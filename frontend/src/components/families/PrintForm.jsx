import React, { useState, useEffect } from 'react';
import { Info, AlertCircle, Plus, Layers, Printer, Scissors } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import useStore from '../../store';

/**
 * PrintForm — Impresión HP Latex (Tipos 1, 2 y 3)
 * Datos de materiales extraídos de costes_corregido.xlsx (hoja SOPORTES IMPRESIÓN)
 */

const COST = {
    IMP_M2: 10.14,
    IMP_FIJO: 3.74,
    PREP_BAJA: 1.49,
    PREP_MEDIA: 4.48,
    PREP_ALTA: 8.97,
    LAM_PROCESO_M2: 2.83,
    LAM_MATERIAL_M2: 1.66,
    LAM_FIJO: 2.50,
    SUMMA_CORTE_M2: 2.91,
    SUMMA_FIJO: 3.25,
    SUMMA_TRAZADO: { BAJA: 1.49, MEDIA: 2.99, ALTA: 8.97 },
    PELADO_M2: { BAJA: 1.25, MEDIA: 4.99, ALTA: 11.23 },
    TRANSPORTADOR_M2: 1.16,  // precio real del Excel (hoja VINILO CORTE — Transportador)
};

/**
 * Catálogo extraído de costes_corregido.xlsx → hoja "SOPORTES IMPRESIÓN"
 * La clave 'clase' coincide con el campo clase de la tabla materiales en Supabase.
 */
const CATALOGO_IMPRESION = {
    monomerico: {
        label: 'Vinilo Monomérico',
        clase: 'VINILO MONOMERICO',
        materiales: [
            { value: 'VM-PER', label: 'Monomérico Permanente', precio: 1.35 },
            { value: 'VM-REM', label: 'Monomérico Removible', precio: 1.40 },
            { value: 'VM-TRANS', label: 'Monomérico Transparente', precio: 1.40 },
            { value: 'VM-HT', label: 'Monomérico HT / Pared', precio: 2.25 },
            { value: 'VM-MIC', label: 'Microperforado ONE VISION', precio: 3.83 },
            { value: 'VM-MICH', label: 'Microperforado Homologado', precio: 7.23 },
        ],
    },
    polimerico: {
        label: 'Vinilo Polimérico',
        clase: 'VINILO POLIMERICO',
        materiales: [
            { value: 'VP-PER', label: 'Polimérico Permanente', precio: 3.60 },
            { value: 'VP-REM', label: 'Polimérico Removible', precio: 3.60 },
            { value: 'VP-TRANS', label: 'Polimérico Transparente', precio: 2.94 },
            { value: 'VP-HT', label: 'Polimérico HT / Pared', precio: 2.79 },
            { value: 'VP-BO', label: 'Polimérico Block-Out', precio: 4.71 },
        ],
    },
    especial: {
        label: 'Vinilo Especial',
        clase: 'VINILO ESPECIAL',
        materiales: [
            { value: 'VAC-01', label: 'Vinilo Ácido', precio: 4.42 },
            { value: 'VMC-BN', label: 'Microventosa Blanco', precio: 3.62 },
            { value: 'VMC-TR', label: 'Microventosa Transparente', precio: 3.62 },
        ],
    },
    papel: {
        label: 'Papel / Film',
        clase: 'PAPEL',
        materiales: [
            { value: 'PAP-01', label: 'Papel Fotográfico', precio: 1.86 },
            { value: 'FBK-01', label: 'Film Backlite', precio: 6.07 },
        ],
    },
    lona: {
        label: 'Lona / Textil',
        clase: 'LONA / TEXTIL',
        materiales: [
            { value: 'LO-FL', label: 'Lona Frontlite 510gr', precio: 1.75 },
            { value: 'LO-BL', label: 'Lona Backlite', precio: 3.50 },
            { value: 'LO03-MIC', label: 'Lona Microperforada', precio: 2.25 },
            { value: 'TE01-BL', label: 'Tela Backlite', precio: 2.85 },
            { value: 'LI-01', label: 'Lienzo Poliéster', precio: 4.76 },
            { value: 'LO-BO', label: 'Lona Blockout', precio: 3.60 },
        ],
    },
};

