import { RawAccount, ProcessedAccount, CategoriaBalance, CATEGORIA_BALANCE } from '@/types/account';

/**
 * MOTOR 1: Procesador de Cuentas y Clasificación Contable Dinámica
 * 
 * Reglas de Negocio Aplicadas:
 * 1. Mapeo Resiliente: Soporta las etiquetas estándar del curso (Liquidez, Derecho_Cobro, Almacen, Inversion, Deuda_Corto, Deuda_Largo, Propietarios)
 *    así como sinonimias teóricas (Gastos Pagados por Anticipado, Capital, Deudas Largo Plazo).
 * 2. Regla Estricta del Terreno: Si la descripción contiene "Terreno" (case-insensitive), la depreciación es NULA ($0).
 * 3. Método de Línea Recta: Depreciación = Monto / Vida Útil (años) cuando la vida útil es > 0.
 * 4. Monto Neto = Monto Bruto - Depreciación Anual.
 */

export function determinarCategoriaBalance(tipoSaldo: string, descripcion: string = ''): CategoriaBalance {
  const ts = tipoSaldo.trim().toLowerCase();
  const desc = descripcion.trim().toLowerCase();

  // 1. Mapeos Directos Estándar del Proyecto y Sinonimias Teóricas
  if (
    ts === 'liquidez' ||
    ts === 'derecho_cobro' ||
    ts === 'almacen' ||
    ts === 'gastos_anticipados' ||
    ts === 'activo_corriente' ||
    /caja|banco|clientes|inventario|cobrar|anticipado/i.test(desc)
  ) {
    if (ts !== 'ingreso' && ts !== 'egreso' && !/ventas|costo|gasto general/i.test(desc)) {
      return CATEGORIA_BALANCE.ACTIVO_CORRIENTE;
    }
  }

  if (
    ts === 'inversion' ||
    ts === 'activo_fijo' ||
    ts === 'activo_no_corriente' ||
    /maquinaria|equipo|terreno|edificio|vehiculo|propiedad/i.test(desc)
  ) {
    if (ts !== 'egreso' && ts !== 'ingreso') {
      return CATEGORIA_BALANCE.ACTIVO_NO_CORRIENTE;
    }
  }

  if (
    ts === 'deuda_corto' ||
    ts === 'pasivo_corriente' ||
    /proveedores|prestamo a 6|impuestos por pagar|cuentas por pagar/i.test(desc)
  ) {
    if (ts !== 'egreso') {
      return CATEGORIA_BALANCE.PASIVO_CORRIENTE;
    }
  }

  if (
    ts === 'deuda_largo' ||
    ts === 'pasivo_no_corriente' ||
    /hipoteca|bonos|largo plazo|10 anos|10 años/i.test(desc)
  ) {
    return CATEGORIA_BALANCE.PASIVO_NO_CORRIENTE;
  }

  if (
    ts === 'propietarios' ||
    ts === 'patrimonio' ||
    /capital|utilidades acumuladas|utilidades retenidas|reservas/i.test(desc)
  ) {
    return CATEGORIA_BALANCE.PATRIMONIO;
  }

  if (
    ts === 'ingreso' ||
    ts === 'egreso' ||
    /ventas|costo de ventas|gastos|honorarios|servicios/i.test(desc)
  ) {
    return CATEGORIA_BALANCE.ESTADO_RESULTADOS;
  }

  // Fallback seguro por tipo de saldo original
  switch (tipoSaldo) {
    case 'Liquidez':
    case 'Derecho_Cobro':
    case 'Almacen':
      return CATEGORIA_BALANCE.ACTIVO_CORRIENTE;
    case 'Inversion':
      return CATEGORIA_BALANCE.ACTIVO_NO_CORRIENTE;
    case 'Deuda_Corto':
      return CATEGORIA_BALANCE.PASIVO_CORRIENTE;
    case 'Deuda_Largo':
      return CATEGORIA_BALANCE.PASIVO_NO_CORRIENTE;
    case 'Propietarios':
      return CATEGORIA_BALANCE.PATRIMONIO;
    case 'Ingreso':
    case 'Egreso':
      return CATEGORIA_BALANCE.ESTADO_RESULTADOS;
    default:
      return CATEGORIA_BALANCE.ACTIVO_CORRIENTE;
  }
}

/**
 * Verifica si una cuenta corresponde al activo fijo Terreno (Inversión + "terreno" en descripción).
 */
export function esCuentaTerreno(descripcion: string, tipoSaldo: string = 'Inversion'): boolean {
  return tipoSaldo === 'Inversion' && /terreno/i.test(descripcion);
}

/**
 * Procesador principal de cuentas individuales.
 */
export function procesarCuenta(account: RawAccount): ProcessedAccount {
  const esTerreno = esCuentaTerreno(account.descripcion_cuenta, account.tipo_saldo);
  const categoria = determinarCategoriaBalance(account.tipo_saldo, account.descripcion_cuenta);

  let depreciacionAnual = 0;

  // Regla estricta: Los terrenos NUNCA se deprecian.
  // Si la cuenta posee vida útil > 0 y NO es terreno, se deprecia en línea recta.
  if (!esTerreno && account.vida_util_anios && account.vida_util_anios > 0) {
    depreciacionAnual = account.monto / account.vida_util_anios;
  }

  // El monto neto para el balance refleja el valor residual después del 1er año de depreciación
  const montoNeto = account.monto - depreciacionAnual;

  return {
    id_cuenta: account.id_cuenta,
    descripcion_cuenta: account.descripcion_cuenta,
    tipo_saldo: account.tipo_saldo,
    monto_bruto: account.monto,
    vida_util_anios: esTerreno ? 0 : (account.vida_util_anios ?? 0),
    depreciacion_anual: Math.round(depreciacionAnual * 100) / 100,
    monto_neto: Math.round(montoNeto * 100) / 100,
    es_terreno: esTerreno,
    categoria_balance: categoria,
  };
}

/**
 * Procesador masivo para un conjunto de cuentas crudas.
 */
export function procesarCuentas(rawAccounts: RawAccount[]): ProcessedAccount[] {
  return rawAccounts.map(procesarCuenta);
}
