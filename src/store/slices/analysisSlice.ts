import { StateCreator } from 'zustand';
import { RawAccount } from '@/types/account';
import { FinancialAnalysisResult } from '@/types/analysis';
import { analizarFinanzas } from '@/lib/engine/financial-analyzer';

export interface AnalysisSliceState {
  analysisResult: FinancialAnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;

  ejecutarAnalisis: (accounts: RawAccount[]) => void;
  resetAnalisis: () => void;
}

export const createAnalysisSlice: StateCreator<AnalysisSliceState, [], [], AnalysisSliceState> = (set) => ({
  analysisResult: null,
  isAnalyzing: false,
  analysisError: null,

  ejecutarAnalisis: (accounts: RawAccount[]) => {
    if (!accounts || accounts.length === 0) {
      set({
        analysisResult: null,
        analysisError: 'No hay cuentas para analizar',
        isAnalyzing: false,
      });
      return;
    }

    set({ isAnalyzing: true, analysisError: null });

    try {
      const resultado = analizarFinanzas(accounts);
      set({
        analysisResult: resultado,
        isAnalyzing: false,
        analysisError: null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error durante el análisis financiero';
      set({
        analysisResult: null,
        isAnalyzing: false,
        analysisError: msg,
      });
    }
  },

  resetAnalisis: () => {
    set({
      analysisResult: null,
      isAnalyzing: false,
      analysisError: null,
    });
  },
});
