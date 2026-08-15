'use client';

import { useEffect } from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';

/**
 * COMPONENTE INICIALIZADOR DEL STORE DE ZUSTAND
 * 
 * Mantiene la reactividad del análisis financiero cuando cambia `rawAccounts`.
 * NO fuerza la carga automática al inicio para permitir que el usuario vea primero
 * la pantalla principal de carga de CSV.
 */
export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const { rawAccounts, ejecutarAnalisis } = useFinancialStore();

  useEffect(() => {
    if (rawAccounts.length > 0) {
      ejecutarAnalisis(rawAccounts);
    }
  }, [rawAccounts, ejecutarAnalisis]);

  return <>{children}</>;
}
