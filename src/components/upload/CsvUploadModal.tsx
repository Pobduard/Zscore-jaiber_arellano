'use client';

import { useState, useRef } from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { ColumnMapperModal } from '@/components/upload/ColumnMapperModal';
import { RawAccount } from '@/types/account';
import { X, UploadCloud, FileSpreadsheet, Sparkles, AlertCircle } from 'lucide-react';

export function CsvUploadModal() {
  const {
    isUploadModalOpen,
    setUploadModalOpen,
    setRawAccounts,
    loadDefaultData,
    parseErrors,
  } = useFinancialStore();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mapperState, setMapperState] = useState<{
    isOpen: boolean;
    fileName: string;
    csvContent: string;
  }>({
    isOpen: false,
    fileName: '',
    csvContent: '',
  });

  if (!isUploadModalOpen) return null;

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
    setUploadModalOpen(false);
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
          {/* Header del Modal */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Cargar Datos Financieros</h3>
                <p className="text-xs text-slate-500">Selecciona o arrastra tu archivo CSV de cuentas</p>
              </div>
            </div>

            <button
              onClick={() => setUploadModalOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo del Modal */}
          <div className="p-6 space-y-5">
            {/* Zona Drag & Drop */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/30 hover:bg-slate-50/80'
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

              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Haz clic para seleccionar o arrastra tu archivo aquí
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  (Se abrirá el asistente para confirmar o asignar columnas)
                </p>
              </div>
            </div>

            {/* Visor de Errores */}
            {parseErrors.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>Advertencias al parsear CSV:</span>
                </div>
                <ul className="text-[11px] text-rose-600 font-mono list-disc list-inside space-y-0.5 max-h-24 overflow-y-auto">
                  {parseErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Separador Visual */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase font-mono absolute">
                O la alternativa rápida
              </span>
            </div>

            {/* Botón Asistido sugerido: Cargar Datos por Defecto */}
            <button
              onClick={() => {
                loadDefaultData();
                setUploadModalOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl text-xs shadow-sm transition-all cursor-pointer active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Usar datos de prueba por defecto (datos.csv)</span>
            </button>
          </div>

          {/* Footer del Modal */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mapeador inteligente de columnas activado</span>
            <button
              onClick={() => setUploadModalOpen(false)}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Modal Mapeador de Columnas */}
      <ColumnMapperModal
        isOpen={mapperState.isOpen}
        fileName={mapperState.fileName}
        csvContent={mapperState.csvContent}
        onConfirm={handleMapperConfirm}
        onCancel={() => setMapperState({ isOpen: false, fileName: '', csvContent: '' })}
      />
    </>
  );
}
