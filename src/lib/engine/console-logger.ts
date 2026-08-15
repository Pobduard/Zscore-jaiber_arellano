import { FinancialAnalysisResult } from '@/types/analysis';

/**
 * MOTOR DE AUDITORÍA Y REGISTRO EN CONSOLA (Console Logger)
 * 
 * ¿Qué hace este módulo?
 * Imprime en la consola del navegador/servidor de forma altamente estructurada (`console.group`, `console.table`)
 * todos los pasos contables, montos procesados, prueba de depreciación, tabla de balance general, ratios
 * y la ecuación discriminante Z.
 * 
 * ¡Ideal para comparar paso a paso con la hoja de cálculo de Excel durante la evaluación o defensa!
 */

export function registrarAuditoriaEnConsola(resultado: FinancialAnalysisResult): void {
  const { cuentasProcesadas, balanceGeneral, estadoResultados, ratios, modeloZ } = resultado;

  if (typeof console === 'undefined') return;

  console.groupCollapsed('📊 AUDITORÍA CONTABLE Y FINANCIERA (COMPROBACIÓN EXCEL)');

  // 1. Cuentas Procesadas y Depreciación
  console.group('1. Clasificación de Cuentas y Depreciación Lineal');
  console.table(
    cuentasProcesadas.map((c) => ({
      ID: c.id_cuenta,
      Descripción: c.descripcion_cuenta,
      Tipo: c.tipo_saldo,
      Categoría: c.categoria_balance,
      'Monto Bruto': `$${c.monto_bruto.toLocaleString()}`,
      'Vida Útil (Años)': c.vida_util_anios ?? 'N/A',
      'Depreciación 1er Año': `$${c.depreciacion_anual.toLocaleString()}`,
      'Monto Neto': `$${c.monto_neto.toLocaleString()}`,
      'Es Terreno': c.es_terreno ? 'SÍ (Sin depreciación)' : 'No',
    }))
  );
  console.groupEnd();

  // 2. Resumen del Balance General y Validación de Equilibrio
  console.group('2. Balance General y Ecuación Fundamental (Activo = Pasivo + Patrimonio)');
  console.log(`- Total Activo Corriente: $${balanceGeneral.totalActivoCorriente.toLocaleString()}`);
  console.log(`- Total Activo No Corriente: $${balanceGeneral.totalActivoNoCorriente.toLocaleString()}`);
  console.log(`🟢 TOTAL ACTIVO: $${balanceGeneral.totalActivo.toLocaleString()}`);
  console.log(`--------------------------------------------------`);
  console.log(`- Total Pasivo Corriente: $${balanceGeneral.totalPasivoCorriente.toLocaleString()}`);
  console.log(`- Total Pasivo No Corriente: $${balanceGeneral.totalPasivoNoCorriente.toLocaleString()}`);
  console.log(`- TOTAL PASIVO: $${balanceGeneral.totalPasivo.toLocaleString()}`);
  console.log(`- TOTAL PATRIMONIO: $${balanceGeneral.totalPatrimonio.toLocaleString()}`);
  console.log(`🔵 TOTAL PASIVO + PATRIMONIO: $${balanceGeneral.totalPasivoMasPatrimonio.toLocaleString()}`);
  console.log(`--------------------------------------------------`);
  console.log(`Diferencia de Descuadre: $${balanceGeneral.diferenciaEquilibrio.toFixed(2)}`);
  if (balanceGeneral.estaEquilibrado) {
    console.log(`✅ ¡EQUILIBRIO CONTABLE VERIFICADO CORRECTAMENTE!`);
  } else {
    console.warn(`🚨 ALERTA: DESCUADRE PATRIMONIAL DETECTADO ($${balanceGeneral.diferenciaEquilibrio.toFixed(2)})`);
  }
  console.groupEnd();

  // 3. Estado de Resultados
  console.group('3. Estado de Resultados');
  console.log(`- Ventas Netas: $${estadoResultados.totalVentas.toLocaleString()}`);
  console.log(`- Costo de Ventas: -$${estadoResultados.totalCostoVentas.toLocaleString()}`);
  console.log(`- Utilidad Bruta: $${estadoResultados.utilidadBruta.toLocaleString()}`);
  console.log(`- Gastos Generales: -$${estadoResultados.totalGastosGenerales.toLocaleString()}`);
  console.log(`💰 UTILIDAD NETA: $${estadoResultados.utilidadNeta.toLocaleString()}`);
  console.groupEnd();

  // 4. Panel de Razones Financieras
  console.group('4. Indicadores y Ratios Financieros');
  console.table({
    'Liquidez - Razón Circulante (X1)': ratios.liquidez.razonCirculante.toFixed(4),
    'Liquidez - Prueba Ácida': ratios.liquidez.pruebaAcida.toFixed(4),
    'Apalancamiento - Razón de Endeudamiento': `${(ratios.apalancamiento.razonEndeudamiento * 100).toFixed(2)}%`,
    'Apalancamiento - Apalancamiento Interno (X2)': ratios.apalancamiento.apalancamientoInterno.toFixed(4),
    'Apalancamiento - Autonomía': `${(ratios.apalancamiento.autonomia * 100).toFixed(2)}%`,
    'Actividad - Días de Inventario': `${ratios.actividad.diasInventario.toFixed(1)} días`,
    'Actividad - Rotación de Inventario': `${ratios.actividad.rotacionInventario.toFixed(2)} veces`,
    'Actividad - Días CxC': `${ratios.actividad.diasCuentasPorCobrar.toFixed(1)} días`,
    'Actividad - Rotación CxC': `${ratios.actividad.rotacionCuentasPorCobrar.toFixed(2)} veces`,
    'Actividad - Rotación Activo Total': `${ratios.actividad.rotacionActivoTotal.toFixed(2)} veces`,
    'Rentabilidad - Margen Neto': `${(ratios.rentabilidad.margenNeto * 100).toFixed(2)}%`,
    'Rentabilidad - ROE': `${(ratios.rentabilidad.roe * 100).toFixed(2)}%`,
    'Rentabilidad - ROA': `${(ratios.rentabilidad.roa * 100).toFixed(2)}%`,
  });
  console.groupEnd();

  // 5. Modelo Predictivo Z-Score
  console.group('5. Dictamen del Modelo Predictivo Z-Score (Z = 0.4 X1 + 0.6 X2)');
  console.log(`- X1 (Razón Circulante): ${modeloZ.x1_razonCirculante.toFixed(4)}`);
  console.log(`- X2 (Apalancamiento Interno): ${modeloZ.x2_apalancamientoInterno.toFixed(4)}`);
  console.log(`- Fórmula Aplicada: Z = (0.4 * ${modeloZ.x1_razonCirculante.toFixed(4)}) + (0.6 * ${modeloZ.x2_apalancamientoInterno.toFixed(4)})`);
  console.log(`⭐ VALOR DE Z OBTENIDO: ${modeloZ.valorZ.toFixed(4)}`);
  console.log(`🏷️ DICTAMEN FINAL: ${modeloZ.categoriaRiesgo.toUpperCase()}`);
  console.log(`ℹ️ ${modeloZ.explicacion}`);
  console.groupEnd();

  console.groupEnd();
}
