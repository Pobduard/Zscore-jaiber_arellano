'use client';

import {
  LayoutDashboard,
  Scale,
  TrendingUp,
  ShieldCheck,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { TabNavegacion } from '@/store/slices/uiSlice';

export function Sidebar() {
  const activeTab = useFinancialStore((state) => state.activeTab);
  const setActiveTab = useFinancialStore((state) => state.setActiveTab);
  const fileName = useFinancialStore((state) => state.fileName);
  const rawAccounts = useFinancialStore((state) => state.rawAccounts);
  const setUploadModalOpen = useFinancialStore((state) => state.setUploadModalOpen);
  const analysisResult = useFinancialStore((state) => state.analysisResult);

  const navItems: { id: TabNavegacion; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Resumen General', icon: LayoutDashboard },
    { id: 'cuentas', label: 'Datos Actuales', icon: FileText },
    { id: 'balance', label: 'Balance General', icon: Scale },
    { id: 'ratios', label: 'Razones Financieras', icon: TrendingUp },
    { id: 'prediccion', label: 'Modelo Predictivo Z', icon: ShieldCheck },
  ];

  const estaEquilibrado = analysisResult?.balanceGeneral.estaEquilibrado ?? true;

  return (
    <aside className="w-70 bg-[#0f172a] text-slate-100 h-screen fixed left-0 top-0 flex flex-col justify-between border-r border-slate-800 z-30 select-none">
      {/* 1. Brand / Header Académico */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">Motor Z-Score</h1>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Autor - Jaiber Arellano</p>
          </div>
        </div>

        {/* 2. Módulos de Navegación */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono mb-2">
            Módulos del Sistema
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer: Estado del Archivo & Botón Cargar Otro CSV */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
        <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200 truncate" title={fileName ?? 'Sin archivo'}>
                {fileName ?? 'Sin archivo'}
              </span>
            </div>
            {estaEquilibrado ? (
              <span title="Balance Equilibrado">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </span>
            ) : (
              <span title="Descuadre en Balance">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{rawAccounts.length} cuentas</span>
            <span className={estaEquilibrado ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {estaEquilibrado ? 'Equilibrado' : 'Descuadrado'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-md text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Cargar Otro CSV</span>
        </button>
      </div>
    </aside>
  );
}
