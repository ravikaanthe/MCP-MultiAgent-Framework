/**
 * Test Automation Orchestrator
 * Coordinates all agents in the multi-agent test automation framework
 */

import { config } from 'dotenv';
import { StoryAnalystAgent } from '../agents/story-analyst.js';
import { TestGeneratorAgent } from '../agents/test-generator.js';
import { TestExecutorAgent } from '../agents/test-executor.js';
import { ResultsAnalyzerAgent } from '../agents/results-analyzer.js';
import { TestPromptManager } from '../managers/test-prompt-manager.js';
import EnvironmentManager from '../config/environments.js';
import { UserStoryManager } from '../managers/user-story-manager.js';
import type { TestResult, TestCase } from './types.js';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

config();

export interface PipelineResults {
  analysis: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    passRate: number;
  };
  totalExecutionTime: number;
  testResults: TestResult[];
}

export class TestAutomationOrchestrator {
  private apiKey: string;
  private promptManager: TestPromptManager;
  private headedMode: boolean;

  constructor(apiKey: string, options: { headed?: boolean } = {}) {
    this.apiKey = apiKey;
    this.promptManager = new TestPromptManager();
    this.headedMode = options.headed || false;
  }

  /**
   * Validates the environment setup
   */
  static validateEnvironment(apiKey: string): void {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    console.log(chalk.green('✅ Environment validation passed'));
  }

  /**
   * Runs the complete multi-agent pipeline
   */
  async runPipeline(userStory: string, moduleFolder?: string, storyId?: string): Promise<PipelineResults> {
    const startTime = Date.now();
    
    console.log(chalk.blue.bold('🚀 Starting Multi-Agent Test Automation Pipeline'));
    console.log(chalk.blue('═'.repeat(60)));

    try {
      // Initialize all agents
      const storyAnalyst = new StoryAnalystAgent(this.apiKey);
      const testGenerator = new TestGeneratorAgent(this.apiKey);
      const testExecutor = new TestExecutorAgent({ headed: this.headedMode });
      const resultsAnalyzer = new ResultsAnalyzerAgent(this.apiKey);

      // Agent 1: Story Analysis
      console.log(chalk.yellow('\n📋 Agent 1: Story Analyst - Analyzing user story...'));
      const storyAnalysis = await storyAnalyst.analyzeUserStory(userStory);
      console.log(chalk.green('✅ Story analysis completed'));

      // Extract story information for file organization
      const resolvedStoryId = storyId || this.extractStoryId(userStory);
      const storyModule = this.determineStoryModule(resolvedStoryId, storyAnalysis);
      console.log(chalk.cyan(`📝 Processing story: ${resolvedStoryId} (module: ${storyModule})`));

      // Agent 2: Test Generation
      console.log(chalk.yellow('\n🧪 Agent 2: Test Generator - Generating test cases...'));
      const testCases = await testGenerator.generateTestCases(storyAnalysis);
      console.log(chalk.green(`✅ Generated ${testCases.length} test cases`));
      console.log(chalk.gray(`🔍 Test cases for ${resolvedStoryId}:`));
      testCases.forEach((tc, i) => {
        console.log(chalk.gray(`   ${i + 1}. ${tc.testName}`));
      });

      // Save test cases to organized structure
      await this.promptManager.initialize();
      await this.promptManager.saveOrganizedTestCases(resolvedStoryId, storyModule, storyAnalysis, testCases);
      console.log(chalk.cyan(`💾 Test cases saved to: test-cases/${storyModule}/${resolvedStoryId}-tests.md`));

      // Agent 3: Test Execution
      console.log(chalk.yellow('\n🎭 Agent 3: Test Executor - Executing test cases...'));
      await testExecutor.initializeMCP();
      const testResults = await testExecutor.executeAllTests(testCases);
      console.log(chalk.green(`✅ Executed ${testResults.length} test cases`));

      // Agent 4: Results Analysis
      console.log(chalk.yellow('\n📊 Agent 4: Results Analyzer - Analyzing results...'));
      const resultsAnalysis = await resultsAnalyzer.analyzeResults(testResults);
      
      // Generate HTML report
      const htmlReport = resultsAnalyzer.generateHTMLReport(resultsAnalysis, testResults, resolvedStoryId);
      
      // Save results using TestPromptManager's organized structure
      await this.promptManager.saveTestResults(resolvedStoryId, storyModule, testResults, htmlReport);
      
      // Also save analysis report to outputs root for backward compatibility
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = path.join('outputs', `analysis-report-${timestamp}.md`);
      await fs.writeFile(reportPath, resultsAnalysis.summary);
      console.log(chalk.gray(`📄 Legacy report saved to: ${reportPath}`));
      
      await testExecutor.cleanup();

      const totalTime = Date.now() - startTime;
      const passedTests = testResults.filter(r => r.status === 'passed').length;
      const failedTests = testResults.filter(r => r.status === 'failed').length;
      const passRate = testResults.length > 0 ? (passedTests / testResults.length) * 100 : 0;

      console.log(chalk.green('✅ Results analysis completed'));
      console.log(chalk.blue('═'.repeat(60)));
      console.log(chalk.green.bold('🎉 Multi-Agent Pipeline Completed Successfully!'));
      
      return {
        analysis: {
          totalTests: testResults.length,
          passedTests,
          failedTests,
          passRate
        },
        totalExecutionTime: totalTime,
        testResults
      };

    } catch (error) {
      console.error(chalk.red('\n❌ Pipeline execution failed:'), error);
      throw error;
    }
  }

