import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Layout
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  rightPanelWidth: number;
  setRightPanelWidth: (width: number) => void;
  bottomPanelHeight: number;
  setBottomPanelHeight: (height: number) => void;
  
  // Panel visibility (persisted)
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
  rightPanelVisible: boolean;
  toggleRightPanel: () => void;
  setRightPanelVisible: (visible: boolean) => void;
  bottomPanelVisible: boolean;
  toggleBottomPanel: () => void;
  setBottomPanelVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Layout
      sidebarWidth: 250,
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
      rightPanelWidth: 300,
      setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
      bottomPanelHeight: 200,
      setBottomPanelHeight: (height) => set({ bottomPanelHeight: height }),
      
      // Panel visibility
      sidebarVisible: true,
      toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
      setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
      rightPanelVisible: true,
      toggleRightPanel: () => set((state) => ({ rightPanelVisible: !state.rightPanelVisible })),
      setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
      bottomPanelVisible: true,
      toggleBottomPanel: () => set((state) => ({ bottomPanelVisible: !state.bottomPanelVisible })),
      setBottomPanelVisible: (visible) => set({ bottomPanelVisible: visible }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        sidebarVisible: state.sidebarVisible,
        rightPanelVisible: state.rightPanelVisible,
        bottomPanelVisible: state.bottomPanelVisible,
        theme: state.theme,
      }),
    }
  )
);
