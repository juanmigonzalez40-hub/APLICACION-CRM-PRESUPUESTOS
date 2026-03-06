import React from 'react';
import {
    Trash2,
    Edit3,
    GripVertical,
    Plus,
    AlertTriangle,
    ChevronRight,
    TrendingUp,
    Box,
    Layers,
    Printer,
    PenTool,
    LayoutDashboard,
    Truck,
    Palette
} from 'lucide-react';
import useStore from '../../store';

const iconMap = {
    1: Printer,
    2: PenTool,
    3: Layers,
    4: Box,
    5: LayoutDashboard,
    6: Truck,
    7: TrendingUp,
    8: Palette
};

const RightPanel = () => {
    const { mode, basket, summary, removeItem, clearBasket } = useStore();

    // In Quick mode, show only if there are items
    if (mode === 'quick' && basket.length === 0) return null;

    return (
        <aside className="w-[380px] h-screen bg-black border-l border-[#27272A] glass p-6 flex flex-col z-10 shrink-0 overflow-y-auto custom-scroll">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted italic">
                    {mode === 'formal' ? 'Presupuesto en curso' : 'Resultados de consulta'}
                </h3>
                <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold rounded uppercase tracking-widest">Live</span>
            </div>

            {/* Main Metrics */}
            <div className="space-y-6 shrink-0">
                <div className="p-6 bg-surface/30 border-l-2 border-accent rounded-r-sm relative overflow-hidden group border border-white/5 shadow-xl">
                    <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                        <TrendingUp size={160} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-3">Total Venta (PVP)</p>
                    <p className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none mb-6">
                        {summary.pvp_total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-accent text-xl ml-1">€</span>
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(217,255,0,0.5)]"
                                style={{ width: `${Math.min(summary.margen_promedio * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] font-black text-accent tracking-tighter whitespace-nowrap">{(summary.margen_promedio * 100).toFixed(0)}% MARGEN</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface/20 border border-white/5 group hover:border-white/10 transition-colors rounded-sm flex flex-col gap-1">
                        <p className="text-[8px] font-black uppercase text-muted tracking-widest">Coste Est.</p>
                        <p className="text-xl font-black tabular-nums text-white/90 leading-none">
                            {summary.coste_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span className="text-[10px] opacity-40">€</span>
                        </p>
                    </div>
                    <div className="p-4 bg-surface/20 border border-white/5 group hover:border-white/10 transition-colors rounded-sm flex flex-col gap-1">
                        <p className="text-[8px] font-black uppercase text-muted tracking-widest">Margen Bruto</p>
                        <p className={`text-xl font-black tabular-nums leading-none ${(summary.pvp_total - summary.coste_total) > 0 ? 'text-accent' : 'text-white'}`}>
                            {(summary.pvp_total - summary.coste_total).toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span className="text-[10px] opacity-40 text-white">€</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Basket/Lines List */}
            <div className="mt-10 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                    <p className="text-[10px] font-black uppercase text-muted tracking-widest">Líneas ({basket.length})</p>
                    {basket.length > 0 && (
                        <button
                            onClick={clearBasket}
                            className="text-[8px] text-red-500/50 hover:text-red-500 font-bold uppercase transition-all px-2 py-1 border border-red-500/10 hover:border-red-500/30 rounded-sm"
                        >
                            Vaciar todo
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-3 min-h-0">
                    {basket.length === 0 ? (
                        <div className="py-20 border border-dashed border-white/5 rounded-sm text-center flex flex-col items-center justify-center gap-3">
                            <div className="p-4 bg-white/5 rounded-full text-muted/20">
                                <Box size={32} />
                            </div>
                            <p className="text-[10px] text-muted uppercase tracking-widest font-bold max-w-[150px] leading-relaxed">Inicie una construcción para añadir líneas</p>
                        </div>
                    ) : (
                        basket.map((item, index) => {
                            const Icon = iconMap[item.family_id] || Box;
                            return (
                                <div key={item.id} className="group relative bg-surface/40 hover:bg-surface/60 p-4 rounded-sm border border-white/5 hover:border-accent/20 transition-all flex gap-4">
                                    <div className="shrink-0 flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-sm bg-black/40 border border-white/5 flex items-center justify-center text-accent/50 group-hover:text-accent transition-colors">
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-[8px] font-black text-muted tabular-nums">#{index + 1}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2 mb-1">
                                            <p className="text-[11px] font-black tracking-tight text-white/90 truncate uppercase">
                                                {item.nombre || 'Línea sin nombre'}
                                            </p>
                                            <p className="text-[11px] font-black tabular-nums text-accent">{item.precio_venta.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-[8px] px-1.5 py-0.5 bg-black/50 text-muted uppercase font-bold rounded-xs tracking-tighter">
                                                FAM {item.family_id}
                                            </span>
                                            <div className="h-[1px] flex-1 bg-white/5"></div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-bold text-muted uppercase tracking-tighter">Cant.</span>
                                                    <span className="text-[9px] font-black text-white">{item.cantidad || 1} {item.unidad || 'ud'}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-bold text-muted uppercase tracking-tighter">Margen</span>
                                                    <span className="text-[9px] font-black text-accent">{((1 - (item.coste / item.precio_venta)) * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-muted hover:text-white hover:bg-white/10 rounded-sm transition-all shadow-sm">
                                                    <Edit3 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all shadow-sm"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <div className="cursor-grab p-1.5 text-muted hover:text-white">
                                                    <GripVertical size={12} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Warnings & Alerts */}
            <div className="mt-8 shrink-0">
                {summary.margen_promedio < 0.3 && summary.pvp_total > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex gap-3 items-start animate-fade-in">
                        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-100/70 leading-tight font-black uppercase tracking-tight">
                            Alerta: <span className="text-red-500">MARGEN CRÍTICO ({(summary.margen_promedio * 100).toFixed(0)}%)</span>. REVISAR COSTES.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default RightPanel;
