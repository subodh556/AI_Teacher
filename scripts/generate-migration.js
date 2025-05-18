/**
 * Generate Migration
 * 
 * This script generates a migration for the current schema changes.
 */

const { execSync } = require('child_process');

function main() {
  console.log('Generating migration for gamification models...');
  
  try {
    // Generate migration
    execSync('npx prisma migrate dev --name add_gamification_models --create-only', { stdio: 'inherit' });
    
    console.log('Migration generated successfully!');
    console.log('To apply the migration, run: npx prisma migrate dev');
  } catch (error) {
    console.error('Error generating migration:', error);
    process.exit(1);
  }
}

main();
