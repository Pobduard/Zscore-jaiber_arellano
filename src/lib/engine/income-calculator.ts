import { ProcessedAccount } from '@/types/account';
import { EstadoResultadosStructure } from '@/types/income-statement';

/**
 * MOTOR 3: Calculador del Estado de Resultados (Ganancias y Pérdidas)
 * 
 * ¿Qué hace este módulo?
 * Procesa las partidas operativas (Ingresos y Egresos) para construir la cascada de utilidades:
 * Ventas Netas - Costo de Ventas = Utilidad Bruta
 * Utilidad Bruta - Gastos Generales/Administrativos = Utilidad Neta
 * 
 * Esta Utilidad Neta y las Ventas servirán de insumo directo para calcular los ratios de
 * Actividad y Rentabilidad (Margen Neto, ROA, ROE, Días de Inventarios, etc.).
 */

export function calcularEstadoResultados(cuentas: ProcessedAccount[]): EstadoResultadosStructure {
  // 1. Filtrar cuentas de Ingreso y Egreso
  const ingresos = cuentas.filter((c) => c.tipo_saldo === 'Ingreso');
  const egresos = cuentas.filter((c) => c.tipo_saldo === 'Egreso');

  // Distinguir Costo de Ventas de Gastos Generales por descripción o palabra clave
  const costos = egresos.filter((c) => /costo/i.test(c.descripcion_cuenta));
  const gastos = egresos.filter((c) => !/costo/i.test(c.descripcion_cuenta));

  // 2. Sumar totales
  const totalVentas = ingresos.reduce((acc, c) => acc + c.monto_neto, 0);
  const totalCostoVentas = costos.reduce((acc, c) => acc + c.monto_neto, 0);
  const utilidadBruta = Math.round((totalVentas - totalCostoVentas) * 100) / 100;

  const totalGastosGenerales = gastos.reduce((acc, c) => acc + c.monto_neto, 0);
  const utilidadNeta = Math.round((utilidadBruta - totalGastosGenerales) * 100) / 100;

  return {
    ingresos,
    costos,
    gastos,
    totalVentas: Math.round(totalVentas * 100) / 100,
    totalCostoVentas: Math.round(totalCostoVentas * 100) / 100,
    utilidadBruta,
    totalGastosGenerales: Math.round(totalGastosGenerales * 100) / 100,
    utilidadNeta,
  };
}
