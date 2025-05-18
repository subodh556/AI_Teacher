'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProgressData, Achievement } from '@/types/core-components';
import { mockProgressData, mockAchievements } from '@/lib/mock-data';
import { useProgressStore } from '@/store/progress-store';

// API functions for progress
const fetchUserProgress = async (): Promise<ProgressData> => {
  // In a real app, this would be an API call
  // For now, we'll use mock data and local storage
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get progress from store or use mock data
      const storedProgress = useProgressStore.getState().progressData;
      resolve(storedProgress || mockProgressData);
    }, 500);
  });
};

const fetchUserAchievements = async (): Promise<Achievement[]> => {
  // In a real app, this would be an API call
  // For now, we'll use mock data and local storage
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get achievements from store or use mock data
      const storedAchievements = useProgressStore.getState().achievements;
      resolve(storedAchievements || mockAchievements);
    }, 300);
  });
};

const updateUserProgress = async (data: Partial<ProgressData>): Promise<ProgressData> => {
  // In a real app, this would be an API call
  // For now, we'll update local storage
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update progress in store
      const progressStore = useProgressStore.getState();
      progressStore.updateProgressData(data);
      
      // Return updated progress
      resolve(progressStore.progressData);
    }, 300);
  });
};

// React Query hooks
export function useUserProgress() {
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: fetchUserProgress,
  });
}

export function useUserAchievements() {
  return useQuery({
    queryKey: ['user-achievements'],
    queryFn: fetchUserAchievements,
  });
}

export function useUpdateUserProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserProgress,
    onSuccess: (data) => {
      // Update progress cache with result
      queryClient.setQueryData(['user-progress'], data);
    },
  });
}

// Hook to update streak
export function useUpdateStreak() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const progressStore = useProgressStore.getState();
      progressStore.updateLastActiveDate();
      return progressStore.currentStreak;
    },
    onSuccess: (streak) => {
      // Update streak in cache
      queryClient.setQueryData(['user-streak'], streak);
      
      // Invalidate progress to refetch
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
}
