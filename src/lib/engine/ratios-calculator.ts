import { BalanceGeneralStructure } from '@/types/balance';
import { EstadoResultadosStructure } from '@/types/income-statement';
import { FinancialRatios } from '@/types/ratios';

/**
 * MOTOR 4: Calculador de Razones / Indicadores Financieros (Principales y Extendidos)
 * 
 * Procesa las 4 grandes familias de razones financieras según el estándar contable:
 * 1. Liquidez: Razón Circulante ($X_1$), Prueba Ácida, Prueba Súper Ácida, Capital de Trabajo Neto.
 * 2. Apalancamiento: Endeudamiento, Corto Plazo, Largo Plazo, Apalancamiento Interno ($X_2$), Autonomía, Capitalización.
 * 3. Actividad: Días/Rotación de Inventario, Días/Rotación CxC, Rotación Activo Total, Rotación Activo Fijo.
 * 4. Rentabilidad: Margen Bruto, Margen Neto, ROE, ROA, Descomposición DuPont.
 */

export function calcularRatiosFinancieros(
  balance: BalanceGeneralStructure,
  estadoResultados: EstadoResultadosStructure
): FinancialRatios {
  // Extraer valores clave del Balance General
  const ac = balance.totalActivoCorriente;
  const anc = balance.totalActivoNoCorriente;
  const at = balance.totalActivo;

  const pc = balance.totalPasivoCorriente;
  const pnc = balance.totalPasivoNoCorriente;
  const pt = balance.totalPasivo;

  const pat = balance.totalPatrimonio;

  // Extraer partidas específicas del Activo Corriente
  const cajaBancos = balance.activoCorriente
    .filter((c) => c.tipo_saldo === 'Liquidez' || /caja|banco|efectivo/i.test(c.descripcion_cuenta))
    .reduce((acc, c) => acc + c.monto_neto, 0);

  const inventario = balance.activoCorriente
    .filter((c) => c.tipo_saldo === 'Almacen' || /inventario/i.test(c.descripcion_cuenta))
    .reduce((acc, c) => acc + c.monto_neto, 0);

  const cuentasPorCobrar = balance.activoCorriente
    .filter((c) => c.tipo_saldo === 'Derecho_Cobro' || /cobrar|cliente/i.test(c.descripcion_cuenta))
    .reduce((acc, c) => acc + c.monto_neto, 0);

  // Extraer valores clave del Estado de Resultados
  const ventas = estadoResultados.totalVentas;
  const costoVentas = estadoResultados.totalCostoVentas;
  const utilidadBruta = estadoResultados.utilidadBruta;
  const utilidadNeta = estadoResultados.utilidadNeta;

  // Helper para dividir de forma segura y redondear a 4 decimales
  const safeDiv = (num: number, den: number) => {
    return (den === 0 || isNaN(num) || isNaN(den)) ? 0 : Math.round((num / den) * 10000) / 10000;
  };

  // --- 1. RAZONES DE LIQUIDEZ ---
  const razonCirculante = safeDiv(ac, pc);
  const pruebaAcida = safeDiv(ac - inventario, pc);
  const pruebaSuperAcida = safeDiv(cajaBancos, pc);
  // El capital de trabajo es una resta, así que solo lo redondeamos directamente
  const capitalDeTrabajoNeto = Math.round((ac - pc) * 10000) / 10000;

  // --- 2. RAZONES DE APALANCAMIENTO ---
  const razonEndeudamiento = safeDiv(pt, at);
  const endeudamientoCortoPlazo = safeDiv(pc, at);
  const endeudamientoLargoPlazo = safeDiv(pnc, at);
  const apalancamientoInterno = safeDiv(pat, pt);
  const autonomia = safeDiv(pat, at);

  const totalCapitalizacion = pnc + pat;
  const capitalizacionExterna = safeDiv(pnc, totalCapitalizacion);
  const capitalizacionInterna = safeDiv(pat, totalCapitalizacion);
  const relacionApalancamientoFormato = pt > 0 ? `${(pat / pt).toFixed(2)} : 1` : 'N/A';

  // --- 3. RAZONES DE ACTIVIDAD ---
  const diasInventario = safeDiv(inventario * 360, ventas);
  const rotacionInventario = safeDiv(costoVentas > 0 ? costoVentas : ventas, inventario);
  const diasCuentasPorCobrar = safeDiv(cuentasPorCobrar * 360, ventas);
  const rotacionCuentasPorCobrar = safeDiv(ventas, cuentasPorCobrar);
  const rotacionActivoTotal = safeDiv(ventas, at);
  const rotacionActivoFijo = safeDiv(ventas, anc);
  const rotacionCapitalDeTrabajo = safeDiv(ventas, capitalDeTrabajoNeto);

  // --- 4. RAZONES DE RENTABILIDAD & DUPONT ---
  const margenBruto = safeDiv(utilidadBruta, ventas);
  const margenNeto = safeDiv(utilidadNeta, ventas);
  const roe = safeDiv(utilidadNeta, pat);
  const roa = safeDiv(utilidadNeta, at);
  const multiplicadorApalancamientoDuPont = safeDiv(at, pat);

  return {
    liquidez: {
      razonCirculante,
      pruebaAcida,
      pruebaSuperAcida,
      capitalDeTrabajoNeto,
    },
    apalancamiento: {
      razonEndeudamiento,
      endeudamientoCortoPlazo,
      endeudamientoLargoPlazo,
      apalancamientoInterno,
      autonomia,
      capitalizacionExterna,
      capitalizacionInterna,
      relacionApalancamientoFormato,
    },
    actividad: {
      diasInventario,
      rotacionInventario,
      diasCuentasPorCobrar,
      rotacionCuentasPorCobrar,
      rotacionActivoTotal,
      rotacionActivoFijo,
      rotacionCapitalDeTrabajo,
    },
    rentabilidad: {
      margenBruto,
      margenNeto,
      roe,
      roa,
      multiplicadorApalancamientoDuPont,
    },
  };
}
