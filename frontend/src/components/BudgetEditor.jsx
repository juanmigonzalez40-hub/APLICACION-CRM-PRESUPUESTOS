import React, { useState } from 'react';
import useStore from '../store';
import {
    Users,
    FileEdit,
    Grid,
    ChevronRight,
    Printer,
    PenTool,
    Layers,
    Box,
    LayoutDashboard,
    Truck,
    TrendingUp,
    Palette,
    CheckCircle,
    Plus
} from 'lucide-react';
import PrintForm from './families/PrintForm';
import VinylForm from './families/VinylForm';
import SignForm from './families/SignForm';
import FurnitureForm from './families/FurnitureForm';
import RigidForm from './families/RigidForm';
import InstallationForm from './families/InstallationForm';
import MarginForm from './families/MarginForm';
import DesignForm from './families/DesignForm';

import ClientStepper from './ClientStepper';

const families = [
    { id: 1, name: 'Impresión Digital', icon: Printer, component: PrintForm },
    { id: 2, name: 'Vinilo de Corte', icon: PenTool, component: VinylForm },
    { id: 3, name: 'Rótulos', icon: Layers, component: SignForm },
    { id: 4, name: 'Mobiliario', icon: Box, component: FurnitureForm },
    { id: 5, name: 'Rígidos / CNC', icon: LayoutDashboard, component: RigidForm },
    { id: 6, name: 'Montajes', icon: Truck, component: InstallationForm },
    { id: 7, name: 'Márgenes', icon: TrendingUp, component: MarginForm },
    { id: 8, name: 'Diseño', icon: Palette, component: DesignForm },
];

