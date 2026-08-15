import { ProcessedAccount } from './account';
import { BalanceGeneralStructure } from './balance';
import { EstadoResultadosStructure } from './income-statement';
import { FinancialRatios } from './ratios';
import { PredictiveModelZ } from './predictive';

/**
 * Resultado integral del Análisis Financiero
 */
export interface FinancialAnalysisResult {
  cuentasProcesadas: ProcessedAccount[];
  balanceGeneral: BalanceGeneralStructure;
  estadoResultados: EstadoResultadosStructure;
  ratios: FinancialRatios;
  modeloZ: PredictiveModelZ;
  alertas: string[];
  logsAuditoria: string[];
}

