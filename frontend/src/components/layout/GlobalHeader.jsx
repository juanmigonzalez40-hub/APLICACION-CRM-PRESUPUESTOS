import React from 'react';
import {
    FileText,
    FileCheck,
    Wrench,
    User,
    Briefcase,
    ChevronRight,
    Download,
    CheckCircle,
    Clock,
    Send,
    MoreHorizontal
} from 'lucide-react';
import useStore from '../../store';

const GlobalHeader = () => {
    const {
        mode,
        setMode,
        tariff,
        setTariff,
        client,
        project
    } = useStore();

    const isFormal = mode === 'formal';

    return (
        <header className="h-[70px] border-b border-[#27272A] glass z-50 px-6 grid grid-cols-3 gap-x-4 items-center shrink-0 w-full overflow-hidden">
            {/* 1. Left: Selectors */}
            <div className="flex items-center gap-4 min-w-0">
                <div className="flex flex-col shrink-0">
                    <span className="text-[8px] font-black uppercase text-muted tracking-widest mb-1">Modo</span>
                    <div className="flex bg-black p-0.5 rounded-sm border border-[#27272A]">
                        <button
                            onClick={() => setMode('quick')}
                            className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all rounded-sm ${mode === 'quick' ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
                        >
                            {mode === 'quick' ? 'Consulta' : 'C'}
                        </button>
                        <button
                            onClick={() => setMode('formal')}
                            className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all rounded-sm ${mode === 'formal' ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
                        >
                            {mode === 'formal' ? 'Presupuesto' : 'P'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col shrink-0">
                    <span className="text-[8px] font-black uppercase text-muted tracking-widest mb-1">Tarifa</span>
                    <div className="flex bg-black p-0.5 rounded-sm border border-[#27272A]">
                        <button
                            disabled={isFormal && client?.tipo}
                            onClick={() => setTariff('final')}
                            className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all rounded-sm ${tariff === 'final' ? 'bg-accent text-black' : 'text-muted hover:text-white'} ${isFormal && client?.tipo ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            {tariff === 'final' ? 'Final' : 'F'}
                        </button>
                        <button
                            disabled={isFormal && client?.tipo}
                            onClick={() => setTariff('agencia')}
                            className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest transition-all rounded-sm ${tariff === 'agencia' ? 'bg-accent text-black' : 'text-muted hover:text-white'} ${isFormal && client?.tipo ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            {tariff === 'agencia' ? 'Agencia' : 'A'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Center: Project Info (Rigidly centered) */}
            <div className="flex justify-center min-w-0">
                {isFormal && (
                    <div className="flex items-center gap-3 bg-surface/80 px-4 py-1.5 rounded-sm border border-white/10 h-9 shrink-0 shadow-lg">
                        <div className="flex flex-col shrink-0">
                            <span className="text-[7px] font-black text-muted uppercase tracking-tighter">Ref</span>
                            <span className="text-[9px] font-black text-white leading-none mt-0.5">{project.referencia || 'P-000'}</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/20"></div>
                        <div className="flex flex-col min-w-0 max-w-[120px]">
                            <span className="text-[7px] font-black text-muted uppercase tracking-tighter">Cliente</span>
                            <span className="text-[9px] font-black text-accent truncate leading-none mt-0.5">
                                {client?.nombre || 'ALTA'}
                            </span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/20"></div>
                        <div className="flex flex-col shrink-0">
                            <span className="text-[7px] font-black text-muted uppercase tracking-tighter">Estado</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={`w-1 h-1 rounded-full ${project.estado === 'borrador' ? 'bg-muted' : 'bg-accent'}`}></span>
                                <span className="text-[9px] font-black uppercase text-white leading-none">{project.estado}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Right: Actions */}
            <div className="flex items-center justify-end gap-2 pr-1">
                {isFormal && (
                    <>
                        <div className="flex items-center gap-1.5">
                            <button title="Presupuesto" className="w-8 h-8 bg-white/5 hover:bg-white/10 text-muted hover:text-white border border-white/5 rounded-sm flex items-center justify-center transition-colors">
                                <FileText size={14} />
                            </button>
                            <button title="Proforma" className="w-8 h-8 bg-white/5 hover:bg-white/10 text-muted hover:text-white border border-white/5 rounded-sm flex items-center justify-center transition-colors">
                                <FileCheck size={14} />
                            </button>
                            <button title="OT" className="w-8 h-8 bg-white/5 hover:bg-white/10 text-muted hover:text-white border border-white/5 rounded-sm flex items-center justify-center transition-colors">
                                <Wrench size={14} />
                            </button>
                        </div>
                        <div className="w-[1px] h-6 bg-white/10 mx-1 hidden lg:block"></div>
                        <button className="w-8 h-8 flex items-center justify-center bg-accent text-black hover:scale-105 active:scale-95 transition-all rounded-sm shadow-[0_0_10px_rgba(217,255,0,0.2)]">
                            <CheckCircle size={14} />
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default GlobalHeader;
