// Topic Explorer Types
export interface TreeItem {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeItem[];
  path?: string;
  language?: string;
}

// Code Editor Types
export interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  theme?: "vs-dark" | "light";
  options?: Record<string, any>;
}

// Terminal Interface Types
export interface TerminalInterfaceProps {
  onCommand?: (command: string) => void;
  initialCommands?: string[];
  height?: string;
  className?: string;
}

export interface TerminalCommand {
  command: string;
  output: string[];
  timestamp: Date;
}

// Output Console Types
export interface OutputConsoleProps {
  output: string[];
  onClear?: () => void;
  height?: string;
  className?: string;
}

// Assessment Interface Types
export interface Question {
  id: string;
  type: "multiple-choice" | "coding" | "text";
  prompt: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  code?: string;
  language?: string;
}

export interface AssessmentInterfaceProps {
  questions: Question[];
  onSubmit?: (answers: Record<string, any>) => void;
  onComplete?: (score: number, total: number) => void;
  className?: string;
}

// Progress Dashboard Types
export interface ProgressData {
  date: string;
  count: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface ProgressDashboardProps {
  progressData: ProgressData[];
  achievements?: Achievement[];
  streakCount?: number;
  completedToday?: number;
  className?: string;
}
