/**
 * Seed Gamification Data
 *
 * This script seeds the database with gamification data.
 */

const { execSync } = require('child_process');

// Regenerate Prisma client
console.log('Regenerating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client regenerated successfully.');
} catch (error) {
  console.error('Error regenerating Prisma client:', error);
  process.exit(1);
}

// Import PrismaClient after regeneration
let prisma;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.error('Error initializing Prisma client:', error);
  process.exit(1);
}

async function seedAchievements() {
  // Check if achievements already exist
  const existingCount = await prisma.achievement.count();
  if (existingCount > 0) {
    console.log(`Skipping achievement seeding, ${existingCount} achievements already exist.`);
    return;
  }

  // Create achievements
  const achievements = [
    // Learning Achievements - Bronze Tier
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      criteria: {
        type: 'lesson_completion',
        threshold: 1,
        iconName: 'award',
        category: 'learning',
        tier: 'bronze'
      },
      icon_url: 'award'
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 5 lessons',
      criteria: {
        type: 'lesson_completion',
        threshold: 5,
        iconName: 'book-open',
        category: 'learning',
        tier: 'bronze'
      },
      icon_url: 'book-open'
    },

    // Learning Achievements - Silver Tier
    {
      name: 'Dedicated Learner',
      description: 'Complete 15 lessons',
      criteria: {
        type: 'lesson_completion',
        threshold: 15,
        iconName: 'book-open',
        category: 'learning',
        tier: 'silver'
      },
      icon_url: 'book-open'
    },
    {
      name: 'Topic Explorer',
      description: 'Study at least 3 different topics',
      criteria: {
        type: 'topic_diversity',
        threshold: 3,
        iconName: 'compass',
        category: 'learning',
        tier: 'silver'
      },
      icon_url: 'compass'
    },

    // Learning Achievements - Gold Tier
    {
      name: 'Knowledge Master',
      description: 'Complete 30 lessons',
      criteria: {
        type: 'lesson_completion',
        threshold: 30,
        iconName: 'book-open',
        category: 'learning',
        tier: 'gold'
      },
      icon_url: 'book-open'
    },
    {
      name: 'Topic Master',
      description: 'Complete all lessons in a topic',
      criteria: {
        type: 'topic_mastery',
        threshold: 1,
        iconName: 'award',
        category: 'learning',
        tier: 'gold'
      },
      icon_url: 'award'
    },

    // Assessment Achievements - Bronze Tier
    {
      name: 'Quiz Taker',
      description: 'Complete your first assessment',
      criteria: {
        type: 'assessment_completion',
        threshold: 1,
        iconName: 'check-circle',
        category: 'assessment',
        tier: 'bronze'
      },
      icon_url: 'check-circle'
    },
    {
      name: 'Passing Grade',
      description: 'Score at least 70% on an assessment',
      criteria: {
        type: 'assessment_score',
        threshold: 1,
        minScore: 70,
        iconName: 'check-circle',
        category: 'assessment',
        tier: 'bronze'
      },
      icon_url: 'check-circle'
    },

    // Assessment Achievements - Silver Tier
    {
      name: 'Assessment Ace',
      description: 'Score 100% on an assessment',
      criteria: {
        type: 'assessment_score',
        threshold: 1,
        minScore: 100,
        iconName: 'award',
        category: 'assessment',
        tier: 'silver'
      },
      icon_url: 'award'
    },
    {
      name: 'Quiz Master',
      description: 'Complete 10 assessments',
      criteria: {
        type: 'assessment_completion',
        threshold: 10,
        iconName: 'check-circle',
        category: 'assessment',
        tier: 'silver'
      },
      icon_url: 'check-circle'
    },

    // Assessment Achievements - Gold Tier
    {
      name: 'Perfect Streak',
      description: 'Score 100% on 3 assessments in a row',
      criteria: {
        type: 'perfect_scores',
        threshold: 3,
        iconName: 'zap',
        category: 'assessment',
        tier: 'gold'
      },
      icon_url: 'zap'
    },

    // Coding Achievements - Bronze Tier
    {
      name: 'Code Rookie',
      description: 'Complete your first coding exercise',
      criteria: {
        type: 'coding_exercises',
        threshold: 1,
        iconName: 'code',
        category: 'coding',
        tier: 'bronze'
      },
      icon_url: 'code'
    },

    // Coding Achievements - Silver Tier
    {
      name: 'Code Enthusiast',
      description: 'Complete 10 coding exercises',
      criteria: {
        type: 'coding_exercises',
        threshold: 10,
        iconName: 'code',
        category: 'coding',
        tier: 'silver'
      },
      icon_url: 'code'
    },

    // Coding Achievements - Gold Tier
    {
      name: 'Code Ninja',
      description: 'Complete 25 coding exercises',
      criteria: {
        type: 'coding_exercises',
        threshold: 25,
        iconName: 'code',
        category: 'coding',
        tier: 'gold'
      },
      icon_url: 'code'
    },

    // Streak Achievements - Bronze Tier
    {
      name: 'Getting Started',
      description: 'Maintain a 3-day learning streak',
      criteria: {
        type: 'streak_days',
        threshold: 3,
        iconName: 'calendar',
        category: 'streak',
        tier: 'bronze'
      },
      icon_url: 'calendar'
    },

    // Streak Achievements - Silver Tier
    {
      name: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      criteria: {
        type: 'streak_days',
        threshold: 7,
        iconName: 'calendar',
        category: 'streak',
        tier: 'silver'
      },
      icon_url: 'calendar'
    },

    // Streak Achievements - Gold Tier
    {
      name: 'Dedicated Scholar',
      description: 'Maintain a 14-day learning streak',
      criteria: {
        type: 'streak_days',
        threshold: 14,
        iconName: 'calendar',
        category: 'streak',
        tier: 'gold'
      },
      icon_url: 'calendar'
    },

    // Streak Achievements - Platinum Tier
    {
      name: 'Learning Machine',
      description: 'Maintain a 30-day learning streak',
      criteria: {
        type: 'streak_days',
        threshold: 30,
        iconName: 'calendar',
        category: 'streak',
        tier: 'platinum'
      },
      icon_url: 'calendar'
    }
  ];

  // Insert achievements
  await prisma.achievement.createMany({
    data: achievements
  });

  console.log(`Created ${achievements.length} achievements.`);
}

async function main() {
  console.log('Starting gamification data seeding...');

  try {
    // Seed achievements
    await seedAchievements();

    console.log('Gamification data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding gamification data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
