'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { KnowledgeMap } from '@/components/assessment/KnowledgeMap';
import { UserKnowledgeMap, KnowledgeArea } from '@/types/assessment';

// Mock function to fetch knowledge map data
const fetchKnowledgeMap = async (userId: string): Promise<{
  userKnowledgeMap: UserKnowledgeMap;
  knowledgeAreas: KnowledgeArea[];
}> => {
  // In a real app, this would be an API call
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock knowledge areas
  const knowledgeAreas: KnowledgeArea[] = [
    {
      id: 'area-1',
      name: 'JavaScript Fundamentals',
      description: 'Core concepts of JavaScript including variables, data types, functions, and control flow.',
      topics: ['javascript', 'programming-basics'],
    },
    {
      id: 'area-2',
      name: 'React Components',
      description: 'Understanding React components, props, state, and lifecycle methods.',
      topics: ['react', 'frontend'],
    },
    {
      id: 'area-3',
      name: 'Data Structures',
      description: 'Common data structures including arrays, linked lists, trees, and graphs.',
      topics: ['algorithms', 'computer-science'],
    },
    {
      id: 'area-4',
      name: 'Algorithms',
      description: 'Common algorithms including sorting, searching, and graph algorithms.',
      parentId: 'area-3',
      topics: ['algorithms', 'computer-science'],
    },
    {
      id: 'area-5',
      name: 'CSS and Styling',
      description: 'CSS fundamentals, layouts, responsive design, and modern styling techniques.',
      topics: ['css', 'frontend'],
    },
    {
      id: 'area-6',
      name: 'Backend Development',
      description: 'Server-side programming, APIs, databases, and authentication.',
      topics: ['backend', 'api'],
    },
  ];
  
  // Mock user knowledge map
  const userKnowledgeMap: UserKnowledgeMap = {
    userId,
    areas: [
      {
        areaId: 'area-1',
        proficiency: 85,
        confidence: 80,
        lastAssessed: new Date().toISOString(),
        needsReview: false,
      },
      {
        areaId: 'area-2',
        proficiency: 70,
        confidence: 65,
        lastAssessed: new Date().toISOString(),
        needsReview: false,
      },
      {
        areaId: 'area-3',
        proficiency: 40,
        confidence: 35,
        lastAssessed: new Date().toISOString(),
        needsReview: true,
      },
      {
        areaId: 'area-4',
        proficiency: 30,
        confidence: 25,
        lastAssessed: new Date().toISOString(),
        needsReview: true,
      },
      {
        areaId: 'area-5',
        proficiency: 60,
        confidence: 55,
        lastAssessed: new Date().toISOString(),
        needsReview: false,
      },
      {
        areaId: 'area-6',
        proficiency: 20,
        confidence: 15,
        lastAssessed: new Date().toISOString(),
        needsReview: true,
      },
    ],
  };
  
  return {
    userKnowledgeMap,
    knowledgeAreas,
  };
};

export default function KnowledgeMapPage() {
  // Mock user ID for demo purposes
  const userId = 'user-123';
  
  // Fetch knowledge map data
  const { data, isLoading } = useQuery({
    queryKey: ['knowledge-map', userId],
    queryFn: () => fetchKnowledgeMap(userId),
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading knowledge map...</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">Knowledge Map Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load your knowledge map. Please try again later.
        </p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Knowledge Map</span>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Knowledge Map</h1>
        <p className="text-muted-foreground">
          Track your proficiency across different knowledge areas and identify gaps in your understanding.
        </p>
      </div>
      
      <KnowledgeMap
        userKnowledgeMap={data.userKnowledgeMap}
        knowledgeAreas={data.knowledgeAreas}
        showGaps={true}
      />
    </div>
  );
}
