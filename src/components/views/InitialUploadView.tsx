'use client';

import { useState, useRef } from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { ColumnMapperModal } from '@/components/upload/ColumnMapperModal';
import { RawAccount } from '@/types/account';
import { UploadCloud, Sparkles, Scale, AlertCircle } from 'lucide-react';

export function InitialUploadView() {
  const { setRawAccounts, loadDefaultData, parseErrors } = useFinancialStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para el modal mapeador de columnas
  const [mapperState, setMapperState] = useState<{
    isOpen: boolean;
    fileName: string;
    csvContent: string;
  }>({
    isOpen: false,
    fileName: '',
    csvContent: '',
  });

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Por favor selecciona un archivo con extensión .csv');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        // SIEMPRE requiere confirmación en el Mapeador de Columnas para archivos subidos por el usuario
        setMapperState({
          isOpen: true,
          fileName: file.name,
          csvContent: text,
        });
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleMapperConfirm = (mappedAccounts: RawAccount[], fileName: string, rawContent: string) => {
    setRawAccounts(fileName, rawContent, mappedAccounts);
    setMapperState({ isOpen: false, fileName: '', csvContent: '' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 select-none">
      <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Encabezado Principal */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <Scale className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Motor Z-Score
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Autor — Jaiber Arellano
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Procesamiento de estados financieros, estructuración del Balance General y evaluación predictiva de riesgo crediticio.
          </p>
        </div>

        {/* Zona Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : 'border-slate-600 hover:border-slate-400 bg-slate-900/40 hover:bg-slate-900/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              Selecciona o arrastra tu archivo CSV contable
            </p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              (Se abrirá el asistente para confirmar o asignar columnas)
            </p>
          </div>
        </div>

        {/* Muestra errores de parseo si los hubiese */}
        {parseErrors.length > 0 && (
          <div className="bg-rose-950/60 border border-rose-800 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Errores al procesar CSV:</span>
            </div>
            <ul className="text-[11px] text-rose-400 font-mono list-disc list-inside space-y-0.5">
              {parseErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Separador */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-700 w-full" />
          <span className="bg-slate-800 px-3 text-[11px] text-slate-400 font-mono uppercase absolute">
            O selecciona la opción rápida
          </span>
        </div>

        {/* Botón Asistido sugerido: Carga Directa sin Mapeo */}
        <button
          onClick={() => loadDefaultData()}
          className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Cargar archivo de prueba por defecto (datos.csv)</span>
        </button>
      </div>

      {/* Modal Mapeador de Columnas */}
      <ColumnMapperModal
        isOpen={mapperState.isOpen}
        fileName={mapperState.fileName}
        csvContent={mapperState.csvContent}
        onConfirm={handleMapperConfirm}
        onCancel={() => setMapperState({ isOpen: false, fileName: '', csvContent: '' })}
      />
    </div>
  );
}
