'use client';

import { useState, useEffect } from 'react';
import { RawAccount } from '@/types/account';
import {
  extractCsvHeaders,
  suggestColumnMapping,
  parseCsvWithMapping,
  ColumnMapping,
} from '@/lib/parser/csv-parser';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Settings2,
} from 'lucide-react';

interface ColumnMapperModalProps {
  isOpen: boolean;
  fileName: string;
  csvContent: string;
  onConfirm: (mappedAccounts: RawAccount[], fileName: string, rawContent: string) => void;
  onCancel: () => void;
}

const REQUERIDOS: { key: keyof ColumnMapping; title: string; desc: string; required: boolean }[] = [
  {
    key: 'id_cuenta',
    title: 'ID / Código de Cuenta',
    desc: 'Identificador único numérico del registro contable.',
    required: false,
  },
  {
    key: 'descripcion_cuenta',
    title: 'Descripción / Nombre de Cuenta',
    desc: 'Nombre formal de la partida (ej. Caja, Maquinaria, Terreno, Ventas).',
    required: true,
  },
  {
    key: 'tipo_saldo',
    title: 'Tipo / Categoría de Saldo',
    desc: 'Clasificación contable (Liquidez, Derecho_Cobro, Almacen, Inversion, Deuda_Corto, Deuda_Largo, Propietarios, Ingreso, Egreso).',
    required: true,
  },
  {
    key: 'monto',
    title: 'Monto / Saldo Monetario ($)',
    desc: 'Monto bruto nominal del saldo de la cuenta en dólares.',
    required: true,
  },
  {
    key: 'vida_util_anios',
    title: 'Vida Útil (Años)',
    desc: 'Años para la depreciación en línea recta (Terrenos siempre tienen 0). Opcional.',
    required: false,
  },
];

export function ColumnMapperModal({
  isOpen,
  fileName,
  csvContent,
  onConfirm,
  onCancel,
}: ColumnMapperModalProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    id_cuenta: '',
    descripcion_cuenta: '',
    tipo_saldo: '',
    monto: '',
    vida_util_anios: '',
  });

  useEffect(() => {
    if (isOpen && csvContent) {
      const extracted = extractCsvHeaders(csvContent);
      setHeaders(extracted);
      const suggested = suggestColumnMapping(extracted);
      setMapping(suggested);
    }
  }, [isOpen, csvContent]);

  if (!isOpen) return null;

  const handleSelectChange = (key: keyof ColumnMapping, value: string) => {
    setMapping((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirm = () => {
    if (!mapping.descripcion_cuenta || !mapping.tipo_saldo || !mapping.monto) {
      alert('Por favor selecciona las columnas para Descripción, Tipo de Saldo y Monto.');
      return;
    }
    const result = parseCsvWithMapping(csvContent, mapping);
    onConfirm(result.accounts, fileName, csvContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">Asistente Mapeador de Columnas</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  Paso Obligatorio de Confirmación
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Archivo: <strong className="text-slate-200">{fileName}</strong> ({headers.length} columnas detectadas)
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-emerald-950 space-y-0.5 font-sans">
              <p className="font-bold text-xs">
                Asigna o confirma las columnas de tu archivo CSV a las variables requeridas por el Motor Z-Score.
              </p>
              <p className="text-[11px] text-emerald-800">
                Selecciona la columna real correspondiente de tu archivo en cada uno de los desplegables.
              </p>
            </div>
          </div>

          {/* Tabla de Mapeo */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 font-bold">
                  <th className="py-2.5 px-4">Variable del Sistema</th>
                  <th className="py-2.5 px-4">Función / Significado</th>
                  <th className="py-2.5 px-4">Estado de Pre-Selección</th>
                  <th className="py-2.5 px-4 text-right">Columna Seleccionada del CSV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {REQUERIDOS.map((req) => {
                  const currentValue = mapping[req.key];
                  const isSelected = currentValue !== '';

                  return (
                    <tr key={req.key} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {req.title}
                        {req.required && <span className="text-rose-500 ml-1">*</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs">{req.desc}</td>
                      <td className="py-3 px-4">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-mono px-2 py-0.5 rounded font-semibold border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Pre-Seleccionado ({currentValue})</span>
                          </span>
                        ) : (
                          <span className="text-amber-800 bg-amber-50 border border-amber-200 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                            Pendiente Selección
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={currentValue}
                          onChange={(e) => handleSelectChange(req.key, e.target.value)}
                          className="bg-slate-50 border border-slate-300 hover:border-emerald-500 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium outline-none cursor-pointer w-52 font-mono"
                        >
                          <option value="">-- Seleccionar Columna --</option>
                          {headers.map((h, idx) => (
                            <option key={`header-${h}-${idx}`} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>Confirmar Mapeo y Procesar Datos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
