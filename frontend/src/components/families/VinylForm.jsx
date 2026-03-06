import React, { useState, useEffect } from 'react';
import { PenTool, Scissors, Layers, Move, AlertCircle } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import useStore from '../../store';

/**
 * VinylForm — Cálculo de Vinilo de Corte (TIPO 4: Sin imprimir)
 * Datos de materiales extraídos de costes_corregido.xlsx (hoja VINILO CORTE)
 */

const COSTES = {
    corte_m2: 2.91,
    fijos_corte: 3.25,
    pelado_m2: { BAJA: 1.25, MEDIA: 4.99, ALTA: 11.23 },
    transportador_m2: 1.16,  // precio real del Excel (Transportador 1.16 €/m²)
    vectorizado: { No: 0, BAJA: 1.49, MEDIA: 5.98, ALTA: 13.45 },
};

/**
 * Catálogo extraído de costes_corregido.xlsx → hoja "VINILO CORTE"
 * La clave 'clase' coincide exactamente con el campo clase de la tabla materiales en Supabase.
 */
const CATALOGO_VINILO_CORTE = {
    tres_cinco: {
        label: 'Vinilo Corte 3-5 años',
        clase: 'VINILO CORTE 3-5 AÑOS',
        materiales: [
            { value: 'VC3-BRbn', label: 'Blanco/Negro Brillo', precio: 3.40 },
            { value: 'VC3-Brco', label: 'Colores Brillo', precio: 3.76 },
            { value: 'VC3-BRmt', label: 'Metalizado Brillo', precio: 4.97 },
            { value: 'VC3-MTbn', label: 'Blanco/Negro Mate', precio: 3.56 },
            { value: 'VC3-Mtco', label: 'Colores Mate', precio: 5.12 },
            { value: 'VC3-Mtmet', label: 'Metalizado Mate', precio: 3.97 },
        ],
    },
    seis: {
        label: 'Vinilo Corte 6 años',
        clase: 'VINILO CORTE 6 AÑOS',
        materiales: [
            { value: 'VC6-BRbn', label: 'Blanco/Negro Brillo', precio: 4.87 },
            { value: 'VC6-Brco', label: 'Colores Brillo', precio: 6.09 },
            { value: 'VC6-Brmet', label: 'Metalizado Brillo', precio: 7.76 },
            { value: 'VC6-MTbn', label: 'Blanco/Negro Mate', precio: 5.13 },
            { value: 'VC6-Mtco', label: 'Colores Mate', precio: 5.49 },
            { value: 'VC6-Mtmet', label: 'Metalizado Mate', precio: 6.09 },
        ],
    },
    diez: {
        label: 'Vinilo Corte 10 años',
        clase: 'VINILO CORTE 10 AÑOS',
        materiales: [
            { value: 'VC10-BRbn', label: 'Blanco/Negro Brillo', precio: 6.41 },
            { value: 'VC10-Brco', label: 'Colores Brillo', precio: 7.76 },
            { value: 'VC10-Brmet', label: 'Metalizado Brillo', precio: 6.09 },
            { value: 'VC10-MTbn', label: 'Blanco/Negro Mate', precio: 7.65 },
            { value: 'VC10-Mtco', label: 'Colores Mate', precio: 7.86 },
            { value: 'VC10-Mtmet', label: 'Metalizado Mate', precio: 8.56 },
        ],
    },
    traslucido: {
        label: 'Vinilo Traslúcido',
        clase: 'VINILO CORTE TRASLUCIDO',
        materiales: [
            { value: 'VC-TR', label: 'Traslúcido', precio: 8.29 },
        ],
    },
};

const FAMILIA_KEYS = Object.keys(CATALOGO_VINILO_CORTE);

