import React from 'react';
import {
    Calculator,
    FileText,
    Users,
    Settings,
    PlusCircle,
    History,
    ChevronRight,
    ClipboardList
} from 'lucide-react';
import useStore from '../../store';

const Sidebar = () => {
    const { mode, setMode, basket, resetFormalBudget } = useStore();

    const handleNewBudget = () => {
        setMode('formal');
        resetFormalBudget();
    };

    return (
        <aside className="w-[260px] bg-surface flex flex-col border-r border-[#27272A] glass z-30 h-screen shrink-0">
            {/* Brand */}
            <div className="p-6 border-b border-[#27272A] mb-4">
                <h1 className="text-xl font-bold tracking-tighter text-accent flex items-center gap-2">
                    DL STUDIO <span className="text-[10px] bg-accent text-black px-1 rounded uppercase font-black">v2</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-6">
                {/* Main Sections */}
                <div className="space-y-1">
                    <button
                        onClick={() => setMode('quick')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium ${mode === 'quick'
                                ? 'bg-accent/10 border-l-2 border-accent text-accent'
                                : 'text-muted hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Calculator size={18} />
                        <span className="flex-1 text-left">Consulta rápida</span>
                        {mode === 'quick' && <ChevronRight size={14} />}
                    </button>
                </div>

                {/* Presupuestos Section */}
                <div className="space-y-1">
                    <div className="px-4 py-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Presupuestos</p>
                    </div>

                    <button
                        onClick={handleNewBudget}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium text-muted hover:bg-white/5 hover:text-white`}
                    >
                        <PlusCircle size={18} />
                        <span className="flex-1 text-left">Crear nuevo</span>
                    </button>

                    {basket.length > 0 && (
                        <button
                            onClick={() => setMode('formal')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium ${mode === 'formal'
                                    ? 'bg-accent/10 border-l-2 border-accent text-accent'
                                    : 'text-muted hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <ClipboardList size={18} />
                            <span className="flex-1 text-left">Presupuesto en curso</span>
                            <span className="bg-accent/20 text-accent text-[10px] px-1.5 font-bold rounded-full">
                                {basket.length}
                            </span>
                        </button>
                    )}

                    <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium text-muted hover:bg-white/5 hover:text-white`}
                    >
                        <History size={18} />
                        <span className="flex-1 text-left">Historial</span>
                    </button>
                </div>

                {/* Other Sections */}
                <div className="space-y-1">
                    <div className="px-4 py-2 mt-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Gestión</p>
                    </div>

                    <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium text-muted hover:bg-white/5 hover:text-white`}
                    >
                        <Users size={18} />
                        <span className="flex-1 text-left">Clientes</span>
                    </button>

                    <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium text-muted hover:bg-white/5 hover:text-white`}
                    >
                        <Settings size={18} />
                        <span className="flex-1 text-left">Configuración</span>
                    </button>
                </div>
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-[#27272A] mt-auto">
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-sm">
                    <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center font-bold text-xs shrink-0">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">Juan De Lógica</p>
                        <p className="text-[10px] text-muted truncate">Administrador</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
