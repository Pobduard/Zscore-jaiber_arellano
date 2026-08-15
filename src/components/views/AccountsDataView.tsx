'use client';

import { useState } from 'react';
import { useFinancialStore } from '@/store/useFinancialStore';
import { RawAccount, TipoSaldo } from '@/types/account';
import { esCuentaTerreno } from '@/lib/engine/account-processor';
import {
  FileText,
  Plus,
  Trash2,
  RefreshCw,
  Edit3,
} from 'lucide-react';

const TIPOS_SALDO_OPCIONES: { value: TipoSaldo; label: string; grupo: string; }[] = [
  { value: 'Liquidez', label: 'Liquidez (Caja / Bancos)', grupo: 'Activo Corriente' },
  { value: 'Derecho_Cobro', label: 'Derecho de Cobro (Clientes / CxC)', grupo: 'Activo Corriente' },
  { value: 'Almacen', label: 'Almacén (Inventarios / Existencias)', grupo: 'Activo Corriente' },
  { value: 'Inversion', label: 'Inversión (Maquinaria / Terrenos / Activo Fijo)', grupo: 'Activo No Corriente' },
  { value: 'Deuda_Corto', label: 'Deuda Corto Plazo (Proveedores / Impuestos)', grupo: 'Pasivo Corriente' },
  { value: 'Deuda_Largo', label: 'Deuda Largo Plazo (Hipotecas / Prestamos)', grupo: 'Pasivo No Corriente' },
  { value: 'Propietarios', label: 'Propietarios (Capital Social / Utilidades)', grupo: 'Patrimonio' },
  { value: 'Ingreso', label: 'Ingreso (Ventas de Software / Productos)', grupo: 'Estado Resultados' },
  { value: 'Egreso', label: 'Egreso (Costo de Ventas / Gastos Generales)', grupo: 'Estado Resultados' },
];

