/**
 * Clasificación de Riesgo Crediticio del Modelo Predictivo Discriminante Z (Fase 3)
 */
export type CategoriaRiesgo = 'Crédito excelente' | 'Crédito de riesgo normal' | 'Crédito malo';
export type CodigoColorRiesgo = 'excellent' | 'normal' | 'risk';

export interface PredictiveModelZ {
  x1_razonCirculante: number;
  x2_apalancamientoInterno: number;
  valorZ: number;
  categoriaRiesgo: CategoriaRiesgo;
  codigoColor: CodigoColorRiesgo;
  explicacion: string;
}
