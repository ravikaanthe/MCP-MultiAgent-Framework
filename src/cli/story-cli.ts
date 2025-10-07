#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import { UserStoryManager } from '../managers/user-story-manager.js';

const program = new Command();

program
  .name('story-cli')
  .description('CLI for managing user stories in the multi-agent framework')
  .version('1.0.0');

// List all stories
program
  .command('list')
  .description('List all available user stories')
  .option('-m, --module <module>', 'Filter by specific module')
  .action(async (options) => {
    const manager = new UserStoryManager();
    
    if (options.module) {
      console.log(chalk.blue.bold(`\n📂 Stories from module: ${options.module}`));
      const stories = await manager.getStoriesByModule(options.module);
      
      if (stories.length === 0) {
        console.log(chalk.yellow(`No stories found in module '${options.module}'`));
        return;
      }
      
      stories.forEach((story, index) => {
        console.log(chalk.white(`${index + 1}. ${story.title}`));
        console.log(chalk.gray(`   ID: ${story.id}`));
        console.log(chalk.gray(`   Preview: ${story.content.substring(0, 80)}...`));
        console.log();
      });
    } else {
      await manager.listAvailableStories();
    }
  });

// List modules
program
  .command('modules')
  .description('List all available modules')
  .action(async () => {
    const manager = new UserStoryManager();
    const modules = await manager.listAvailableModules();
    
    console.log(chalk.cyan.bold('\n📁 Available Modules:'));
    console.log(chalk.cyan('─'.repeat(30)));
    
    if (modules.length === 0) {
      console.log(chalk.yellow('No modules found. Using legacy single file structure.'));
      return;
    }
    
    modules.forEach((module, index) => {
      console.log(chalk.white(`${index + 1}. ${module}`));
    });
    console.log();
  });

// View specific story
program
  .command('view <storyId>')
  .description('View a specific story by ID')
  .action(async (storyId) => {
    const manager = new UserStoryManager();
    
    try {
      const content = await manager.getStoryById(storyId);
      console.log(chalk.green.bold(`\n📖 Story: ${storyId}`));
      console.log(chalk.green('─'.repeat(40)));
      console.log(chalk.white(content));
      console.log();
    } catch (error) {
      console.error(chalk.red(`❌ Failed to retrieve story '${storyId}':`, error));
    }
  });

// Add new story
program
  .command('add')
  .description('Add a new user story')
  .option('-m, --module <module>', 'Module to add story to', 'user-management')
  .option('-f, --file <file>', 'File within module to add story to', 'custom-stories.md')
  .option('-t, --title <title>', 'Story title')
  .option('-c, --content <content>', 'Story content')
  .action(async (options) => {
    const manager = new UserStoryManager();
    
    // Interactive mode if title/content not provided
    if (!options.title || !options.content) {
      console.log(chalk.yellow('Interactive mode not implemented yet. Please use --title and --content options.'));
      return;
    }
    
    try {
      await manager.addStory(options.title, options.content, options.module, options.file);
    } catch (error) {
      console.error(chalk.red('❌ Failed to add story:'), error);
    }
  });

// Run tests for specific story or module
program
  .command('test')
  .description('Run tests for a specific story or module')
  .option('-s, --story <storyId>', 'Run tests for specific story')
  .option('-m, --module <module>', 'Run tests for all stories in module')
  .action(async (options) => {
    // Check if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error(chalk.red('❌ ANTHROPIC_API_KEY is not set in environment variables'));
      console.log(chalk.yellow('Please check your .env file and ensure ANTHROPIC_API_KEY is configured'));
      process.exit(1);
    }
    
    const { TestAutomationOrchestrator } = await import('../core/orchestrator.js');
    const { UserStoryManager } = await import('../managers/user-story-manager.js');
    
    const userStoryManager = new UserStoryManager();
    const orchestrator = new TestAutomationOrchestrator(apiKey);
    
    if (options.story) {
      console.log(chalk.blue.bold(`\n🧪 Running tests for story: ${options.story}`));
      
      // Get the story and its module information
      const allStories = await userStoryManager.getAllStories();
      const story = allStories.find(s => s.id === options.story);
      const storyContent = await userStoryManager.getStoryById(options.story);
      
      await orchestrator.runPipeline(storyContent, story?.module);
    } else if (options.module) {
      console.log(chalk.blue.bold(`\n🧪 Running tests for module: ${options.module}`));
      const manager = new UserStoryManager();
      const stories = await manager.getStoriesByModule(options.module);
      
      for (const story of stories) {
        console.log(chalk.cyan(`\n➡️ Processing story: ${story.id}`));
        const storyContent = await userStoryManager.getStoryById(story.id);
        await orchestrator.runPipeline(storyContent, story.module);
      }
    } else {
      console.log(chalk.yellow('Please specify either --story or --module option'));
    }
  });

