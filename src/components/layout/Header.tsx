'use client';

import { useFinancialStore } from '@/store/useFinancialStore';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';

export function Header() {
  const { fileName, loadDefaultData } = useFinancialStore();

  return (
    <header className="h-12 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Indicador del Archivo Activo */}
      <div className="flex items-center gap-2 text-slate-800 font-mono text-xs font-semibold">
        <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{fileName ?? 'datos.csv'}</span>
      </div>

      {/* Recarga de datos de prueba */}
      <button
        onClick={() => loadDefaultData()}
        title="Recargar datos de prueba por defecto (datos.csv)"
        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </header>
  );
}
