import { ProcessedAccount } from './account';

/**
 * Estructura del Estado de Resultados (base para ratios de rentabilidad)
 */
export interface EstadoResultadosStructure {
  ingresos: ProcessedAccount[];
  costos: ProcessedAccount[];
  gastos: ProcessedAccount[];
  totalVentas: number;
  totalCostoVentas: number;
  utilidadBruta: number;
  totalGastosGenerales: number;
  utilidadNeta: number;
}
