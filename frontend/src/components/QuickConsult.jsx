import React from 'react';
import useStore from '../store';
import {
    Printer,
    PenTool,
    Layers,
    Box,
    LayoutDashboard,
    Truck,
    TrendingUp,
    Palette,
    ChevronRight,
    Copy,
    RefreshCw
} from 'lucide-react';

import PrintForm from './families/PrintForm';
import VinylForm from './families/VinylForm';
import SignForm from './families/SignForm';
import FurnitureForm from './families/FurnitureForm';
import RigidForm from './families/RigidForm';
import InstallationForm from './families/InstallationForm';
import MarginForm from './families/MarginForm';
import DesignForm from './families/DesignForm';

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

const QuickConsult = () => {
    const { activeFamily, setActiveFamily, tempCalculation, setTempCalculation } = useStore();
    console.log('DEBUG: QuickConsult Active Family ID:', activeFamily);

    const ActiveForm = families.find(f => f.id === activeFamily)?.component;
    console.log('DEBUG: ActiveForm is:', ActiveForm?.name || ActiveForm);

    const handleCopy = () => {
        const text = `Resultado Consulta Rápida:\nFamilia: ${families.find(f => f.id === activeFamily)?.name}\nPartida: ${tempCalculation.nombre}\nPrecio Final: ${tempCalculation.precio_venta.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`;
        navigator.clipboard.writeText(text);
        alert('Copiado al portapapeles');
    };

    const handleNew = () => {
        setTempCalculation({
            coste: 0,
            precio_venta: 0,
            nombre: '',
            metadatos: {}
        });
    };

    return (
        <div className="max-w-5xl w-full mx-auto animate-fade-in pb-20">
            {/* Header section with family selector tabs */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent text-[9px] font-black uppercase tracking-[0.3em]">Calculadora Instantánea</span>
                    <div className="h-[1px] w-12 bg-accent/30"></div>
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">
                    Consulta Rápida
                </h2>

                <div className="flex flex-wrap gap-2">
                    {families.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFamily(f.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${activeFamily === f.id
                                ? 'bg-accent text-black border-accent shadow-[0_0_15px_rgba(217,255,0,0.2)]'
                                : 'bg-white/5 border-white/10 text-muted hover:border-white/20 hover:text-white'
                                }`}
                        >
                            <f.icon size={14} />
                            {f.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Area */}
                <div className="lg:col-span-8">
                    <section className="bg-surface/50 border border-white/5 glass rounded-sm p-8 min-h-[500px]">
                        {ActiveForm ? (
                            <ActiveForm />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-muted">
                                <RefreshCw size={32} className="animate-spin mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">Cargando constructor...</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Results & Actions Area */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-surface/60 border border-white/5 p-8 rounded-sm glass sticky top-8 border-l-2 border-accent">
                        <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2 italic">Precio Calculado</p>
                        <div className="mb-10">
                            <p className="text-6xl font-black text-white tracking-tighter tabular-nums leading-none">
                                {tempCalculation.precio_venta.toLocaleString('es-ES', { minimumFractionDigits: 2 })} <span className="text-accent text-3xl">€</span>
                            </p>
                            <p className="text-[10px] text-muted font-bold uppercase mt-4 tracking-widest">Importe Final de Venta</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCopy}
                                disabled={tempCalculation.precio_venta === 0}
                                className="w-full flex items-center justify-center gap-2 bg-accent text-black py-4 text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 disabled:opacity-30 shadow-[0_0_20px_rgba(217,255,0,0.1)]"
                            >
                                <Copy size={16} />
                                Copiar Resultado
                            </button>
                            <button
                                onClick={handleNew}
                                className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-muted hover:text-white py-4 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <RefreshCw size={16} />
                                Limpiar datos
                            </button>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp size={14} className="text-accent/50" />
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic">Desglose de Rentabilidad</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] text-muted font-bold uppercase group-hover:text-white transition-colors">Base Manufactura</span>
                                    <span className="text-[11px] text-white font-black tabular-nums">{tempCalculation.coste.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] text-muted font-bold uppercase group-hover:text-white transition-colors">Margen Operativo</span>
                                    <span className="text-[11px] text-accent font-black tabular-nums">{(tempCalculation.precio_venta - tempCalculation.coste).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                                </div>
                                <div className="h-[1px] bg-white/5 w-full my-2"></div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] text-muted font-bold uppercase group-hover:text-white transition-colors">Rendimiento</span>
                                    <span className="text-sm text-accent font-black">
                                        {tempCalculation.precio_venta > 0
                                            ? ((1 - (tempCalculation.coste / tempCalculation.precio_venta)) * 100).toFixed(0)
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickConsult;
