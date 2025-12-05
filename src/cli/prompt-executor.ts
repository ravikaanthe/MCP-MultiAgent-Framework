#!/usr/bin/env node
/**
 * Direct Prompt Executor
 * Runs tests directly from prompt/test-case markdown files using real Playwright browser
 */

import { chromium, Browser, Page } from 'playwright';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

interface TestCase {
  name: string;
  priority: string;
  steps: string[];
  testData?: any;
}

class DirectPromptExecutor {
  private browser: Browser | null = null;
  private page: Page | null = null;
  
  /**
   * Parse test cases from markdown file
   */
  async parseTestCasesFromFile(filePath: string): Promise<TestCase[]> {
    console.log(chalk.blue(`📖 Reading test cases from: ${filePath}`));
    
    const content = await fs.readFile(filePath, 'utf-8');
    const testCases: TestCase[] = [];
    
    // Split by test case headers
    const testCaseRegex = /### Test Case \d+: (.+?)\n\*\*Priority:\*\* (.+?)\n/g;
    const matches = [...content.matchAll(testCaseRegex)];
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const testName = match[1];
      const priority = match[2];
      
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
  }
  
  /**
   * Initialize browser
   */
  async initBrowser(): Promise<void> {
    console.log(chalk.blue('🚀 Initializing Playwright browser...'));
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    console.log(chalk.green('✅ Browser initialized'));
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
   * Execute a single test step
   */
  private async executeStep(step: string, testData: any): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    
    const lowerStep = step.toLowerCase();
    
    // Navigate
    if (lowerStep.includes('navigate to')) {
      const urlMatch = step.match(/https?:\/\/[^\s)]+/);
      if (urlMatch) {
        await this.page.goto(urlMatch[0], { waitUntil: 'networkidle' });
        await this.page.waitForTimeout(1000);
      }
    }
    // Enter/Type text
    else if (lowerStep.includes('enter') && !lowerStep.includes('verify')) {
      if (lowerStep.includes('username')) {
        const username = testData?.username || 'ficusroot';
        await this.page.fill('input[name="username"]', username);
      } else if (lowerStep.includes('password')) {
        const password = testData?.password || 'katal@n@ravi';
        await this.page.fill('input[name="password"]', password);
      }
    }
    // Click
    else if (lowerStep.includes('click')) {
      if (lowerStep.includes('log in')) {
        await this.page.click('input[value="Log In"]');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
      }
    }
    // Select dropdown
    else if (lowerStep.includes('select')) {
      const match = step.match(/['"]([^'"]+)['"]/);
      if (match) {
        const value = match[1];
        await this.page.selectOption('select#type', value);
      }
    }
    // Verify
    else if (lowerStep.includes('verify')) {
      const expectSuccess = step.includes('(EXPECT: SUCCESS)') || step.includes('(expect: success)');
      const expectFailure = step.includes('(EXPECT: FAILURE)') || step.includes('(expect: failure)');
      
      if (lowerStep.includes('redirected') || lowerStep.includes('url contains')) {
        const currentUrl = this.page.url();
        
        if (expectSuccess && lowerStep.includes('overview')) {
          if (!currentUrl.includes('overview.htm')) {
            throw new Error(`Expected to be redirected to overview page, but URL is: ${currentUrl}`);
          }
        } else if (expectFailure && lowerStep.includes('login fails')) {
          if (currentUrl.includes('overview.htm')) {
            throw new Error(`Expected login to fail, but was redirected to overview page`);
          }
          // Check for error message
          const errorVisible = await this.page.isVisible('.error, [class*="error"], [class*="Error"]').catch(() => false);
          if (!errorVisible) {
            throw new Error('Expected error message to be displayed');
          }
        }
      } else if (lowerStep.includes('welcome')) {
        const welcomeVisible = await this.page.isVisible('text=/welcome/i').catch(() => false);
        if (!welcomeVisible) {
          throw new Error('Expected "Welcome" message not found');
        }
      } else if (lowerStep.includes('accounts overview')) {
        const headingVisible = await this.page.isVisible('h1:has-text("Accounts Overview")').catch(() => false);
        if (!headingVisible) {
          throw new Error('Expected "Accounts Overview" heading not found');
        }
      } else if (lowerStep.includes('log out')) {
        const logoutVisible = await this.page.isVisible('a:has-text("Log Out")').catch(() => false);
        if (!logoutVisible) {
          throw new Error('Expected "Log Out" link not found');
        }
      }
    }
    
    // Small delay between steps
    await this.page.waitForTimeout(500);
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
        await this.page!.waitForTimeout(2000);
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
   * Cleanup
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      console.log(chalk.blue('\n🧹 Cleaning up...'));
      await this.browser.close();
      console.log(chalk.green('✅ Browser closed'));
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
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
      console.log(chalk.green('\n✅ Execution completed'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n❌ Execution failed:'), error);
      process.exit(1);
    });
}

export { DirectPromptExecutor };
