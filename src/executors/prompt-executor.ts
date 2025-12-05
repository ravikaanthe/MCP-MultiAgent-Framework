#!/usr/bin/env node
/**
 * Direct Prompt Executor
 * Runs tests directly from prompt/test-case markdown files using REAL Playwright MCP
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, ChildProcess } from 'child_process';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestCase {
  name: string;
  priority: string;
  steps: string[];
  testData?: any;
}

class DirectPromptExecutor {
  private mcpClient: Client | null = null;
  private mcpProcess: ChildProcess | null = null;
  private isConnected = false;
  
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
      const mcpServerPath = 'src/mcp/playwright-mcp-server.ts';
      
      // On Windows, we need to use npx.cmd instead of tsx directly
      const isWindows = process.platform === 'win32';
      const command = isWindows ? 'npx.cmd' : 'npx';
      
      console.log(chalk.gray(`📡 Starting MCP server: ${command} tsx ${mcpServerPath} --headed`));

      // Create MCP client
      this.mcpClient = new Client(
        { name: 'direct-prompt-executor', version: '1.0.0' },
        { capabilities: {} }
      );

      // Connect via stdio transport
      const transport = new StdioClientTransport({
        command: command,
        args: ['tsx', mcpServerPath, '--headed']
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
  async executeTestCase(testCase: TestCase): Promise<{ status: 'passed' | 'failed'; errors: string[] }> {
    console.log(chalk.yellow(`\n🧪 Executing: ${testCase.name}`));
    console.log(chalk.gray(`   Priority: ${testCase.priority}`));
    
    const errors: string[] = [];
    
    try {
      for (let i = 0; i < testCase.steps.length; i++) {
        const step = testCase.steps[i];
        console.log(chalk.cyan(`   ${i + 1}. ${step}`));
        
        try {
          await this.executeStep(step, testCase.testData);
          console.log(chalk.green(`      ✅ Step passed`));
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.log(chalk.red(`      ❌ Step failed: ${errorMsg}`));
          errors.push(`Step ${i + 1}: ${errorMsg}`);
        }
      }
      
      const status = errors.length === 0 ? 'passed' : 'failed';
      console.log(status === 'passed' 
        ? chalk.green(`   ✅ Test PASSED`) 
        : chalk.red(`   ❌ Test FAILED (${errors.length} errors)`)
      );
      
      return { status, errors };
      
    } catch (error) {
      console.error(chalk.red(`   ❌ Test execution error: ${error}`));
      return { status: 'failed', errors: [String(error)] };
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
      const urlMatch = step.match(/https?:\/\/[^\s)]+/);
      if (urlMatch) {
        console.log(chalk.blue(`   → Navigating to: ${urlMatch[0]}`));
        await this.mcpClient.callTool({
          name: 'mcp_playwright_browser_navigate',
          arguments: { url: urlMatch[0] }
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    // Enter/Type text
    else if (lowerStep.includes('enter') && !lowerStep.includes('verify')) {
      if (lowerStep.includes('username')) {
        const username = testData?.username || 'ficusroot';
        console.log(chalk.blue(`   → Entering username: ${username}`));
        await this.mcpClient.callTool({
          name: 'mcp_playwright_browser_type',
          arguments: {
            element: 'username field',
            ref: 'input[name="username"]',
            text: username
          }
        });
      } else if (lowerStep.includes('password')) {
        const password = testData?.password || 'katal@n@ravi';
        console.log(chalk.blue(`   → Entering password: ${'*'.repeat(password.length)}`));
        await this.mcpClient.callTool({
          name: 'mcp_playwright_browser_type',
          arguments: {
            element: 'password field',
            ref: 'input[name="password"]',
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
          name: 'mcp_playwright_browser_click',
          arguments: {
            element: 'Log In button',
            ref: 'input[value="Log In"]'
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
          name: 'mcp_playwright_browser_select_option',
          arguments: {
            element: 'account type dropdown',
            ref: 'select#type',
            values: [value]
          }
        });
      }
    }
    // Verify
    else if (lowerStep.includes('verify')) {
      console.log(chalk.blue(`   → Verifying: ${step}`));
      // Use snapshot to check page state
      const snapshot: any = await this.mcpClient.callTool({
        name: 'mcp_playwright_browser_snapshot',
        arguments: {}
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
      const results: Array<{ name: string; status: 'passed' | 'failed'; errors: string[] }> = [];
      
      for (const testCase of testCases) {
        const result = await this.executeTestCase(testCase);
        results.push({
          name: testCase.name,
          status: result.status,
          errors: result.errors
        });
        
        // Small delay between test cases
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Print summary
      console.log(chalk.blue('\n' + '═'.repeat(60)));
      console.log(chalk.blue.bold('📊 Test Execution Summary'));
      console.log(chalk.blue('═'.repeat(60)));
      
      const passed = results.filter(r => r.status === 'passed').length;
      const failed = results.filter(r => r.status === 'failed').length;
      
      console.log(chalk.white(`Total Tests: ${results.length}`));
      console.log(chalk.green(`✅ Passed: ${passed}`));
      console.log(chalk.red(`❌ Failed: ${failed}`));
      console.log(chalk.cyan(`Pass Rate: ${((passed / results.length) * 100).toFixed(1)}%`));
      
      // Show failed tests
      if (failed > 0) {
        console.log(chalk.red('\n❌ Failed Tests:'));
        results.filter(r => r.status === 'failed').forEach(r => {
          console.log(chalk.red(`   - ${r.name}`));
          r.errors.forEach(err => console.log(chalk.gray(`     ${err}`)));
        });
      }
      
    } catch (error) {
      console.error(chalk.red('\n❌ Execution failed:'), error);
    } finally {
      await this.cleanup();
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
