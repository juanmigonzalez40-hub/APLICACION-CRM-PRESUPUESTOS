import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Armchair, Calculator, Check, Loader2 } from 'lucide-react';

const Step3_FurnitureCalculation = ({ onFinish }) => {
    const [materials, setMaterials] = useState([]);
    const [form, setForm] = useState({
        descripcion: '',
        material_principal_id: '',
        frente_cm: '',
        fondo_cm: '',
        alto_cm: '',
        baldas_fijas: '0',
        puertas_abatibles: '0',
        puntos_luz: '0',
        horas_mo: '8'
    });
    const [calculation, setCalculation] = useState(null);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase.from('materiales').select('*').order('nombre');
            setMaterials(data || []);
        };
        fetchMaterials();
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setCalculation(null);
    };

    const handleCalculate = async () => {
        if (!form.material_principal_id || !form.frente_cm || !form.fondo_cm || !form.alto_cm) return;
        setCalculating(true);

        try {
            const { data, error } = await supabase.functions.invoke('calcular_mobiliario', {
                body: {
                    muebles: [{
                        id_mueble: 'M1',
                        descripcion: form.descripcion || 'Mueble a medida',
                        catalogo: false,
                        material_principal_id: form.material_principal_id,
                        medidas: {
                            frente_cm: parseFloat(form.frente_cm),
                            fondo_cm: parseFloat(form.fondo_cm),
                            alto_cm: parseFloat(form.alto_cm)
                        },
                        estructura: {
                            baldas_fijas: { cantidad: parseInt(form.baldas_fijas) || 0 },
                            puertas_abatibles: { cantidad: parseInt(form.puertas_abatibles) || 0 }
                        },
                        electricidad: Array.from({ length: parseInt(form.puntos_luz) || 0 }, () => ({ tipo: 'led' })),
                        mano_obra: { horas: parseFloat(form.horas_mo) || 8 }
                    }]
                }
            });
            if (!error && data) setCalculation(data);
            else console.error('Error:', error);
        } catch (err) {
            console.error('Furniture calc failed:', err);
        } finally {
            setCalculating(false);
        }
    };

    const selectedMaterial = materials.find(m => m.id === form.material_principal_id);
    const muebleResult = calculation?.muebles?.[0];

    return (
        <div className="flex flex-col gap-8 animate-fade">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                    <Armchair size={20} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Mobiliario a Medida</h3>
                    <p className="text-slate-400 text-sm">Cálculo de costes para muebles fabricados a medida.</p>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descripción del mueble</label>
                    <input type="text" placeholder="Ej: Mostrador recepción con estantes internos"
                        value={form.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500/50 outline-none transition-all" />
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Material Principal</label>
                    <select value={form.material_principal_id} onChange={(e) => handleChange('material_principal_id', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/50 outline-none transition-all">
                        <option value="">Selecciona material...</option>
                        {materials.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.nombre} — {m.precio}€/m²</option>)}
                    </select>
                </div>

                {/* Dimensions */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Frente (cm)</label>
                    <input type="number" placeholder="120" value={form.frente_cm} onChange={(e) => handleChange('frente_cm', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fondo (cm)</label>
                    <input type="number" placeholder="45" value={form.fondo_cm} onChange={(e) => handleChange('fondo_cm', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alto (cm)</label>
                    <input type="number" placeholder="90" value={form.alto_cm} onChange={(e) => handleChange('alto_cm', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Horas Mano de Obra</label>
                    <input type="number" placeholder="8" value={form.horas_mo} onChange={(e) => handleChange('horas_mo', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-500/50 outline-none transition-all" />
                </div>

                {/* Extras */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Baldas Fijas</label>
                    <input type="number" min="0" max="10" value={form.baldas_fijas} onChange={(e) => handleChange('baldas_fijas', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Puertas Abatibles</label>
                    <input type="number" min="0" max="6" value={form.puertas_abatibles} onChange={(e) => handleChange('puertas_abatibles', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Puntos de Luz LED</label>
                    <input type="number" min="0" max="5" value={form.puntos_luz} onChange={(e) => handleChange('puntos_luz', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/50 outline-none transition-all" />
                </div>
            </div>

            {/* Calculate */}
            <button onClick={handleCalculate} disabled={calculating || !form.material_principal_id}
                className="btn-premium flex items-center justify-center gap-2 py-4">
                {calculating ? <Loader2 size={20} className="animate-spin" /> : <Calculator size={20} />}
                {calculating ? 'Calculando...' : 'Calcular Coste Mueble'}
            </button>

            {/* Results */}
            {calculation && muebleResult && (
                <div className="flex flex-col gap-6 p-8 bg-amber-600/5 border border-amber-500/20 rounded-3xl animate-fade">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white"><Calculator size={24} /></div>
                        <div>
                            <h4 className="text-xl font-bold">{muebleResult.descripcion}</h4>
                            <p className="text-sm text-slate-400">{selectedMaterial?.nombre} • {form.frente_cm}×{form.fondo_cm}×{form.alto_cm} cm</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coste Total</span>
                            <p className="text-4xl font-black text-amber-400">{parseFloat(muebleResult.coste_mueble).toFixed(2)}€</p>
                        </div>
                    </div>

                    {muebleResult.desglose && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Material</span>
                                <span className="text-sm font-semibold">{parseFloat(muebleResult.desglose.material).toFixed(2)}€</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Ensamblaje</span>
                                <span className="text-sm font-semibold">{parseFloat(muebleResult.desglose.ensamblaje).toFixed(2)}€</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Extras</span>
                                <span className="text-sm font-semibold">{parseFloat(muebleResult.desglose.extras).toFixed(2)}€</span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button onClick={() => setCalculation(null)}
                            className="flex-1 glass py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Recalcular</button>
                        <button onClick={() => onFinish({ nombre: form.descripcion || 'Mueble a medida', coste_base: muebleResult.coste_mueble, pvp: muebleResult.coste_mueble })}
                            className="flex-[2] btn-premium flex items-center justify-center gap-2">
                            <Check size={20} /> Añadir al Presupuesto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step3_FurnitureCalculation;
