import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProgressData, mockAchievements } from '@/lib/mock-data';
import { ProgressData, Achievement } from '@/types/core-components';

interface ProgressState {
  // User progress data
  progressData: ProgressData;
  updateProgressData: (data: Partial<ProgressData>) => void;
  
  // Achievements
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;
  
  // Learning streak
  currentStreak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  lastActiveDate: string | null;
  updateLastActiveDate: () => void;
  
  // Topic completion
  completedTopics: string[];
  markTopicCompleted: (topicId: string) => void;
  
  // Reset progress (for testing)
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      // User progress data
      progressData: mockProgressData,
      updateProgressData: (data) => 
        set((state) => ({ 
          progressData: { ...state.progressData, ...data } 
        })),
      
      // Achievements
      achievements: mockAchievements.map(achievement => ({
        ...achievement,
        unlocked: false,
        unlockedAt: null,
      })),
      unlockAchievement: (achievementId) => 
        set((state) => ({
          achievements: state.achievements.map(achievement => 
            achievement.id === achievementId
              ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
              : achievement
          )
        })),
      
      // Learning streak
      currentStreak: 0,
      incrementStreak: () => set((state) => ({ currentStreak: state.currentStreak + 1 })),
      resetStreak: () => set({ currentStreak: 0 }),
      lastActiveDate: null,
      updateLastActiveDate: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          // If last active date is not today, increment streak
          if (state.lastActiveDate !== today) {
            // Check if streak should continue or reset
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (state.lastActiveDate === yesterdayStr) {
              // Continue streak
              return { 
                lastActiveDate: today,
                currentStreak: state.currentStreak + 1
              };
            } else {
              // Reset streak
              return { 
                lastActiveDate: today,
                currentStreak: 1
              };
            }
          }
          return { lastActiveDate: today };
        });
      },
      
      // Topic completion
      completedTopics: [],
      markTopicCompleted: (topicId) => 
        set((state) => ({
          completedTopics: state.completedTopics.includes(topicId)
            ? state.completedTopics
            : [...state.completedTopics, topicId]
        })),
      
      // Reset progress (for testing)
      resetProgress: () => set({
        progressData: mockProgressData,
        achievements: mockAchievements.map(achievement => ({
          ...achievement,
          unlocked: false,
          unlockedAt: null,
        })),
        currentStreak: 0,
        lastActiveDate: null,
        completedTopics: [],
      }),
    }),
    {
      name: 'progress-storage',
    }
  )
);
