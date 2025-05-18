/**
 * Direct SQL Setup for Gamification
 *
 * This script sets up the gamification system by directly executing SQL
 * without relying on the Prisma client.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get database connection details from environment variables
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create a new PostgreSQL client
const client = new Client({
  connectionString: dbUrl,
});

// Create tables function
async function createTables() {
  console.log('Creating gamification tables...');

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database');

    // Create UserStreak table
    console.log('Creating UserStreak table...');
    await client.query(`
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
    await client.query(`
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

// Seed achievements function
async function seedAchievements() {
  console.log('Seeding achievements...');

  try {
    // Check if achievements already exist
    const checkResult = await client.query('SELECT COUNT(*) FROM "Achievement"');
    const existingCount = parseInt(checkResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`Skipping achievement seeding, ${existingCount} achievements already exist.`);
      return true;
    }

    // Create achievements
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        criteria: JSON.stringify({
          type: 'lesson_completion',
          threshold: 1,
          iconName: 'award',
          category: 'learning',
          tier: 'bronze'
        }),
        icon_url: 'award'
      },
      {
        name: 'Knowledge Seeker',
        description: 'Complete 5 lessons',
        criteria: JSON.stringify({
          type: 'lesson_completion',
          threshold: 5,
          iconName: 'book-open',
          category: 'learning',
          tier: 'bronze'
        }),
        icon_url: 'book-open'
      },
      {
        name: 'Consistent Learner',
        description: 'Maintain a 7-day learning streak',
        criteria: JSON.stringify({
          type: 'streak_days',
          threshold: 7,
          iconName: 'calendar',
          category: 'streak',
          tier: 'silver'
        }),
        icon_url: 'calendar'
      },
      {
        name: 'Quiz Taker',
        description: 'Complete your first assessment',
        criteria: JSON.stringify({
          type: 'assessment_completion',
          threshold: 1,
          iconName: 'check-circle',
          category: 'assessment',
          tier: 'bronze'
        }),
        icon_url: 'check-circle'
      }
    ];

    // Insert achievements
    for (const achievement of achievements) {
      await client.query(
        'INSERT INTO "Achievement" (name, description, criteria, icon_url) VALUES ($1, $2, $3, $4)',
        [achievement.name, achievement.description, achievement.criteria, achievement.icon_url]
      );
    }

    console.log(`Created ${achievements.length} achievements.`);
    return true;
  } catch (error) {
    console.error('Error seeding achievements:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting direct SQL setup for gamification...');

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
  } finally {
    // Close the database connection
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the main function
main();
