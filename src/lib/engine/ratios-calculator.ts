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
  const costoVentas = estadoResultados.costoVentas;
  const utilidadBruta = estadoResultados.utilidadBruta;
  const utilidadNeta = estadoResultados.utilidadNeta;

  // Helper para redondear a 4 decimales
  const r = (val: number) => (isNaN(val) || !isFinite(val) ? 0 : Math.round(val * 10000) / 10000);

  // --- 1. RAZONES DE LIQUIDEZ ---
  const razonCirculante = pc > 0 ? r(ac / pc) : 0;
  const pruebaAcida = pc > 0 ? r((ac - inventario) / pc) : 0;
  const pruebaSuperAcida = pc > 0 ? r(cajaBancos / pc) : 0;
  const capitalDeTrabajoNeto = r(ac - pc);

  // --- 2. RAZONES DE APALANCAMIENTO ---
  const razonEndeudamiento = at > 0 ? r(pt / at) : 0;
  const endeudamientoCortoPlazo = at > 0 ? r(pc / at) : 0;
  const endeudamientoLargoPlazo = at > 0 ? r(pnc / at) : 0;
  const apalancamientoInterno = pt > 0 ? r(pat / pt) : 0;
  const autonomia = at > 0 ? r(pat / at) : 0;

  const totalCapitalizacion = pnc + pat;
  const capitalizacionExterna = totalCapitalizacion > 0 ? r(pnc / totalCapitalizacion) : 0;
  const capitalizacionInterna = totalCapitalizacion > 0 ? r(pat / totalCapitalizacion) : 0;
  const relacionApalancamientoFormato = pt > 0 ? `${(pat / pt).toFixed(2)} : 1` : 'N/A';

  // --- 3. RAZONES DE ACTIVIDAD ---
  const diasInventario = ventas > 0 ? r((inventario * 360) / ventas) : 0;
  const rotacionInventario = inventario > 0 ? r((costoVentas > 0 ? costoVentas : ventas) / inventario) : 0;
  const diasCuentasPorCobrar = ventas > 0 ? r((cuentasPorCobrar * 360) / ventas) : 0;
  const rotacionCuentasPorCobrar = cuentasPorCobrar > 0 ? r(ventas / cuentasPorCobrar) : 0;
  const rotacionActivoTotal = at > 0 ? r(ventas / at) : 0;
  const rotacionActivoFijo = anc > 0 ? r(ventas / anc) : 0;
  const rotacionCapitalDeTrabajo = capitalDeTrabajoNeto > 0 ? r(ventas / capitalDeTrabajoNeto) : 0;

  // --- 4. RAZONES DE RENTABILIDAD & DUPONT ---
  const margenBruto = ventas > 0 ? r(utilidadBruta / ventas) : 0;
  const margenNeto = ventas > 0 ? r(utilidadNeta / ventas) : 0;
  const roe = pat > 0 ? r(utilidadNeta / pat) : 0;
  const roa = at > 0 ? r(utilidadNeta / at) : 0;
  const multiplicadorApalancamientoDuPont = pat > 0 ? r(at / pat) : 0;

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
