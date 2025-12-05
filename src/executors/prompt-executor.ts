#!/usr/bin/env node
/**
 * Direct Prompt Executor
 * Runs tests directly from prompt/test-case markdown files using REAL Playwright MCP
 */

import { config } from 'dotenv';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, ChildProcess } from 'child_process';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import EnvironmentManager from '../config/environments.js';
import { ResultsAnalyzerAgent } from '../agents/results-analyzer.js';
import { TestPromptManager } from '../managers/test-prompt-manager.js';

// Load environment variables from .env file
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestCase {
  name: string;
  priority: string;
  steps: string[];
  testData?: any;
}

interface TestResult {
  testName: string;
  priority: string;
  status: 'PASS' | 'FAIL' | 'SKIPPED';
  duration: number;
  steps: StepResult[];
  error?: string;
}

interface StepResult {
  step: string;
  status: 'PASS' | 'FAIL';
  duration: number;
  error?: string;
}

class DirectPromptExecutor {
  private mcpClient: Client | null = null;
  private mcpProcess: ChildProcess | null = null;
  private isConnected = false;
  private testResults: TestResult[] = [];
  private testPromptManager: TestPromptManager;
  private resultsAnalyzer: ResultsAnalyzerAgent;
  
  constructor() {
    // Use 'outputs' as base directory for consistency with Full AI Pipeline
    this.testPromptManager = new TestPromptManager('outputs');
    
    // Get Anthropic API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (!apiKey) {
      console.warn(chalk.yellow('⚠️ ANTHROPIC_API_KEY not set. Results analysis will be limited.'));
    }
    this.resultsAnalyzer = new ResultsAnalyzerAgent(apiKey);
  }
  
  /**
   * Parse test cases from markdown file
   */
  async parseTestCasesFromFile(filePath: string): Promise<TestCase[]> {
    console.log(chalk.blue(`📖 Reading test cases from: ${filePath}`));
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      console.log(chalk.gray(`   File size: ${content.length} characters`));
      
      const testCases: TestCase[] = [];
      
      // Split by test case headers - match both numbered and non-numbered formats
      const testCaseRegex = /### Test Case (?:\d+: )?(.+?)\n\*\*Priority:\*\* (.+?)\n/g;
      const matches = [...content.matchAll(testCaseRegex)];
      
      console.log(chalk.gray(`   Found ${matches.length} test case headers`));
      
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const testName = match[1];
        const priority = match[2];
        
        console.log(chalk.gray(`   Parsing: ${testName}`));
        
        // Find the section between this test case and the next
        const startIdx = match.index! + match[0].length;
        const endIdx = i < matches.length - 1 ? matches[i + 1].index! : content.length;
        const testSection = content.substring(startIdx, endIdx);
        
        // Extract test steps
        const stepsMatch = testSection.match(/#### Test Steps:\n([\s\S]+?)(?=\n####|$)/);
        const steps: string[] = [];
        
        if (stepsMatch) {
          const stepsText = stepsMatch[1];
          const stepLines = stepsText.split('\n')
            .filter(line => line.trim().match(/^\d+\./))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());
          steps.push(...stepLines);
        }
        
        console.log(chalk.gray(`      Steps found: ${steps.length}`));
        
        // Extract test data
        let testData = {};
        const testDataMatch = testSection.match(/```json\n([\s\S]+?)\n```/);
        if (testDataMatch) {
          try {
            testData = JSON.parse(testDataMatch[1]);
          } catch (e) {
            console.warn(chalk.yellow(`⚠️ Could not parse test data for: ${testName}`));
          }
        }
        
        testCases.push({
          name: testName,
          priority,
          steps,
          testData
        });
      }
      
      console.log(chalk.green(`✅ Parsed ${testCases.length} test cases`));
      return testCases;
      
    } catch (error) {
      console.error(chalk.red(`❌ Error reading file: ${error}`));
      throw error;
    }
  }
  
  /**
   * Initialize REAL MCP Browser (Headed Mode - Visible Browser)
   */
  async initBrowser(): Promise<void> {
    console.log(chalk.blue('🚀 Initializing REAL Playwright MCP (Headed Mode)...'));
    
    try {
      const mcpServerPath = path.resolve(process.cwd(), 'src/mcp/playwright-mcp-server.ts');
      
      // On Windows, we need to use node directly with tsx loader
      // StdioClientTransport doesn't handle .cmd files well on Windows
      const command = 'node';
      const tsxLoaderPath = path.resolve(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs');
      
      console.log(chalk.gray(`📡 Starting MCP server: ${command} ${tsxLoaderPath} ${mcpServerPath} --headed`));

      // Create MCP client
      this.mcpClient = new Client(
        { name: 'direct-prompt-executor', version: '1.0.0' },
        { capabilities: {} }
      );

      // Connect via stdio transport using node + tsx loader
      const transport = new StdioClientTransport({
        command: command,
        args: [tsxLoaderPath, mcpServerPath, '--headed']
      });

      console.log(chalk.gray('⏳ Connecting to MCP server...'));
      await this.mcpClient.connect(transport);
      
      this.isConnected = true;
      
      console.log(chalk.green('✅ REAL MCP Browser initialized - Browser will open!'));
      console.log(chalk.green('👁️  Watch the browser window for test execution'));
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize MCP:'), error);
      throw new Error(`MCP initialization failed: ${error}`);
    }
  }
  
  /**
   * Execute a single test case
   */
  async executeTestCase(testCase: TestCase): Promise<{ status: 'passed' | 'failed'; errors: string[]; steps: StepResult[] }> {
    console.log(chalk.yellow(`\n🧪 Executing: ${testCase.name}`));
    console.log(chalk.gray(`   Priority: ${testCase.priority}`));
    
    const errors: string[] = [];
    const stepResults: StepResult[] = [];
    
    try {
      for (let i = 0; i < testCase.steps.length; i++) {
        const step = testCase.steps[i];
        console.log(chalk.cyan(`   ${i + 1}. ${step}`));
        
        const stepStartTime = Date.now();
        try {
          await this.executeStep(step, testCase.testData);
          const stepEndTime = Date.now();
          
          stepResults.push({
            step: step,
            status: 'PASS',
            duration: stepEndTime - stepStartTime
          });
          
          console.log(chalk.green(`      ✅ Step passed`));
        } catch (error) {
          const stepEndTime = Date.now();
          const errorMsg = error instanceof Error ? error.message : String(error);
          
          stepResults.push({
            step: step,
            status: 'FAIL',
            duration: stepEndTime - stepStartTime,
            error: errorMsg
          });
          
          console.log(chalk.red(`      ❌ Step failed: ${errorMsg}`));
          errors.push(`Step ${i + 1}: ${errorMsg}`);
        }
      }
      
      const status = errors.length === 0 ? 'passed' : 'failed';
      console.log(status === 'passed' 
        ? chalk.green(`   ✅ Test PASSED`) 
        : chalk.red(`   ❌ Test FAILED (${errors.length} errors)`)
      );
      
      return { status, errors, steps: stepResults };
      
    } catch (error) {
      console.error(chalk.red(`   ❌ Test execution error: ${error}`));
      return { status: 'failed', errors: [String(error)], steps: stepResults };
    }
  }
  
  /**
   * Execute a single test step using REAL MCP
   */
  private async executeStep(step: string, testData: any): Promise<void> {
    if (!this.isConnected || !this.mcpClient) throw new Error('MCP not initialized');
    
    const lowerStep = step.toLowerCase();
    
    // Navigate
    if (lowerStep.includes('navigate to')) {
      let targetUrl = null;
      
      // First, try to extract URL from the step description
      const urlMatch = step.match(/https?:\/\/[^\s)]+/);
      if (urlMatch) {
        targetUrl = urlMatch[0];
      }
      // If no URL in step, check test data
      else if (testData?.baseUrl) {
        targetUrl = testData.baseUrl;
      }
      else if (testData?.url) {
        targetUrl = testData.url;
      }
      // Fallback: Use environment config for ParaBank login page
      else if (lowerStep.includes('login page') || lowerStep.includes('parabank')) {
        const envConfig = EnvironmentManager.getCurrentEnvironment();
        const parabankConfig = envConfig.applications['parabank'];
        if (parabankConfig) {
          targetUrl = parabankConfig.loginUrl;
          console.log(chalk.gray(`      Using ParaBank URL from environment: ${targetUrl}`));
        }
      }
      // Generic website navigation fallback
      else if (lowerStep.includes('website') || lowerStep.includes('home page')) {
        const envConfig = EnvironmentManager.getCurrentEnvironment();
        const parabankConfig = envConfig.applications['parabank'];
        if (parabankConfig) {
          targetUrl = parabankConfig.baseUrl;
          console.log(chalk.gray(`      Using ParaBank base URL from environment: ${targetUrl}`));
        }
      }
      
      if (targetUrl) {
        console.log(chalk.blue(`   → Navigating to: ${targetUrl}`));
        await this.mcpClient.callTool({
          name: 'playwright_navigate',
          arguments: { url: targetUrl }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        throw new Error(`Could not determine target URL for navigation step: "${step}"`);
      }
    }
    // Enter/Type text
    else if (lowerStep.includes('enter') && !lowerStep.includes('verify')) {
      if (lowerStep.includes('username')) {
        const username = testData?.username || EnvironmentManager.getValidCredentials().username;
        console.log(chalk.blue(`   → Entering username: ${username}`));
        await this.mcpClient.callTool({
          name: 'playwright_type',
          arguments: {
            selector: 'input[name="username"]',
            text: username
          }
        });
      } else if (lowerStep.includes('password')) {
        const password = testData?.password || EnvironmentManager.getValidCredentials().password;
        console.log(chalk.blue(`   → Entering password: ${'*'.repeat(password.length)}`));
        await this.mcpClient.callTool({
          name: 'playwright_type',
          arguments: {
            selector: 'input[name="password"]',
            text: password
          }
        });
      }
    }
    // Click
    else if (lowerStep.includes('click')) {
      if (lowerStep.includes('log in')) {
        console.log(chalk.blue(`   → Clicking Log In button`));
        await this.mcpClient.callTool({
          name: 'playwright_click',
          arguments: {
            selector: 'input[value="Log In"]'
          }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    // Select dropdown
    else if (lowerStep.includes('select')) {
      const match = step.match(/['"]([^'"]+)['"]/);
      if (match) {
        const value = match[1];
        console.log(chalk.blue(`   → Selecting: ${value}`));
        await this.mcpClient.callTool({
          name: 'playwright_select',
          arguments: {
            selector: 'select#type',
            value: value
          }
        });
      }
    }
    // Verify
    else if (lowerStep.includes('verify')) {
      console.log(chalk.blue(`   → Verifying: ${step}`));
      // Use get_text to check page state
      const snapshot: any = await this.mcpClient.callTool({
        name: 'playwright_get_text',
        arguments: { selector: 'body' }
      });
      
      const expectSuccess = step.includes('(EXPECT: SUCCESS)') || step.includes('(expect: success)');
      const expectFailure = step.includes('(EXPECT: FAILURE)') || step.includes('(expect: failure)');
      
      // Parse snapshot content for verification
      const content = JSON.stringify(snapshot).toLowerCase();
      
      if (lowerStep.includes('redirected') || lowerStep.includes('url contains')) {
        if (expectSuccess && lowerStep.includes('overview')) {
          if (!content.includes('overview') && !content.includes('account')) {
            throw new Error(`Expected to be redirected to overview page`);
          }
        } else if (expectFailure && lowerStep.includes('login fails')) {
          if (content.includes('overview')) {
            throw new Error(`Expected login to fail, but was redirected to overview page`);
          }
          if (!content.includes('error')) {
            throw new Error('Expected error message to be displayed');
          }
        }
      } else if (lowerStep.includes('welcome')) {
        if (!content.includes('welcome')) {
          throw new Error('Expected "Welcome" message not found');
        }
      } else if (lowerStep.includes('accounts overview')) {
        if (!content.includes('account') && !content.includes('overview')) {
          throw new Error('Expected "Accounts Overview" heading not found');
        }
      } else if (lowerStep.includes('log out')) {
        if (!content.includes('log out') && !content.includes('logout')) {
          throw new Error('Expected "Log Out" link not found');
        }
      }
    }
    
    // Small delay between steps
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  /**
   * Execute all test cases from a file
   */
  async executeFromFile(filePath: string): Promise<void> {
    console.log(chalk.blue.bold('\n🎯 Direct Prompt Executor'));
    console.log(chalk.blue('═'.repeat(60)));
    
    // Extract story ID and module from file path for report naming
    const fileName = path.basename(filePath, '.md');
    const storyId = fileName.replace(/-tests$/, ''); // AUTH-001-tests -> AUTH-001
    const moduleDir = path.basename(path.dirname(filePath)); // authentication
    
    // Clear previous results
    this.testResults = [];
    const executionStartTime = Date.now();
    
    try {
      // Parse test cases
      const testCases = await this.parseTestCasesFromFile(filePath);
      
      if (testCases.length === 0) {
        console.log(chalk.yellow('⚠️ No test cases found in file'));
        return;
      }
      
      // Initialize browser
      await this.initBrowser();
      
      // Execute each test case
      for (const testCase of testCases) {
        const testStartTime = Date.now();
        const result = await this.executeTestCase(testCase);
        const testEndTime = Date.now();
        
        // Store result with proper structure for results analyzer
        this.testResults.push({
          testName: testCase.name,
          priority: testCase.priority,
          status: result.status === 'passed' ? 'PASS' : 'FAIL',
          duration: testEndTime - testStartTime,
          steps: result.steps || [],
          error: result.errors.length > 0 ? result.errors.join('; ') : undefined
        });
        
        // Small delay between test cases
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const executionEndTime = Date.now();
      const totalDuration = executionEndTime - executionStartTime;
      
      // Print console summary
      this.printSummary();
      
      // Save results using TestPromptManager (same as Full AI Pipeline)
      console.log(chalk.blue('\n💾 Saving test results...'));
      await this.saveResults(storyId, moduleDir, totalDuration);
      
    } catch (error) {
      console.error(chalk.red('\n❌ Execution failed:'), error);
    } finally {
      await this.cleanup();
    }
  }
  
  /**
   * Print test execution summary to console
   */
  private printSummary(): void {
    console.log(chalk.blue('\n' + '═'.repeat(60)));
    console.log(chalk.blue.bold('📊 Test Execution Summary'));
    console.log(chalk.blue('═'.repeat(60)));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const total = this.testResults.length;
    
    console.log(chalk.white(`Total Tests: ${total}`));
    console.log(chalk.green(`✅ Passed: ${passed}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));
    console.log(chalk.cyan(`Pass Rate: ${((passed / total) * 100).toFixed(1)}%`));
    
    // Show failed tests
    if (failed > 0) {
      console.log(chalk.red('\n❌ Failed Tests:'));
      this.testResults.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(chalk.red(`   - ${r.testName}`));
        if (r.error) {
          console.log(chalk.gray(`     ${r.error}`));
        }
      });
    }
  }
  
  /**
   * Save test results with AI analysis (same as Full AI Pipeline)
   */
  private async saveResults(storyId: string, module: string, totalDuration: number): Promise<void> {
    try {
      // Convert TestResult[] to format expected by results analyzer
      const resultsForAnalyzer = this.testResults.map(result => ({
        testName: result.testName,
        status: result.status === 'PASS' ? 'passed' as const : 'failed' as const,
        duration: result.duration,
        steps: result.steps.map(step => ({
          step: step.step,
          status: step.status === 'PASS' ? 'passed' as const : 'failed' as const,
          duration: step.duration,
          error: step.error
        })),
        errors: result.error ? [result.error] : []
      }));
      
      // Use Results Analyzer (Agent 4) to get AI-powered insights
      console.log(chalk.blue('🤖 Running AI-powered results analysis...'));
      const analysis = await this.resultsAnalyzer.analyzeResults(resultsForAnalyzer);
      
      // Generate beautiful HTML report
      const htmlContent = this.resultsAnalyzer.generateHTMLReport(
        analysis,
        resultsForAnalyzer,
        storyId
      );
      
      // Prepare results object for JSON file
      const resultsData = {
        storyId,
        module,
        executionTime: new Date().toISOString(),
        totalDuration,
        summary: {
          totalTests: this.testResults.length,
          passed: this.testResults.filter(r => r.status === 'PASS').length,
          failed: this.testResults.filter(r => r.status === 'FAIL').length,
          passRate: analysis.passRate
        },
        analysis,
        results: resultsForAnalyzer
      };
      
      // Save both JSON and HTML reports using TestPromptManager
      await this.testPromptManager.saveTestResults(
        storyId,
        module,
        [resultsData], // Wrap in array as expected by saveTestResults
        htmlContent
      );
      
      console.log(chalk.green('✅ Test results saved successfully!'));
      console.log(chalk.cyan(`   📁 Location: outputs/test-results/${module}/`));
      console.log(chalk.cyan(`   📄 Files: ${storyId}-results-*.{json,html}`));
      console.log(chalk.magenta(`   🎨 Beautiful HTML report generated with AI insights!`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error saving results:'), error);
      // Don't fail the entire execution if saving fails
    }
  }
  
  /**
   * Cleanup MCP resources
   */
  async cleanup(): Promise<void> {
    console.log(chalk.blue('\n🧹 Cleaning up MCP resources...'));
    
    if (this.mcpClient) {
      try {
        await this.mcpClient.close();
        console.log(chalk.green('✅ MCP client closed (browser and server terminated)'));
      } catch (error) {
        console.error(chalk.red('Error closing MCP client:'), error);
      }
    }
  }
}

// CLI execution - Main entry point
const scriptPath = fileURLToPath(import.meta.url);
const isDirectExecution = process.argv[1] === scriptPath || process.argv[1] === scriptPath.replace(/\.ts$/, '.js');

if (isDirectExecution) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error(chalk.red('❌ No test file provided'));
    console.log(chalk.yellow('Usage: npm run prompt -- <path-to-test-file>'));
    console.log(chalk.yellow('Example: npm run prompt -- outputs/test-cases/authentication/AUTH-001-tests.md'));
    process.exit(1);
  }
  
  const executor = new DirectPromptExecutor();
  executor.executeFromFile(filePath)
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n❌ Execution failed:'));
      console.error(error);
      if (error instanceof Error && error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    });
}

export { DirectPromptExecutor };
