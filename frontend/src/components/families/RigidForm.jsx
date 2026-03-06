import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Scissors, Printer, Plus, Info } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import useStore from '../../store';

const RigidForm = () => {
    const { mode, addItem, setTempCalculation, catalogs, getMargin } = useStore();
    const [formData, setFormData] = useState({
        material_id: '',
        ancho_cm: '',
        alto_cm: '',
        unidades: 1,
        cnc_cutting: true,
        impresion: 'none', // 'none' | 'directa' | 'vinilo'
        doble_cara: false,
    });

    const materialOptions = React.useMemo(() => (catalogs.materiales || [])
        .filter(m => m.familia === 'rigido')
        .map(m => ({ value: m.id, label: m.nombre, precio: m.precio })), [catalogs.materiales]);

    // Initialize selection
    useEffect(() => {
        if (materialOptions.length > 0 && !formData.material_id) {
            setFormData(prev => ({ ...prev, material_id: materialOptions[0].value }));
        }
    }, [materialOptions, formData.material_id]);

    // Real-time calculation
    useEffect(() => {
        const ancho = parseFloat(formData.ancho_cm) || 0;
        const alto = parseFloat(formData.alto_cm) || 0;
        const unidades = parseInt(formData.unidades) || 0;
        const selectedMaterial = materialOptions.find(m => m.value === formData.material_id);

        if (ancho > 0 && alto > 0 && unidades > 0) {
            const area = Math.max(0.5, (ancho * alto) / 10000);

            // Logic: Material Price from DB + Optional CNC cost
            let basePrice = selectedMaterial?.precio || 25;
            if (formData.cnc_cutting) basePrice += 15; // Extra per m2 for CNC path
            if (formData.impresion === 'directa') basePrice += 20; // Example print cost
            if (formData.impresion === 'vinilo') basePrice += 25; // Example vinyl cost
            if (formData.doble_cara && formData.impresion !== 'none') basePrice *= 1.8; // Double face printing

            const cost = area * basePrice * unidades;
            const margin = getMargin('rigido') || 0.4;
            const marginFactor = Math.max(0.1, 1 - margin);
            const pvp = cost / marginFactor;

            setTempCalculation({
                familia: 'Rígidos / CNC',
                family_id: 5,
                nombre: `Plancha ${selectedMaterial?.label || ''} ${ancho}x${alto}cm ${formData.cnc_cutting ? '(CNC)' : ''}`,
                coste: cost,
                precio_venta: pvp,
                metadatos: formData
            });
        } else {
            setTempCalculation({
                familia: 'Rígidos / CNC',
                family_id: 5,
                nombre: '',
                coste: 0,
                precio_venta: 0,
                metadatos: formData
            });
        }
    }, [formData, materialOptions]);

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <LayoutDashboard size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Soporte Rígido</h3>
                    </div>

                    <Select
                        label="Material Base"
                        options={materialOptions}
                        value={formData.material_id}
                        onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
                    />

                    <div className="grid grid-cols-3 gap-4 items-end">
                        <Input label="Ancho (cm)" type="number" value={formData.ancho_cm} onChange={(e) => setFormData({ ...formData, ancho_cm: e.target.value })} />
                        <Input label="Alto (cm)" type="number" value={formData.alto_cm} onChange={(e) => setFormData({ ...formData, alto_cm: e.target.value })} />
                        <Input label="Unidades" type="number" value={formData.unidades} onChange={(e) => setFormData({ ...formData, unidades: e.target.value })} />
                    </div>

                    <Select
                        label="Grado de Corte"
                        options={[
                            { value: 'rectangular', label: 'Rectangular (Estándar)' },
                            { value: 'cnc', label: 'Forma Especial (CNC / Fresadora)' },
                        ]}
                        value={formData.tipo_corte}
                        onChange={(e) => setFormData({ ...formData, tipo_corte: e.target.value })}
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Printer size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Tratamiento de Superficie</h3>
                    </div>

                    <Select
                        label="Tipo de Impresión"
                        options={[
                            { value: 'none', label: 'Sin Impresión (Solo Material)' },
                            { value: 'directa', label: 'Impresión UVI Directa' },
                            { value: 'vinilo', label: 'Vinilo Aplicado' },
                        ]}
                        value={formData.impresion}
                        onChange={(e) => setFormData({ ...formData, impresion: e.target.value })}
                    />

                    <Toggle
                        label="Impresión a Doble Cara"
                        checked={formData.doble_cara}
                        onChange={(val) => setFormData({ ...formData, doble_cara: val })}
                    />

                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm flex gap-3">
                        <Info size={16} className="text-muted shrink-0" />
                        <p className="text-[9px] text-muted italic leading-tight">
                            El precio incluye manipulación básica. Para instalaciones complejas, añadir partida de 'Montajes'.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RigidForm;
