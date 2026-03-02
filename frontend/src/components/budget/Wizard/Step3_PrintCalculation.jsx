import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Printer, Calculator, Check, Loader2, AlertTriangle } from 'lucide-react';

const Step3_PrintCalculation = ({ onFinish }) => {
    const [form, setForm] = useState({ material_id: 'vinilo_impresion', ancho: '', alto: '', laminado_id: '', troquelado: false, complejidad: 'BAJO' });
    const [calculation, setCalculation] = useState(null);
    const [calculating, setCalculating] = useState(false);

    const handleChange = (f, v) => { setForm(p => ({ ...p, [f]: v })); setCalculation(null); };

    const handleCalculate = async () => {
        if (!form.ancho || !form.alto) return;
        setCalculating(true);
        try {
            const { data, error } = await supabase.functions.invoke('calcular_impresion', {
                body: { material_id: form.material_id, ancho: parseFloat(form.ancho), alto: parseFloat(form.alto), laminado_id: form.laminado_id || null, troquelado: form.troquelado, complejidad: form.complejidad }
            });
            if (!error) setCalculation(data);
        } catch (err) { console.error(err); }
        setCalculating(false);
    };

    return (
        <div className="flex flex-col gap-8 animate-fade">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white"><Printer size={20} /></div>
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Impresión / Lonas</h3>
                    <p className="text-slate-400 text-sm">Impresión digital y lonas publicitarias.</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-300"><strong>Nota:</strong> Backend pendiente de implementar. Los resultados mostrarán ceros.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Material</label>
                    <select value={form.material_id} onChange={(e) => handleChange('material_id', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 outline-none transition-all">
                        <option value="vinilo_impresion" className="bg-slate-900">Vinilo de Impresión</option>
                        <option value="lona" className="bg-slate-900">Lona PVC</option>
                        <option value="lona_mesh" className="bg-slate-900">Lona Microperforada</option>
                        <option value="backlight" className="bg-slate-900">Backlight</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ancho (cm)</label>
                    <input type="number" placeholder="137" value={form.ancho} onChange={(e) => handleChange('ancho', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-pink-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alto (cm)</label>
                    <input type="number" placeholder="200" value={form.alto} onChange={(e) => handleChange('alto', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-pink-500/50 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Laminado</label>
                    <select value={form.laminado_id} onChange={(e) => handleChange('laminado_id', e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500/50 outline-none transition-all">
                        <option value="" className="bg-slate-900">Sin Laminado</option>
                        <option value="brillo" className="bg-slate-900">Brillo</option>
                        <option value="mate" className="bg-slate-900">Mate</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complejidad</label>
                    <div className="flex gap-2">
                        {['BAJO', 'MEDIO', 'ALTO'].map(o => (
                            <button key={o} onClick={() => handleChange('complejidad', o)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${form.complejidad === o ? 'bg-pink-600/20 border-pink-500/50 text-pink-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>{o}</button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4 col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleChange('troquelado', !form.troquelado)}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.troquelado ? 'bg-pink-600 border-pink-500' : 'border-white/20'}`}>
                            {form.troquelado && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-slate-300">Incluir troquelado</span>
                    </label>
                </div>
            </div>

            <button onClick={handleCalculate} disabled={calculating || !form.ancho} className="btn-premium flex items-center justify-center gap-2 py-4">
                {calculating ? <Loader2 size={20} className="animate-spin" /> : <Calculator size={20} />}
                {calculating ? 'Calculando...' : 'Calcular Coste Impresión'}
            </button>

            {calculation && (
                <div className="flex flex-col gap-6 p-8 bg-pink-600/5 border border-pink-500/20 rounded-3xl animate-fade">
                    <div className="grid grid-cols-2 gap-6">
                        <div><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coste</span><p className="text-4xl font-black text-pink-400">{calculation.coste_estructural}€</p></div>
                        <div><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">PVP</span><p className="text-4xl font-black text-emerald-400">{calculation.precio_venta}€</p></div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setCalculation(null)} className="flex-1 glass py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Recalcular</button>
                        <button onClick={() => onFinish({ nombre: `Impresión ${form.ancho}×${form.alto}cm`, coste_base: calculation.coste_estructural, pvp: calculation.precio_venta })}
                            className="flex-[2] btn-premium flex items-center justify-center gap-2"><Check size={20} /> Añadir</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step3_PrintCalculation;
