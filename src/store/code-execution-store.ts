/**
 * Code Execution Store
 * 
 * This file contains the Zustand store for managing code execution state.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PistonExecuteResponse } from '@/lib/code-execution';
import { getStarterCode } from '@/lib/editor-utils';

interface CodeExecutionState {
  // Code and language
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  
  // Input and arguments
  input: string;
  setInput: (input: string) => void;
  args: string[];
  setArgs: (args: string[]) => void;
  
  // Execution state
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
  executionResult: PistonExecuteResponse | null;
  setExecutionResult: (result: PistonExecuteResponse | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // History
  executionHistory: Array<{
    language: string;
    code: string;
    input: string;
    args: string[];
    result: PistonExecuteResponse;
    timestamp: Date;
  }>;
  addToHistory: (entry: {
    language: string;
    code: string;
    input: string;
    args: string[];
    result: PistonExecuteResponse;
  }) => void;
  clearHistory: () => void;
  
  // Reset
  resetCode: () => void;
  resetState: () => void;
}

export const useCodeExecutionStore = create<CodeExecutionState>()(
  persist(
    (set, get) => ({
      // Code and language
      code: getStarterCode('javascript'),
      setCode: (code) => set({ code }),
      language: 'javascript',
      setLanguage: (language) => {
        // Update code with starter code for the new language if current code is empty
        // or if it's the starter code for the previous language
        const currentCode = get().code;
        const previousLanguage = get().language;
        const previousStarterCode = getStarterCode(previousLanguage);
        
        if (!currentCode || currentCode === previousStarterCode) {
          set({ 
            language, 
            code: getStarterCode(language) 
          });
        } else {
          set({ language });
        }
      },
      
      // Input and arguments
      input: '',
      setInput: (input) => set({ input }),
      args: [],
      setArgs: (args) => set({ args }),
      
      // Execution state
      isExecuting: false,
      setIsExecuting: (isExecuting) => set({ isExecuting }),
      executionResult: null,
      setExecutionResult: (executionResult) => set({ executionResult }),
      error: null,
      setError: (error) => set({ error }),
      
      // History
      executionHistory: [],
      addToHistory: (entry) => {
        const history = get().executionHistory;
        // Keep only the last 10 entries
        const newHistory = [
          ...history, 
          { ...entry, timestamp: new Date() }
        ].slice(-10);
        
        set({ executionHistory: newHistory });
      },
      clearHistory: () => set({ executionHistory: [] }),
      
      // Reset
      resetCode: () => {
        const language = get().language;
        set({ code: getStarterCode(language) });
      },
      resetState: () => set({
        code: getStarterCode('javascript'),
        language: 'javascript',
        input: '',
        args: [],
        isExecuting: false,
        executionResult: null,
        error: null
      })
    }),
    {
      name: 'code-execution-storage',
      // Only persist these fields
      partialize: (state) => ({
        language: state.language,
        code: state.code,
        input: state.input,
        executionHistory: state.executionHistory
      }),
    }
  )
);
