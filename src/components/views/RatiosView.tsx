'use client';

import { useState } from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';
import {
  Droplet,
  Anchor,
  Activity,
  DollarSign,
  Award,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export function RatiosView() {
  const { analysisResult } = useFinancialStore();
  const [activeTab, setActiveTab] = useState<'principales' | 'extendidos'>('principales');

  if (!analysisResult) return null;

  const { ratios, balanceGeneral } = analysisResult;

  const renderRatioCard = (
    name: string,
    value: string | number,
    formula: string,
    description: string,
    symbol: string | null = null,
    theme: 'blue' | 'amber' | 'purple' | 'emerald' = 'blue',
    percentageProgress: number | null = null
  ) => {
    const themeStyles = {
      blue: {
        border: symbol ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300',
        badge: 'bg-blue-100 text-blue-900 border-blue-200',
        formulaBg: 'bg-blue-50/90 border-blue-200 text-blue-950',
        valueColor: 'text-blue-950',
        progressFill: 'bg-blue-600',
      },
      amber: {
        border: symbol ? 'border-amber-400 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-300',
        badge: 'bg-amber-100 text-amber-900 border-amber-200',
        formulaBg: 'bg-amber-50/90 border-amber-200 text-amber-950',
        valueColor: 'text-amber-950',
        progressFill: 'bg-amber-500',
      },
      purple: {
        border: 'border-slate-200 hover:border-purple-300',
        badge: 'bg-purple-100 text-purple-900 border-purple-200',
        formulaBg: 'bg-purple-50/90 border-purple-200 text-purple-950',
        valueColor: 'text-purple-950',
        progressFill: 'bg-purple-600',
      },
      emerald: {
        border: 'border-slate-200 hover:border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        formulaBg: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
        valueColor: 'text-emerald-950',
        progressFill: 'bg-emerald-600',
      },
    }[theme];

    return (
      <div
        className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${themeStyles.border}`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h5 className="font-bold text-slate-900 text-sm tracking-tight">{name}</h5>
            {symbol ? (
              <span className="bg-slate-900 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                Variable {symbol} (Modelo Z)
              </span>
            ) : (
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${themeStyles.badge}`}>
                Indicador
              </span>
            )}
          </div>

          <div className={`text-3xl font-extrabold font-mono tracking-tight my-2 ${themeStyles.valueColor}`}>
            {typeof value === 'number' ? value.toFixed(4) : value}
          </div>

          {/* Barra de Progreso Visual si aplica un porcentaje */}
          {percentageProgress !== null && (
            <div className="my-2 space-y-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full ${themeStyles.progressFill} transition-all duration-500`}
                  style={{ width: `${Math.min(Math.max(percentageProgress, 0), 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Apartado de Fórmula */}
          <div className={`rounded-lg p-2.5 text-xs font-mono border my-3 ${themeStyles.formulaBg}`}>
            <span className="font-normal opacity-80">Fórmula: </span>
            <strong className="font-bold tracking-wide">{formula}</strong>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pt-2.5 border-t border-slate-100">
          {description}
        </p>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 max-w-360 mx-auto animate-in fade-in duration-300">
      {/* Alerta de Descuadre Patrimonial */}
      {!balanceGeneral.estaEquilibrado && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-rose-950 text-xs font-sans space-y-1">
            <p className="font-bold">
              Inconsistencia de Registro en Archivo CSV (Descuadre de ${Math.abs(balanceGeneral.diferenciaEquilibrio).toLocaleString('es-ES', { minimumFractionDigits: 2 })})
            </p>

            <p className="leading-relaxed">
              El Total Activo (${balanceGeneral.totalActivo.toLocaleString()}) difiere de Pasivo + Patrimonio (${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()}).
              <strong className="block text-rose-950 font-extrabold mt-1">
                Diferencia: ${Math.abs(balanceGeneral.diferenciaEquilibrio).toLocaleString('es-ES', { minimumFractionDigits: 2 })}.
              </strong>
            </p>
            <p className="text-[11px] text-rose-800 font-mono italic">
              Nota teórica: Al existir un descuadre, la suma de Endeudamiento (%) + Autonomía (%) puede superar el 100% debido a la distorsión del denominador.
            </p>
          </div>
        </div>
      )}

      {/* Banner Resumen Superior con Selector de Pestañas */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Panel General de Razones Financieras</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Consolidado de Indicadores Contables</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Cálculo automatizado en tiempo real a partir del Balance General y el Estado de Resultados.
          </p>
        </div>

        {/* Sub-navegación entre Pestaña Oficial y Pestaña Extendida */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 font-mono text-xs">
          <button
            onClick={() => setActiveTab('principales')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'principales'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Razones - Datos Principales</span>
          </button>
          <button
            onClick={() => setActiveTab('extendidos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${activeTab === 'extendidos'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Razones - Datos Extendidos & DuPont</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: RAZONES PRINCIPALES (4 GRUPOS EXPLICITOS) */}
      {activeTab === 'principales' && (
        <div className="space-y-6">
          {/* 1. LIQUIDEZ */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">1. Razones de Liquidez</h3>
                <p className="text-xs text-slate-500">Miden la capacidad de pago a corto plazo mediante recursos líquidos</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {renderRatioCard(
                'Razón Circulante',
                ratios.liquidez.razonCirculante,
                'Activo Corriente / Pasivo Corriente',
                'Indica cuántas unidades monetarias de activo circulante se tienen por cada unidad de deuda a corto plazo.',
                'X₁',
                'blue'
              )}
              {renderRatioCard(
                'Prueba Ácida',
                ratios.liquidez.pruebaAcida,
                '(Activo Corriente - Inventario) / Pasivo Corriente',
                'Mide la liquidez inmediata excluyendo existencias por requerir proceso de comercialización.',
                null,
                'blue'
              )}
            </div>
          </section>

          {/* 2. APALANCAMIENTO */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">2. Razones de Apalancamiento</h3>
                <p className="text-xs text-slate-500">Miden la proporción de financiamiento de terceros versus fondos propios</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {renderRatioCard(
                'Apalancamiento Interno',
                ratios.apalancamiento.apalancamientoInterno,
                'Patrimonio Total / Pasivo Total',
                'Proporción de inversión financiada por accionistas por cada unidad monetaria tomada de terceros.',
                'X₂',
                'amber'
              )}
              {renderRatioCard(
                'Razón de Endeudamiento',
                `${(ratios.apalancamiento.razonEndeudamiento * 100).toFixed(2)}%`,
                'Pasivo Total / Activo Total',
                'Porcentaje de la inversión total financiado con compromisos de terceros.',
                null,
                'amber',
                ratios.apalancamiento.razonEndeudamiento * 100
              )}
              {renderRatioCard(
                'Autonomía Financiera',
                `${(ratios.apalancamiento.autonomia * 100).toFixed(2)}%`,
                'Patrimonio Total / Activo Total',
                'Porcentaje de los activos financiado con recursos propios de los propietarios.',
                null,
                'amber',
                ratios.apalancamiento.autonomia * 100
              )}
            </div>
          </section>

          {/* 3. ACTIVIDAD */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">3. Razones de Actividad / Gerencia</h3>
                <p className="text-xs text-slate-500">Miden la velocidad de rotación de recursos e inventarios de la empresa</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {renderRatioCard(
                'Días de Inventario',
                `${ratios.actividad.diasInventario.toFixed(1)} días`,
                '(Inventario * 360) / Ventas Netas',
                'Días estimados que podría operar la empresa sin reponer existencias en almacén.',
                null,
                'purple'
              )}
              {renderRatioCard(
                'Días Cuentas por Cobrar (En la calle)',
                `${ratios.actividad.diasCuentasPorCobrar.toFixed(1)} días`,
                '(Cuentas por Cobrar * 360) / Ventas Netas',
                'Días promedio que tarda la organización en recuperar sus ventas a crédito.',
                null,
                'purple'
              )}
              {renderRatioCard(
                'Rotación del Activo Total',
                `${ratios.actividad.rotacionActivoTotal.toFixed(2)} veces`,
                'Ventas Netas / Activo Total',
                'Eficiencia de la inversión total para generar ventas brutas en el período.',
                null,
                'purple'
              )}
            </div>
          </section>

          {/* 4. RENTABILIDAD */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">4. Razones de Rentabilidad</h3>
                <p className="text-xs text-slate-500">Miden la rentabilidad global del negocio sobre las ventas y el capital social</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {renderRatioCard(
                'Margen Neto',
                `${(ratios.rentabilidad.margenNeto * 100).toFixed(2)}%`,
                'Utilidad Neta / Ventas Netas',
                'Porcentaje de ganancias líquidas remanentes por cada unidad monetaria vendida.',
                null,
                'emerald',
                ratios.rentabilidad.margenNeto * 100
              )}
              {renderRatioCard(
                'ROE (Rendimiento s/ Patrimonio)',
                `${(ratios.rentabilidad.roe * 100).toFixed(2)}%`,
                'Utilidad Neta / Patrimonio Total',
                'Rentabilidad generada sobre la inversión acumulada de los propietarios.',
                null,
                'emerald',
                ratios.rentabilidad.roe * 100
              )}
              {renderRatioCard(
                'ROA (Rendimiento s/ Activos)',
                `${(ratios.rentabilidad.roa * 100).toFixed(2)}%`,
                'Utilidad Neta / Activo Total',
                'Capacidad de los activos totales para generar ganancias operativas.',
                null,
                'emerald',
                ratios.rentabilidad.roa * 100
              )}
            </div>
          </section>
        </div>
      )}

      {/* VISTA 2: ANÁLISIS EXTENDIDO & SISTEMA DUPONT ORGANIZADO POR GRUPOS */}
      {activeTab === 'extendidos' && (
        <div className="space-y-6">
          {/* Bloque Descomposición DuPont */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Descomposición del Sistema DuPont</span>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">1. Margen Neto</div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {(ratios.rentabilidad.margenNeto * 100).toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-400">Eficiencia Operativa</div>
              </div>

              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">2. Rotación Activo Total</div>
                <div className="text-xl font-extrabold text-purple-400">
                  {ratios.actividad.rotacionActivoTotal.toFixed(2)}x
                </div>
                <div className="text-[10px] text-slate-400">Eficiencia de Uso de Activos</div>
              </div>

              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">3. Multiplicador Apalancamiento</div>
                <div className="text-xl font-extrabold text-amber-400">
                  {ratios.rentabilidad.multiplicadorApalancamientoDuPont.toFixed(2)}x
                </div>
                <div className="text-[10px] text-slate-400">Apalancamiento Financiero</div>
              </div>

              <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-800 space-y-1">
                <div className="text-[10px] text-emerald-300 uppercase font-bold">ROE Final DuPont</div>
                <div className="text-xl font-black text-emerald-400">
                  {(ratios.rentabilidad.roe * 100).toFixed(2)}%
                </div>
                <div className="text-[10px] text-emerald-300">Rendimiento s/ Patrimonio</div>
              </div>
            </div>
          </div>

          {/* 1. RAZONES DE LIQUIDEZ EXTENDIDAS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">1. Razones de Liquidez (Extendidas)</h3>
                <p className="text-xs text-slate-500">Indicadores avanzados de cobertura en efectivo e inversión operativa</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {renderRatioCard(
                'Prueba Súper Ácida (Efectivo)',
                ratios.liquidez.pruebaSuperAcida,
                'Caja y Bancos / Pasivo Corriente',
                'Mide la cobertura de pasivos circulantes usando únicamente dinero en efectivo disponible sin cobros futuros.',
                null,
                'blue'
              )}
              {renderRatioCard(
                'Capital de Trabajo Neto',
                `$${ratios.liquidez.capitalDeTrabajoNeto.toLocaleString()}`,
                'Activo Corriente - Pasivo Corriente',
                'Monto monetario de liquidez disponible para la operación cotidiana de la organización.',
                null,
                'blue'
              )}
            </div>
          </section>

          {/* 2. RAZONES DE APALANCAMIENTO EXTENDIDAS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <Anchor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">2. Razones de Apalancamiento (Extendidas)</h3>
                <p className="text-xs text-slate-500">Estructura detallada del endeudamiento por plazos y capitalización</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {renderRatioCard(
                'Endeudamiento Corto Plazo',
                `${(ratios.apalancamiento.endeudamientoCortoPlazo * 100).toFixed(2)}%`,
                'Pasivo Corriente / Activo Total',
                'Proporción de los activos totales financiada con deuda exigible en menos de 1 año.',
                null,
                'amber',
                ratios.apalancamiento.endeudamientoCortoPlazo * 100
              )}
              {renderRatioCard(
                'Endeudamiento Largo Plazo',
                `${(ratios.apalancamiento.endeudamientoLargoPlazo * 100).toFixed(2)}%`,
                'Pasivo No Corriente / Activo Total',
                'Proporción de los activos totales financiada con obligaciones a largo plazo.',
                null,
                'amber',
                ratios.apalancamiento.endeudamientoLargoPlazo * 100
              )}
              {renderRatioCard(
                'Capitalización Externa',
                `${(ratios.apalancamiento.capitalizacionExterna * 100).toFixed(2)}%`,
                'Pasivo No Corriente / (Pasivo NC + Patrimonio)',
                'Porcentaje de la estructura de capital permanente provisto por acreedores a largo plazo.',
                null,
                'amber',
                ratios.apalancamiento.capitalizacionExterna * 100
              )}
              {renderRatioCard(
                'Capitalización Interna',
                `${(ratios.apalancamiento.capitalizacionInterna * 100).toFixed(2)}%`,
                'Patrimonio / (Pasivo NC + Patrimonio)',
                'Porcentaje de la estructura de capital permanente aportado por los propietarios.',
                null,
                'amber',
                ratios.apalancamiento.capitalizacionInterna * 100
              )}
              {renderRatioCard(
                'Relación Apalancamiento X2',
                ratios.apalancamiento.relacionApalancamientoFormato,
                'Patrimonio Total : Pasivo Total',
                'Expresión en formato de razón de proporción entre patrimonio propio y deudas externas.',
                'X₂',
                'amber'
              )}
            </div>
          </section>

          {/* 3. RAZONES DE ACTIVIDAD EXTENDIDAS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">3. Razones de Actividad / Gerencia (Extendidas)</h3>
                <p className="text-xs text-slate-500">Eficiencia en la rotación de activos fijos e inversión operativa</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {renderRatioCard(
                'Rotación del Activo Fijo',
                `${ratios.actividad.rotacionActivoFijo.toFixed(2)} veces`,
                'Ventas Netas / Activo No Corriente',
                'Productividad de los activos fijos e instalaciones en la generación de ventas.',
                null,
                'purple'
              )}
              {renderRatioCard(
                'Rotación del Capital de Trabajo',
                `${ratios.actividad.rotacionCapitalDeTrabajo.toFixed(2)} veces`,
                'Ventas Netas / Capital de Trabajo Neto',
                'Eficiencia del fondo de maniobra corriente para generar ventas netas anuales.',
                null,
                'purple'
              )}
            </div>
          </section>

          {/* 4. RAZONES DE RENTABILIDAD EXTENDIDAS */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">4. Razones de Rentabilidad (Extendidas)</h3>
                <p className="text-xs text-slate-500">Márgenes de explotación directa previos a gastos administrativos</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {renderRatioCard(
                'Margen de Utilidad Bruto',
                `${(ratios.rentabilidad.margenBruto * 100).toFixed(2)}%`,
                'Utilidad Bruta / Ventas Netas',
                'Porcentaje de ganancias remanente tras descontar únicamente los costos de ventas directos.',
                null,
                'emerald',
                ratios.rentabilidad.margenBruto * 100
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
