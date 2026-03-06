import React, { useState, useEffect } from 'react';
import { PenTool, CheckCircle, Star, Award, Zap } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import useStore from '../../store';

const DesignForm = () => {
    const { mode, addItem, setTempCalculation, basket, getMargin } = useStore();
    const [formData, setFormData] = useState({
        pack: 'impacto',
        zona: '0',
        m2: '',
        planos_cad: true,
        branding: 'none',
        naming: 'none',
        horas_extra: 0
    });

    const packs = [
        { value: 'impacto', label: 'PACK IMPACTO (Básico)', price: 450 },
        { value: 'reactiva', label: 'PACK REACTIVA (Intermedio)', price: 950 },
        { value: 'conceptual', label: 'PACK CONCEPTUAL (Completo)', price: 1800 },
    ];

    const brands = [
        { value: 'none', label: 'Sin Branding' },
        { value: 'express', label: 'Branding Express' },
        { value: 'standard', label: 'Branding Standard' },
        { value: 'pro', label: 'Branding Pro' },
        { value: 'premium', label: 'Branding Premium' },
    ];

    // Logic: Check for Double Impact (if furniture or rigids are in basket)
    const isDoubleImpact = basket.some(item => item.familia === 'Mobiliario' || item.familia === 'Rígidos');

    // Real-time calculation
    useEffect(() => {
        const packPrice = packs.find(p => p.value === formData.pack)?.price || 0;
        let cost = packPrice;

        // Naming/Branding additions
        if (formData.branding !== 'none') cost += 500;
        if (formData.naming !== 'none') cost += 300;

        // Apply Double Impact discount (simulated)
        if (isDoubleImpact) cost *= 0.85; // 15% discount

        const margin = getMargin('diseno') || 0.5;
        const marginFactor = Math.max(0.1, 1 - margin);
        const pvp = cost / marginFactor;

        setTempCalculation({
            familia: 'Diseño',
            family_id: 8,
            nombre: `Proyecto ${formData.pack.toUpperCase()} - Diseño/Interiorismo`,
            coste: cost,
            precio_venta: pvp,
            metadatos: { ...formData, double_impact: isDoubleImpact }
        });
    }, [formData, isDoubleImpact]);

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Star size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Selección de Pack</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {packs.map(p => (
                            <div
                                key={p.value}
                                onClick={() => setFormData({ ...formData, pack: p.value })}
                                className={`p-4 border cursor-pointer transition-all flex justify-between items-center bg-black ${formData.pack === p.value ? 'border-accent shadow-[0_0_10px_rgba(217,255,0,0.05)]' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${formData.pack === p.value ? 'text-accent' : 'text-muted'}`}>{p.label}</p>
                                    <p className="text-[9px] text-muted italic mt-1">Incluye consultoría y levantamiento básico.</p>
                                </div>
                                {formData.pack === p.value && <CheckCircle size={16} className="text-accent" />}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Zona de Actuación" options={[{ value: '0', label: 'Zona 0 (Local)' }, { value: '1', label: 'Zona 1' }, { value: '2', label: 'Zona 2' }]} value={formData.zona} onChange={(e) => setFormData({ ...formData, zona: e.target.value })} />
                        <Input label="Superficie (m2)" type="number" value={formData.m2} onChange={(e) => setFormData({ ...formData, m2: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Award size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Identidad / Branding</h3>
                    </div>

                    <Select label="Servicio de Branding" options={brands} value={formData.branding} onChange={(e) => setFormData({ ...formData, branding: e.target.value })} />

                    <Select
                        label="Servicio de Naming"
                        options={[{ value: 'none', label: 'Sin Naming' }, { value: 'basico', label: 'Naming Básico' }, { value: 'avanzado', label: 'Naming Avanzado' }]}
                        value={formData.naming}
                        onChange={(e) => setFormData({ ...formData, naming: e.target.value })}
                    />

                    <Toggle label="El cliente aporta Planos CAD" checked={formData.planos_cad} onChange={(v) => setFormData({ ...formData, planos_cad: v })} />

                    {isDoubleImpact && (
                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm flex gap-3 animate-pulse">
                            <Zap size={16} className="text-accent shrink-0" />
                            <div>
                                <p className="text-[9px] text-accent font-black uppercase tracking-widest">Doble Impacto Activo</p>
                                <p className="text-[9px] text-accent/70 leading-tight mt-1">
                                    Se aplicará un descuento especial por vinculación con fabricación de mobiliario/rígidos.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesignForm;
