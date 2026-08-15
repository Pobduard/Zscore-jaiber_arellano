import { StateCreator } from 'zustand';

export type TabNavegacion = 'dashboard' | 'cuentas' | 'balance' | 'ratios' | 'prediccion';

export interface UiSliceState {
  activeTab: TabNavegacion;
  isSidebarCollapsed: boolean;
  isUploadModalOpen: boolean;

  setActiveTab: (tab: TabNavegacion) => void;
  toggleSidebar: () => void;
  setUploadModalOpen: (open: boolean) => void;
}

export const createUiSlice: StateCreator<UiSliceState, [], [], UiSliceState> = (set) => ({
  activeTab: 'dashboard',
  isSidebarCollapsed: false,
  isUploadModalOpen: false,

  setActiveTab: (tab: TabNavegacion) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setUploadModalOpen: (open: boolean) => set({ isUploadModalOpen: open }),
});
