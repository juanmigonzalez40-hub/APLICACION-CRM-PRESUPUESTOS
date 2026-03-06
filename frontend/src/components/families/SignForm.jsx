import React, { useState, useEffect } from 'react';
import { Layers, Zap, Plus, Info } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import useStore from '../../store';

const SignForm = () => {
    const { mode, addItem, setTempCalculation, getMargin } = useStore();
    const [formData, setFormData] = useState({
        tipo: 'luminoso_textil',
        material: 'aluminio',
        iluminacion: true,
        ancho_cm: '',
        alto_cm: '',
        fondo_cm: '10',
        unidades: 1
    });

    const tipos = [
        { value: 'luminoso_textil', label: 'Caja de Luz Textil' },
        { value: 'letras_corporeas', label: 'Letras Corpóreas' },
        { value: 'banderola', label: 'Banderola de Fachada' },
        { value: 'placa_flat', label: 'Placa Plana / Directorio' },
    ];

    // Real-time calculation
    useEffect(() => {
        const ancho = parseFloat(formData.ancho_cm) || 0;
        const alto = parseFloat(formData.alto_cm) || 0;
        const unidades = parseInt(formData.unidades) || 0;

        if (ancho > 0 && alto > 0 && unidades > 0) {
            const area = Math.max(0.5, (ancho * alto) / 10000);

            let basePrice = 250;
            if (formData.iluminacion) basePrice += 150;
            if (formData.tipo === 'letras_corporeas') basePrice *= 1.5;

            const cost = area * basePrice * unidades;
            const margin = getMargin('rotulos') || 0.4;
            const marginFactor = Math.max(0.1, 1 - margin);
            const pvp = cost / marginFactor;

            setTempCalculation({
                familia: 'Rótulos',
                family_id: 3,
                nombre: `Rótulo ${ancho}x${alto}cm - ${tipos.find(t => t.value === formData.tipo)?.label}`,
                coste: cost,
                precio_venta: pvp,
                metadatos: formData
            });
        } else {
            setTempCalculation({
                familia: 'Rótulos',
                family_id: 3,
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
                        <Layers size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Tipología de Rótulo</h3>
                    </div>

                    <Select
                        label="Tipo de Producto"
                        options={tipos}
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    />

                    <div className="grid grid-cols-3 gap-4 items-end">
                        <Input label="Ancho (cm)" type="number" value={formData.ancho_cm} onChange={(e) => setFormData({ ...formData, ancho_cm: e.target.value })} />
                        <Input label="Alto (cm)" type="number" value={formData.alto_cm} onChange={(e) => setFormData({ ...formData, alto_cm: e.target.value })} />
                        <Input label="Fondo (mm)" type="number" value={formData.fondo_cm} onChange={(e) => setFormData({ ...formData, fondo_cm: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Electrónica y Acabados</h3>
                    </div>

                    <Toggle
                        label="Incluir Iluminación LED"
                        checked={formData.iluminacion}
                        onChange={(val) => setFormData({ ...formData, iluminacion: val })}
                    />

                    <Select
                        label="Material de Estructura"
                        options={[
                            { value: 'aluminio', label: 'Perfil de Aluminio' },
                            { value: 'acero', label: 'Acero Inoxidable' },
                            { value: 'pvc', label: 'PVC / Metacrilato' },
                        ]}
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />

                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm flex gap-3">
                        <Info size={16} className="text-muted shrink-0" />
                        <p className="text-[9px] text-muted italic leading-tight">
                            Nota: Para rótulos exteriores, asegúrese de añadir la partida de 'Licencias' o 'Instalación' si no es suministro.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignForm;
