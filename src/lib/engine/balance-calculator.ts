import { ProcessedAccount, CATEGORIA_BALANCE } from '@/types/account';
import { BalanceGeneralStructure } from '@/types/balance';

/**
 * MOTOR 2: Calculador del Balance General y Ecuación de Equilibrio
 * 
 * ¿Qué hace este módulo?
 * Clasifica y agrupa las cuentas procesadas en los tres grandes rubros patrimoniales:
 * 1. Activo (Corriente + No Corriente)
 * 2. Pasivo (Corriente + No Corriente)
 * 3. Patrimonio (incluyendo el traslado contable de la Utilidad Neta del Ejercicio)
 * 
 * Además, efectúa la comprobación de la Ecuación Contable Fundamental:
 * ACTIVO = PASIVO + PATRIMONIO
 * 
 * Si existe un descuadre (diferencia > 0.01), el sistema lo marca para generar una alerta visual.
 */

/**
 * Función auxiliar para sumar importes netos de un arreglo de cuentas contables.
 */
function sumarMontosNetos(cuentas: ProcessedAccount[]): number {
  const suma = cuentas.reduce((acc, c) => acc + c.monto_neto, 0);
  return Math.round(suma * 100) / 100;
}

/**
 * Construye y calcula la estructura completa del Balance General a partir de las cuentas procesadas.
 * Recibe opcionalmente la utilidadNeta del Estado de Resultados para realizar el asiento de cierre contable.
 */
export function calcularBalanceGeneral(
  cuentas: ProcessedAccount[],
  utilidadNeta: number = 0
): BalanceGeneralStructure {
  // 1. Filtrar las cuentas pertenecientes a cada categoría del Balance General
  const activoCorriente = cuentas.filter((c) => c.categoria_balance === CATEGORIA_BALANCE.ACTIVO_CORRIENTE);
  const activoNoCorriente = cuentas.filter((c) => c.categoria_balance === CATEGORIA_BALANCE.ACTIVO_NO_CORRIENTE);
  const pasivoCorriente = cuentas.filter((c) => c.categoria_balance === CATEGORIA_BALANCE.PASIVO_CORRIENTE);
  const pasivoNoCorriente = cuentas.filter((c) => c.categoria_balance === CATEGORIA_BALANCE.PASIVO_NO_CORRIENTE);
  const patrimonioBase = cuentas.filter((c) => c.categoria_balance === CATEGORIA_BALANCE.PATRIMONIO);

  // Si existe Utilidad Neta del Estado de Resultados, se incorpora como asiento de cierre contable en el Patrimonio
  const patrimonio: ProcessedAccount[] = [...patrimonioBase];
  if (utilidadNeta !== 0) {
    patrimonio.push({
      id_cuenta: 999,
      descripcion_cuenta: 'Utilidad Neta del Ejercicio',
      tipo_saldo: 'Propietarios',
      monto_bruto: utilidadNeta,
      vida_util_anios: 0,
      depreciacion_anual: 0,
      monto_neto: utilidadNeta,
      es_terreno: false,
      categoria_balance: CATEGORIA_BALANCE.PATRIMONIO,
    });
  }

  // 2. Sumar subtotales de cada grupo
  const totalActivoCorriente = sumarMontosNetos(activoCorriente);
  const totalActivoNoCorriente = sumarMontosNetos(activoNoCorriente);
  const totalActivo = Math.round((totalActivoCorriente + totalActivoNoCorriente) * 100) / 100;

  const totalPasivoCorriente = sumarMontosNetos(pasivoCorriente);
  const totalPasivoNoCorriente = sumarMontosNetos(pasivoNoCorriente);
  const totalPasivo = Math.round((totalPasivoCorriente + totalPasivoNoCorriente) * 100) / 100;

  const totalPatrimonio = sumarMontosNetos(patrimonio);

  // 3. Validar Ecuación de Equilibrio: Activo = Pasivo + Patrimonio
  const totalPasivoMasPatrimonio = Math.round((totalPasivo + totalPatrimonio) * 100) / 100;
  const diferenciaEquilibrio = Math.abs(Math.round((totalActivo - totalPasivoMasPatrimonio) * 100) / 100);

  // Tolerancia por centavos debido a redondeo en cálculos de punto flotante
  const estaEquilibrado = diferenciaEquilibrio < 0.01;

  return {
    activoCorriente,
    activoNoCorriente,
    totalActivoCorriente,
    totalActivoNoCorriente,
    totalActivo,

    pasivoCorriente,
    pasivoNoCorriente,
    totalPasivoCorriente,
    totalPasivoNoCorriente,
    totalPasivo,

    patrimonio,
    totalPatrimonio,

    totalPasivoMasPatrimonio,
    diferenciaEquilibrio,
    estaEquilibrado,
  };
}
