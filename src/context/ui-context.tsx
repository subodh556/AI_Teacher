'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type UIContextType = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  rightPanelCollapsed: boolean;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  bottomPanelCollapsed: boolean;
  setBottomPanelCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [bottomPanelCollapsed, setBottomPanelCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Auto-collapse panels on mobile
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
        setRightPanelCollapsed(true);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    rightPanelCollapsed,
    setRightPanelCollapsed,
    bottomPanelCollapsed,
    setBottomPanelCollapsed,
    isMobile,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
