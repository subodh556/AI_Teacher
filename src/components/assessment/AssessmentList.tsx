'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  BookOpen, 
  Clock, 
  BarChart, 
  ChevronRight,
  Star,
  StarHalf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export interface AssessmentListItem {
  id: string;
  title: string;
  description: string;
  topicId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  questionCount: number;
  adaptive: boolean;
  tags: string[];
  completedByUser?: boolean;
  userScore?: number;
}

interface AssessmentListProps {
  assessments: AssessmentListItem[];
  className?: string;
}

export function AssessmentList({ assessments, className }: AssessmentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'timeEstimate'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'incomplete' | 'adaptive'>('all');
  
  // Filter and sort assessments
  const filteredAssessments = assessments
    .filter(assessment => {
      // Apply search filter
      if (searchQuery && !assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !assessment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Apply category filter
      if (filterBy === 'completed' && !assessment.completedByUser) return false;
      if (filterBy === 'incomplete' && assessment.completedByUser) return false;
      if (filterBy === 'adaptive' && !assessment.adaptive) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'difficulty') {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return sortOrder === 'asc' 
          ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      } else {
        return sortOrder === 'asc' 
          ? a.timeEstimate - b.timeEstimate
          : b.timeEstimate - a.timeEstimate;
      }
    });
  
  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                {filterBy === 'all' ? 'All Assessments' : 
                 filterBy === 'completed' ? 'Completed' : 
                 filterBy === 'incomplete' ? 'Incomplete' : 'Adaptive'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBy('all')}>
                All Assessments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('incomplete')}>
                Incomplete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('adaptive')}>
                Adaptive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => {
                  setSortBy('title');
                  setSortOrder('asc');
                }}
              >
                Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSortBy('title');
                  setSortOrder('desc');
                }}
              >
                Title (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSortBy('difficulty');
                  setSortOrder('asc');
                }}
              >
                Difficulty (Easy to Hard)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSortBy('difficulty');
                  setSortOrder('desc');
                }}
              >
                Difficulty (Hard to Easy)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSortBy('timeEstimate');
                  setSortOrder('asc');
                }}
              >
                Time (Shortest to Longest)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSortBy('timeEstimate');
                  setSortOrder('desc');
                }}
              >
                Time (Longest to Shortest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Assessment cards */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssessments.map(assessment => (
            <Card key={assessment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  {assessment.completedByUser && (
                    <div className="flex items-center text-xs text-green-500">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {assessment.userScore}%
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2">{assessment.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className={cn("text-xs", getDifficultyColor(assessment.difficulty))}>
                    {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)}
                  </Badge>
                  
                  {assessment.adaptive && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 text-xs">
                      Adaptive
                    </Badge>
                  )}
                  
                  {assessment.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  
                  {assessment.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{assessment.tags.length - 2} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {assessment.timeEstimate} min
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {assessment.questionCount} questions
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button asChild className="w-full">
                  <Link href={`/assessment/${assessment.id}`}>
                    {assessment.completedByUser ? 'Retake Assessment' : 'Start Assessment'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No assessments found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
