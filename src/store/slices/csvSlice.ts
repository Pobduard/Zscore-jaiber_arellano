import { StateCreator } from 'zustand';
import { RawAccount } from '@/types/account';
import { parseCsvString } from '@/lib/parser/csv-parser';

export interface CsvSliceState {
  fileName: string | null;
  rawCsvContent: string | null;
  rawAccounts: RawAccount[];
  parseErrors: string[];
  isLoaded: boolean;

  setCsvData: (fileName: string, content: string) => void;
  setRawAccounts: (fileName: string, rawCsvContent: string, accounts: RawAccount[]) => void;
  clearCsvData: () => void;
  loadDefaultData: () => Promise<void>;

  // Métodos CRUD para modificación interactiva de datos contables
  updateRawAccount: (id: number, updatedFields: Partial<RawAccount>) => void;
  addRawAccount: (newAccount: RawAccount) => void;
  deleteRawAccount: (id: number) => void;
}

export const createCsvSlice: StateCreator<CsvSliceState, [], [], CsvSliceState> = (set) => ({
  fileName: null,
  rawCsvContent: null,
  rawAccounts: [],
  parseErrors: [],
  isLoaded: false,

  setCsvData: (fileName: string, content: string) => {
    const { accounts, errors } = parseCsvString(content);
    set({
      fileName,
      rawCsvContent: content,
      rawAccounts: accounts,
      parseErrors: errors,
      isLoaded: accounts.length > 0,
    });
  },

  setRawAccounts: (fileName: string, rawCsvContent: string, accounts: RawAccount[]) => {
    set({
      fileName,
      rawCsvContent,
      rawAccounts: accounts,
      parseErrors: [],
      isLoaded: accounts.length > 0,
    });
  },

  clearCsvData: () => {
    set({
      fileName: null,
      rawCsvContent: null,
      rawAccounts: [],
      parseErrors: [],
      isLoaded: false,
    });
  },

  loadDefaultData: async () => {
    try {
      const response = await fetch('/data/datos.csv');
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo por defecto /data/datos.csv');
      }
      const text = await response.text();
      const { accounts, errors } = parseCsvString(text);

      set({
        fileName: 'datos.csv (Ejemplo por defecto)',
        rawCsvContent: text,
        rawAccounts: accounts,
        parseErrors: errors,
        isLoaded: accounts.length > 0,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al cargar datos por defecto';
      set({
        parseErrors: [msg],
        isLoaded: false,
      });
    }
  },

  updateRawAccount: (id: number, updatedFields: Partial<RawAccount>) => {
    set((state) => ({
      rawAccounts: state.rawAccounts.map((acc) =>
        acc.id_cuenta === id ? { ...acc, ...updatedFields } : acc
      ),
    }));
  },

  addRawAccount: (newAccount: RawAccount) => {
    set((state) => ({
      rawAccounts: [...state.rawAccounts, newAccount],
    }));
  },

  deleteRawAccount: (id: number) => {
    set((state) => ({
      rawAccounts: state.rawAccounts.filter((acc) => acc.id_cuenta !== id),
    }));
  },
});
