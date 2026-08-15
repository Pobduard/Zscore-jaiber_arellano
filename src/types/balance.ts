import { ProcessedAccount } from './account';

/**
 * Estructura organizada del Balance General (Fase 1)
 */
export interface BalanceGeneralStructure {
  activoCorriente: ProcessedAccount[];
  activoNoCorriente: ProcessedAccount[];
  totalActivoCorriente: number;
  totalActivoNoCorriente: number;
  totalActivo: number;

  pasivoCorriente: ProcessedAccount[];
  pasivoNoCorriente: ProcessedAccount[];
  totalPasivoCorriente: number;
  totalPasivoNoCorriente: number;
  totalPasivo: number;

  patrimonio: ProcessedAccount[];
  totalPatrimonio: number;

  totalPasivoMasPatrimonio: number;
  diferenciaEquilibrio: number;
  estaEquilibrado: boolean;
}
