import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './lib/supabase'

const useStore = create(
    persist(
        (set, get) => ({
            // UI State
            mode: 'quick',
            setMode: (mode) => set({ mode }),
            tariff: 'final',
            setTariff: (tariff) => set({ tariff }),
            activeFamily: 2,
            setActiveFamily: (activeFamily) => set({ activeFamily }),
            isLoading: false,

            // Catalogs (from Supabase)
            catalogs: {
                materiales: [],
                muebles: [],
                margenes: [],
                config: null
            },

            fetchCatalogs: async () => {
                set({ isLoading: true });
                try {
                    const [mats, furniture, margins, config] = await Promise.all([
                        supabase.from('materiales').select('*').eq('activo', true),
                        supabase.from('muebles_catalogo').select('*').eq('activo', true),
                        supabase.from('margenes').select('*'),
                        supabase.from('configuracion_global').select('*').single()
                    ]);

                    set({
                        catalogs: {
                            materiales: mats.data || [],
                            muebles: furniture.data || [],
                            margenes: margins.data || [],
                            config: config.data || null
                        }
                    });
                } catch (error) {
                    console.error('Error fetching catalogs:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            // Clients
            clients: [],
            fetchClients: async () => {
                const { data, error } = await supabase
                    .from('clientes')
                    .select('*')
                    .eq('activo', true)
                    .order('nombre');

                if (!error) set({ clients: data });
            },

            // Basket (items/partidas)
            basket: [],
            addItem: (item) => {
                const newItem = {
                    ...item,
                    id: crypto.randomUUID(),
                    orden: get().basket.length + 1
                };
                set((state) => ({ basket: [...state.basket, newItem] }));
                get().updateSummary();
            },
            removeItem: (id) => {
                set((state) => ({
                    basket: state.basket.filter((item) => item.id !== id)
                }));
                get().updateSummary();
            },
            updateItem: (id, updates) => {
                set((state) => ({
                    basket: state.basket.map((item) => item.id === id ? { ...item, ...updates } : item)
                }));
                get().updateSummary();
            },
            reorderBasket: (newBasket) => {
                set({ basket: newBasket });
            },
            clearBasket: () => {
                set({ basket: [] });
                get().updateSummary();
            },

            // Global Client Info
            client: null,
            setClient: (client) => {
                set({ client });
                if (client?.tipo_cliente) {
                    set({ tariff: client.tipo_cliente === 'agencia' ? 'agencia' : 'final' });
                }
            },

            // Project Info
            project: {
                nombre: '',
                referencia: '',
                fecha: new Date().toISOString().split('T')[0],
                validez: 15,
                estado: 'borrador',
                descuento: 0,
            },
            setProject: (project) => set((state) => ({
                project: { ...state.project, ...project }
            })),

            // Active calculation
            tempCalculation: {
                coste: 0,
                precio_venta: 0,
                nombre: '',
                familia: '',
                family_id: null,
                metadatos: {},
            },
            setTempCalculation: (calc) => set((state) => ({
                tempCalculation: { ...state.tempCalculation, ...calc }
            })),

            // Summary
            summary: {
                coste_total: 0,
                pvp_total: 0,
                margen_promedio: 0,
            },
            updateSummary: () => {
                const basket = get().basket;
                const coste_total = basket.reduce((acc, item) => acc + (parseFloat(item.coste) || 0), 0);
                const pvp_total = basket.reduce((acc, item) => acc + (parseFloat(item.precio_venta) || 0), 0);
                const margen_promedio = pvp_total > 0 ? (pvp_total - coste_total) / pvp_total : 0;

                set({ summary: { coste_total, pvp_total, margen_promedio } });
            },

            getMargin: (familia) => {
                const margins = get().catalogs.margenes;
                const tariff = get().tariff;
                const item = margins.find(m => m.familia.toLowerCase() === familia.toLowerCase());
                if (!item) return 0.5; // Default 50%
                return tariff === 'agencia' ? item.agencia : item.final;
            },

            resetFormalBudget: () => {
                set({
                    client: null,
                    basket: [],
                    project: {
                        nombre: '',
                        referencia: '',
                        fecha: new Date().toISOString().split('T')[0],
                        validez: 15,
                        estado: 'borrador',
                        descuento: 0,
                    },
                    summary: {
                        coste_total: 0,
                        pvp_total: 0,
                        margen_promedio: 0,
                    }
                });
            }
        }),
        {
            name: 'dl-studio-storage',
            partialize: (state) => ({
                // Only persist UI settings and basket, not big catalogs
                mode: state.mode,
                tariff: state.tariff,
                basket: state.basket,
                client: state.client,
                project: state.project
            })
        }
    )
)

export default useStore
