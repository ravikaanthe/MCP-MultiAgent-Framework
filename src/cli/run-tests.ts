#!/usr/bin/env node
/**
 * CLI Entry Point for Multi-Agent Test Automation
 * Runs the full 4-agent pipeline for a given story ID
 */

import { config } from 'dotenv';
import { TestAutomationOrchestrator } from '../core/orchestrator.js';
import { UserStoryManager } from '../managers/user-story-manager.js';
import chalk from 'chalk';

// Load environment variables
config();

async function main() {
  console.log(chalk.blue.bold('🚀 Multi-Agent Test Automation Framework'));
  console.log(chalk.blue('═'.repeat(60)));
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const headedMode = args.includes('--headed') || args.includes('-h');
  const storyId = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-')) || '';
  
  if (!storyId) {
    console.error(chalk.red('❌ No story ID provided.'));
    console.log(chalk.yellow('\nUsage: npm test -- AUTH-001 [--headed]'));
    console.log(chalk.yellow('   or: npm test -- AUTH-002 --headed'));
    console.log(chalk.yellow('\nOptions:'));
    console.log(chalk.yellow('  --headed, -h    Run tests with visible browser (default: headless)'));
    process.exit(1);
  }
  
  console.log(chalk.cyan(`📝 Story ID: ${storyId}`));
  if (headedMode) {
    console.log(chalk.green('👁️  Browser Mode: HEADED (visible browser)'));
  } else {
    console.log(chalk.gray('👻 Browser Mode: HEADLESS (background)'));
  }
  console.log();
  
  // Validate API key
  const apiKey = process.env.ANTHROPIC_API_KEY || '';
  
  if (!apiKey) {
    console.error(chalk.red('❌ ANTHROPIC_API_KEY not found in environment variables.'));
    console.log(chalk.yellow('\n📋 Setup Instructions:'));
    console.log(chalk.yellow('1. Copy .env.example to .env'));
    console.log(chalk.yellow('2. Get your API key from https://console.anthropic.com/'));
    console.log(chalk.yellow('3. Add your API key to .env file'));
    process.exit(1);
  }
  
  try {
    // Initialize managers
    const orchestrator = new TestAutomationOrchestrator(apiKey, { headed: headedMode });
    const userStoryManager = new UserStoryManager();
    
    console.log(chalk.blue('📚 Loading user stories...\n'));
    
    // Get all stories
    const allStories = await userStoryManager.getAllStories();
    console.log(chalk.green(`✅ Found ${allStories.length} user stories\n`));
    
    // Find the requested story
    const storyObj = allStories.find(s => s.id === storyId);
    
    if (!storyObj) {
      console.error(chalk.red(`❌ Could not find story with ID: ${storyId}`));
      console.log(chalk.yellow('\n📋 Available stories:'));
      allStories.forEach(story => {
        console.log(chalk.cyan(`   - ${story.id}: ${story.title}`));
      });
      process.exit(1);
    }
    
    console.log(chalk.green(`✅ Found story: ${storyObj.title}`));
    console.log(chalk.gray(`   Module: ${storyObj.module || 'N/A'}\n`));
    
    // Get story content
    const storyContent = await userStoryManager.getStoryById(storyId);
    console.log(chalk.gray(`📄 Story content loaded (${storyContent.length} characters)\n`));
    
    // Run the pipeline
    console.log(chalk.blue.bold('🎯 Starting 4-Agent Pipeline...\n'));
    
    const results = await orchestrator.runPipeline(storyContent, storyObj.module, storyId);
    
    // Display final results
    console.log(chalk.green.bold('\n✅ Pipeline completed successfully!'));
    console.log(chalk.blue('═'.repeat(60)));
    console.log(chalk.cyan('📊 Final Results:'));
    console.log(chalk.white(`   Total Tests: ${results.analysis.totalTests}`));
    console.log(chalk.green(`   Passed: ${results.analysis.passedTests}`));
    console.log(chalk.red(`   Failed: ${results.analysis.failedTests}`));
    console.log(chalk.yellow(`   Pass Rate: ${results.analysis.passRate.toFixed(2)}%`));
    console.log(chalk.gray(`   Execution Time: ${(results.totalExecutionTime / 1000).toFixed(2)}s`));
    console.log(chalk.blue('═'.repeat(60)));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Pipeline failed:'), error);
    if (error instanceof Error) {
      console.error(chalk.red('   Error message:'), error.message);
      if (error.stack) {
        console.error(chalk.gray('\n   Stack trace:'));
        console.error(chalk.gray(error.stack));
      }
    }
    process.exit(1);
  }
}

// Run main function
main().catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});
