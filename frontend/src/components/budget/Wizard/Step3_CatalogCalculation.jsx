import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Package, Calculator, ArrowRight, Check } from 'lucide-react';

const Step3_CatalogCalculation = ({ onFinish }) => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [calculation, setCalculation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const fetchCatalog = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('muebles_catalogo')
                .select('*')
                .ilike('nombre', `%${search}%`)
                .limit(8);

            if (!error) setItems(data || []);
            setLoading(false);
        };

        const timer = setTimeout(fetchCatalog, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleCalculate = async (item) => {
        setCalculating(true);
        setSelectedItem(item);

        try {
            const { data, error } = await supabase.functions.invoke('calcular-catalogo', {
                body: { item_id: item.id }
            });

            if (!error) {
                setCalculation(data);
            } else {
                console.error("Error invoking function:", error);
            }
        } catch (err) {
            console.error("Calculation failed:", err);
        } finally {
            setCalculating(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fade">
            {!selectedItem ? (
                <>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold tracking-tight">Selecciona un mueble del catálogo</h3>
                        <p className="text-slate-400">Busca por nombre o código de producto.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:border-blue-500/50 transition-all">
                        <input
                            type="text"
                            placeholder="Buscar p. ej. 'Mostrador'..."
                            className="bg-transparent border-none outline-none w-full text-lg placeholder:text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleCalculate(item)}
                                className="glass p-6 flex flex-col gap-4 cursor-pointer hover:border-blue-500/30 transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <Package className="text-slate-500 group-hover:text-blue-400 transition-colors" size={24} />
                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{item.id}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg leading-tight">{item.nombre}</p>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{item.marca}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-8 animate-fade">
                    <div className="flex flex-col gap-6 p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                <Calculator size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">{selectedItem.nombre}</h4>
                                <p className="text-sm text-slate-400">Cálculo en tiempo real desde Supabase Edge Functions</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coste Base (Contract)</span>
                                {calculating ? (
                                    <div className="h-8 w-24 bg-white/5 animate-pulse rounded"></div>
                                ) : (
                                    <p className="text-2xl font-bold">{calculation?.coste_base}€</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Precio Venta (PVP)</span>
                                {calculating ? (
                                    <div className="h-8 w-32 bg-white/5 animate-pulse rounded"></div>
                                ) : (
                                    <p className="text-4xl font-black text-blue-400">{calculation?.pvp}€</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => { setSelectedItem(null); setCalculation(null); }}
                            className="flex-1 glass py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all"
                        >
                            Cambiar Producto
                        </button>
                        <button
                            onClick={() => onFinish(calculation)}
                            disabled={calculating}
                            className="flex-[2] btn-premium flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            Añadir al Presupuesto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step3_CatalogCalculation;
