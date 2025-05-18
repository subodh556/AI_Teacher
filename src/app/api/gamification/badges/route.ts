/**
 * Badges API Endpoints
 *
 * This file contains the API endpoints for the badge system.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleApiError,
  validateRequest,
  extractQueryParams,
  parseRequestBody
} from '@/lib/api-utils';
import { achievementCreateSchema, userAchievementCreateSchema } from '@/lib/validation';

/**
 * GET /api/gamification/badges
 * Returns all badges or badges for a specific user
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request);
    const { user_id } = params;

    try {
      if (user_id) {
        try {
          // Get badges for a specific user
          const userAchievements = await prisma.userAchievement.findMany({
            where: { user_id: user_id as string },
            include: {
              achievement: true
            },
            orderBy: { earned_at: 'desc' }
          });

          // Get all achievements to include unearned ones
          const allAchievements = await prisma.achievement.findMany();

          // Map achievements to badges format
          const badges = allAchievements.map(achievement => {
            const userAchievement = userAchievements.find(
              ua => ua.achievement_id === achievement.id
            );

            return {
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              iconName: (achievement.criteria as any).iconName || 'award',
              category: (achievement.criteria as any).category || 'achievement',
              tier: (achievement.criteria as any).tier || 'bronze',
              criteria: achievement.criteria,
              earnedAt: userAchievement ? userAchievement.earned_at.toISOString() : undefined
            };
          });

          return NextResponse.json(badges);
        } catch (error) {
          console.error('Database error fetching user badges:', error);
          // Return default badges if there's a database error
          return NextResponse.json(getDefaultBadges());
        }
      } else {
        try {
          // Get all badges (achievements)
          const achievements = await prisma.achievement.findMany();

          // Map achievements to badges format
          const badges = achievements.map(achievement => ({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            iconName: (achievement.criteria as any).iconName || 'award',
            category: (achievement.criteria as any).category || 'achievement',
            tier: (achievement.criteria as any).tier || 'bronze',
            criteria: achievement.criteria
          }));

          return NextResponse.json(badges);
        } catch (error) {
          console.error('Database error fetching all badges:', error);
          // Return default badges if there's a database error
          return NextResponse.json(getDefaultBadges());
        }
      }
    } catch (error) {
      console.error('Error in badges logic:', error);
      // Return default badges on any error
      return NextResponse.json(getDefaultBadges());
    }
  } catch (error) {
    console.error('API error fetching badges:', error);
    // Return default badges on any error
    return NextResponse.json(getDefaultBadges());
  }
}

/**
 * Get default badges for when the database is not available
 */
function getDefaultBadges() {
  return [
    {
      id: 'default-1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      iconName: 'award',
      category: 'learning',
      tier: 'bronze',
      criteria: { type: 'lesson_completion', threshold: 1 }
    },
    {
      id: 'default-2',
      name: 'Code Ninja',
      description: 'Complete 10 coding exercises',
      iconName: 'code',
      category: 'coding',
      tier: 'silver',
      criteria: { type: 'coding_exercises', threshold: 10 }
    },
    {
      id: 'default-3',
      name: 'Perfect Score',
      description: 'Get 100% on an assessment',
      iconName: 'check-circle',
      category: 'assessment',
      tier: 'gold',
      criteria: { type: 'assessment_score', threshold: 100 }
    },
    {
      id: 'default-4',
      name: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      iconName: 'calendar',
      category: 'streak',
      tier: 'silver',
      criteria: { type: 'streak_days', threshold: 7 }
    }
  ];
}

/**
 * POST /api/gamification/badges
 * Creates a new badge (achievement)
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    // Extract badge-specific fields
    const { iconName, category, tier, ...achievementData } = body;

    // Prepare achievement data with badge info in criteria
    const achievementWithBadgeInfo = {
      ...achievementData,
      criteria: {
        ...achievementData.criteria,
        iconName,
        category,
        tier
      }
    };

    const validatedData = await validateRequest(achievementWithBadgeInfo, achievementCreateSchema);

    const achievement = await prisma.achievement.create({
      data: validatedData
    });

    return NextResponse.json({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      iconName: (achievement.criteria as any).iconName || 'award',
      category: (achievement.criteria as any).category || 'achievement',
      tier: (achievement.criteria as any).tier || 'bronze',
      criteria: achievement.criteria
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create badge');
  }
}

/**
 * POST /api/gamification/badges/award
 * Awards a badge to a user
 */
