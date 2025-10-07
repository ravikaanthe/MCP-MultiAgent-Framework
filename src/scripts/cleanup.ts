#!/usr/bin/env node

/**
 * 🧹 Framework Cleanup Script
 * Removes any duplicate or outdated files that might appear
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const OUTDATED_FILES = [
  'complete-framework-acct002.ts',
  'demo-acct-002.ts',
  'execute-acct002.ts',
  'execute-auth-test.ts',
  'generate-test-prompt.ts',
  'run-acct002-framework.ts',
  'user-stories.md',
  'test-parabank-direct.md',
  'test-with-credits.sh'
];

const OUTDATED_DIRECTORIES = [
  'generated-prompts',
  'generated-test-cases',
  'generated-outputs'
];

async function cleanupFiles() {
  console.log(chalk.blue.bold('🧹 Framework Cleanup Script'));
  console.log(chalk.blue('═'.repeat(40)));
  
  let cleanedCount = 0;
  
  // Clean up files
  for (const file of OUTDATED_FILES) {
    try {
      await fs.access(file);
      await fs.unlink(file);
      console.log(chalk.green(`✅ Removed file: ${file}`));
      cleanedCount++;
    } catch (error) {
      // File doesn't exist, which is good
    }
  }
  
  // Clean up directories
  for (const dir of OUTDATED_DIRECTORIES) {
    try {
      await fs.access(dir);
      await fs.rm(dir, { recursive: true, force: true });
      console.log(chalk.green(`✅ Removed directory: ${dir}/`));
      cleanedCount++;
    } catch (error) {
      // Directory doesn't exist, which is good
    }
  }
  
  // Clean dist directory if it exists
  try {
    await fs.access('dist');
    await fs.rm('dist', { recursive: true, force: true });
    console.log(chalk.green(`✅ Removed compiled files: dist/`));
    cleanedCount++;
  } catch (error) {
    // Dist doesn't exist, which is fine
  }
  
  if (cleanedCount === 0) {
    console.log(chalk.cyan('✨ Framework is already clean! No files to remove.'));
  } else {
    console.log(chalk.yellow(`🧹 Cleaned ${cleanedCount} items`));
  }
  
  console.log(chalk.blue('═'.repeat(40)));
  console.log(chalk.green('✅ Cleanup completed!'));
  
  // Show current clean structure
  console.log(chalk.cyan('\n📁 Current clean structure:'));
  try {
    const items = await fs.readdir('.', { withFileTypes: true });
    const relevantItems = items.filter(item => 
      ['src', 'user-stories', 'outputs', 'package.json', '.env.example', 'README.md', 'tsconfig.json'].includes(item.name)
    );
    
    for (const item of relevantItems) {
      const icon = item.isDirectory() ? '📁' : '📄';
      console.log(chalk.gray(`  ${icon} ${item.name}`));
    }
  } catch (error) {
    console.log(chalk.yellow('Could not list directory contents'));
  }
}

// Export for use in package.json scripts
export { cleanupFiles };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupFiles().catch(console.error);
}
