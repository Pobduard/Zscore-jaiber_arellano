'use client';

import { useFinancialStore } from '@/store/useFinancialStore';
import { CATEGORIA_BALANCE } from '@/types/account';
import {
  DollarSign,
  TrendingUp,
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  PieChart as PieIcon,
  ChevronRight,
  Box,
  Droplet,
  Activity,
  Award,
  Layers,
  Clock,
  Percent,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

export function DashboardView() {
  const { analysisResult, setActiveTab } = useFinancialStore();

  if (!analysisResult) return null;

  const { balanceGeneral, estadoResultados, ratios, modeloZ } = analysisResult;

  // Datos para gráfico de barras de Estructura Patrimonial
  const structureData = [
    { name: CATEGORIA_BALANCE.ACTIVO_CORRIENTE, monto: balanceGeneral.totalActivoCorriente, fill: '#0f172a' },
    { name: CATEGORIA_BALANCE.ACTIVO_NO_CORRIENTE, monto: balanceGeneral.totalActivoNoCorriente, fill: '#334155' },
    { name: CATEGORIA_BALANCE.PASIVO_CORRIENTE, monto: balanceGeneral.totalPasivoCorriente, fill: '#f59e0b' },
    { name: CATEGORIA_BALANCE.PASIVO_NO_CORRIENTE, monto: balanceGeneral.totalPasivoNoCorriente, fill: '#d97706' },
    { name: CATEGORIA_BALANCE.PATRIMONIO, monto: balanceGeneral.totalPatrimonio, fill: '#10b981' },
  ];

  // Datos para Gráfico de Dona: Proporción de Financiamiento y Recursos
  const pieStructureData = [
    { name: 'Activo Total (Recursos)', valor: balanceGeneral.totalActivo, fill: '#0f172a' },
    { name: 'Pasivo Total (Deuda Externa)', valor: balanceGeneral.totalPasivo, fill: '#f59e0b' },
    { name: 'Patrimonio Neto (Recursos Propios)', valor: balanceGeneral.totalPatrimonio, fill: '#10b981' },
  ];

  const getZBadgeStyle = () => {
    switch (modeloZ.codigoColor) {
      case 'excellent':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'normal':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'risk':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  // Cálculos para el Diagrama de Cajas Proporcionales (Treemap / Balance Equality Box)
  const totalActivo = balanceGeneral.totalActivo > 0 ? balanceGeneral.totalActivo : 1;
  const totalPasivoMasPatrimonio = balanceGeneral.totalPasivoMasPatrimonio > 0 ? balanceGeneral.totalPasivoMasPatrimonio : 1;

  const pctActivoCorriente = (balanceGeneral.totalActivoCorriente / totalActivo) * 100;
  const pctActivoNoCorriente = (balanceGeneral.totalActivoNoCorriente / totalActivo) * 100;

  const pctPasivoCorriente = (balanceGeneral.totalPasivoCorriente / totalPasivoMasPatrimonio) * 100;
  const pctPasivoNoCorriente = (balanceGeneral.totalPasivoNoCorriente / totalPasivoMasPatrimonio) * 100;
  const pctPatrimonio = (balanceGeneral.totalPatrimonio / totalPasivoMasPatrimonio) * 100;

  return (
    <div className="p-4 space-y-4 max-w-360 mx-auto animate-in fade-in duration-300">
      {/* Banner de Descuadre si existe error contable */}
      {!balanceGeneral.estaEquilibrado && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 text-sm">Alerta de Descuadre Contable Detectado</h4>
              <div className="text-xs text-rose-800 font-mono mt-1 space-y-1">
                <div>El Activo Total (${balanceGeneral.totalActivo.toLocaleString()}) difiere de Pasivo + Patrimonio (${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()}).</div>
                <div className="font-bold text-rose-950 mt-1 text-xs">Diferencia: ${balanceGeneral.diferenciaEquilibrio.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('balance')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
          >
            Revisar Balance
          </button>
        </div>
      )}

      {/* SECCIÓN 1: RESUMEN EJECUTIVO & MODELO PREDICTIVO Z */}
      <div className="grid grid-cols-12 gap-4">
        {/* Widget Prominente Z-Score Modelo Predictivo (Spans 5 cols) */}
        <div className="col-span-5 bg-slate-900 text-white rounded-xl p-5 shadow-md border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Modelo Predictivo Z-Score</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getZBadgeStyle()}`}>
              {modeloZ.categoriaRiesgo}
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs text-slate-400 font-mono mb-1">Índice Discriminante Z = 0.4 X₁ + 0.6 X₂</div>
            <div className="text-5xl font-extrabold font-mono tracking-tight text-white">
              {modeloZ.valorZ.toFixed(4)}
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {modeloZ.explicacion}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <div>
              <span>X₁ (Circulante): </span>
              <strong className="text-white font-bold">{modeloZ.x1_razonCirculante.toFixed(2)}</strong>
            </div>
            <div>
              <span>X₂ (Apalancamiento): </span>
              <strong className="text-white font-bold">{modeloZ.x2_apalancamientoInterno.toFixed(2)}</strong>
            </div>
            <button
              onClick={() => setActiveTab('prediccion')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-sans font-semibold cursor-pointer"
            >
              <span>Ver Informe</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Gráficos de Estructura Contable (Spans 7 cols: Composición + Dona) */}
        <div className="col-span-7 grid grid-cols-2 gap-4">
          {/* Gráfico de Barras de Composición */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Composición del Balance</h3>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={structureData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => [`$${Number(val ?? 0).toLocaleString()}`, 'Monto Neto']}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                    itemStyle={{ color: '#ffffff', fontWeight: '600' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: '600' }}
                  />
                  <Bar dataKey="monto" radius={[4, 4, 0, 0]}>
                    {structureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Dona: Deuda vs Recursos Propios */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Recursos vs Deuda</h3>
              </div>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieStructureData}
                    cx="50%"
                    cy="35%"
                    innerRadius={28}
                    outerRadius={46}
                    paddingAngle={4}
                    dataKey="valor"
                  >
                    {pieStructureData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [`$${Number(val ?? 0).toLocaleString()}`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                    itemStyle={{ color: '#ffffff', fontWeight: '600' }}
                  />
                  <Legend
                    layout='vertical'
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', lineHeight: '18px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: LAS 4 FAMILIAS DE RAZONES FINANCIERAS (RÚBRICA DIRECTA DEL PROFESOR) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Las 4 Familias de Razones Financieras</span>
          </div>
          <button
            onClick={() => setActiveTab('ratios')}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold font-sans transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Ver panel completo de ratios</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* GRUPO 1: LIQUIDEZ */}
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Droplet className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wide">1. LIQUIDEZ</h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                Capacidad Pago
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="bg-blue-50/80 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Razón Circulante (X₁):</span>
                <strong className="text-blue-950 font-bold text-sm">{ratios.liquidez.razonCirculante.toFixed(4)}</strong>
              </div>

              <div className="bg-blue-50/80 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Prueba Ácida:</span>
                <strong className="text-blue-950 font-bold text-sm">{ratios.liquidez.pruebaAcida.toFixed(4)}</strong>
              </div>

              <div className="text-[11px] font-sans text-slate-500 pt-1 leading-tight">
                Mide la disponibilidad de caja e inventarios para cubrir deudas de corto plazo (${balanceGeneral.totalPasivoCorriente.toLocaleString()}).
              </div>
            </div>
          </div>

          {/* GRUPO 2: APALANCAMIENTO */}
          <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Scale className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wide">2. APALANCAMIENTO</h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Estructura Deuda
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="bg-amber-50/80 p-2 rounded-lg border border-amber-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Apalancamiento Int. (X₂):</span>
                <strong className="text-amber-950 font-bold text-sm">{ratios.apalancamiento.apalancamientoInterno.toFixed(4)}</strong>
              </div>

              <div className="bg-amber-50/80 p-2 rounded-lg border border-amber-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Razón Endeudamiento:</span>
                <strong className="text-amber-950 font-bold text-sm">{(ratios.apalancamiento.razonEndeudamiento * 100).toFixed(1)}%</strong>
              </div>

              <div className="text-[11px] font-sans text-slate-500 pt-1 leading-tight">
                Autonomía del capital propio (${balanceGeneral.totalPatrimonio.toLocaleString()}) respecto a acreedores (${balanceGeneral.totalPasivo.toLocaleString()}).
              </div>
            </div>
          </div>

          {/* GRUPO 3: ACTIVIDAD / GERENCIA */}
          <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-purple-950 text-xs uppercase tracking-wide">3. ACTIVIDAD</h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                Eficiencia Rotación
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="bg-purple-50/80 p-2 rounded-lg border border-purple-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Rotación Activo Total:</span>
                <strong className="text-purple-950 font-bold text-sm">{ratios.actividad.rotacionActivoTotal.toFixed(2)}x</strong>
              </div>

              <div className="bg-purple-50/80 p-2 rounded-lg border border-purple-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Días de Inventario:</span>
                <strong className="text-purple-950 font-bold text-sm">{ratios.actividad.diasInventario.toFixed(1)}d</strong>
              </div>

              <div className="text-[11px] font-sans text-slate-500 pt-1 leading-tight">
                Velocidad de recuperación de ventas y ciclo operativo de cobro en calle ({ratios.actividad.diasCuentasPorCobrar.toFixed(1)} días).
              </div>
            </div>
          </div>

          {/* GRUPO 4: RENTABILIDAD */}
          <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wide">4. RENTABILIDAD</h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                Rendimiento Neto
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">Margen Neto Operativo:</span>
                <strong className="text-emerald-950 font-bold text-sm">{(ratios.rentabilidad.margenNeto * 100).toFixed(1)}%</strong>
              </div>

              <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 flex items-center justify-between">
                <span className="text-slate-600 font-sans text-[11px]">ROE (Patrimonio):</span>
                <strong className="text-emerald-950 font-bold text-sm">{(ratios.rentabilidad.roe * 100).toFixed(1)}%</strong>
              </div>

              <div className="text-[11px] font-sans text-slate-500 pt-1 leading-tight">
                Generación neta de utilidades (${estadoResultados.utilidadNeta.toLocaleString()}) sobre activos (ROA: {(ratios.rentabilidad.roa * 100).toFixed(1)}%).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: DIAGRAMA DE CAJAS PROPORCIONALES (TREEMAP / BALANCE EQUALITY BOX DIAGRAM) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            <Box className="w-4 h-4 text-emerald-600" />
            <span>Diagrama de Cajas Proporcionales (Estructura del Balance)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">

          <div className="grid grid-cols-2 gap-6 min-h-[280px]">
            {/* Caja Izquierda: ACTIVOS */}
            <div className="border-2 border-emerald-300 bg-emerald-50/20 rounded-xl p-3 flex flex-col justify-between gap-2 overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950 font-mono">
                <span>ESTRUCTURA DE ACTIVOS</span>
                <span>100% (${balanceGeneral.totalActivo.toLocaleString()})</span>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {/* Bloque Activo Corriente */}
                <div
                  className="bg-emerald-800 text-white rounded-lg px-3 py-1.5 flex flex-col justify-center transition-all hover:bg-emerald-700 shadow-xs min-h-[36px] overflow-hidden"
                  style={{ height: `${pctActivoCorriente}%` }}
                  title={`Activo Corriente: $${balanceGeneral.totalActivoCorriente.toLocaleString()} (${pctActivoCorriente.toFixed(1)}%)`}
                >
                  {pctActivoCorriente < 15 ? (
                    <div className="flex items-center justify-between text-[11px] font-bold font-mono truncate gap-1">
                      <span className="truncate">1. Activo Corriente: ${balanceGeneral.totalActivoCorriente.toLocaleString()}</span>
                      <span className="shrink-0">{pctActivoCorriente.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span>1. Activo Corriente</span>
                        <span>{pctActivoCorriente.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] font-mono opacity-90">${balanceGeneral.totalActivoCorriente.toLocaleString()}</div>
                    </>
                  )}
                </div>

                {/* Bloque Activo No Corriente */}
                <div
                  className="bg-slate-900 text-white rounded-lg px-3 py-1.5 flex flex-col justify-center transition-all hover:bg-slate-800 shadow-xs min-h-[36px] overflow-hidden"
                  style={{ height: `${pctActivoNoCorriente}%` }}
                  title={`Activo No Corriente: $${balanceGeneral.totalActivoNoCorriente.toLocaleString()} (${pctActivoNoCorriente.toFixed(1)}%)`}
                >
                  {pctActivoNoCorriente < 15 ? (
                    <div className="flex items-center justify-between text-[11px] font-bold font-mono truncate gap-1">
                      <span className="truncate">2. Activo No Corriente: ${balanceGeneral.totalActivoNoCorriente.toLocaleString()}</span>
                      <span className="shrink-0">{pctActivoNoCorriente.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span>2. Activo No Corriente (Fijo)</span>
                        <span>{pctActivoNoCorriente.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] font-mono opacity-90">${balanceGeneral.totalActivoNoCorriente.toLocaleString()}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Caja Derecha: PASIVO Y PATRIMONIO */}
            <div className="border-2 border-amber-300 bg-amber-50/20 rounded-xl p-3 flex flex-col justify-between gap-2 overflow-hidden shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950 font-mono">
                <span>PASIVO Y PATRIMONIO</span>
                <span>100% (${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()})</span>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {/* Bloque Pasivo Corriente */}
                <div
                  className="bg-amber-600 text-white rounded-lg px-3 py-1.5 flex flex-col justify-center transition-all hover:bg-amber-500 shadow-xs min-h-[36px] overflow-hidden"
                  style={{ height: `${pctPasivoCorriente}%` }}
                  title={`Pasivo Corriente: $${balanceGeneral.totalPasivoCorriente.toLocaleString()} (${pctPasivoCorriente.toFixed(1)}%)`}
                >
                  {pctPasivoCorriente < 15 ? (
                    <div className="flex items-center justify-between text-[11px] font-bold font-mono truncate gap-1">
                      <span className="truncate">3. Pasivo Corriente: ${balanceGeneral.totalPasivoCorriente.toLocaleString()}</span>
                      <span className="shrink-0">{pctPasivoCorriente.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span>3. Pasivo Corriente</span>
                        <span>{pctPasivoCorriente.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] font-mono opacity-90">${balanceGeneral.totalPasivoCorriente.toLocaleString()}</div>
                    </>
                  )}
                </div>

                {/* Bloque Pasivo No Corriente */}
                <div
                  className="bg-amber-800 text-white rounded-lg px-3 py-1.5 flex flex-col justify-center transition-all hover:bg-amber-700 shadow-xs min-h-[36px] overflow-hidden"
                  style={{ height: `${pctPasivoNoCorriente}%` }}
                  title={`Pasivo No Corriente: $${balanceGeneral.totalPasivoNoCorriente.toLocaleString()} (${pctPasivoNoCorriente.toFixed(1)}%)`}
                >
                  {pctPasivoNoCorriente < 15 ? (
                    <div className="flex items-center justify-between text-[11px] font-bold font-mono truncate gap-1">
                      <span className="truncate">4. Pasivo No Corriente: ${balanceGeneral.totalPasivoNoCorriente.toLocaleString()}</span>
                      <span className="shrink-0">{pctPasivoNoCorriente.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span>4. Pasivo No Corriente</span>
                        <span>{pctPasivoNoCorriente.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] font-mono opacity-90">${balanceGeneral.totalPasivoNoCorriente.toLocaleString()}</div>
                    </>
                  )}
                </div>

                {/* Bloque Patrimonio Neto */}
                <div
                  className="bg-emerald-900 text-white rounded-lg px-3 py-1.5 flex flex-col justify-center transition-all hover:bg-emerald-800 shadow-xs min-h-[36px] overflow-hidden"
                  style={{ height: `${pctPatrimonio}%` }}
                  title={`Patrimonio Neto: $${balanceGeneral.totalPatrimonio.toLocaleString()} (${pctPatrimonio.toFixed(1)}%)`}
                >
                  {pctPatrimonio < 15 ? (
                    <div className="flex items-center justify-between text-[11px] font-bold font-mono truncate gap-1">
                      <span className="truncate">5. Patrimonio: ${balanceGeneral.totalPatrimonio.toLocaleString()}</span>
                      <span className="shrink-0">{pctPatrimonio.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold font-mono">
                        <span>5. Patrimonio Neto</span>
                        <span>{pctPatrimonio.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] font-mono opacity-90">${balanceGeneral.totalPatrimonio.toLocaleString()}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
