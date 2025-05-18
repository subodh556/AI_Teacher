/**
 * Seed Gamification Data
 * 
 * This script seeds the database with gamification data.
 */

import { seedAchievements } from '@/lib/seed-achievements';
import { prisma } from '@/lib/prisma';

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
