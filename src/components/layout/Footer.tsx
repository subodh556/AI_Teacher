"use client";

import { Activity, Calendar, CheckCircle2 } from "lucide-react";

export function Footer() {
  // Mock data for the footer
  const currentStreak = 3;
  const completedToday = 2;
  const systemStatus = "Online";

  return (
    <footer className="h-8 border-t border-border bg-card flex items-center justify-between px-4 text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-blue-500" />
          <span>{`Streak: ${currentStreak} days`}</span>
        </div>
        
        <div className="flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
          <span>{`Completed today: ${completedToday}`}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Activity className="h-3 w-3 mr-1 text-green-500" />
          <span>{`System: ${systemStatus}`}</span>
        </div>
        
        <div className="text-muted-foreground">
          <span>AI Teacher v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
