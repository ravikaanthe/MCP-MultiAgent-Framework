#!/usr/bin/env node

/**
 * 🌍 Environment-Aware Test Runner
 * Allows running tests in different environments
 */

import { config } from 'dotenv';
import EnvironmentManager from '../config/environments.js';
import chalk from 'chalk';

// Load environment variables
config();

/**
 * Display usage information
 */
function showUsage() {
  console.log(chalk.blue.bold('🌍 Environment-Aware Test Runner'));
  console.log(chalk.blue('═'.repeat(50)));
  console.log(chalk.cyan('Usage:'));
  console.log(chalk.white('  npm run test:dev ACCT-002              # Run in development'));
  console.log(chalk.white('  npm run test:staging ACCT-002          # Run in staging'));
  console.log(chalk.white('  npm run test:prod ACCT-002             # Run in production'));
  console.log();
  console.log(chalk.cyan('Environment Variables:'));
  console.log(chalk.white('  TEST_ENV=development|staging|production'));
  console.log(chalk.white('  TEST_APP=parabank                      # Application to test'));
  console.log();
  console.log(chalk.cyan('Examples:'));
  console.log(chalk.white('  TEST_ENV=staging npm run dev ACCT-002'));
  console.log(chalk.white('  TEST_ENV=production TEST_APP=parabank npm run dev AUTH-001'));
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
  }
  
  // Set environment from command line or environment variable
  const testEnv = process.env.TEST_ENV || 'development';
  const testApp = process.env.TEST_APP || 'parabank';
  
  try {
    // Set the environment
    EnvironmentManager.setEnvironment(testEnv, testApp);
    
    // Display environment info
    const envInfo = EnvironmentManager.getEnvironmentInfo();
    console.log(chalk.blue.bold('🌍 Test Environment Configuration'));
    console.log(chalk.blue('═'.repeat(50)));
    console.log(chalk.cyan(`Environment: ${envInfo.environment}`));
    console.log(chalk.cyan(`Application: ${envInfo.application}`));
    console.log(chalk.cyan(`Base URL: ${envInfo.baseUrl}`));
    console.log(chalk.blue('═'.repeat(50)));
    console.log();
    
    // Get credentials info (don't log actual passwords)
    const validCreds = EnvironmentManager.getValidCredentials();
    const invalidCreds = EnvironmentManager.getInvalidCredentials();
    console.log(chalk.gray(`Valid Username: ${validCreds.username}`));
    console.log(chalk.gray(`Invalid Username: ${invalidCreds.username}`));
    console.log();
    
  } catch (error) {
    console.error(chalk.red('❌ Environment configuration error:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
