import React, { useState } from 'react';
import Step1_Client from './Step1_Client';
import Step3_CatalogCalculation from './Step3_CatalogCalculation';
import Step3_VinylCalculation from './Step3_VinylCalculation';
import Step3_CNCCalculation from './Step3_CNCCalculation';
import Step3_FurnitureCalculation from './Step3_FurnitureCalculation';
import Step3_PrintCalculation from './Step3_PrintCalculation';
import Step3_DesignCalculation from './Step3_DesignCalculation';
import { useBudget } from '../../../context/BudgetContext';
import GlassCard from '../../common/GlassCard';
import { ArrowLeft, CheckCircle2, Package, Scissors, Box, Armchair, Printer, Palette } from 'lucide-react';

const familyConfig = [
    { name: 'Muebles Catálogo', family: 'catalogo', icon: Package, color: 'blue' },
    { name: 'Vinilo de Corte', family: 'vinilo', icon: Scissors, color: 'orange' },
    { name: 'Rígidos CNC', family: 'cnc', icon: Box, color: 'cyan' },
    { name: 'Mobiliario a Medida', family: 'medida', icon: Armchair, color: 'amber' },
    { name: 'Impresión / Lonas', family: 'impresion', icon: Printer, color: 'pink' },
    { name: 'Diseño / Marca', family: 'diseno', icon: Palette, color: 'violet' },
];

const familyColors = {
    catalogo: 'bg-blue-600/20 text-blue-400 border-blue-500/50',
    vinilo: 'bg-orange-600/20 text-orange-400 border-orange-500/50',
    cnc: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/50',
    medida: 'bg-amber-600/20 text-amber-400 border-amber-500/50',
    impresion: 'bg-pink-600/20 text-pink-400 border-pink-500/50',
    diseno: 'bg-violet-600/20 text-violet-400 border-violet-500/50',
};

const BudgetWizard = () => {
    const [step, setStep] = useState(1);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const { currentBudget, updateBudget, addPartida } = useBudget();

    const handleNextStep = (data) => {
        if (step === 1) {
            updateBudget({ cliente: data });
            setStep(2);
        } else if (step === 2) {
            setSelectedFamily(data);
            setStep(3);
        } else if (step === 3) {
            const familyLabel = familyConfig.find(f => f.family === selectedFamily)?.name || selectedFamily;
            addPartida({
                descripcion: data.nombre,
                coste: data.coste_base,
                precio: data.pvp,
                familia: familyLabel
            });
            setStep(4);
        }
    };

    const renderCalculationStep = () => {
        const props = { onFinish: handleNextStep };
        switch (selectedFamily) {
            case 'catalogo': return <Step3_CatalogCalculation {...props} />;
            case 'vinilo': return <Step3_VinylCalculation {...props} />;
            case 'cnc': return <Step3_CNCCalculation {...props} />;
            case 'medida': return <Step3_FurnitureCalculation {...props} />;
            case 'impresion': return <Step3_PrintCalculation {...props} />;
            case 'diseno': return <Step3_DesignCalculation {...props} />;
            default: return <Step3_CatalogCalculation {...props} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {/* progress bar */}
            <div className="flex gap-4">
                {[1, 2, 3, 4].map(s => (
                    <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-blue-600' : 'bg-white/10 opacity-30'}`}
                        style={s <= step ? { background: 'var(--grad-premium)' } : {}}
                    />
                ))}
            </div>

            <div className="flex items-center gap-4">
                {step > 1 && step < 4 && (
                    <button
                        onClick={() => setStep(prev => prev - 1)}
                        className="p-2 rounded-full glass hover:bg-white/10 transition-all text-slate-400"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
            </div>

            <GlassCard>
                {step === 1 && <Step1_Client onNext={handleNextStep} />}
                {step === 2 && (
                    <div className="animate-fade flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-bold tracking-tight">¿Qué vamos a presupuestar?</h3>
                            <p className="text-slate-400">Cliente: <span className="text-blue-400 font-medium">{currentBudget.cliente?.nombre}</span></p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {familyConfig.map(opt => {
                                const Icon = opt.icon;
                                return (
                                    <div
                                        key={opt.family}
                                        onClick={() => handleNextStep(opt.family)}
                                        className="glass p-8 flex flex-col gap-4 cursor-pointer hover:border-blue-500/50 transition-all text-center group"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-white/5 text-slate-400 group-hover:${familyColors[opt.family]?.split(' ')[0]} group-hover:text-white transition-all`}>
                                            <Icon size={26} />
                                        </div>
                                        <p className="font-bold text-lg">{opt.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {step === 3 && renderCalculationStep()}
                {step === 4 && (
                    <div className="flex flex-col items-center gap-8 py-12 animate-fade">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold">¡Partida Añadida!</h3>
                            <p className="text-slate-400 mt-2">Se ha agregado la partida al presupuesto de {currentBudget.cliente?.nombre}.</p>
                        </div>
                        <div className="glass p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resumen Actual</span>
                                <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">BORRADOR</span>
                            </div>
                            <div className="flex flex-col gap-3 mb-4">
                                {currentBudget.partidas.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{p.familia}</span>
                                            <span className="text-slate-300">{p.descripcion}</span>
                                        </div>
                                        <span className="font-semibold">{parseFloat(p.precio).toFixed(2)}€</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-slate-400 font-medium">Total Base</span>
                                <span className="text-2xl font-black text-white">
                                    {currentBudget.partidas.reduce((acc, p) => acc + parseFloat(p.precio), 0).toFixed(2)}€
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full max-w-md">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 glass py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                            >
                                Añadir Otra Partida
                            </button>
                            <button className="flex-1 btn-premium">
                                Finalizar Presupuesto
                            </button>
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default BudgetWizard;
