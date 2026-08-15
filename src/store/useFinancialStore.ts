import { create } from 'zustand';
import { CsvSliceState, createCsvSlice } from './slices/csvSlice';
import { AnalysisSliceState, createAnalysisSlice } from './slices/analysisSlice';
import { UiSliceState, createUiSlice } from './slices/uiSlice';

export type FinancialStore = CsvSliceState & AnalysisSliceState & UiSliceState;

export const useFinancialStore = create<FinancialStore>()((...a) => ({
  ...createCsvSlice(...a),
  ...createAnalysisSlice(...a),
  ...createUiSlice(...a),
}));
