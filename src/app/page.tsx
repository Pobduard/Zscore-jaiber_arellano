'use client';

import { useFinancialStore } from '@/store/useFinancialStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { CsvUploadModal } from '@/components/upload/CsvUploadModal';
import { InitialUploadView } from '@/components/views/InitialUploadView';
import { DashboardView } from '@/components/views/DashboardView';
import { AccountsDataView } from '@/components/views/AccountsDataView';
import { BalanceView } from '@/components/views/BalanceView';
import { RatiosView } from '@/components/views/RatiosView';
import { PredictiveView } from '@/components/views/PredictiveView';

export default function Home() {
  const { isLoaded, activeTab } = useFinancialStore();

  // Si no se ha cargado ningún CSV aún, muestra la vista principal de carga
  if (!isLoaded) {
    return <InitialUploadView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'cuentas':
        return <AccountsDataView />;
      case 'balance':
        return <BalanceView />;
      case 'ratios':
        return <RatiosView />;
      case 'prediccion':
        return <PredictiveView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Sidebar Fijo a la Izquierda (280px) */}
      <Sidebar />

      {/* 2. Área Principal a la Derecha que toma 100% de alto libre */}
      <div className="flex-1 ml-70 flex flex-col min-h-screen">
        <main className="flex-1 px-4">{renderActiveView()}</main>
      </div>

      {/* 3. Modal Global de Carga de CSV para cambio de archivo */}
      <CsvUploadModal />
    </div>
  );
}
