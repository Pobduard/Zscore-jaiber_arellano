'use client';

import { useFinancialStore } from '@/store/useFinancialStore';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Calculator, FileSpreadsheet } from 'lucide-react';

export function PredictiveView() {
  const { analysisResult } = useFinancialStore();

  if (!analysisResult) return null;

  const { modeloZ, balanceGeneral } = analysisResult;

  // Cálculo proporcional dinámico del indicador sobre la escala Z (0.0 a 2.0) mapeado entre 5% y 95%
  const calculateGaugePos = (z: number): string => {
    if (z <= 0) return '5%';
    if (z >= 2.0) return '95%';
    const pct = 5 + (z / 2.0) * 90;
    return `${Math.min(95, Math.max(5, pct)).toFixed(1)}%`;
  };

  const getStatusStyle = () => {
    switch (modeloZ.codigoColor) {
      case 'excellent':
        return {
          cardBg: 'bg-emerald-950 text-white border-emerald-800',
          badgeBg: 'bg-emerald-500 text-slate-950 font-bold',
          iconColor: 'text-emerald-400',
          gaugePos: calculateGaugePos(modeloZ.valorZ),
          textColor: 'text-emerald-400',
          icon: CheckCircle2,
        };
      case 'normal':
        return {
          cardBg: 'bg-amber-950 text-white border-amber-800',
          badgeBg: 'bg-amber-500 text-slate-950 font-bold',
          iconColor: 'text-amber-400',
          gaugePos: calculateGaugePos(modeloZ.valorZ),
          textColor: 'text-amber-400',
          icon: HelpCircle,
        };
      case 'risk':
        return {
          cardBg: 'bg-rose-950 text-white border-rose-800',
          badgeBg: 'bg-rose-600 text-white font-bold',
          iconColor: 'text-rose-400',
          gaugePos: calculateGaugePos(modeloZ.valorZ),
          textColor: 'text-rose-400',
          icon: AlertTriangle,
        };
    }
  };

  const status = getStatusStyle();
  const StatusIcon = status.icon;

  return (
    <div className="p-4 space-y-4 max-w-360 mx-auto animate-in fade-in duration-300">
      {/* 1. Hero Card Principal Z-Score */}
      <div className={`rounded-2xl p-8 border shadow-lg flex flex-col justify-between relative overflow-hidden ${status.cardBg}`}>
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className={`w-7 h-7 ${status.iconColor}`} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Modelo Discriminante de Evaluación de Crédito
              </span>
              <h2 className="text-2xl font-extrabold text-white">Dictamen Z-Score</h2>
            </div>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide shadow-sm ${status.badgeBg}`}>
            {modeloZ.categoriaRiesgo}
          </span>
        </div>

        <div className="my-6 z-10">
          <div className="text-xs text-slate-300 font-mono mb-1">Resultado de la Ecuación Z = 0.4 X₁ + 0.6 X₂</div>
          <div className="text-6xl font-black font-mono tracking-tight text-white">
            {modeloZ.valorZ.toFixed(4)}
          </div>
          <p className="text-sm text-slate-200 mt-3 max-w-3xl leading-relaxed">
            {modeloZ.explicacion}
          </p>
        </div>

        {/* Indicador Visual / Barra Espectro de Riesgo */}
        <div className="pt-4 border-t border-white/10 space-y-2 z-10">
          <div className="flex justify-between text-[11px] font-mono text-slate-300">
            <span className="text-rose-300 font-bold">🔴 Crédito Malo (Z &lt; 0.66)</span>
            <span className="text-amber-300 font-bold">🟡 Riesgo Normal (0.66 - 1.4)</span>
            <span className="text-emerald-300 font-bold">🟢 Excelente (Z &gt; 1.4)</span>
          </div>

          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/20">
            <div className="w-full h-full bg-linear-to-r from-rose-500 via-amber-400 to-emerald-500" />
            <div
              className="absolute top-0 bottom-0 w-3 bg-white shadow-md rounded-full border-2 border-slate-900 transition-all duration-700 -ml-1.5"
              style={{ left: status.gaugePos }}
              title={`Puntaje Z actual: ${modeloZ.valorZ.toFixed(4)}`}
            />
          </div>
        </div>
      </div>

      {/* 2. Desglose Aritmético de Variables X1 y X2 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-slate-700" />
            <h3 className="font-extrabold text-slate-900 text-base">Ecuación Predictiva y Aportes Parciales</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-md text-slate-900 border border-slate-200">
            Z = 0.4(X₁) + 0.6(X₂)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Card Variable X1 */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Variable X₁: Razón Circulante</span>
              <span className="text-xs font-mono bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-200">
                Ponderación: 40% (0.4)
              </span>
            </div>

            <div className="text-3xl font-extrabold font-mono text-slate-900">
              X₁ = {modeloZ.x1_razonCirculante.toFixed(4)}
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div>Activo Corriente: <strong>${balanceGeneral.totalActivoCorriente.toLocaleString()}</strong></div>
              <div>Pasivo Corriente: <strong>${balanceGeneral.totalPasivoCorriente.toLocaleString()}</strong></div>
            </div>

            <div className="text-xs font-mono text-blue-950 bg-blue-50 border border-blue-200 p-2.5 rounded-lg">
              <span className="font-normal opacity-80">Aporte a Z: </span>
              <strong className="font-bold">0.4 × {modeloZ.x1_razonCirculante.toFixed(4)} = {(0.4 * modeloZ.x1_razonCirculante).toFixed(4)}</strong>
            </div>
          </div>

          {/* Card Variable X2 */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Variable X₂: Apalancamiento Interno</span>
              <span className="text-xs font-mono bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded border border-purple-200">
                Ponderación: 60% (0.6)
              </span>
            </div>

            <div className="text-3xl font-extrabold font-mono text-slate-900">
              X₂ = {modeloZ.x2_apalancamientoInterno.toFixed(4)}
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div>Patrimonio Total: <strong>${balanceGeneral.totalPatrimonio.toLocaleString()}</strong></div>
              <div>Pasivo Total: <strong>${balanceGeneral.totalPasivo.toLocaleString()}</strong></div>
            </div>

            <div className="text-xs font-mono text-purple-950 bg-purple-50 border border-purple-200 p-2.5 rounded-lg">
              <span className="font-normal opacity-80">Aporte a Z: </span>
              <strong className="font-bold">0.6 × {modeloZ.x2_apalancamientoInterno.toFixed(4)} = {(0.6 * modeloZ.x2_apalancamientoInterno).toFixed(4)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabla Resumen para Evaluación en Defensa Google Meet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm">Resumen Ejecutivo para Evaluación Crediticia</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Modelo Discriminante</span>
        </div>

        <div className="p-6">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2.5 px-4">Parámetro</th>
                <th className="py-2.5 px-4">Valor Calculado</th>
                <th className="py-2.5 px-4">Ponderación</th>
                <th className="py-2.5 px-4 text-right">Contribución a Z</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-900">Razón Circulante (X₁)</td>
                <td className="py-3 px-4">{modeloZ.x1_razonCirculante.toFixed(4)}</td>
                <td className="py-3 px-4 text-slate-500">40% (0.4)</td>
                <td className="py-3 px-4 text-right font-bold text-blue-700">
                  +{(0.4 * modeloZ.x1_razonCirculante).toFixed(4)}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-900">Apalancamiento Interno (X₂)</td>
                <td className="py-3 px-4">{modeloZ.x2_apalancamientoInterno.toFixed(4)}</td>
                <td className="py-3 px-4 text-slate-500">60% (0.6)</td>
                <td className="py-3 px-4 text-right font-bold text-purple-700">
                  +{(0.6 * modeloZ.x2_apalancamientoInterno).toFixed(4)}
                </td>
              </tr>
              <tr className="bg-slate-900 text-white font-bold">
                <td className="py-3 px-4 font-sans text-sm">PUNTAJE FINAL Z</td>
                <td colSpan={2} className={`py-3 px-4 ${status.textColor}`}>{modeloZ.categoriaRiesgo}</td>
                <td className={`py-3 px-4 text-right text-base font-extrabold ${status.textColor}`}>
                  {modeloZ.valorZ.toFixed(4)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