const FAMILIA_KEYS = Object.keys(CATALOGO_IMPRESION);

const PrintForm = () => {
    const { setTempCalculation, catalogs, getMargin } = useStore();

    const [formData, setFormData] = useState({
        familia_material: FAMILIA_KEYS[0],
        material_id: CATALOGO_IMPRESION[FAMILIA_KEYS[0]].materiales[0].value,
        ancho_cm: '',
        alto_cm: '',
        unidades: 1,
        laminado_id: 'none',
        corte_contorno: false,
        complejidad: 'MEDIA',
        con_pelado: false,
        con_transportador: false,
    });

    const [alerts, setAlerts] = useState([]);

    // ── Construir catálogo desde BD o fallback ───────────────────────────────
    // La BD usa campo 'clase' (ej: 'VINILO MONOMERICO') y 'nombre' (ej: 'Monomérico Permanente')
    const dbMateriales = React.useMemo(() =>
        (catalogs.materiales || []).filter(m => m.familia === 'impresion'),
        [catalogs.materiales]
    );

    const catalogoDB = React.useMemo(() => {
        if (dbMateriales.length === 0) return null;
        const grupos = {};
        // Usar 'clase' normalizada como clave estable (sin tildes, espacios → _)
        const normKey = (s) => (s || 'OTROS')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar tildes
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')  // solo alfanumérico
            .replace(/^_|_$/g, '');       // limpiar extremos
        dbMateriales.forEach(m => {
            const key = normKey(m.clase);
            if (!grupos[key]) {
                grupos[key] = { label: m.clase || 'Otros', clase: m.clase, materiales: [] };
            }
            grupos[key].materiales.push({ value: m.id, label: m.nombre, precio: m.precio });
        });
        return grupos;
    }, [dbMateriales]);

    // Usar BD si tiene datos, si no el catálogo del Excel (fallback)
    const catalogo = catalogoDB || CATALOGO_IMPRESION;
    const familiaOptions = Object.entries(catalogo).map(([key, val]) => ({
        value: key,
        label: val.label,
    }));

    // Subfamilias disponibles según la familia elegida
    const subfamiliaOptions = React.useMemo(() => {
        const grupo = catalogo[formData.familia_material];
        return grupo?.materiales || [];
    }, [catalogo, formData.familia_material]);

    // Si la familia cambia, auto-seleccionar el primer material de esa familia
    useEffect(() => {
        if (subfamiliaOptions.length > 0) {
            const existe = subfamiliaOptions.find(m => m.value === formData.material_id);
            if (!existe) {
                setFormData(prev => ({ ...prev, material_id: subfamiliaOptions[0].value }));
            }
        }
    }, [formData.familia_material, subfamiliaOptions]);

    // Init when catalog loads from DB for the first time
    useEffect(() => {
        if (familiaOptions.length > 0 && !familiaOptions.find(f => f.value === formData.familia_material)) {
            const firstKey = familiaOptions[0].value;
            const firstMat = catalogo[firstKey]?.materiales[0]?.value || '';
            setFormData(prev => ({ ...prev, familia_material: firstKey, material_id: firstMat }));
        }
    }, [catalogo]);

    // Limpiar pelado/transportadora si se desactiva corte contorno
    useEffect(() => {
        if (!formData.corte_contorno) {
            setFormData(prev => ({ ...prev, con_pelado: false, con_transportador: false }));
        }
    }, [formData.corte_contorno]);

    const laminados = [
        { value: 'none', label: 'Sin Laminado' },
        { value: 'LM-MA', label: 'Laminado Monomérico Mate  (+1.66 €/m²)' },
        { value: 'LM-BR', label: 'Laminado Monomérico Brillo (+1.66 €/m²)' },
        { value: 'LP-MA', label: 'Laminado Polimérico Mate  (+2.74 €/m²)' },
        { value: 'LP-BR', label: 'Laminado Polimérico Brillo (+2.74 €/m²)' },
        { value: 'LS01-Ant', label: 'Laminado Suelo Antideslizante (+3.75 €/m²)' },
        { value: 'LVEL-BL', label: 'Veleda Blanco (+8.50 €/m²)' },
        { value: 'LVEL-TR', label: 'Veleda Transparente (+8.50 €/m²)' },
    ];

    // Precio real del laminado seleccionado
    const LAM_PRECIOS = {
        'none': 0, 'LM-MA': 1.66, 'LM-BR': 1.66,
        'LP-MA': 2.74, 'LP-BR': 2.74, 'LS01-Ant': 3.75,
        'LVEL-BL': 8.50, 'LVEL-TR': 8.50,
    };

    const tipoTrabajo = React.useMemo(() => {
        if (formData.corte_contorno && formData.laminado_id !== 'none') return 'TIPO_3';
        if (formData.corte_contorno) return 'TIPO_2';
        return 'TIPO_1';
    }, [formData.corte_contorno, formData.laminado_id]);

    useEffect(() => {
        const newAlerts = [];
        const ancho = parseFloat(formData.ancho_cm) || 0;
        const alto = parseFloat(formData.alto_cm) || 0;
        const unidades = parseInt(formData.unidades) || 1;

        const allMats = Object.values(catalogo).flatMap(g => g.materiales);
        const selectedMaterial = allMats.find(m => m.value === formData.material_id);

        if (ancho > 137 && formData.laminado_id !== 'none') {
            newAlerts.push({ type: 'warning', text: 'Ancho > 137cm: El laminado máximo es de 140cm. Se requerirá solape manual.' });
        }
        const area = (ancho * alto) / 10000;
        if (area > 0 && area < 1) {
            newAlerts.push({ type: 'info', text: 'Área inferior a 1m²: Se aplicará el mínimo facturable de 1m².' });
        }
        setAlerts(newAlerts);

        if (ancho > 0 && alto > 0 && unidades > 0) {
            const m2_real = (ancho * alto) / 10000;
            const m2_cobrado = Math.max(1, m2_real) * unidades;

            const vinyloPrecio = selectedMaterial?.precio || 1.35;
            let coste = m2_cobrado * (COST.IMP_M2 + vinyloPrecio) + COST.IMP_FIJO;

            const prep = formData.complejidad === 'BAJA' ? COST.PREP_BAJA
                : formData.complejidad === 'ALTA' ? COST.PREP_ALTA : COST.PREP_MEDIA;
            coste += prep;

            if (formData.laminado_id !== 'none') {
                const lamPrecio = LAM_PRECIOS[formData.laminado_id] ?? COST.LAM_MATERIAL_M2;
                coste += m2_cobrado * (COST.LAM_PROCESO_M2 + lamPrecio) + COST.LAM_FIJO;
            }

            if (formData.corte_contorno) {
                const trazado = COST.SUMMA_TRAZADO[formData.complejidad] ?? COST.SUMMA_TRAZADO.MEDIA;
                coste += m2_cobrado * COST.SUMMA_CORTE_M2 + COST.SUMMA_FIJO + trazado;

                if (formData.con_pelado) {
                    coste += m2_cobrado * (COST.PELADO_M2[formData.complejidad] ?? COST.PELADO_M2.MEDIA);
                }
                if (formData.con_transportador) {
                    coste += m2_cobrado * COST.TRANSPORTADOR_M2;
                }
            }

            const margin = getMargin('impresion') || 0.58;
            const pvp = coste / (1 - margin);
            const familiaLabel = catalogo[formData.familia_material]?.label || '';

            setTempCalculation({
                familia: 'Impresión',
                family_id: 1,
                nombre: `${tipoTrabajo.replace('_', ' ')} — ${ancho}×${alto}cm (×${unidades}) — ${familiaLabel}: ${selectedMaterial?.label || ''}`,
                coste,
                precio_venta: pvp,
                metadatos: { ...formData, tipo_trabajo: tipoTrabajo, m2_cobrado: m2_cobrado.toFixed(3) }
            });
        } else {
            setTempCalculation({ familia: 'Impresión', family_id: 1, nombre: '', coste: 0, precio_venta: 0, metadatos: formData });
        }
    }, [formData, catalogo, tipoTrabajo]);

    const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const tipoLabel = {
        TIPO_1: 'TIPO 1 — Solo impreso',
        TIPO_2: 'TIPO 2 — Impreso + Corte contorno',
        TIPO_3: 'TIPO 3 — Impreso + Laminado + Corte'
    };

    return (
        <div className="space-y-8 animate-slide-up">

            <div className="p-3 bg-accent/5 border border-accent/15 rounded-sm flex gap-3 items-center">
                <Printer size={13} className="text-accent shrink-0" />
                <p className="text-[9px] text-accent/80 uppercase font-black tracking-tight">{tipoLabel[tipoTrabajo]}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna izquierda: Especificaciones */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Layers size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Especificaciones HP Latex</h3>
                    </div>

                    <Select
                        label="Familia de material"
                        options={familiaOptions}
                        value={formData.familia_material}
                        onChange={(e) => set('familia_material', e.target.value)}
                    />

                    <Select
                        label="Material de impresión (soporte base)"
                        options={subfamiliaOptions}
                        value={formData.material_id}
                        onChange={(e) => set('material_id', e.target.value)}
                    />

                    <div className="grid grid-cols-3 gap-4 items-end">
                        <Input label="Ancho (cm)" type="number" placeholder="0" value={formData.ancho_cm} onChange={(e) => set('ancho_cm', e.target.value)} />
                        <Input label="Alto (cm)" type="number" placeholder="0" value={formData.alto_cm} onChange={(e) => set('alto_cm', e.target.value)} />
                        <Input label="Unidades" type="number" placeholder="1" value={formData.unidades} onChange={(e) => set('unidades', e.target.value)} />
                    </div>

                    <Select
                        label="Complejidad (afecta prep. archivo y trazado)"
                        options={[
                            { value: 'BAJA', label: 'Baja — Rectangular / Fondo entero' },
                            { value: 'MEDIA', label: 'Media — Formas simples / Logotipo' },
                            { value: 'ALTA', label: 'Alta — Detalle fino / Perfilado exacto' },
                        ]}
                        value={formData.complejidad}
                        onChange={(e) => set('complejidad', e.target.value)}
                    />
                </div>

                {/* Columna derecha: Acabados */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Plus size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Acabados (Laminado / Corte)</h3>
                    </div>

                    <Select
                        label="Tipo de Laminado (+2.83 €/m² proceso)"
                        options={laminados}
                        value={formData.laminado_id}
                        onChange={(e) => set('laminado_id', e.target.value)}
                    />

                    <Toggle
                        label="Corte de contorno — Plotter Summa (+2.91 €/m²)"
                        checked={formData.corte_contorno}
                        onChange={(val) => set('corte_contorno', val)}
                    />

                    {formData.corte_contorno && (
                        <div className="ml-4 space-y-4 pl-4 border-l-2 border-accent/20 animate-slide-up">
                            <p className="text-[9px] text-accent/60 uppercase font-black tracking-widest mb-2">
                                Opciones Plotter Summa
                            </p>
                            <Toggle
                                label={`Pelado (retirar sobrante vinilo) — ${formData.complejidad === 'BAJA' ? '+1.25' :
                                    formData.complejidad === 'ALTA' ? '+11.23' : '+4.99'
                                    } €/m²`}
                                checked={formData.con_pelado}
                                onChange={(val) => set('con_pelado', val)}
                            />
                            <Toggle
                                label="Transportadora HT (aplicación) — +1.16 €/m²"
                                checked={formData.con_transportador}
                                onChange={(val) => set('con_transportador', val)}
                            />
                            <div className="p-3 bg-white/3 border border-white/6 rounded-sm flex gap-2 items-start">
                                <Scissors size={11} className="text-white/30 shrink-0 mt-0.5" />
                                <p className="text-[8px] text-white/30 leading-tight uppercase font-medium tracking-tight">
                                    Plotter Summa: Corte contorno en vinilo impreso. Pelado y transportadora opcionales según necesidad del trabajo.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="space-y-2 py-4 border-t border-white/5">
                    {alerts.map((alert, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-sm ${alert.type === 'warning' ? 'bg-orange-500/10 text-orange-200/80 border border-orange-500/20' : 'bg-blue-500/10 text-blue-200/80 border border-blue-500/20'}`}>
                            {alert.type === 'warning' ? <AlertCircle size={14} className="shrink-0 mt-0.5" /> : <Info size={14} className="shrink-0 mt-0.5" />}
                            <p className="text-[10px] uppercase font-bold tracking-tight">{alert.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrintForm;