export function AccountsDataView() {
  const {
    rawAccounts,
    updateRawAccount,
    addRawAccount,
    deleteRawAccount,
    loadDefaultData,
    analysisResult,
  } = useFinancialStore();

  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newTipo, setNewTipo] = useState<TipoSaldo>('Liquidez');
  const [newMonto, setNewMonto] = useState<number>(10000);
  const [newVidaUtil, setNewVidaUtil] = useState<number>(0);

  const handleDescriptionChange = (id: number, desc: string, tipoSaldo: TipoSaldo) => {
    const isTerreno = esCuentaTerreno(desc, tipoSaldo);
    if (isTerreno) {
      updateRawAccount(id, { descripcion_cuenta: desc, vida_util_anios: 0 });
    } else {
      updateRawAccount(id, { descripcion_cuenta: desc });
    }
  };

  const handleTipoSaldoChange = (id: number, newTipo: TipoSaldo, desc: string) => {
    const isTerreno = esCuentaTerreno(desc, newTipo);
    if (isTerreno) {
      updateRawAccount(id, { tipo_saldo: newTipo, vida_util_anios: 0 });
    } else {
      updateRawAccount(id, { tipo_saldo: newTipo });
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const isTerreno = esCuentaTerreno(newDesc, newTipo);
    const nextId = rawAccounts.length > 0 ? Math.max(...rawAccounts.map((a) => a.id_cuenta)) + 1 : 101;

    const newAcc: RawAccount = {
      id_cuenta: nextId,
      descripcion_cuenta: newDesc.trim(),
      tipo_saldo: newTipo,
      monto: Number(newMonto) || 0,
      vida_util_anios: isTerreno ? 0 : Number(newVidaUtil) || 0,
    };

    addRawAccount(newAcc);
    setNewDesc('');
    setNewMonto(10000);
    setNewVidaUtil(0);
    setIsAddingModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-360 mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Edit3 className="w-4 h-4" />
            <span>Gestor de Datos Contables en Tiempo Real</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Partidas Contables Actuales</h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Modifica cualquier cuenta, tipo de saldo, monto o vida útil. Solo las cuentas de tipo Inversión con &quot;Terreno&quot; en su descripción tienen vida útil 0 (no se deprecian).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Partida</span>
          </button>

          <button
            onClick={() => loadDefaultData()}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Restablecer datos originales del archivo datos.csv"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Restablecer datos.csv</span>
          </button>
        </div>
      </div>

      {/* Tabla Interactiva de Cuentas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono">Tabla Editable de Saldos</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-800 px-3 py-1 rounded-md text-emerald-400 border border-slate-700">
            {rawAccounts.length} Partidas Registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold font-mono text-slate-500 uppercase border-b border-slate-200">
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4">Descripción de Cuenta</th>
                <th className="py-3 px-4">Tipo de Saldo (Categoría)</th>
                <th className="py-3 px-4 text-right">Monto Bruto ($)</th>
                <th className="py-3 px-4 text-right">Vida Útil (Años)</th>
                <th className="py-3 px-4 text-right">Depreciación Anual</th>
                <th className="py-3 px-4 text-center w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono text-slate-800">
              {rawAccounts.map((acc) => {
                const processed = analysisResult?.cuentasProcesadas.find((c) => c.id_cuenta === acc.id_cuenta);
                const isTerreno = esCuentaTerreno(acc.descripcion_cuenta, acc.tipo_saldo);
                const currentVidaUtil = isTerreno ? 0 : (acc.vida_util_anios ?? 0);

                return (
                  <tr key={acc.id_cuenta} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-400">{acc.id_cuenta}</td>

                    {/* Descripción Editable */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={acc.descripcion_cuenta}
                        onChange={(e) => handleDescriptionChange(acc.id_cuenta, e.target.value, acc.tipo_saldo)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded px-2.5 py-1 text-xs text-slate-900 font-sans font-semibold transition-all outline-none"
                      />
                    </td>

                    {/* Selector de Tipo de Saldo */}
                    <td className="py-3 px-4">
                      <select
                        value={acc.tipo_saldo}
                        onChange={(e) => handleTipoSaldoChange(acc.id_cuenta, e.target.value as TipoSaldo, acc.descripcion_cuenta)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded px-2 py-1 text-xs font-sans font-medium text-slate-900 transition-all outline-none cursor-pointer"
                      >
                        {TIPOS_SALDO_OPCIONES.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Monto Bruto Editable */}
                    <td className="py-3 px-4 text-right">
                      <input
                        type="number"
                        value={acc.monto}
                        onChange={(e) => updateRawAccount(acc.id_cuenta, { monto: Number(e.target.value) || 0 })}
                        className="w-32 text-right bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 transition-all outline-none"
                      />
                    </td>

                    {/* Vida Útil (Habilitada para todas las cuentas excepto Terreno Inversión) */}
                    <td className="py-3 px-4 text-right">
                      {isTerreno ? (
                        <div className="bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-sans font-bold px-2 py-1 rounded inline-block">
                          0 (Terreno - No Depreciable)
                        </div>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={currentVidaUtil}
                          onChange={(e) =>
                            updateRawAccount(acc.id_cuenta, {
                              vida_util_anios: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-20 text-right bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 transition-all outline-none"
                        />
                      )}
                    </td>

                    {/* Depreciación Calculada */}
                    <td className="py-3 px-4 text-right font-bold text-rose-600 font-mono">
                      {processed && processed.depreciacion_anual > 0
                        ? `-$${processed.depreciacion_anual.toLocaleString()}`
                        : '$0'}
                    </td>

                    {/* Botón Eliminar */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteRawAccount(acc.id_cuenta)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Eliminar partida contable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {rawAccounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans italic text-sm">
                    No hay partidas contables cargadas. Haz clic en &quot;Agregar Partida&quot; o &quot;Restablecer datos.csv&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario Flotante para Agregar Nueva Cuenta */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>Agregar Nueva Partida Contable</span>
              </h3>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción de la Cuenta:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Equipos de Computación, Terreno Industrial"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Saldo (Categoría):</label>
                <select
                  value={newTipo}
                  onChange={(e) => setNewTipo(e.target.value as TipoSaldo)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-900 outline-none cursor-pointer"
                >
                  {TIPOS_SALDO_OPCIONES.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monto ($):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newMonto}
                    onChange={(e) => setNewMonto(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg p-2.5 text-xs font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vida Útil (Años):</label>
                  <input
                    type="number"
                    min={0}
                    disabled={esCuentaTerreno(newDesc, newTipo)}
                    placeholder={esCuentaTerreno(newDesc, newTipo) ? 'Terreno (0)' : 'Años'}
                    value={esCuentaTerreno(newDesc, newTipo) ? 0 : newVidaUtil}
                    onChange={(e) => setNewVidaUtil(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg p-2.5 text-xs font-mono text-slate-900 outline-none disabled:bg-amber-50 disabled:text-amber-900 disabled:font-bold disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Guardar Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
