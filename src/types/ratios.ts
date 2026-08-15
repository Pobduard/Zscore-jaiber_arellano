/**
 * Razones / Indicadores Financieros obligatorios del sistema (Fase 2) + Ratios Extendidos
 */
export interface LiquidezRatios {
  razonCirculante: number; // X1 en el modelo Z
  pruebaAcida: number;
  pruebaSuperAcida: number; // Caja y Bancos / Pasivo Corriente
  capitalDeTrabajoNeto: number; // Activo Corriente - Pasivo Corriente ($)
}

export interface ApalancamientoRatios {
  razonEndeudamiento: number;
  endeudamientoCortoPlazo: number; // Pasivo Corriente / Activo Total
  endeudamientoLargoPlazo: number; // Pasivo No Corriente / Activo Total
  apalancamientoInterno: number; // X2 en el modelo Z (Patrimonio / Pasivo Total)
  autonomia: number; // Patrimonio / Activo Total
  capitalizacionExterna: number; // Pasivo No Corriente / (Pasivo No Corriente + Patrimonio)
  capitalizacionInterna: number; // Patrimonio / (Pasivo No Corriente + Patrimonio)
  relacionApalancamientoFormato: string; // Formato X:1 (ej. "1.75 : 1")
}

export interface ActividadRatios {
  diasInventario: number;
  rotacionInventario: number;
  diasCuentasPorCobrar: number;
  rotacionCuentasPorCobrar: number;
  rotacionActivoTotal: number;
  rotacionActivoFijo: number; // Ventas / Activo No Corriente
  rotacionCapitalDeTrabajo: number; // Ventas / Capital de Trabajo Neto
}

export interface RentabilidadRatios {
  margenBruto: number; // Utilidad Bruta / Ventas
  margenNeto: number;
  roe: number;
  roa: number;
  multiplicadorApalancamientoDuPont: number; // Activo Total / Patrimonio
}

export interface FinancialRatios {
  liquidez: LiquidezRatios;
  apalancamiento: ApalancamientoRatios;
  actividad: ActividadRatios;
  rentabilidad: RentabilidadRatios;
}