const VinylForm = () => {
    const { setTempCalculation, catalogs, getMargin } = useStore();

    const [formData, setFormData] = useState({
        familia_material: FAMILIA_KEYS[0],
        material_id: CATALOGO_VINILO_CORTE[FAMILIA_KEYS[0]].materiales[0].value,
        ancho_cm: '',
        alto_cm: '',
        unidades: 1,
        complejidad: 'MEDIA',
        vectorizado: 'No',
        con_pelado: true,
        con_transportador: true,
    });

    // ── Construir catálogo desde BD o fallback ───────────────────────────────
    const dbMateriales = React.useMemo(() =>
        (catalogs.materiales || []).filter(m => m.familia === 'vinilo_corte'),
        [catalogs.materiales]
    );

    const catalogoDB = React.useMemo(() => {
        if (dbMateriales.length === 0) return null;
        const grupos = {};
        const normKey = (s) => (s || 'OTROS')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');
        dbMateriales.forEach(m => {
            const key = normKey(m.clase);
            if (!grupos[key]) {
                grupos[key] = { label: m.clase || 'Otros', clase: m.clase, materiales: [] };
            }
            grupos[key].materiales.push({ value: m.id, label: m.nombre, precio: m.precio });
        });
        return grupos;
    }, [dbMateriales]);

    const catalogo = catalogoDB || CATALOGO_VINILO_CORTE;
    const familiaOptions = Object.entries(catalogo).map(([key, val]) => ({
        value: key,
        label: val.label,
    }));

    const subfamiliaOptions = React.useMemo(() => {
        const grupo = catalogo[formData.familia_material];
        return grupo?.materiales || [];
    }, [catalogo, formData.familia_material]);

    // Auto-seleccionar primer material al cambiar familia
    useEffect(() => {
        if (subfamiliaOptions.length > 0) {
            const existe = subfamiliaOptions.find(m => m.value === formData.material_id);
            if (!existe) {
                setFormData(prev => ({ ...prev, material_id: subfamiliaOptions[0].value }));
            }
        }
    }, [formData.familia_material, subfamiliaOptions]);

    // ── Cálculo en tiempo real ───────────────────────────────────────────────
    useEffect(() => {
        const ancho = parseFloat(formData.ancho_cm) || 0;
        const alto = parseFloat(formData.alto_cm) || 0;
        const unidades = parseInt(formData.unidades) || 1;

        const allMats = Object.values(catalogo).flatMap(g => g.materiales);
        const selectedMaterial = allMats.find(m => m.value === formData.material_id);

        if (ancho > 0 && alto > 0 && unidades > 0) {
            const m2_unitario = (ancho * alto) / 10000;
            const m2_reales = Math.max(0.5, m2_unitario) * unidades;

            const coste_vinilo = m2_reales * (selectedMaterial?.precio || 3.40);
            const coste_corte = m2_reales * COSTES.corte_m2;
            const coste_pelado = formData.con_pelado
                ? m2_reales * (COSTES.pelado_m2[formData.complejidad] ?? COSTES.pelado_m2.MEDIA)
                : 0;
            const coste_transportador = formData.con_transportador
                ? m2_reales * COSTES.transportador_m2
                : 0;
            const coste_fijos = COSTES.fijos_corte;
            const coste_vectorizado = COSTES.vectorizado[formData.vectorizado] ?? 0;

            const coste_total = coste_vinilo + coste_corte + coste_pelado + coste_transportador + coste_fijos + coste_vectorizado;

            const margin = getMargin('vinilo_corte') || 0.60;
            const precio_venta = coste_total / (1 - margin);
            const familiaLabel = catalogo[formData.familia_material]?.label || '';

            setTempCalculation({
                familia: 'Vinilo Corte',
                family_id: 2,
                nombre: `Vinilo Corte ${ancho}×${alto}cm (×${unidades}) — ${familiaLabel}: ${selectedMaterial?.label || ''}`,
                coste: coste_total,
                precio_venta,
                metadatos: {
                    ...formData,
                    m2_reales: m2_reales.toFixed(3),
                    tipo_trabajo: 'TIPO_4_VINILO_CORTE',
                    desglose: {
                        vinilo: coste_vinilo.toFixed(2),
                        corte: coste_corte.toFixed(2),
                        pelado: coste_pelado.toFixed(2),
                        transportador: coste_transportador.toFixed(2),
                        fijos_arranque: coste_fijos.toFixed(2),
                        vectorizado: coste_vectorizado.toFixed(2),
                    }
                }
            });
        } else {
            setTempCalculation({ familia: 'Vinilo Corte', family_id: 2, nombre: '', coste: 0, precio_venta: 0, metadatos: formData });
        }
    }, [formData, catalogo]);

    const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-8 animate-slide-up">

            <div className="p-3 bg-accent/5 border border-accent/15 rounded-sm flex gap-3 items-start">
                <AlertCircle size={14} className="text-accent shrink-0 mt-0.5" />
                <p className="text-[9px] text-accent/80 leading-tight uppercase font-bold tracking-tight">
                    TIPO 4 — Vinilo de corte monocolor (sin imprimir). Para vinilo impreso con corte de contorno, usa <strong>Impresión</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* ── Columna izquierda: Especificaciones ───────────────── */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <PenTool size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Especificaciones</h3>
                    </div>

                    {/* NIVEL 1: Familia (años de duración) */}
                    <Select
                        label="Durabilidad / Calidad"
                        options={familiaOptions}
                        value={formData.familia_material}
                        onChange={(e) => set('familia_material', e.target.value)}
                    />

                    {/* NIVEL 2: Acabado concreto */}
                    <Select
                        label="Tipo de vinilo de corte"
                        options={subfamiliaOptions}
                        value={formData.material_id}
                        onChange={(e) => set('material_id', e.target.value)}
                    />

                    <div className="grid grid-cols-3 gap-4 items-end">
                        <Input label="Ancho (cm)" type="number" value={formData.ancho_cm} onChange={(e) => set('ancho_cm', e.target.value)} />
                        <Input label="Alto (cm)" type="number" value={formData.alto_cm} onChange={(e) => set('alto_cm', e.target.value)} />
                        <Input label="Unidades" type="number" value={formData.unidades} onChange={(e) => set('unidades', e.target.value)} />
                    </div>

                    <Select
                        label="Complejidad del diseño (afecta al pelado)"
                        options={[
                            { value: 'BAJA', label: 'Baja — Texto / Formas grandes  (+1.25 €/m²)' },
                            { value: 'MEDIA', label: 'Media — Logotipos               (+4.99 €/m²)' },
                            { value: 'ALTA', label: 'Alta — Detalle fino / Calados  (+11.23 €/m²)' },
                        ]}
                        value={formData.complejidad}
                        onChange={(e) => set('complejidad', e.target.value)}
                    />

                    <Select
                        label="Vectorizado (preparación de archivo de corte)"
                        options={[
                            { value: 'No', label: 'No necesario (archivo ya vectorizado)' },
                            { value: 'BAJA', label: 'Baja — Contornos simples  (+1.49 €)' },
                            { value: 'MEDIA', label: 'Media — Texto / Logotipo  (+5.98 €)' },
                            { value: 'ALTA', label: 'Alta — Detalle fino       (+13.45 €)' },
                        ]}
                        value={formData.vectorizado}
                        onChange={(e) => set('vectorizado', e.target.value)}
                    />
                </div>

                {/* ── Columna derecha: Manipulación ─────────────────────── */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Scissors size={14} className="text-accent" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Procesos de Manipulación</h3>
                    </div>

                    <Toggle
                        label="Pelado (retirar sobrantes de vinilo)"
                        checked={formData.con_pelado}
                        onChange={(val) => set('con_pelado', val)}
                    />

                    <Toggle
                        label="Aplicar Transportador HT (+1.16 €/m²)"
                        checked={formData.con_transportador}
                        onChange={(val) => set('con_transportador', val)}
                    />

                    <div className="p-4 bg-white/3 border border-white/8 rounded-sm space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers size={12} className="text-accent" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Costes Fijos del Trabajo</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[9px] text-white/40 uppercase">Corte plotter</span>
                            <span className="text-[9px] font-bold text-white/70">2.91 €/m²</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[9px] text-white/40 uppercase">Arranque máquina</span>
                            <span className="text-[9px] font-bold text-white/70">3.25 €/trabajo</span>
                        </div>
                        {formData.con_transportador && (
                            <div className="flex justify-between">
                                <span className="text-[9px] text-white/40 uppercase">Transportador HT</span>
                                <span className="text-[9px] font-bold text-white/70">1.16 €/m²</span>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-white/3 border border-white/6 rounded-sm flex gap-2">
                        <Move size={12} className="text-white/30 shrink-0 mt-0.5" />
                        <p className="text-[8px] text-white/30 leading-tight uppercase font-medium tracking-tight">
                            Proceso: PLOTER_Corte — Vinilo monocolor. Incluye corte, pelado y transportador (si aplica). NO incluye impresión.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VinylForm;
