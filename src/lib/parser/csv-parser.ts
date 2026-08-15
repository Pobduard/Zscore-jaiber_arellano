import Papa from 'papaparse';
import { RawAccount, TipoSaldo } from '@/types/account';

/**
 * MOTOR DE PARSEO DE ARCHIVOS CSV CON MAPEADOR DINÁMICO DE COLUMNAS
 */

export interface ParseCsvResult {
  accounts: RawAccount[];
  errors: string[];
}

export interface ColumnMapping {
  id_cuenta: string;
  descripcion_cuenta: string;
  tipo_saldo: string;
  monto: string;
  vida_util_anios: string;
}

/**
 * Extrae la lista exacta y real de encabezados (nombres de columnas) de la primera fila del CSV.
 * Elimina cualquier celda vacía o coma sobrante al final para reportar el número real de columnas.
 */
export function extractCsvHeaders(csvContent: string): string[] {
  const parsed = Papa.parse<string[]>(csvContent, {
    preview: 1,
    skipEmptyLines: true,
  });

  if (parsed.data && parsed.data.length > 0 && Array.isArray(parsed.data[0])) {
    const rawHeaders = parsed.data[0];
    const cleaned = rawHeaders.map((h) => String(h ?? '').trim());

    // Encuentra el último índice con contenido real para evitar contar comas o celdas vacías al final
    let lastIndex = cleaned.length - 1;
    while (lastIndex >= 0 && cleaned[lastIndex] === '') {
      lastIndex--;
    }

    if (lastIndex < 0) return [];

    // Devuelve exactamente el arreglo recortado al número real de columnas
    return cleaned.slice(0, lastIndex + 1).map((h, idx) => (h !== '' ? h : `Columna ${idx + 1}`));
  }

  return [];
}

/**
 * Pre-selecciona ÚNICAMENTE si existe coincidencia EXACTA con los 5 nombres de cabecera originales:
 * - id_cuenta
 * - descripcion_cuenta
 * - tipo_saldo
 * - monto
 * - vida_util_anios
 * 
 * Si el nombre es cualquier otro (ej. Row Labels, Sum of monto, codigo), se deja sin seleccionar ("").
 */
export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const findExactHeader = (target: string): string => {
    const match = headers.find((h) => h.toLowerCase().trim() === target.toLowerCase());
    return match ?? '';
  };

  return {
    id_cuenta: findExactHeader('id_cuenta'),
    descripcion_cuenta: findExactHeader('descripcion_cuenta'),
    tipo_saldo: findExactHeader('tipo_saldo'),
    monto: findExactHeader('monto'),
    vida_util_anios: findExactHeader('vida_util_anios') || findExactHeader('vida_util_años'),
  };
}

/**
 * Parsea el CSV aplicando el mapeo explícito de columnas seleccionado por el usuario.
 */
export function parseCsvWithMapping(csvContent: string, mapping: ColumnMapping): ParseCsvResult {
  const accounts: RawAccount[] = [];
  const errors: string[] = [];

  const parsed = Papa.parse<Record<string, unknown>>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.forEach((err) => {
      errors.push(`Línea ${err.row ?? 0}: ${err.message}`);
    });
  }

  parsed.data.forEach((row, index) => {
    try {
      const rawId = mapping.id_cuenta ? row[mapping.id_cuenta] : undefined;
      const rawDesc = mapping.descripcion_cuenta ? row[mapping.descripcion_cuenta] : undefined;
      const rawTipo = mapping.tipo_saldo ? row[mapping.tipo_saldo] : undefined;
      const rawMonto = mapping.monto ? row[mapping.monto] : undefined;
      const rawVida = mapping.vida_util_anios ? row[mapping.vida_util_anios] : undefined;

      const id_cuenta = Number(rawId) || index + 101;
      const descripcion_cuenta = String(rawDesc ?? `Cuenta ${index + 1}`).trim();
      const tipo_saldo = String(rawTipo ?? 'Liquidez').trim() as TipoSaldo;
      const monto = typeof rawMonto === 'number' ? rawMonto : Number(String(rawMonto).replace(/[^0-9.-]+/g, '')) || 0;
      const vida_util_anios = rawVida !== undefined && rawVida !== null && rawVida !== '' ? Number(rawVida) : null;

      // Descartar filas vacías o totales de tablas dinámicas
      if (!descripcion_cuenta || /total general|grand total/i.test(descripcion_cuenta)) {
        return;
      }

      accounts.push({
        id_cuenta,
        descripcion_cuenta,
        tipo_saldo,
        monto: Math.abs(monto),
        vida_util_anios: vida_util_anios !== null && !isNaN(vida_util_anios) ? Math.max(0, vida_util_anios) : null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error procesando fila';
      errors.push(`Fila ${index + 1}: ${msg}`);
    }
  });

  return { accounts, errors };
}

/**
 * Función legacy de parseo directo.
 */
export function parseCsvString(csvContent: string): ParseCsvResult {
  const headers = extractCsvHeaders(csvContent);
  const mapping = suggestColumnMapping(headers);
  return parseCsvWithMapping(csvContent, mapping);
}
