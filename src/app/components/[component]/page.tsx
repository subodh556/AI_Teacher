'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeExecutionEnvironment } from '@/components/code-execution';
import { TerminalInterface, OutputConsole, TopicExplorer, AssessmentInterface, ProgressDashboard } from '@/components/core';
import { mockTopicExplorerData, mockOutputConsoleData, mockAssessmentQuestions, mockProgressData } from '@/lib/mock-data';

// Component metadata
const componentData = {
  'code-editor': {
    title: 'Code Editor',
    description: 'A powerful code editor with syntax highlighting and execution capabilities.',
    component: CodeExecutionEnvironment,
    props: { height: '400px' }
  },
  'terminal-interface': {
    title: 'Terminal Interface',
    description: 'Interactive terminal for executing commands and viewing output.',
    component: TerminalInterface,
    props: { height: '400px', onCommand: (cmd: string) => console.log('Command:', cmd) }
  },
  'output-console': {
    title: 'Output Console',
    description: 'Console for displaying program output and logs.',
    component: OutputConsole,
    props: { output: mockOutputConsoleData, height: '400px' }
  },
  'topic-explorer': {
    title: 'Topic Explorer',
    description: 'Tree-based navigation for exploring learning topics.',
    component: TopicExplorer,
    props: { items: mockTopicExplorerData, onSelect: (item: any) => console.log('Selected:', item) }
  },
  'assessment-interface': {
    title: 'Assessment Interface',
    description: 'Interface for taking assessments and quizzes.',
    component: AssessmentInterface,
    props: { questions: mockAssessmentQuestions, onSubmit: (answers: any) => console.log('Submitted:', answers) }
  },
  'progress-dashboard': {
    title: 'Progress Dashboard',
    description: 'Dashboard for tracking learning progress and achievements.',
    component: ProgressDashboard,
    props: { progressData: mockProgressData }
  },
  'language-selector': {
    title: 'Language Selector',
    description: 'Component for selecting programming languages for code execution.',
    component: CodeExecutionEnvironment,
    props: { height: '400px' }
  },
  'input-panel': {
    title: 'Input Panel',
    description: 'Panel for providing input to code execution.',
    component: CodeExecutionEnvironment,
    props: { height: '400px' }
  },
  'output-panel': {
    title: 'Output Panel',
    description: 'Panel for displaying code execution results.',
    component: CodeExecutionEnvironment,
    props: { height: '400px' }
  },
  'execution-environment': {
    title: 'Code Execution Environment',
    description: 'Complete environment for writing, running, and testing code in multiple languages.',
    component: CodeExecutionEnvironment,
    props: { height: '400px' }
  }
};

// Component that uses useSearchParams, wrapped in Suspense
function ComponentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('preview');
  const componentId = params.component as string;

  // Get component data or default to code editor
  const component = componentData[componentId] || componentData['code-editor'];

  // Dynamically render the component
  const ComponentToRender = component.component;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{component.title}</CardTitle>
          <CardDescription>{component.description}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ComponentToRender {...component.props} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
              <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                <code>{`import { ${component.title.replace(/\s/g, '')} } from '@/components/${componentId.includes('execution') ? 'code-execution' : 'core'}';

export default function MyComponent() {
  return (
    <${component.title.replace(/\s/g, '')}
      ${Object.entries(component.props)
        .map(([key, value]) => `${key}={${typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}}`)
        .join('\n      ')}
    />
  );
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Props</h3>
              <div className="border rounded-md divide-y">
                {Object.entries(component.props).map(([key, value]) => (
                  <div key={key} className="p-3 flex">
                    <div className="w-1/3 font-medium">{key}</div>
                    <div className="w-1/3 text-muted-foreground">{typeof value}</div>
                    <div className="w-1/3 text-muted-foreground">{typeof value === 'string' ? value : 'Object'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ComponentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading component...</p>
        </div>
      </div>
    }>
      <ComponentContent />
    </Suspense>
  );
}
