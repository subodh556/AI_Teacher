'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Zap, MessageSquare, BookOpen, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the folder structure types
export interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  icon?: React.ReactNode;
  children: (FolderItem | FileItem)[];
  expanded?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file';
  icon?: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

interface FolderStructureProps {
  items: (FolderItem | FileItem)[];
  className?: string;
  level?: number;
}

export function FolderStructure({ items, className, level = 0 }: FolderStructureProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // Toggle folder expanded state
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Check if a folder is expanded
  const isFolderExpanded = (folderId: string, defaultExpanded = false) => {
    return folderId in expandedFolders ? expandedFolders[folderId] : defaultExpanded;
  };

  // Render a folder item
  const renderFolder = (folder: FolderItem, level: number) => {
    const isExpanded = isFolderExpanded(folder.id, folder.expanded);
    const paddingLeft = level * 12 + 8;

    return (
      <div key={folder.id} className="select-none">
        <div
          className="flex items-center py-1 px-2 hover:bg-secondary/50 cursor-pointer rounded-md transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => toggleFolder(folder.id)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
          )}
          {folder.icon || <Folder className="h-4 w-4 mr-2 shrink-0 text-blue-500" />}
          <span className="text-sm truncate">{folder.name}</span>
        </div>

        {isExpanded && folder.children.length > 0 && (
          <div className="ml-2">
            {folder.children.map(item =>
              item.type === 'folder'
                ? renderFolder(item as FolderItem, level + 1)
                : renderFile(item as FileItem, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render a file item
  const renderFile = (file: FileItem, level: number) => {
    const paddingLeft = level * 12 + 8;
    const isActive = file.path && pathname === file.path;

    return (
      <div
        key={file.id}
        className={cn(
          "flex items-center py-1 px-2 hover:bg-secondary/50 cursor-pointer rounded-md transition-colors",
          isActive && "bg-secondary"
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={file.onClick}
      >
        {file.path ? (
          <Link href={file.path} className="flex items-center w-full">
            {file.icon || <File className="h-4 w-4 mr-2 shrink-0 text-gray-400" />}
            <span className="text-sm truncate">{file.name}</span>
          </Link>
        ) : (
          <>
            {file.icon || <File className="h-4 w-4 mr-2 shrink-0 text-gray-400" />}
            <span className="text-sm truncate">{file.name}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map(item =>
        item.type === 'folder'
          ? renderFolder(item as FolderItem, level)
          : renderFile(item as FileItem, level)
      )}
    </div>
  );
}

// Helper function to create the component structure
export function createComponentStructure() {
  return [
    {
      id: 'ai-tools',
      name: 'AI Tools',
      type: 'folder' as const,
      icon: <Zap className="h-4 w-4 mr-2 shrink-0 text-blue-500" />,
      expanded: true,
      children: [
        {
          id: 'study-plan',
          name: 'Study Plan Generator',
          type: 'file' as const,
          icon: <BookOpen className="h-4 w-4 mr-2 shrink-0 text-purple-500" />,
          onClick: () => {}, // Will be replaced in Sidebar component
        },
        {
          id: 'contextual-explanation',
          name: 'Ask AI',
          type: 'file' as const,
          icon: <MessageSquare className="h-4 w-4 mr-2 shrink-0 text-blue-500" />,
          onClick: () => {}, // Will be replaced in Sidebar component
        },
        {
          id: 'quiz-generator',
          name: 'Quiz Generator',
          type: 'file' as const,
          icon: <ListChecks className="h-4 w-4 mr-2 shrink-0 text-green-500" />,
          onClick: () => {}, // Will be replaced in Sidebar component
        }
      ]
    }
  ];
}
