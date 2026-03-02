import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Palette, Calculator, Check, Loader2, Sparkles } from 'lucide-react';

const packs = [
    { id: 'impacto', name: 'Impacto', price: '1.700€', desc: 'Diseño básico de alto impacto visual', color: 'blue' },
    { id: 'reactiva', name: 'Reactiva', price: '2.800€', desc: 'Diseño completo con renders y planos', color: 'purple' },
    { id: 'conceptual', name: 'Conceptual', price: '4.500€', desc: 'Proyecto integral de interiorismo', color: 'amber' },
];

const Step3_DesignCalculation = ({ onFinish }) => {
    const [form, setForm] = useState({
        pack: '', zona: 0, m2: '', planos_cad: true,
        branding: '', naming: '', horas_extra: '', proyecto_retail_asociado: false
    });
    const [calculation, setCalculation] = useState(null);
    const [calculating, setCalculating] = useState(false);

    const handleChange = (f, v) => { setForm(p => ({ ...p, [f]: v })); setCalculation(null); };

    const handleCalculate = async () => {
        if (!form.pack) return;
        setCalculating(true);
        try {
            const { data, error } = await supabase.functions.invoke('calcular_diseno', {
                body: {
                    pack: form.pack, zona: parseInt(form.zona),
                    m2: parseFloat(form.m2) || 0, planos_cad: form.planos_cad,
                    branding: form.branding || null, naming: form.naming || null,
                    horas_extra: parseFloat(form.horas_extra) || 0,
                    proyecto_retail_asociado: form.proyecto_retail_asociado
                }
            });
            if (!error) setCalculation(data);
        } catch (err) { console.error(err); }
        setCalculating(false);
    };

    const selectedPack = packs.find(p => p.id === form.pack);

    return (
        <div className="flex flex-col gap-8 animate-fade">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white"><Palette size={20} /></div>
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Diseño / Marca</h3>
                    <p className="text-slate-400 text-sm">Packs de diseño de interiores e identidad corporativa.</p>
                </div>
            </div>

            {/* Pack Selection */}
            <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selecciona Pack</label>
                <div className="grid grid-cols-3 gap-4">
                    {packs.map(p => (
                        <div key={p.id} onClick={() => handleChange('pack', p.id)}
                            className={`glass p-6 flex flex-col gap-3 cursor-pointer transition-all text-center group ${form.pack === p.id ? 'border-violet-500/50 bg-violet-600/10' : 'hover:border-white/20'
                                }`}>
                            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${form.pack === p.id ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-500'
                                }`}><Sparkles size={18} /></div>
                            <p className="font-bold text-lg">{p.name}</p>
                            <p className="text-2xl font-black text-violet-400">{p.price}</p>
                            <p className="text-xs text-slate-500">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {form.pack && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade">
                    {form.pack !== 'impacto' && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Superficie (m²)</label>
                            <input type="number" placeholder="60" value={form.m2} onChange={(e) => handleChange('m2', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-violet-500/50 outline-none transition-all" />
                            <span className="text-[10px] text-slate-600">+12€/m² extra si supera 60m²</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Zona Logística</label>
                        <select value={form.zona} onChange={(e) => handleChange('zona', e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500/50 outline-none transition-all">
                            <option value={0} className="bg-slate-900">Zona 0 — Local (0€)</option>
                            <option value={1} className="bg-slate-900">Zona 1 — Provincia (150€)</option>
                            <option value={2} className="bg-slate-900">Zona 2 — Nacional (350€)</option>
                            <option value={3} className="bg-slate-900">Zona 3 — Internacional (550€)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Branding</label>
                        <select value={form.branding} onChange={(e) => handleChange('branding', e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500/50 outline-none transition-all">
                            <option value="" className="bg-slate-900">Sin Branding</option>
                            <option value="express" className="bg-slate-900">Express (400€)</option>
                            <option value="standard" className="bg-slate-900">Standard (800€)</option>
                            <option value="pro" className="bg-slate-900">Pro (1.500€)</option>
                            <option value="premium" className="bg-slate-900">Premium (3.000€)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Naming</label>
                        <select value={form.naming} onChange={(e) => handleChange('naming', e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500/50 outline-none transition-all">
                            <option value="" className="bg-slate-900">Sin Naming</option>
                            <option value="basico" className="bg-slate-900">Básico (300€)</option>
                            <option value="avanzado" className="bg-slate-900">Avanzado (600€)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Horas Extra Diseño</label>
                        <input type="number" placeholder="0" value={form.horas_extra} onChange={(e) => handleChange('horas_extra', e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-violet-500/50 outline-none transition-all" />
                    </div>

                    <div className="flex flex-col gap-4 col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer" onClick={() => handleChange('planos_cad', !form.planos_cad)}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.planos_cad ? 'bg-violet-600 border-violet-500' : 'border-white/20'}`}>
                                {form.planos_cad && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-slate-300">Dispone de planos CAD <span className="text-slate-500 text-xs">(+15% sin planos)</span></span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer" onClick={() => handleChange('proyecto_retail_asociado', !form.proyecto_retail_asociado)}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.proyecto_retail_asociado ? 'bg-violet-600 border-violet-500' : 'border-white/20'}`}>
                                {form.proyecto_retail_asociado && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-slate-300">Proyecto retail asociado <span className="text-slate-500 text-xs">(-15% en identidad)</span></span>
                        </label>
                    </div>
                </div>
            )}

            {form.pack && (
                <button onClick={handleCalculate} disabled={calculating} className="btn-premium flex items-center justify-center gap-2 py-4">
                    {calculating ? <Loader2 size={20} className="animate-spin" /> : <Calculator size={20} />}
                    {calculating ? 'Calculando...' : 'Calcular Coste Diseño'}
                </button>
            )}

            {calculation && (
                <div className="flex flex-col gap-6 p-8 bg-violet-600/5 border border-violet-500/20 rounded-3xl animate-fade">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center text-white"><Calculator size={24} /></div>
                        <div>
                            <h4 className="text-xl font-bold">Pack {selectedPack?.name}</h4>
                            <p className="text-sm text-slate-400">Diseño de interiores + identidad</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coste Total</span>
                        <p className="text-5xl font-black text-violet-400">{calculation.coste_total}€</p>
                    </div>

                    {calculation.desglose && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-white/5">
                            {Object.entries(calculation.desglose).map(([k, v]) => (
                                <div key={k} className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{k.replace(/_/g, ' ')}</span>
                                    <span className="text-sm font-semibold">{typeof v === 'number' ? `${v.toFixed(2)}€` : `${v}€`}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {calculation.condiciones && (
                        <div className="pt-4 border-t border-white/5 space-y-1">
                            {calculation.condiciones.map((c, i) => (
                                <p key={i} className="text-xs text-slate-500">• {c}</p>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button onClick={() => setCalculation(null)} className="flex-1 glass py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Recalcular</button>
                        <button onClick={() => onFinish({ nombre: `Diseño Pack ${selectedPack?.name}`, coste_base: calculation.coste_total, pvp: calculation.coste_total })}
                            className="flex-[2] btn-premium flex items-center justify-center gap-2"><Check size={20} /> Añadir</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step3_DesignCalculation;
