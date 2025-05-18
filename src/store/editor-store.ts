import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockCodeEditorValue } from '@/lib/mock-data';

interface EditorState {
  // Current code in the editor
  code: string;
  setCode: (code: string) => void;
  
  // Editor settings
  fontSize: number;
  setFontSize: (size: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  
  // History
  history: string[];
  addToHistory: (code: string) => void;
  clearHistory: () => void;
  
  // Reset to default
  resetToDefault: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Current code
      code: mockCodeEditorValue,
      setCode: (code) => set({ code }),
      
      // Editor settings
      fontSize: 14,
      setFontSize: (size) => set({ fontSize: size }),
      theme: 'vs-dark',
      setTheme: (theme) => set({ theme }),
      language: 'javascript',
      setLanguage: (language) => set({ language }),
      
      // History
      history: [],
      addToHistory: (code) => {
        const currentHistory = get().history;
        // Only add to history if different from the last entry
        if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== code) {
          // Keep only the last 10 entries
          const newHistory = [...currentHistory, code].slice(-10);
          set({ history: newHistory });
        }
      },
      clearHistory: () => set({ history: [] }),
      
      // Reset to default
      resetToDefault: () => set({
        code: mockCodeEditorValue,
        fontSize: 14,
        theme: 'vs-dark',
        language: 'javascript',
      }),
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        fontSize: state.fontSize,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
