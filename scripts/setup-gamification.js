/**
 * Setup Gamification System
 *
 * This script sets up the gamification system by:
 * 1. Regenerating the Prisma client
 * 2. Creating the necessary database tables
 * 3. Seeding the database with achievement data
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Regenerate Prisma client
console.log('Step 1: Regenerating Prisma client...');
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
  // Clear require cache to ensure we get the freshly generated client
  Object.keys(require.cache).forEach(key => {
    if (key.includes('prisma') || key.includes('.prisma')) {
      delete require.cache[key];
    }
  });

  // Try different possible paths for the Prisma client
  try {
    const { PrismaClient } = require('../src/generated/prisma');
    prisma = new PrismaClient();
    console.log('Prisma client initialized successfully from src/generated/prisma.');
  } catch (innerError) {
    try {
      const { PrismaClient } = require('@prisma/client');
      prisma = new PrismaClient();
      console.log('Prisma client initialized successfully from @prisma/client.');
    } catch (innerError2) {
      throw new Error('Could not import PrismaClient from any known location');
    }
  }
} catch (error) {
  console.error('Error initializing Prisma client:', error);
  process.exit(1);
}

// Create database tables
async function createTables() {
  console.log('Step 2: Creating gamification tables...');

  try {
    // Create UserStreak table
    console.log('Creating UserStreak table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserStreak" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL UNIQUE REFERENCES "User"(id),
        "current_streak" INTEGER NOT NULL DEFAULT 0,
        "longest_streak" INTEGER NOT NULL DEFAULT 0,
        "last_active" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    // Create UserLevel table
    console.log('Creating UserLevel table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserLevel" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL UNIQUE REFERENCES "User"(id),
        "current_level" INTEGER NOT NULL DEFAULT 1,
        "experience" INTEGER NOT NULL DEFAULT 0,
        "next_level_exp" INTEGER NOT NULL DEFAULT 100,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    console.log('Gamification tables created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating gamification tables:', error);
    return false;
  }
}

// Seed achievements
async function seedAchievements() {
  console.log('Step 3: Seeding achievements...');

  try {
    // Check if achievements already exist
    const existingCount = await prisma.achievement.count();
    if (existingCount > 0) {
      console.log(`Skipping achievement seeding, ${existingCount} achievements already exist.`);
      return true;
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
      }
    ];

    // Insert achievements
    await prisma.achievement.createMany({
      data: achievements
    });

    console.log(`Created ${achievements.length} achievements.`);
    return true;
  } catch (error) {
    console.error('Error seeding achievements:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting gamification system setup...');

  try {
    // Create tables
    const tablesCreated = await createTables();

    // Seed achievements if tables were created successfully
    if (tablesCreated) {
      await seedAchievements();
    }

    console.log('Gamification system setup completed!');
  } catch (error) {
    console.error('Error setting up gamification system:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main();
