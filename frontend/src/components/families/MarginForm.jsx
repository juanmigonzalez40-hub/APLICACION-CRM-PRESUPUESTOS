import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Percent, ShieldCheck, AlertCircle } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useStore from '../../store';

const MarginForm = () => {
    const { client, setClient, summary, updateSummary, project, setProject } = useStore();

    const handleUpdateClient = (updates) => {
        setClient({ ...client, ...updates });
        setTimeout(updateSummary, 0);
    };

    const handleUpdateProject = (updates) => {
        setProject(updates);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Métricas de Rentabilidad</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-black/40 border border-white/5 p-6 rounded-sm">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-[9px] font-black uppercase text-muted tracking-widest">Margen Bruto Promedio</span>
                                <span className={`text-2xl font-black ${(summary.margen_promedio * 100) > 30 ? 'text-accent' : 'text-orange-500'}`}>
                                    {(summary.margen_promedio * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${summary.margen_promedio > 0.3 ? 'bg-accent' : 'bg-orange-500'}`}
                                    style={{ width: `${Math.min(100, summary.margen_promedio * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="p-4 bg-accent/5 border border-accent/10 rounded-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck size={14} className="text-accent" />
                                <p className="text-[9px] text-accent font-black uppercase tracking-widest">Motor de Cálculo Activo</p>
                            </div>
                            <p className="text-[9px] text-accent/60 leading-tight italic">
                                Las tarifas de <span className="text-white">{(client?.tipo || 'final').toUpperCase()}</span> se están aplicando a todas las partidas del presupuesto actual.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Percent size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Ajustes Globales</h3>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Descuento Final Presupuesto (%)"
                            type="number"
                            placeholder="0"
                            value={project.descuento || ''}
                            onChange={(e) => handleUpdateProject({ descuento: parseFloat(e.target.value) || 0 })}
                        />
                        <div className="h-[1px] w-full bg-white/5"></div>
                        <Select
                            label="Estado del Presupuesto"
                            options={[
                                { value: 'borrador', label: 'Borrador (Edición)' },
                                { value: 'enviado', label: 'Enviado al Cliente' },
                                { value: 'aprobado', label: 'Aprobado (Listo para OT)' },
                            ]}
                            value={project.estado}
                            onChange={(e) => handleUpdateProject({ estado: e.target.value })}
                        />
                    </div>

                    {summary.margen_promedio < 0.25 && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-sm flex gap-3">
                            <AlertCircle size={16} className="text-orange-500 shrink-0" />
                            <p className="text-[9px] text-orange-200/80 leading-tight uppercase font-bold tracking-tight">
                                Alerta de Rentabilidad: El margen es inferior al mínimo recomendado del 25%.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarginForm;