const BudgetEditor = () => {
    const { client, project, setProject, activeFamily, setActiveFamily, tempCalculation, addItem, updateSummary } = useStore();
    const [step, setStep] = useState(client ? (project.nombre ? 3 : 2) : 1);

    const ActiveForm = families.find(f => f.id === activeFamily)?.component;

    const handleAddLine = () => {
        if (!tempCalculation.nombre || tempCalculation.precio_venta === 0) return;

        addItem({ ...tempCalculation, id: Date.now() });
        updateSummary();

        // Optional: show a small toast or success state
        alert('Partida añadida al presupuesto');
    };

    // Step 1: Client Selection
    if (step === 1) {
        return (
            <div className="animate-fade-in">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                            <Users size={32} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Selección de Cliente</h2>
                    <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">Identifique al receptor del presupuesto</p>
                </div>

                <ClientStepper onComplete={() => setStep(2)} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl w-full mx-auto animate-fade-in relative pb-20">
            {/* Stepper Indicator */}
            <nav className="flex items-center gap-4 mb-12 bg-surface/30 p-2 border border-white/5 rounded-sm shrink-0 w-fit mx-auto">
                <button
                    onClick={() => setStep(1)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-sm transition-all ${step === 1 ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">01. Cliente</span>
                    {client && <CheckCircle size={14} className={step === 1 ? 'text-black' : 'text-accent'} />}
                </button>
                <ChevronRight size={14} className="text-muted/20" />
                <button
                    onClick={() => client && setStep(2)}
                    disabled={!client}
                    className={`flex items-center gap-3 px-6 py-3 rounded-sm transition-all ${step === 2 ? 'bg-accent text-black' : 'text-muted hover:text-white disabled:opacity-30'}`}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">02. Proyecto</span>
                    {project.nombre && <CheckCircle size={14} className={step === 2 ? 'text-black' : 'text-accent'} />}
                </button>
                <ChevronRight size={14} className="text-muted/20" />
                <button
                    onClick={() => project.nombre && setStep(3)}
                    disabled={!project.nombre}
                    className={`flex items-center gap-3 px-6 py-3 rounded-sm transition-all ${step === 3 ? 'bg-accent text-black' : 'text-muted hover:text-white disabled:opacity-30'}`}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">03. Editor</span>
                </button>
            </nav>

            {step === 2 && (
                <section className="max-w-2xl mx-auto space-y-8 animate-slide-up">
                    <div className="border-l-4 border-accent pl-6">
                        <h3 className="text-4xl font-black uppercase tracking-tighter">Datos del Proyecto</h3>
                        <p className="text-muted text-sm mt-2 font-bold uppercase tracking-widest">Información Maestra del Presupuesto</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 bg-surface/50 border border-white/5 p-8 rounded-sm glass">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-accent tracking-widest">Nombre del Proyecto (Obligatorio)</label>
                            <input
                                type="text"
                                value={project.nombre}
                                onChange={(e) => setProject({ nombre: e.target.value })}
                                placeholder="Ej: Reforma Local Centro Comercial"
                                className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-accent outline-none transition-all font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Fecha</label>
                                <input
                                    type="date"
                                    value={project.fecha}
                                    onChange={(e) => setProject({ fecha: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-accent outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted tracking-widest">Validez (Días)</label>
                                <input
                                    type="number"
                                    value={project.validez}
                                    onChange={(e) => setProject({ validez: parseInt(e.target.value) })}
                                    className="w-full bg-black/50 border border-white/10 p-4 text-white focus:border-accent outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/5 rounded-sm flex items-center justify-between">
                            <div>
                                <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Cliente Asignado</p>
                                <p className="text-xs font-black text-white uppercase mt-1">{client?.nombre} <span className="text-muted text-[10px]">({client?.empresa || 'Particular'})</span></p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-[9px] font-black text-accent uppercase tracking-widest hover:underline">Cambiar</button>
                        </div>

                        <button
                            disabled={!project.nombre}
                            onClick={() => setStep(3)}
                            className="mt-4 w-full bg-accent text-black py-4 font-black uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Confirmar e Ir al Editor
                        </button>
                    </div>
                </section>
            )}

            {step === 3 && (
                <div className="space-y-8 animate-fade-in">
                    {/* Editor Header */}
                    <header className="flex items-end justify-between border-b border-white/5 pb-8 mb-8">
                        <div className="border-l-4 border-accent pl-6">
                            <span className="text-[9px] font-black uppercase text-accent tracking-widest">Construcción de Partidas</span>
                            <h3 className="text-4xl font-black uppercase tracking-tighter mt-1">{project.nombre}</h3>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">
                                {client?.nombre} • {client?.empresa || 'Particular'} • <span className="text-accent">{client?.tipo}</span>
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-wrap gap-1 max-w-[500px] justify-end">
                                {families.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFamily(f.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-tight border transition-all ${activeFamily === f.id
                                            ? 'bg-accent text-black border-accent shadow-[0_0_15px_rgba(217,255,0,0.2)]'
                                            : 'bg-white/5 border-white/5 text-muted hover:border-white/20'
                                            }`}
                                    >
                                        <f.icon size={12} />
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* Form Area */}
                    <section className="bg-surface/40 border border-white/5 p-8 rounded-sm glass min-h-[500px]">
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-sm text-accent">
                                    {React.createElement(families.find(f => f.id === activeFamily)?.icon || Grid, { size: 16 })}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest">Constructor: {families.find(f => f.id === activeFamily)?.name}</h4>
                                    <p className="text-[10px] text-muted font-medium uppercase tracking-tighter">Ingrese parámetros técnicos para generar la partida</p>
                                </div>
                            </div>
                        </div>

                        {ActiveForm && <ActiveForm />}

                        <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                            <button
                                onClick={handleAddLine}
                                disabled={!tempCalculation.nombre || tempCalculation.precio_venta === 0}
                                className="flex items-center gap-2 bg-accent text-black px-8 h-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(217,255,0,0.1)] hover:scale-[1.02] transition-all group disabled:opacity-30 disabled:scale-100"
                            >
                                Añadir a Presupuesto
                                <CheckCircle size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default BudgetEditor;
