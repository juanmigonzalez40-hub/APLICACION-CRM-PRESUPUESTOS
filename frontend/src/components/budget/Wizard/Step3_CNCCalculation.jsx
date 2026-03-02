import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Box, Calculator, Check, Loader2, Plus, Trash2 } from 'lucide-react';

const Step3_CNCCalculation = ({ onFinish }) => {
    const [materials, setMaterials] = useState([]);
    const [piezas, setPiezas] = useState([{ material_id: '', ancho_cm: '', alto_cm: '' }]);
    const [complejidad, setComplejidad] = useState('BAJO');
    const [canteado, setCanteado] = useState('');
    const [calculation, setCalculation] = useState(null);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase.from('materiales').select('*').order('nombre');
            setMaterials(data || []);
        };
        fetchMaterials();
    }, []);

    const addPieza = () => setPiezas(prev => [...prev, { material_id: '', ancho_cm: '', alto_cm: '' }]);
    const removePieza = (idx) => setPiezas(prev => prev.filter((_, i) => i !== idx));
    const updatePieza = (idx, field, value) => {
        setPiezas(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
        setCalculation(null);
    };

    const handleCalculate = async () => {
        const validPiezas = piezas.filter(p => p.material_id && p.ancho_cm && p.alto_cm);
        if (validPiezas.length === 0) return;
        setCalculating(true);

        try {
            const { data, error } = await supabase.functions.invoke('calcular_rigidos_cnc', {
                body: {
                    piezas: validPiezas.map(p => ({
                        material_id: p.material_id,
                        ancho_cm: parseFloat(p.ancho_cm),
                        alto_cm: parseFloat(p.alto_cm)
                    })),
                    cnc: { complejidad_cam: complejidad },
                    canteado_ml: parseFloat(canteado) || 0
                }
            });
            if (!error) setCalculation(data);
            else console.error('Error:', error);
        } catch (err) {
            console.error('CNC calc failed:', err);
        } finally {
            setCalculating(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fade">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
                    <Box size={20} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Rígidos CNC</h3>
                    <p className="text-slate-400 text-sm">Corte y mecanizado CNC de materiales rígidos.</p>
                </div>
            </div>

            {/* Piezas */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Piezas ({piezas.length})</label>
                    <button onClick={addPieza} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                        <Plus size={14} /> Añadir pieza
                    </button>
                </div>

                {piezas.map((pieza, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_100px_100px_40px] gap-3 items-end bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-600 uppercase">Material</span>
                            <select
                                value={pieza.material_id}
                                onChange={(e) => updatePieza(idx, 'material_id', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-all"
                            >
                                <option value="" className="bg-slate-900">Seleccionar...</option>
                                {materials.map(m => (
                                    <option key={m.id} value={m.id} className="bg-slate-900">{m.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-600 uppercase">Ancho cm</span>
                            <input type="number" placeholder="120" value={pieza.ancho_cm}
                                onChange={(e) => updatePieza(idx, 'ancho_cm', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-all" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-600 uppercase">Alto cm</span>
                            <input type="number" placeholder="80" value={pieza.alto_cm}
                                onChange={(e) => updatePieza(idx, 'alto_cm', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-all" />
                        </div>
                        <button onClick={() => removePieza(idx)} disabled={piezas.length <= 1}
                            className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-20">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Complejidad CAM</label>
                    <div className="flex gap-2">
                        {['BAJO', 'MEDIO', 'ALTO'].map(opt => (
                            <button key={opt} onClick={() => { setComplejidad(opt); setCalculation(null); }}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${complejidad === opt ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}>{opt}</button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Canteado (metros lineales)</label>
                    <input type="number" placeholder="0" value={canteado}
                        onChange={(e) => { setCanteado(e.target.value); setCalculation(null); }}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all" />
                </div>
            </div>

            {/* Calculate */}
            <button onClick={handleCalculate} disabled={calculating}
                className="btn-premium flex items-center justify-center gap-2 py-4">
                {calculating ? <Loader2 size={20} className="animate-spin" /> : <Calculator size={20} />}
                {calculating ? 'Calculando...' : 'Calcular Coste CNC'}
            </button>

            {/* Results */}
            {calculation && (
                <div className="flex flex-col gap-6 p-8 bg-cyan-600/5 border border-cyan-500/20 rounded-3xl animate-fade">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Resultado CNC</h4>
                            <p className="text-sm text-slate-400">{piezas.length} pieza(s) • Complejidad {complejidad}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coste Total</span>
                            <p className="text-4xl font-black text-cyan-400">{calculation.coste_total}€</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">m² Totales</span>
                            <p className="text-2xl font-bold">{calculation.m2_totales} m²</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiempo CNC</span>
                            <p className="text-2xl font-bold">{calculation.cnc?.tiempo_min} min</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setCalculation(null)}
                            className="flex-1 glass py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all">Recalcular</button>
                        <button onClick={() => onFinish({ nombre: `CNC — ${piezas.length} piezas`, coste_base: calculation.coste_total, pvp: calculation.coste_total })}
                            className="flex-[2] btn-premium flex items-center justify-center gap-2">
                            <Check size={20} /> Añadir al Presupuesto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step3_CNCCalculation;
