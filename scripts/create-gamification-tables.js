/**
 * Create Gamification Tables
 *
 * This script creates the gamification tables directly using SQL.
 */

const fs = require('fs');
const path = require('path');
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

async function main() {
  console.log('Creating gamification tables...');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-gamification-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await prisma.$executeRawUnsafe(sql);

    console.log('Gamification tables created successfully!');
  } catch (error) {
    console.error('Error creating gamification tables:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
