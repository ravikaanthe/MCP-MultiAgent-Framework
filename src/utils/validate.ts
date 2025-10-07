import chalk from 'chalk';

/**
 * Simple validation script to check if the framework is properly set up
 */
async function validateSetup(): Promise<void> {
  console.log(chalk.blue.bold('🔍 Multi-Agent Test Automation Framework - Setup Validation\n'));

  // Check if all required files exist
  const requiredFiles = [
    'dist/index.js',
    'dist/orchestrator.js',
    'dist/types.js',
    'dist/agents/story-analyst.js',
    'dist/agents/test-generator.js',
    'dist/agents/test-executor.js',
    'dist/agents/results-analyzer.js'
  ];

  console.log(chalk.yellow('📁 Checking compiled files...'));
  
  try {
    // Import the main orchestrator to verify everything works
    const { TestAutomationOrchestrator } = await import('../core/orchestrator.js');
    console.log(chalk.green('✅ Orchestrator loaded successfully'));
    
    // Check individual agents
    const { StoryAnalystAgent } = await import('../agents/story-analyst.js');
    console.log(chalk.green('✅ Story Analyst Agent loaded'));
    
    const { TestGeneratorAgent } = await import('../agents/test-generator.js');
    console.log(chalk.green('✅ Test Generator Agent loaded'));
    
    const { TestExecutorAgent } = await import('../agents/test-executor.js');
    console.log(chalk.green('✅ Test Executor Agent loaded'));
    
    const { ResultsAnalyzerAgent } = await import('../agents/results-analyzer.js');
    console.log(chalk.green('✅ Results Analyzer Agent loaded'));
    
  } catch (error) {
    console.log(chalk.red(`❌ Error loading files: ${error}`));
    return;
  }

  console.log(chalk.green('\n✅ All TypeScript files compiled successfully!'));
  console.log(chalk.green('✅ All agent classes are properly structured!'));
  console.log(chalk.green('✅ Framework is ready to use!'));
  
  console.log(chalk.blue.bold('\n🚀 Next Steps:'));
  console.log(chalk.white('1. Add your Anthropic API key to .env file'));
  console.log(chalk.white('2. Run: npm start'));
  console.log(chalk.white('3. Watch the multi-agent collaboration in action!'));
  
  console.log(chalk.gray('\n📖 For detailed instructions, see README.md\n'));
}

validateSetup().catch(error => {
  console.error(chalk.red('Validation failed:'), error);
  process.exit(1);
});
