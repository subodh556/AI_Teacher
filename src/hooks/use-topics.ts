'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TreeItem } from '@/types/core-components';
import { mockTopicExplorerData } from '@/lib/mock-data';

// API functions for topics
const fetchTopics = async (): Promise<TreeItem[]> => {
  // In a real app, this would be an API call
  // For now, we'll use mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTopicExplorerData);
    }, 500);
  });
};

const fetchTopic = async (id: string): Promise<TreeItem | null> => {
  // In a real app, this would be an API call
  // For now, we'll search the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const findTopic = (items: TreeItem[]): TreeItem | null => {
        for (const item of items) {
          if (item.id === id) {
            return item;
          }
          if (item.children) {
            const found = findTopic(item.children);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };
      
      resolve(findTopic(mockTopicExplorerData));
    }, 300);
  });
};

// React Query hooks
export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ['topic', id],
    queryFn: () => fetchTopic(id),
    enabled: !!id, // Only run if id is provided
  });
}

// Mutation for updating a topic (placeholder for future implementation)
export function useUpdateTopic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TreeItem> }) => {
      // In a real app, this would be an API call
      console.log('Updating topic', id, data);
      return { id, ...data };
    },
    onSuccess: () => {
      // Invalidate topics queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
}
