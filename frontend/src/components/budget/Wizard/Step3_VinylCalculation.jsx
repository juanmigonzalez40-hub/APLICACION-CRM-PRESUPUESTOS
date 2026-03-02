import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Scissors, Calculator, Check, Loader2 } from 'lucide-react';

const Step3_VinylCalculation = ({ onFinish }) => {
    const [materials, setMaterials] = useState([]);
    const [form, setForm] = useState({
        material_id: '',
        ancho_cm: '',
        alto_cm: '',
        pelado: 'BAJO',
        vectorizado: 'No',
        superficie: ''
    });
    const [calculation, setCalculation] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [loadingMats, setLoadingMats] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase
                .from('materiales')
                .select('*')
                .order('nombre');
            setMaterials(data || []);
            setLoadingMats(false);
        };
        fetchMaterials();
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setCalculation(null);
    };

    const handleCalculate = async () => {
        if (!form.material_id || (!form.ancho_cm && !form.alto_cm)) return;
        setCalculating(true);

        try {
            const { data, error } = await supabase.functions.invoke('calcular_vinilo_corte', {
                body: {
                    material_id: form.material_id,
                    ancho_cm: parseFloat(form.ancho_cm) || 0,
                    alto_cm: parseFloat(form.alto_cm) || 0,
                    m2: parseFloat(form.superficie) || null,
                    pelado: form.pelado,
                    vectorizado: form.vectorizado,
                    superficie: form.superficie
                }
            });
            if (!error) setCalculation(data);
            else console.error('Error:', error);
        } catch (err) {
            console.error('Calculation failed:', err);
        } finally {
            setCalculating(false);
        }
    };

    const selectedMaterial = materials.find(m => m.id === form.material_id);

    return (
        <div className="flex flex-col gap-8 animate-fade">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                        <Scissors size={20} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Vinilo de Corte</h3>
                        <p className="text-slate-400 text-sm">Cálculo de producción y materiales para vinilo de corte.</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Material */}
                <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Material</label>
                    <select
                        value={form.material_id}
                        onChange={(e) => handleChange('material_id', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500/50 outline-none transition-all"
                    >
                        <option value="">Selecciona un material...</option>
                        {materials.map(m => (
                            <option key={m.id} value={m.id} className="bg-slate-900">{m.nombre} — {m.precio}€/m²</option>
                        ))}
                    </select>
                </div>

                {/* Dimensions */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ancho (cm)</label>
                    <input
                        type="number"
                        placeholder="Ej: 120"
                        value={form.ancho_cm}
                        onChange={(e) => handleChange('ancho_cm', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-orange-500/50 outline-none transition-all"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alto (cm)</label>
                    <input
                        type="number"
                        placeholder="Ej: 80"
                        value={form.alto_cm}
                        onChange={(e) => handleChange('alto_cm', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-orange-500/50 outline-none transition-all"
                    />
                </div>

                {/* Pelado */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dificultad Pelado</label>
                    <div className="flex gap-2">
                        {['BAJO', 'MEDIO', 'ALTO'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleChange('pelado', opt)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${form.pelado === opt
                                        ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vectorizado */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vectorizado</label>
                    <div className="flex gap-2">
                        {['No', 'BAJO', 'MEDIO', 'ALTO'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleChange('vectorizado', opt)}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${form.vectorizado === opt
                                        ? 'bg-orange-600/20 border-orange-500/50 text-orange-400'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calculate Button */}
            <button
                onClick={handleCalculate}
                disabled={calculating || !form.material_id}
                className="btn-premium flex items-center justify-center gap-2 py-4"
            >
                {calculating ? <Loader2 size={20} className="animate-spin" /> : <Calculator size={20} />}
                {calculating ? 'Calculando...' : 'Calcular Coste'}
            </button>

            {/* Results */}
            {calculation && (
                <div className="flex flex-col gap-6 p-8 bg-orange-600/5 border border-orange-500/20 rounded-3xl animate-fade">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Resultado del Cálculo</h4>
                            <p className="text-sm text-slate-400">
                                {selectedMaterial?.nombre} • {form.ancho_cm}×{form.alto_cm} cm
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coste Total</span>
                            <p className="text-4xl font-black text-orange-400">{calculation.coste_total}€</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">m² Facturados</span>
                            <p className="text-2xl font-bold">{calculation.m2_facturados} m²</p>
                        </div>
                    </div>

                    {calculation.desglose && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Material</span>
                                <span className="text-sm font-semibold">{calculation.desglose.material}€</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Máquina</span>
                                <span className="text-sm font-semibold">{calculation.desglose.maquina}€</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Mano Obra</span>
                                <span className="text-sm font-semibold">{calculation.desglose.mano_obra}€</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tiempo</span>
                                <span className="text-sm font-semibold">{calculation.desglose.tiempo_total_min} min</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => setCalculation(null)}
                            className="flex-1 glass py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all"
                        >
                            Recalcular
                        </button>
                        <button
                            onClick={() => onFinish({ nombre: `Vinilo — ${selectedMaterial?.nombre}`, coste_base: calculation.coste_total, pvp: calculation.coste_total })}
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

export default Step3_VinylCalculation;
