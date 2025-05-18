// This script ensures Prisma Client is generated during the build process
const { execSync } = require('child_process');

console.log('🔄 Generating Prisma Client...');

try {
  // Run prisma generate
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error);
  process.exit(1);
}
