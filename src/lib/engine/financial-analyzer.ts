import { RawAccount } from '@/types/account';
import { FinancialAnalysisResult } from '@/types/analysis';
import { procesarCuentas } from './account-processor';
import { calcularBalanceGeneral } from './balance-calculator';
import { calcularEstadoResultados } from './income-calculator';
import { calcularRatiosFinancieros } from './ratios-calculator';
import { calcularModeloPredictivoZ } from './predictive-calculator';
import { registrarAuditoriaEnConsola } from './console-logger';

/**
 * MOTOR ORQUESTADOR PRINCIPAL: Análisis Financiero Integral
 * 
 * ¿Qué hace este módulo?
 * Ejecuta el pipeline secuencial completo para procesar los datos contables:
 * 1. Parseo y tipado contable de partidas + Depreciación lineal (Fase 1).
 * 2. Estructuración del Estado de Resultados (Ingresos y Egresos).
 * 3. Asiento de Cierre Contable: Traslado de Utilidad Neta al Patrimonio del Balance General.
 * 4. Estructuración y comprobación de Ecuación Contable del Balance General (Fase 1).
 * 5. Cálculo automatizado de los 4 grupos de Ratios Financieros (Fase 2).
 * 6. Evaluación Predictiva del Modelo Z (Fase 3).
 * 7. Emisión de alertas de auditoría y registros detallados por consola.
 */

export function analizarFinanzas(cuentasCrudas: RawAccount[]): FinancialAnalysisResult {
  // 1. Procesar cuentas individuales y depreciaciones
  const cuentasProcesadas = procesarCuentas(cuentasCrudas);

  // 2. Generar Estado de Resultados primero para determinar la Utilidad Neta del Ejercicio
  const estadoResultados = calcularEstadoResultados(cuentasProcesadas);

  // 3. Generar Balance General incorporando la Utilidad Neta al Patrimonio (Asiento de Cierre)
  const balanceGeneral = calcularBalanceGeneral(cuentasProcesadas, estadoResultados.utilidadNeta);

  // 4. Calcular los 4 grupos de Ratios Financieros
  const ratios = calcularRatiosFinancieros(balanceGeneral, estadoResultados);

  // 5. Ejecutar Análisis Predictivo Z-Score
  const modeloZ = calcularModeloPredictivoZ(
    ratios.liquidez.razonCirculante,
    ratios.apalancamiento.apalancamientoInterno
  );

  // 6. Recopilar Alertas Contables Informativas
  const alertas: string[] = [];
  const logsAuditoria: string[] = [];

  if (!balanceGeneral.estaEquilibrado) {
    alertas.push(
      `ALERTA DE DESCUADRE: El Activo Total ($${balanceGeneral.totalActivo.toLocaleString()}) difiere de Pasivo + Patrimonio ($${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()}). Diferencia: $${balanceGeneral.diferenciaEquilibrio.toFixed(2)}.`
    );
  }

  if (balanceGeneral.totalPasivo === 0) {
    alertas.push('AVISO: El Pasivo Total es cero. Se asumieron razones de apalancamiento neutras para prevenir divisiones por cero.');
  }

  if (balanceGeneral.totalPasivoCorriente === 0) {
    alertas.push('AVISO: El Pasivo Corriente es cero. La razón circulante no pudo ser calculada por división directa.');
  }

  logsAuditoria.push(`Procesadas ${cuentasProcesadas.length} cuentas exitosamente.`);
  logsAuditoria.push(`Ecuación patrimonial ${balanceGeneral.estaEquilibrado ? 'CORRECTA ✅' : 'DESCUADRADA ❌'}.`);
  logsAuditoria.push(`Valor Z obtenido: ${modeloZ.valorZ.toFixed(4)} -> ${modeloZ.categoriaRiesgo}`);

  const resultado: FinancialAnalysisResult = {
    cuentasProcesadas,
    balanceGeneral,
    estadoResultados,
    ratios,
    modeloZ,
    alertas,
    logsAuditoria,
  };

  // Imprimir auditoría interactiva en la consola F12 del navegador
  registrarAuditoriaEnConsola(resultado);

  return resultado;
}
