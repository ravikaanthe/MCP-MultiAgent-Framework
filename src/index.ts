import { config } from 'dotenv';
import { TestAutomationOrchestrator } from './core/orchestrator.js';
import { UserStoryManager } from './managers/user-story-manager.js';
import chalk from 'chalk';

// Load environment variables
config();

/**
 * Main entry point for the multi-agent test automation framework
 */
async function main(): Promise<void> {
  try {
    console.log(chalk.blue.bold('🚀 Starting Multi-Agent Test Automation Framework\n'));
    
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    // Validate environment
    TestAutomationOrchestrator.validateEnvironment(apiKey || '');
    
    // Initialize User Story Manager
    const storyManager = new UserStoryManager();
    
    // Check command line arguments for story selection
    const args = process.argv.slice(2);
    let userStory: string;
    let storyId: string;
    
    if (args.length > 0) {
      const storySelector = args[0];
      
      if (storySelector === '--list') {
        // List all available stories and exit
        await storyManager.listAvailableStories();
        console.log(chalk.cyan('💡 Usage Examples:'));
        console.log(chalk.white('  npm start                    # Run first story'));
        console.log(chalk.white('  npm start 2                  # Run story by index'));
        console.log(chalk.white('  npm start user-login         # Run story by ID'));
        console.log(chalk.white('  npm start --list             # List all stories'));
        process.exit(0);
      } else if (!isNaN(Number(storySelector))) {
        // Story selection by index
        const storyIndex = Number(storySelector);
        console.log(chalk.cyan(`📖 Loading story #${storyIndex}...`));
        const storyObject = await storyManager.getStoryObjectByIndex(storyIndex);
        if (storyObject) {
          userStory = storyObject.content;
          storyId = storyObject.id;
        } else {
          userStory = await storyManager.getStoryByIndex(storyIndex);
          storyId = 'UNKNOWN-001';
        }
      } else {
        // Story selection by ID
        console.log(chalk.cyan(`📖 Loading story: ${storySelector}...`));
        const storyObject = await storyManager.getStoryObjectById(storySelector);
        if (storyObject) {
          userStory = storyObject.content;
          storyId = storyObject.id;
        } else {
          userStory = await storyManager.getStoryById(storySelector);
          storyId = storySelector;
        }
      }
    } else {
      // Default to first story
      console.log(chalk.cyan('📖 Loading default story (use --list to see all available)...'));
      const storyObject = await storyManager.getStoryObjectByIndex(1);
      if (storyObject) {
        userStory = storyObject.content;
        storyId = storyObject.id;
      } else {
        userStory = await storyManager.getStoryByIndex(1);
        storyId = 'UNKNOWN-001';
      }
    }
    
    console.log(chalk.gray(`📝 Selected Story: ${storyId}\n${userStory.substring(0, 200)}...\n`));
    
    // Create orchestrator instance
    const orchestrator = new TestAutomationOrchestrator(apiKey!);
    
    // Run the complete pipeline
    const results = await orchestrator.runPipeline(userStory, undefined, storyId);
    
    // Log final summary
    console.log(chalk.green.bold('🎉 Framework execution completed successfully!'));
    console.log(chalk.gray(`📊 Pass Rate: ${results.analysis.passRate.toFixed(1)}%`));
    console.log(chalk.gray(`⏱️  Total Time: ${results.totalExecutionTime}ms`));
    console.log(chalk.gray(`📁 Results: test-results.json`));
    
    process.exit(0);
    
  } catch (error) {
    console.error(chalk.red.bold('\n💥 Framework execution failed:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    
    if (error instanceof Error && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    
    process.exit(1);
  }
}

// Export orchestrator for testing
export { TestAutomationOrchestrator };

// Run main function if this file is executed directly
// Check if this is the main module (works with both .ts and .js)
const isMainModule = process.argv[1] && (process.argv[1].endsWith('index.js') || process.argv[1].endsWith('index.ts') || process.argv[1].includes('index'));
if (isMainModule) {
  main().catch(error => {
    console.error(chalk.red('Unhandled error:'), error);
    process.exit(1);
  });
}
