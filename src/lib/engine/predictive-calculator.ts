import { PredictiveModelZ, CategoriaRiesgo, CodigoColorRiesgo } from '@/types/predictive';

/**
 * MOTOR 5: Sistema Predictivo - Análisis Discriminante (Modelo Z)
 * 
 * ¿Qué hace este módulo?
 * Aplica el modelo de evaluación de créditos mediante análisis discriminante:
 * 
 * ECUACIÓN: Z = 0.4 * X1 + 0.6 * X2
 * 
 * Dónde:
 * - X1 = Razón Circulante (Activo Corriente / Pasivo Corriente)
 * - X2 = Razón de Apalancamiento Interno (Patrimonio Total / Pasivo Total)
 * 
 * UMBRALES Y DICTAMEN DE RIESGO:
 * - Z > 1.4            => "Crédito excelente" (Color Verde / Excellent)
 * - 0.66 <= Z <= 1.4   => "Crédito de riesgo normal" (Color Amarillo / Normal)
 * - Z < 0.66           => "Crédito malo" (Color Rojo / Risk)
 */

export function calcularModeloPredictivoZ(
  x1_razonCirculante: number,
  x2_apalancamientoInterno: number
): PredictiveModelZ {
  // Aplicar la ecuación del modelo discriminante
  const zBruto = 0.4 * x1_razonCirculante + 0.6 * x2_apalancamientoInterno;
  const valorZ = Math.round(zBruto * 10000) / 10000; // Redondeo a 4 decimales

  let categoriaRiesgo: CategoriaRiesgo;
  let codigoColor: CodigoColorRiesgo;
  let explicacion: string;

  if (valorZ > 1.4) {
    categoriaRiesgo = 'Crédito excelente';
    codigoColor = 'excellent';
    explicacion = `${valorZ.toFixed(4)} > 1.4. La empresa posee una liquidez circulante sólida e ideal cobertura patrimonial. Riesgo de morosidad mínimo.`;
  } else if (valorZ >= 0.66) {
    categoriaRiesgo = 'Crédito de riesgo normal';
    codigoColor = 'normal';
    explicacion = `${valorZ.toFixed(4)} se encuentra en la zona intermedia (0.66 <= Z <= 1.4). La empresa opera con solidez aceptable pero requiere monitoreo de compromisos a corto plazo.`;
  } else {
    categoriaRiesgo = 'Crédito malo';
    codigoColor = 'risk';
    explicacion = `${valorZ.toFixed(4)} es inferior a 0.66. La empresa refleja alta vulnerabilidad en su razón circulante y/o sobreendeudamiento frente a su patrimonio. Se recomienda restringir crédito.`;
  }

  return {
    x1_razonCirculante,
    x2_apalancamientoInterno,
    valorZ,
    categoriaRiesgo,
    codigoColor,
    explicacion,
  };
}
