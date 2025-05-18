"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { RightPanel } from "./RightPanel";
import { BottomPanel } from "./BottomPanel";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useUI } from "@/context/ui-context";
import { useUIStore } from "@/store/ui-store";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { setTheme } = useTheme();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    rightPanelCollapsed,
    setRightPanelCollapsed,
    bottomPanelCollapsed,
    setBottomPanelCollapsed
  } = useUI();

  // Get persisted UI state from Zustand
  const {
    sidebarVisible,
    setSidebarVisible,
    rightPanelVisible,
    setRightPanelVisible,
    bottomPanelVisible,
    setBottomPanelVisible,
    theme: storedTheme
  } = useUIStore();

  // Set theme from stored preference
  useEffect(() => {
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("dark");
    }
  }, [setTheme, storedTheme]);

  // Sync context state with Zustand store
  useEffect(() => {
    setSidebarCollapsed(!sidebarVisible);
    setRightPanelCollapsed(!rightPanelVisible);
    setBottomPanelCollapsed(!bottomPanelVisible);
  }, [
    sidebarVisible,
    rightPanelVisible,
    bottomPanelVisible,
    setSidebarCollapsed,
    setRightPanelCollapsed,
    setBottomPanelCollapsed
  ]);

  // Update Zustand store when context state changes
  useEffect(() => {
    setSidebarVisible(!sidebarCollapsed);
    setRightPanelVisible(!rightPanelCollapsed);
    setBottomPanelVisible(!bottomPanelCollapsed);
  }, [
    sidebarCollapsed,
    rightPanelCollapsed,
    bottomPanelCollapsed,
    setSidebarVisible,
    setRightPanelVisible,
    setBottomPanelVisible
  ]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <MainContent>{children}</MainContent>
            
          </div>
          <BottomPanel collapsed={bottomPanelCollapsed} setCollapsed={setBottomPanelCollapsed} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