// Execute organized test case file
program
  .command('execute <filePath>')
  .description('Execute test cases from organized test case file')
  .action(async (filePath) => {
    // Check if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error(chalk.red('❌ ANTHROPIC_API_KEY is not set in environment variables'));
      console.log(chalk.yellow('Please check your .env file and ensure ANTHROPIC_API_KEY is configured'));
      process.exit(1);
    }
    
    try {
      const { TestExecutorAgent } = await import('../agents/test-executor.js');
      const { TestPromptManager } = await import('../managers/test-prompt-manager.js');
      
      console.log(chalk.blue.bold(`\n🚀 Executing test case file: ${filePath}`));
      console.log(chalk.blue('═'.repeat(60)));
      
      // Check if file exists
      const fs = await import('fs/promises');
      const path = await import('path');
      
      let fullPath = filePath;
      if (!path.isAbsolute(filePath)) {
        fullPath = path.resolve(filePath);
      }
      
      // Check if it exists
      try {
        await fs.access(fullPath);
      } catch {
        console.error(chalk.red(`❌ Test case file not found: ${fullPath}`));
        return;
      }
      
      console.log(chalk.green(`✅ Found test case file: ${fullPath}`));
      
      // Read and parse the test case file
      const content = await fs.readFile(fullPath, 'utf-8');
      const promptManager = new TestPromptManager();
      const testCases = await promptManager.loadTestCasesFromPrompt(fullPath);
      
      if (!testCases || testCases.length === 0) {
        console.error(chalk.red('❌ No test cases found in file'));
        return;
      }
      
      console.log(chalk.cyan(`📋 Found ${testCases.length} test cases to execute\n`));
      
      // Initialize test executor
      const testExecutor = new TestExecutorAgent(); // No API key needed for direct MCP
      
      // Execute tests
      const results = await testExecutor.executeAllTests(testCases);
      
      // Display results
      console.log(chalk.green.bold('\n✅ Test Execution Complete!'));
      console.log(chalk.green('─'.repeat(40)));
      console.log(chalk.white(`Total Tests: ${results.length}`));
      console.log(chalk.green(`Passed: ${results.filter((r: any) => r.status === 'passed').length}`));
      console.log(chalk.red(`Failed: ${results.filter((r: any) => r.status === 'failed').length}`));
      
      // Show individual results
      results.forEach((result: any, index: number) => {
        const status = result.status === 'passed' ? 
          chalk.green('✅ PASS') : 
          chalk.red('❌ FAIL');
        console.log(`${status} Test ${index + 1}: ${result.testName} (${result.duration}ms)`);
        
        if (result.status === 'failed' && result.error) {
          console.log(chalk.red(`   Error: ${result.error}`));
        }
      });
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to execute test case file:'), error);
    }
  });

// Migration helper
program
  .command('migrate')
  .description('Migrate from legacy user-stories.md to modular structure')
  .action(async () => {
    console.log(chalk.blue.bold('\n🔄 Migration Helper'));
    console.log(chalk.blue('─'.repeat(30)));
    console.log(chalk.yellow('This would help migrate from user-stories.md to the new modular structure.'));
    console.log(chalk.yellow('Migration feature coming soon...'));
  });

// Help text
program.on('--help', () => {
  console.log();
  console.log(chalk.cyan.bold('Examples:'));
  console.log(chalk.white('  $ story-cli list                          # List all stories'));
  console.log(chalk.white('  $ story-cli list --module authentication  # List auth stories'));
  console.log(chalk.white('  $ story-cli modules                       # List all modules'));
  console.log(chalk.white('  $ story-cli view AUTH-001                 # View specific story'));
  console.log(chalk.white('  $ story-cli test --story AUTH-001         # Test specific story'));
  console.log(chalk.white('  $ story-cli test --module e-commerce      # Test all e-commerce stories'));
  console.log();
  console.log(chalk.cyan.bold('Module Structure:'));
  console.log(chalk.white('  authentication/    # Login, MFA, Social Auth'));
  console.log(chalk.white('  user-management/   # Registration, Profile'));
  console.log(chalk.white('  e-commerce/        # Shopping, Cart, Checkout'));
  console.log(chalk.white('  admin/             # Admin features'));
  console.log();
});

program.parse();
