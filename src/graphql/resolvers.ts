/**
 * GraphQL Resolvers
 * 
 * This file defines the GraphQL resolvers for the application.
 */

import { prisma } from '@/lib/prisma';
import { generateSimulatedExplanation } from '@/lib/ai-utils';

export const resolvers = {
  Query: {
    // User queries
    user: async (_: any, { id }: { id: string }) => {
      return prisma.user.findUnique({
        where: { id }
      });
    },
    users: async () => {
      return prisma.user.findMany();
    },
    
    // Topic queries
    topic: async (_: any, { id }: { id: string }) => {
      return prisma.topic.findUnique({
        where: { id }
      });
    },
    topics: async (_: any, { parentId }: { parentId?: string }) => {
      return prisma.topic.findMany({
        where: parentId ? { parent_id: parentId } : undefined,
        include: {
          children: true
        }
      });
    },
    
    // Content queries
    content: async (_: any, { id }: { id: string }) => {
      return prisma.content.findUnique({
        where: { id }
      });
    },
    contentByTopic: async (_: any, { topicId }: { topicId: string }) => {
      return prisma.content.findMany({
        where: { topic_id: topicId },
        orderBy: { difficulty_level: 'asc' }
      });
    },
    
    // Assessment queries
    assessment: async (_: any, { id }: { id: string }) => {
      return prisma.assessment.findUnique({
        where: { id },
        include: {
          questions: true
        }
      });
    },
    assessmentsByTopic: async (_: any, { topicId }: { topicId: string }) => {
      return prisma.assessment.findMany({
        where: { topic_id: topicId }
      });
    },
    
    // Question queries
    question: async (_: any, { id }: { id: string }) => {
      return prisma.question.findUnique({
        where: { id }
      });
    },
    questionsByAssessment: async (_: any, { assessmentId }: { assessmentId: string }) => {
      return prisma.question.findMany({
        where: { assessment_id: assessmentId },
        orderBy: { difficulty_level: 'asc' }
      });
    },
    
    // Progress queries
    userProgress: async (_: any, { userId }: { userId: string }) => {
      return prisma.userProgress.findMany({
        where: { user_id: userId },
        include: {
          topic: true
        }
      });
    },
    progressSummary: async (_: any, { userId }: { userId: string }) => {
      // Get user progress
      const progress = await prisma.userProgress.findMany({
        where: { user_id: userId }
      });
      
      // Get assessment results
      const assessments = await prisma.userAssessment.findMany({
        where: { user_id: userId },
        orderBy: { completed_at: 'desc' },
        take: 5,
        include: {
          assessment: true
        }
      });
      
      // Get achievements
      const achievements = await prisma.userAchievement.findMany({
        where: { user_id: userId },
        include: {
          achievement: true
        }
      });
      
      // Calculate summary statistics
      const completedTopics = progress.filter(p => p.completed).length;
      const totalTopics = await prisma.topic.count();
      const averageProficiency = progress.length > 0
        ? progress.reduce((sum, p) => sum + p.proficiency_level, 0) / progress.length
        : 0;
      const recentAssessmentScore = assessments.length > 0 ? assessments[0].score : null;
      
      return {
        completedTopics,
        totalTopics,
        progressPercentage: totalTopics > 0 
          ? Math.round((completedTopics / totalTopics) * 100) 
          : 0,
        averageProficiency,
        recentAssessments: assessments,
        recentAssessmentScore,
        achievementCount: achievements.length,
        recentAchievements: achievements
          .sort((a, b) => new Date(b.earned_at || 0).getTime() - new Date(a.earned_at || 0).getTime())
          .slice(0, 3)
          .map(a => a.achievement)
      };
    },
    
    // Assessment result queries
    userAssessments: async (_: any, { userId }: { userId: string }) => {
      return prisma.userAssessment.findMany({
        where: { user_id: userId },
        include: {
          assessment: true
        },
        orderBy: { completed_at: 'desc' }
      });
    },
    
    // Achievement queries
    achievements: async () => {
      return prisma.achievement.findMany();
    },
    userAchievements: async (_: any, { userId }: { userId: string }) => {
      return prisma.userAchievement.findMany({
        where: { user_id: userId },
        include: {
          achievement: true
        }
      });
    },
    
    // Study plan queries
    studyPlans: async (_: any, { userId }: { userId: string }) => {
      return prisma.studyPlan.findMany({
        where: { user_id: userId },
        orderBy: { updated_at: 'desc' }
      });
    },
    
    // AI queries
    recommendations: async (_: any, { userId, topicId }: { userId: string, topicId?: string }) => {
      // This is a simplified version of the recommendations logic
      // In a real implementation, this would be more sophisticated
      
      // Get user progress data
      const userProgress = await prisma.userProgress.findMany({
        where: { user_id: userId },
        include: {
          topic: true
        }
      });
      
      // Get all topics or a specific topic
      const topics = await prisma.topic.findMany({
        where: topicId ? { id: topicId } : undefined,
        include: {
          content: {
            select: {
              id: true,
              title: true,
              content_type: true,
              difficulty_level: true
            }
          },
          assessments: {
            select: {
              id: true,
              title: true,
              adaptive: true
            }
          }
        }
      });
      
      // Generate recommendations
      const recommendations = topics.map(topic => {
        const progress = userProgress.find(p => p.topic_id === topic.id);
        const proficiencyLevel = progress?.proficiency_level || 0;
        
        return {
          topic: {
            id: topic.id,
            name: topic.name,
            description: topic.description,
            difficulty_level: topic.difficulty_level
          },
          content: topic.content.slice(0, 3),
          assessments: topic.assessments.slice(0, 2),
          currentProficiency: proficiencyLevel
        };
      });
      
      return {
        recommendations,
        timestamp: new Date()
      };
    }
  },
  
  // Type resolvers
  User: {
    progress: (parent: any) => {
      return prisma.userProgress.findMany({
        where: { user_id: parent.id }
      });
    },
    assessments: (parent: any) => {
      return prisma.userAssessment.findMany({
        where: { user_id: parent.id }
      });
    },
    achievements: (parent: any) => {
      return prisma.userAchievement.findMany({
        where: { user_id: parent.id }
      });
    },
    studyPlans: (parent: any) => {
      return prisma.studyPlan.findMany({
        where: { user_id: parent.id }
      });
    }
  },
  
  Topic: {
    parent: (parent: any) => {
      return parent.parent_id
        ? prisma.topic.findUnique({
            where: { id: parent.parent_id }
          })
        : null;
    },
    children: (parent: any) => {
      return prisma.topic.findMany({
        where: { parent_id: parent.id }
      });
    },
    content: (parent: any) => {
      return prisma.content.findMany({
        where: { topic_id: parent.id }
      });
    },
    assessments: (parent: any) => {
      return prisma.assessment.findMany({
        where: { topic_id: parent.id }
      });
    },
    userProgress: (parent: any) => {
      return prisma.userProgress.findMany({
        where: { topic_id: parent.id }
      });
    }
  }
};
