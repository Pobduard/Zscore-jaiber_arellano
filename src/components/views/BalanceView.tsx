'use client';

import { useFinancialStore } from '@/store/useFinancialStore';
import { ProcessedAccount } from '@/types/account';
import { CheckCircle2, AlertTriangle, Building2, Wallet } from 'lucide-react';

export function BalanceView() {
  const { analysisResult } = useFinancialStore();

  if (!analysisResult) return null;

  const { balanceGeneral } = analysisResult;

  const renderGroupTable = (
    title: string,
    accounts: ProcessedAccount[],
    total: number,
    theme: 'emerald' | 'amber' | 'slate'
  ) => {
    const themeStyles = {
      emerald: {
        header: 'bg-emerald-900 text-emerald-100',
        total: 'text-emerald-300',
        border: 'border-emerald-200',
      },
      amber: {
        header: 'bg-amber-950 text-amber-100',
        total: 'text-amber-300',
        border: 'border-amber-200',
      },
      slate: {
        header: 'bg-slate-900 text-slate-100',
        total: 'text-emerald-400',
        border: 'border-slate-200',
      },
    }[theme];

    return (
      <div className={`bg-white rounded-xl border ${themeStyles.border} shadow-xs overflow-hidden`}>
        <div className={`px-5 py-3 ${themeStyles.header} flex items-center justify-between`}>
          <h4 className="font-bold text-xs tracking-wide uppercase font-mono">{title}</h4>
          <span className={`font-mono text-sm font-extrabold ${themeStyles.total}`}>
            ${total.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-semibold font-mono text-slate-500 uppercase border-b border-slate-200">
                <th className="py-2 px-4 w-12">ID</th>
                <th className="py-2 px-4">Descripción de Cuenta</th>
                <th className="py-2 px-4 text-right">Monto Bruto</th>
                <th className="py-2 px-4 text-right">Depreciación</th>
                <th className="py-2 px-4 text-right">Monto Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono text-slate-700">
              {accounts.map((account) => (
                <tr key={account.id_cuenta} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 text-slate-400 font-semibold">{account.id_cuenta}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                    <div className="flex flex-col">
                      <span>{account.descripcion_cuenta}</span>
                      {account.es_terreno && (
                        <span className="inline-block mt-0.5 bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold w-max">
                          Terreno (Sin Depreciación)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-medium">${account.monto_bruto.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right text-rose-600 font-medium">
                    {account.depreciacion_anual > 0 ? `-$${account.depreciacion_anual.toLocaleString()}` : '$0'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900">${account.monto_neto.toLocaleString()}</td>
                </tr>
              ))}

              {accounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-center text-slate-400 font-sans italic text-xs">
                    Sin partidas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 max-w-[1440px] mx-auto animate-in fade-in duration-300">
      {/* Banner de Verificación de Ecuación Contable */}
      <div
        className={`rounded-xl p-4 border flex items-center justify-between shadow-xs ${balanceGeneral.estaEquilibrado
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
      >
        <div className="flex items-center gap-3">
          {balanceGeneral.estaEquilibrado ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          )}
          <div>
            <h3 className="font-bold text-sm">
              {balanceGeneral.estaEquilibrado
                ? 'Ecuación de Equilibrio Verificada: ACTIVO = PASIVO + PATRIMONIO'
                : 'Alerta: Ecuación Patrimonial Descuadrada'}
            </h3>
            <p className="text-xs mt-0.5 font-mono">
              Activo Total: <strong>${balanceGeneral.totalActivo.toLocaleString()}</strong> | Pasivo + Patrimonio:{' '}
              <strong>${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <div className="text-slate-600">Diferencia:</div>
          <strong className="text-base text-rose-950 font-bold">${balanceGeneral.diferenciaEquilibrio.toFixed(2)}</strong>
        </div>
      </div>

      {/* Grid de Tablas: ESTRUCTURA DE ACTIVOS (Borde Derecho Verde) vs PASIVO Y PATRIMONIO (Borde Izquierdo Ámbar) */}
      <div className="grid grid-cols-2 gap-8 relative">
        {/* Columna Izquierda: ESTRUCTURA DE ACTIVOS */}
        <div className="space-y-6 bg-emerald-50/20 p-6 rounded-2xl border border-emerald-200 border-r-2 border-r-emerald-400 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <h3 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>ESTRUCTURA DE ACTIVOS</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Total Activo: ${balanceGeneral.totalActivo.toLocaleString()}
            </span>
          </div>

          {renderGroupTable(
            '1. Activo Corriente (Circulante)',
            balanceGeneral.activoCorriente,
            balanceGeneral.totalActivoCorriente,
            'emerald'
          )}

          {renderGroupTable(
            '2. Activo No Corriente (Fijo Neto)',
            balanceGeneral.activoNoCorriente,
            balanceGeneral.totalActivoNoCorriente,
            'emerald'
          )}
        </div>

        {/* Columna Derecha: PASIVOS Y PATRIMONIO (Borde Izquierdo Ámbar Replicado) */}
        <div className="space-y-6 bg-amber-50/20 p-6 rounded-2xl border border-amber-200 border-l-2 border-l-amber-400 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-600" />
              <span>PASIVO Y PATRIMONIO</span>
            </h3>
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Total Pasivo + Patrimonio: ${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()}
            </span>
          </div>

          {renderGroupTable(
            '3. Pasivo Corriente (Corto Plazo)',
            balanceGeneral.pasivoCorriente,
            balanceGeneral.totalPasivoCorriente,
            'amber'
          )}

          {renderGroupTable(
            '4. Pasivo No Corriente (Largo Plazo)',
            balanceGeneral.pasivoNoCorriente,
            balanceGeneral.totalPasivoNoCorriente,
            'amber'
          )}

          {renderGroupTable(
            '5. Patrimonio Neto',
            balanceGeneral.patrimonio,
            balanceGeneral.totalPatrimonio,
            'slate'
          )}
        </div>
      </div>
    </div>
  );
}
