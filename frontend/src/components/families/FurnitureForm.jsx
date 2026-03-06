import React, { useState, useEffect } from 'react';
import { Box, Wrench, Settings, Plus, Trash2, Cpu, Zap, Users } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import useStore from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

const FurnitureForm = () => {
    const { mode: appMode, addItem, setTempCalculation, catalogs, getMargin } = useStore();
    const [formMode, setFormMode] = useState('catalog'); // 'catalog' | 'custom'
    const [formData, setFormData] = useState({
        catalog_brand: '',
        catalog_item_id: '',
        custom: {
            frente_cm: '',
            fondo_cm: '',
            alto_cm: '',
            material_principal: 'melamina_19',
            costados: 2,
            techo: true,
            suelo: true,
            trasera: true,
            puertas: 'none', // 'abatible', 'corredera', 'none'
            baldas: 0,
            cajones: 0,
            led_meters: 0,
            led_type: 'none',
            mo_hours: 4,
            mo_persons: 1
        }
    });

    // Extract brands and items from Supabase catalog
    const allFurniture = catalogs.muebles || [];
    const brandOptions = React.useMemo(() => Array.from(new Set(allFurniture.map(m => m.marca)))
        .map(brand => ({ value: brand, label: brand })), [allFurniture]);

    const currentBrandItems = React.useMemo(() => allFurniture
        .filter(m => m.marca === formData.catalog_brand)
        .map(m => ({ value: m.id, label: m.nombre, cost: m.coste, margin: m.margen_pactado })), [allFurniture, formData.catalog_brand]);

    // Set initial brand and item
    useEffect(() => {
        if (brandOptions.length > 0 && !formData.catalog_brand) {
            setFormData(prev => ({ ...prev, catalog_brand: brandOptions[0].value }));
        }
    }, [brandOptions]);

    // Real-time calculation
    useEffect(() => {
        if (formMode === 'catalog') {
            const item = currentBrandItems.find(i => i.value === formData.catalog_item_id);
            if (item) {
                // Calculation: Cost / (1 - Margin)
                const margin = item.margin || getMargin('mobiliario');
                const pvp = item.cost / (1 - margin);

                setTempCalculation({
                    familia: 'Mobiliario',
                    family_id: 4,
                    nombre: `${item.label} (${formData.catalog_brand})`,
                    coste: item.cost,
                    precio_venta: pvp,
                    metadatos: { type: 'catalog', ...item }
                });
            } else {
                setTempCalculation({
                    familia: 'Mobiliario',
                    family_id: 4,
                    nombre: '',
                    coste: 0,
                    precio_venta: 0,
                    metadatos: { type: 'catalog' }
                });
            }
        } else {
            const frente = parseFloat(formData.custom.frente_cm) || 0;
            const alto = parseFloat(formData.custom.alto_cm) || 0;

            if (frente > 0 && alto > 0) {
                const baseArea = (frente * alto) / 10000;
                const materialCost = baseArea * 45;
                const doorCost = formData.custom.puertas !== 'none' ? 80 : 0;
                const laborCost = formData.custom.mo_hours * (formData.custom.mo_persons === 2 ? 50 : 30);
                const totalCost = materialCost + doorCost + laborCost + (parseFloat(formData.custom.led_meters || 0) * 15);

                setTempCalculation({
                    familia: 'Mobiliario',
                    family_id: 4,
                    nombre: `Mueble a Medida ${frente}x${alto}cm`,
                    coste: totalCost,
                    precio_venta: totalCost / 0.4,
                    metadatos: { type: 'custom', ...formData.custom }
                });
            } else {
                setTempCalculation({
                    familia: 'Mobiliario',
                    family_id: 4,
                    nombre: '',
                    coste: 0,
                    precio_venta: 0,
                    metadatos: { type: 'custom' }
                });
            }
        }
    }, [formData, formMode, currentBrandItems]);

    return (
        <div className="space-y-8">
            <div className="flex gap-2 p-1 bg-black border border-white/5 rounded-sm">
                <button
                    onClick={() => setFormMode('catalog')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${formMode === 'catalog' ? 'bg-white/10 text-white' : 'text-muted hover:text-white/50'}`}
                >
                    <Box size={14} />
                    Catálogo Franquicia
                </button>
                <button
                    onClick={() => setFormMode('custom')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${formMode === 'custom' ? 'bg-white/10 text-white' : 'text-muted hover:text-white/50'}`}
                >
                    <Settings size={14} />
                    Constructor a Medida
                </button>
            </div>

            <AnimatePresence mode="wait">
                {formMode === 'catalog' ? (
                    <motion.div
                        key="catalog"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <Select
                                label="Marca / Franquicia"
                                options={brandOptions}
                                value={formData.catalog_brand}
                                onChange={(e) => setFormData({ ...formData, catalog_brand: e.target.value, catalog_item_id: '' })}
                            />
                            <Select
                                label="Modelo de Item"
                                options={[
                                    { value: '', label: 'Seleccionar modelo...' },
                                    ...currentBrandItems
                                ]}
                                value={formData.catalog_item_id}
                                onChange={(e) => setFormData({ ...formData, catalog_item_id: e.target.value })}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="custom"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Section 1: Dimensions */}
                        <div className="grid grid-cols-3 gap-4">
                            <Input
                                label="Frente (cm)"
                                type="number"
                                value={formData.custom.frente_cm}
                                onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, frente_cm: e.target.value } })}
                            />
                            <Input
                                label="Fondo (cm)"
                                type="number"
                                value={formData.custom.fondo_cm}
                                onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, fondo_cm: e.target.value } })}
                            />
                            <Input
                                label="Alto (cm)"
                                type="number"
                                value={formData.custom.alto_cm}
                                onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, alto_cm: e.target.value } })}
                            />
                        </div>

                        {/* Section 2: Structure Detail */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <Cpu size={14} className="text-accent" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Estructura Base</h4>
                                </div>
                                <Select
                                    label="Material Principal"
                                    options={[
                                        { value: 'melamina_19', label: 'Melamina 19mm' },
                                        { value: 'dm_lacado', label: 'DM Lacado' },
                                        { value: 'madera_maciza', label: 'Madera Maciza' },
                                    ]}
                                    value={formData.custom.material_principal}
                                    onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, material_principal: e.target.value } })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Toggle label="Techo / Encimera" checked={formData.custom.techo} onChange={(v) => setFormData({ ...formData, custom: { ...formData.custom, techo: v } })} />
                                    <Toggle label="Suelo / Base" checked={formData.custom.suelo} onChange={(v) => setFormData({ ...formData, custom: { ...formData.custom, suelo: v } })} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <Plus size={14} className="text-accent" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Puertas y Cajones</h4>
                                </div>
                                <Select
                                    label="Tipo de Apertura"
                                    options={[
                                        { value: 'none', label: 'Sin Puertas (Abierto)' },
                                        { value: 'abatible', label: 'Puertas Abatibles' },
                                        { value: 'corredera', label: 'Puertas Correderas' },
                                    ]}
                                    value={formData.custom.puertas}
                                    onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, puertas: e.target.value } })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Nº Baldas" type="number" value={formData.custom.baldas} onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, baldas: e.target.value } })} />
                                    <Input label="Nº Cajones" type="number" value={formData.custom.cajones} onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, cajones: e.target.value } })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Lighting & Labor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-white/5 p-6 rounded-sm border border-white/5">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-accent" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Iluminación LED</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Metros Lineales" type="number" value={formData.custom.led_meters} onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, led_meters: e.target.value } })} />
                                    <Select
                                        label="Tipo de Luz"
                                        options={[
                                            { value: 'none', label: 'Sin LED' },
                                            { value: 'cold', label: 'Fría' },
                                            { value: 'warm', label: 'Cálida' },
                                            { value: 'rgb', label: 'RGB' },
                                        ]}
                                        value={formData.custom.led_type}
                                        onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, led_type: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-accent" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Mano de Obra</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Horas Estimadas" type="number" value={formData.custom.mo_hours} onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, mo_hours: e.target.value } })} />
                                    <Select
                                        label="Nº Operarios"
                                        options={[{ value: 1, label: '1 Persona' }, { value: 2, label: '2 Personas' }]}
                                        value={formData.custom.mo_persons}
                                        onChange={(e) => setFormData({ ...formData, custom: { ...formData.custom, mo_persons: parseInt(e.target.value) } })}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FurnitureForm;