  /**
   * Saves test results and analysis to files
   */
  /**
   * Gets environment information
   */
  getEnvironmentInfo(): any {
    try {
      return EnvironmentManager.getEnvironmentInfo();
    } catch (error) {
      return {
        environment: 'development',
        application: 'ParaBank',
        baseUrl: 'https://parabank.parasoft.com'
      };
    }
  }

  /**
   * Extract story ID from user story text
   */
  private extractStoryId(userStory: string): string {
    // Look for patterns like AUTH-001, ACCT-002, etc.
    const match = userStory.match(/([A-Z]+-\d+)/);
    return match ? match[1] : 'UNKNOWN-001';
  }

  /**
   * Determine story module based on story ID and analysis
   */
  private determineStoryModule(storyId: string, analysisResult: any): string {
    // Extract module from story ID prefix
    const prefix = storyId.split('-')[0];
    
    switch (prefix) {
      case 'AUTH': return 'authentication';
      case 'ACCT': return 'account-management';
      case 'TRANS': return 'transactions';
      case 'BILL': return 'bill-pay';
      case 'USER': return 'user-management';
      case 'ADMIN': return 'admin';
      case 'ECOM': return 'e-commerce';
      default: return 'general';
    }
  }
}

// Export as default for backward compatibility
export default TestAutomationOrchestrator;

// MAIN ENTRY POINT
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const storyId = process.argv[2] || '';
    if (!storyId) {
      console.error('❌ No story ID provided. Usage: npm test -- AUTH-001');
      process.exit(1);
    }
    const apiKey = process.env.ANTHROPIC_API_KEY || '';
    TestAutomationOrchestrator.validateEnvironment(apiKey);
    const orchestrator = new TestAutomationOrchestrator(apiKey);
    const userStoryManager = new UserStoryManager();
    // Use UserStoryManager to get story content and module
    const allStories = await userStoryManager.getAllStories();
    const storyObj = allStories.find(s => s.id === storyId);
    if (!storyObj) {
      console.error(`❌ Could not find story with ID ${storyId} in user-stories.`);
      process.exit(1);
    }
    const storyContent = await userStoryManager.getStoryById(storyId);
    await orchestrator.runPipeline(storyContent, storyObj.module, storyId)
      .then(() => {
        console.log('✅ All agents completed successfully.');
      })
      .catch((err) => {
        console.error('❌ Pipeline failed:', err);
        process.exit(1);
      });
  })();
}
