import React, { useState, useEffect } from 'react';
import { Truck, Users, Clock, Plus, ShieldCheck } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import useStore from '../../store';

const InstallationForm = () => {
    const { mode, addItem, setTempCalculation, getMargin } = useStore();
    const [formData, setFormData] = useState({
        distancia_km: '0',
        dificultad: 'MEDIA',
        operarios: 2,
        horas: 4,
        maquinaria: 'ninguna'
    });

    // Real-time calculation
    useEffect(() => {
        const km = parseFloat(formData.distancia_km) || 0;
        const horas = parseFloat(formData.horas) || 0;
        const operarios = parseInt(formData.operarios) || 0;

        if (horas > 0 && operarios > 0) {
            const kmCost = km * 0.75; // Could be moved to config table later
            const laborCost = horas * operarios * 35; // Could be moved to materials table (family='montaje')
            let machineryCost = 0;
            if (formData.maquinaria === 'andamio') machineryCost = 150;
            if (formData.maquinaria === 'elevador') machineryCost = 450;

            const totalCost = kmCost + laborCost + machineryCost;
            const marginFactor = 1 - getMargin('montaje');
            const pvp = totalCost / marginFactor;

            setTempCalculation({
                familia: 'Montajes',
                family_id: 6,
                nombre: `Instalación - ${operarios} pers. / ${horas}h (${formData.dificultad})`,
                coste: totalCost,
                precio_venta: pvp,
                metadatos: formData
            });
        } else {
            setTempCalculation({
                familia: 'Montajes',
                family_id: 6,
                nombre: '',
                coste: 0,
                precio_venta: 0,
                metadatos: formData
            });
        }
    }, [formData]);

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Desplazamiento</h3>
                    </div>

                    <Input
                        label="Distancia Ida/Vuelta (Km)"
                        type="number"
                        value={formData.distancia_km}
                        onChange={(e) => setFormData({ ...formData, distancia_km: e.target.value })}
                    />

                    <Select
                        label="Dificultad de Acceso"
                        options={[
                            { value: 'BAJA', label: 'Baja (Planta Calle)' },
                            { value: 'MEDIA', label: 'Media (Escaleras/Interior)' },
                            { value: 'ALTA', label: 'Alta (Altura/Difícil)' },
                        ]}
                        value={formData.dificultad}
                        onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Personal y Medios</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-end">
                        <Input label="Operarios" type="number" value={formData.operarios} onChange={(e) => setFormData({ ...formData, operarios: e.target.value })} />
                        <Input label="Horas Estimadas" type="number" value={formData.horas} onChange={(e) => setFormData({ ...formData, horas: e.target.value })} />
                    </div>

                    <Select
                        label="Maquinaria Especial"
                        options={[
                            { value: 'ninguna', label: 'Ninguna (Escalera Manual)' },
                            { value: 'andamio', label: 'Andamio (Torre)' },
                            { value: 'elevador', label: 'Plataforma Elevadora' },
                        ]}
                        value={formData.maquinaria}
                        onChange={(e) => setFormData({ ...formData, maquinaria: e.target.value })}
                    />
                </div>
            </div>

            <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-sm flex gap-3">
                <ShieldCheck size={16} className="text-green-500 shrink-0" />
                <p className="text-[9px] text-green-200/60 leading-tight uppercase font-bold tracking-tight">
                    Personal con EPIs y formación en alturas (PRL) incluido.
                </p>
            </div>
        </div>
    );
};

export default InstallationForm;
