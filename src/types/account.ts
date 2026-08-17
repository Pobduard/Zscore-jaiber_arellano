import { z } from 'zod';

/**
 * Tipos de Saldo soportados en el CSV crudo
 */
export const TipoSaldoSchema = z.enum([
  'Liquidez',
  'Derecho_Cobro',
  'Almacen',
  'Inversion',
  'Deuda_Corto',
  'Deuda_Largo',
  'Propietarios',
  'Ingreso',
  'Egreso',
]);

export type TipoSaldo = z.infer<typeof TipoSaldoSchema>;

/**
 * Esquema Zod para validar cada fila cruda ingresada desde el CSV
 */
export const RawAccountSchema = z.object({
  id_cuenta: z.coerce.number({ message: 'El ID de cuenta debe ser un número válido' }),
  descripcion_cuenta: z.string().min(1, 'La descripción de la cuenta no puede estar vacía'),
  tipo_saldo: TipoSaldoSchema,
  monto: z.coerce.number({ message: 'El monto debe ser un número válido' }).min(0, 'El monto debe ser un número positivo'),
  vida_util_anios: z
    .union([z.coerce.number(), z.string(), z.null(), z.undefined()])
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const parsed = Number(val);
      return isNaN(parsed) ? null : parsed;
    }),
});

export type RawAccount = z.infer<typeof RawAccountSchema>;

/**
 * Diccionario centralizado para las Categorías del Balance (Evita strings quemados)
 */
export const CATEGORIA_BALANCE = {
  ACTIVO_CORRIENTE: 'Activo Corriente',
  ACTIVO_NO_CORRIENTE: 'Activo No Corriente',
  PASIVO_CORRIENTE: 'Pasivo Corriente',
  PASIVO_NO_CORRIENTE: 'Pasivo No Corriente',
  PATRIMONIO: 'Patrimonio',
  ESTADO_RESULTADOS: 'Estado de Resultados',
} as const;

export type CategoriaBalance = typeof CATEGORIA_BALANCE[keyof typeof CATEGORIA_BALANCE];

/**
 * Cuenta procesada individual con cálculo de depreciación y monto neto
 */
export interface ProcessedAccount {
  id_cuenta: number;
  descripcion_cuenta: string;
  tipo_saldo: TipoSaldo;
  monto_bruto: number;
  vida_util_anios: number | null;
  depreciacion_anual: number;
  monto_neto: number;
  es_terreno: boolean;
  categoria_balance: CategoriaBalance;
}