export async function award(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { user_id, badge_id } = body;

    if (!user_id || !badge_id) {
      return NextResponse.json(
        { error: 'User ID and badge ID are required' },
        { status: 400 }
      );
    }

    // Check if the user already has this badge
    const existingBadge = await prisma.userAchievement.findFirst({
      where: {
        user_id,
        achievement_id: badge_id
      }
    });

    if (existingBadge) {
      return NextResponse.json(
        { error: 'User already has this badge', existingBadge },
        { status: 400 }
      );
    }

    // Award the badge
    const userAchievement = await prisma.userAchievement.create({
      data: {
        user_id,
        achievement_id: badge_id,
        earned_at: new Date()
      },
      include: {
        achievement: true
      }
    });

    // Add experience points for earning a badge
    try {
      const badgeTier = (userAchievement.achievement.criteria as any).tier || 'bronze';
      let experiencePoints = 0;

      // Award experience based on badge tier
      switch (badgeTier) {
        case 'bronze':
          experiencePoints = 50;
          break;
        case 'silver':
          experiencePoints = 100;
          break;
        case 'gold':
          experiencePoints = 200;
          break;
        case 'platinum':
          experiencePoints = 500;
          break;
        default:
          experiencePoints = 50;
      }

      // Call the levels API to add experience
      await fetch('/api/gamification/levels/add-experience', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          experience_points: experiencePoints,
          source: 'badge_earned'
        })
      });
    } catch (error) {
      console.error('Failed to add experience points for badge:', error);
      // Continue execution even if adding experience fails
    }

    return NextResponse.json({
      id: userAchievement.achievement.id,
      name: userAchievement.achievement.name,
      description: userAchievement.achievement.description,
      iconName: (userAchievement.achievement.criteria as any).iconName || 'award',
      category: (userAchievement.achievement.criteria as any).category || 'achievement',
      tier: (userAchievement.achievement.criteria as any).tier || 'bronze',
      criteria: userAchievement.achievement.criteria,
      earnedAt: userAchievement.earned_at.toISOString()
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to award badge');
  }
}

/**
 * POST /api/gamification/badges/check
 * Checks if a user qualifies for any new badges
 */
export async function check(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's current badges
    const currentBadges = await prisma.userAchievement.findMany({
      where: { user_id },
      select: { achievement_id: true }
    });

    const currentBadgeIds = currentBadges.map(b => b.achievement_id);

    // Get all badges
    const allBadges = await prisma.achievement.findMany({
      where: {
        id: { notIn: currentBadgeIds }
      }
    });

    // Get user data for badge criteria checking
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id }
    });

    const userAssessments = await prisma.userAssessment.findMany({
      where: { user_id }
    });

    const userStreak = await prisma.userStreak.findUnique({
      where: { user_id }
    });

    // Check for badges
    const newBadges = [];
    const awardedBadges = [];

    for (const badge of allBadges) {
      const criteria = badge.criteria as any;
      let qualifies = false;

      // Check different badge criteria
      switch (criteria.type) {
        case 'lesson_completion':
          const completedLessons = userProgress.filter(p => p.completed).length;
          qualifies = completedLessons >= criteria.threshold;
          break;

        case 'assessment_score':
          const highScores = userAssessments.filter(a => a.score >= criteria.minScore).length;
          qualifies = highScores >= criteria.threshold;
          break;

        case 'streak_days':
          qualifies = userStreak && userStreak.current_streak >= criteria.threshold;
          break;

        // Add more criteria checks as needed
      }

      if (qualifies) {
        newBadges.push(badge);

        // Award the badge
        try {
          const userAchievement = await prisma.userAchievement.create({
            data: {
              user_id,
              achievement_id: badge.id,
              earned_at: new Date()
            },
            include: {
              achievement: true
            }
          });

          awardedBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            iconName: criteria.iconName || 'award',
            category: criteria.category || 'achievement',
            tier: criteria.tier || 'bronze',
            criteria: badge.criteria,
            earnedAt: userAchievement.earned_at.toISOString()
          });
        } catch (error) {
          console.error('Failed to award badge:', error);
        }
      }
    }

    return NextResponse.json({
      newBadges: awardedBadges,
      count: awardedBadges.length
    });
  } catch (error) {
    return handleApiError(error, 'Failed to check badges');
  }
}
