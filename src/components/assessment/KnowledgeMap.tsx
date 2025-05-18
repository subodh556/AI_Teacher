'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, AlertTriangle, CheckCircle, 
  ChevronRight, Search, Filter, ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserKnowledgeMap, KnowledgeArea } from '@/types/assessment';

interface KnowledgeMapProps {
  userKnowledgeMap: UserKnowledgeMap;
  knowledgeAreas: KnowledgeArea[];
  showGaps?: boolean;
  className?: string;
}

export function KnowledgeMap({
  userKnowledgeMap,
  knowledgeAreas,
  showGaps = true,
  className,
}: KnowledgeMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'proficiency'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<'all' | 'gaps' | 'mastered'>('all');
  
  // Get knowledge area details by ID
  const getKnowledgeArea = (areaId: string): KnowledgeArea | undefined => {
    return knowledgeAreas.find(area => area.id === areaId);
  };
  
  // Get user's proficiency for a knowledge area
  const getProficiency = (areaId: string): number => {
    const area = userKnowledgeMap.areas.find(a => a.areaId === areaId);
    return area?.proficiency || 0;
  };
  
  // Check if a knowledge area needs review
  const needsReview = (areaId: string): boolean => {
    const area = userKnowledgeMap.areas.find(a => a.areaId === areaId);
    return area?.needsReview || false;
  };
  
  // Filter and sort knowledge areas
  const filteredAreas = knowledgeAreas
    .filter(area => {
      // Apply search filter
      if (searchQuery && !area.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply category filter
      const proficiency = getProficiency(area.id);
      if (filterBy === 'gaps' && proficiency >= 70) return false;
      if (filterBy === 'mastered' && proficiency < 70) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const profA = getProficiency(a.id);
        const profB = getProficiency(b.id);
        return sortOrder === 'asc' 
          ? profA - profB
          : profB - profA;
      }
    });
  
  // Get proficiency level label
  const getProficiencyLabel = (proficiency: number): string => {
    if (proficiency >= 90) return 'Mastered';
    if (proficiency >= 70) return 'Proficient';
    if (proficiency >= 40) return 'Developing';
    return 'Beginner';
  };
  
  // Get proficiency level color
  const getProficiencyColor = (proficiency: number): string => {
    if (proficiency >= 90) return 'bg-green-500';
    if (proficiency >= 70) return 'bg-blue-500';
    if (proficiency >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Map</CardTitle>
          <CardDescription>
            Track your proficiency across different knowledge areas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge areas..."
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
                    {filterBy === 'all' ? 'All Areas' : 
                     filterBy === 'gaps' ? 'Knowledge Gaps' : 'Mastered'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterBy('all')}>
                    All Areas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('gaps')}>
                    Knowledge Gaps
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('mastered')}>
                    Mastered Areas
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
                      setSortBy('name');
                      setSortOrder('asc');
                    }}
                  >
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSortBy('name');
                      setSortOrder('desc');
                    }}
                  >
                    Name (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSortBy('proficiency');
                      setSortOrder('asc');
                    }}
                  >
                    Proficiency (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSortBy('proficiency');
                      setSortOrder('desc');
                    }}
                  >
                    Proficiency (High to Low)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Knowledge areas grid */}
          {filteredAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAreas.map(area => {
                const proficiency = getProficiency(area.id);
                const review = needsReview(area.id);
                
                return (
                  <Card key={area.id} className={cn(
                    "overflow-hidden",
                    review && "border-yellow-500"
                  )}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base flex justify-between items-center">
                        <span>{area.name}</span>
                        {review && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2 pb-3">
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {area.description}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span>Proficiency</span>
                            <span className="font-medium">{proficiency}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", getProficiencyColor(proficiency))}
                              style={{ width: `${proficiency}%` }}
                            />
                          </div>
                          <div className="text-xs text-right">
                            {getProficiencyLabel(proficiency)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-2 bg-secondary/30 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Last assessed: {
                          userKnowledgeMap.areas.find(a => a.areaId === area.id)?.lastAssessed
                            ? new Date(userKnowledgeMap.areas.find(a => a.areaId === area.id)!.lastAssessed).toLocaleDateString()
                            : 'Never'
                        }
                      </div>
                      
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/learn/${area.id}`}>
                          <span className="text-xs">Study</span>
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No knowledge areas found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
        
        {showGaps && (
          <CardFooter className="flex-col space-y-4">
            <div className="w-full h-px bg-border" />
            
            <div className="w-full">
              <h3 className="text-sm font-medium mb-3">Knowledge Gaps</h3>
              
              {userKnowledgeMap.areas.filter(a => a.needsReview).length > 0 ? (
                <div className="space-y-2">
                  {userKnowledgeMap.areas
                    .filter(a => a.needsReview)
                    .map(area => {
                      const knowledgeArea = getKnowledgeArea(area.areaId);
                      
                      return (
                        <div 
                          key={area.areaId}
                          className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"
                        >
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {knowledgeArea?.name || area.areaId}
                            </span>
                          </div>
                          
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/learn/${area.areaId}`}>
                              <BookOpen className="h-3 w-3 mr-1" />
                              <span className="text-xs">Review</span>
                            </Link>
                          </Button>
                        </div>
                      );
                    })
                  }
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-secondary/30 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">No knowledge gaps detected</span>
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
