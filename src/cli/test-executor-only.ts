import { config } from 'dotenv';
import { TestExecutorAgent } from '../agents/test-executor.js';
import { ResultsAnalyzerAgent } from '../agents/results-analyzer.js';
import { TestPromptManager } from '../managers/test-prompt-manager.js';
import EnvironmentManager from '../config/environments.js';
import type { TestResult } from '../core/types.js';
import chalk from 'chalk';
import fs from 'fs/promises';

config();

/**
 * Test Executor Only - Uses existing test cases without regenerating them
 * Perfect for testing modified test cases manually
 */
async function runTestExecutorOnly(): Promise<void> {
  console.log(chalk.blue.bold('🎯 TEST EXECUTOR ONLY MODE'));
  console.log(chalk.blue('═'.repeat(50)));
  
  // Display environment configuration
  try {
    const envInfo = EnvironmentManager.getEnvironmentInfo();
    console.log(chalk.cyan(`🌍 Environment: ${envInfo.environment}`));
    console.log(chalk.cyan(`🏦 Application: ${envInfo.application}`));
    console.log(chalk.cyan(`🌐 Base URL: ${envInfo.baseUrl}`));
    console.log(chalk.blue('═'.repeat(50)));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Using default environment configuration'));
  }

  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(chalk.cyan('📋 Usage:'));
    console.log(chalk.white('  npx tsx test-executor-only.ts ACCT-002'));
    console.log(chalk.white('  npx tsx test-executor-only.ts AUTH-001'));
    return;
  }

  const storyId = args[0];

  try {
    // ===== STEP 1: LOAD EXISTING TEST CASES =====
    console.log(chalk.yellow(`\n📖 STEP 1: Loading existing test cases for ${storyId}...`));
    
    // Determine module folder based on story ID prefix
    let moduleFolder = 'general';
    const prefix = storyId.split('-')[0];
    switch (prefix) {
      case 'AUTH': moduleFolder = 'authentication'; break;
      case 'ACCT': moduleFolder = 'account-management'; break;
      case 'TRANS': moduleFolder = 'transactions'; break;
      case 'BILL': moduleFolder = 'bill-pay'; break;
      default: moduleFolder = 'general'; break;
    }
    
    const testCasesPath = `./outputs/test-cases/${moduleFolder}/${storyId}-tests.md`;
    console.log(chalk.cyan(`📁 Looking for test cases in: ${moduleFolder}/ folder`));
    
    // Check if test cases file exists
    try {
      await fs.access(testCasesPath);
      console.log(chalk.green(`✅ Found existing test cases: ${testCasesPath}`));
    } catch {
      console.log(chalk.red(`❌ No existing test cases found at: ${testCasesPath}`));
      console.log(chalk.yellow('💡 Run the full orchestrator first to generate test cases'));
      return;
    }

    // Read and parse test cases from the existing file
    const testCasesContent = await fs.readFile(testCasesPath, 'utf-8');
    const testCases = parseTestCasesFromMarkdown(testCasesContent);
    
    console.log(chalk.green(`✅ Loaded ${testCases.length} test cases from existing file`));
    testCases.forEach((tc, i) => {
      console.log(chalk.gray(`   ${i + 1}. ${tc.testName}`));
    });

    // ===== STEP 2: EXECUTE TESTS WITH EXISTING DATA =====
    console.log(chalk.yellow(`\n🎯 STEP 2: Executing tests with current test case data...`));
    
    const testExecutor = new TestExecutorAgent({ headed: false });
    console.log(chalk.cyan('   🔧 Initializing MCP Playwright Browser Automation...'));
    await testExecutor.initializeMCP();
    
    // Execute test cases
    const testResults: TestResult[] = [];
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(chalk.cyan(`\n   🧪 Test Case ${i + 1}: ${testCase.testName}`));
      
      try {
        const result = await testExecutor.executeTestCase(testCase);
        testResults.push(result);
        const statusIcon = result.status === 'passed' ? '✅' : '❌';
        console.log(chalk[result.status === 'passed' ? 'green' : 'red'](`   ${statusIcon} Test ${result.status}`));
      } catch (error) {
        console.log(chalk.red(`   ❌ Test failed: ${error}`));
        testResults.push({
          testName: testCase.testName,
          status: 'failed' as const,
          duration: 0,
          steps: [],
          errors: [error instanceof Error ? error.message : String(error)],
          screenshots: []
        });
      }
    }

    // ===== STEP 3: SAVE RESULTS =====
    console.log(chalk.yellow(`\n💾 STEP 3: Saving Test Results for ${storyId}...`));
    
    const promptManager = new TestPromptManager();
    await promptManager.initialize();
    
    // Generate HTML report using ResultsAnalyzerAgent
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    
    const resultsAnalyzer = new ResultsAnalyzerAgent(apiKey);
    const analysisResult = await resultsAnalyzer.analyzeResults(testResults);
    const htmlReport = resultsAnalyzer.generateHTMLReport(analysisResult, testResults, storyId);
    
    const resultsFile = await promptManager.saveTestResults(
      storyId,
      moduleFolder,
      testResults,
      htmlReport
    );
    
    console.log(chalk.green('✅ Test results saved'));
    console.log(chalk.gray(`   Location: ${resultsFile}`));

    // ===== FINAL SUMMARY =====
    const passed = testResults.filter(r => r.status === 'passed').length;
    const failed = testResults.filter(r => r.status === 'failed').length;
    
    console.log(chalk.green.bold(`\n🎉 TEST EXECUTION COMPLETED FOR ${storyId}!`));
    console.log(chalk.white('═'.repeat(50)));
    console.log(chalk.white('📊 RESULTS:'));
    console.log(chalk.gray(`   ✅ Passed: ${passed}`));
    console.log(chalk.gray(`   ❌ Failed: ${failed}`));
    console.log(chalk.gray(`   📄 Total: ${testResults.length}`));
    console.log(chalk.white('═'.repeat(50)));

  } catch (error) {
    console.error(chalk.red.bold('\n💥 Test execution failed:'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    throw error;
  }
}

/**
 * Parse test cases from markdown file
 */
function parseTestCasesFromMarkdown(content: string): any[] {
  try {
    // Extract the JSON section - look for the last JSON block
    const jsonMatches = content.match(/```json\s*([\s\S]*?)\s*```/g);
    if (!jsonMatches || jsonMatches.length === 0) {
      throw new Error('No JSON section found in test cases file');
    }
    
    // Get the last JSON block (should be the Automation-Ready JSON)
    const lastJsonBlock = jsonMatches[jsonMatches.length - 1];
    const jsonContent = lastJsonBlock.replace(/```json\s*/, '').replace(/\s*```$/, '');
    
    const jsonData = JSON.parse(jsonContent);
    console.log(chalk.blue(`📄 Parsed JSON with ${jsonData.testCases?.length || 0} test cases`));
    
    return jsonData.testCases || [];
  } catch (error) {
    console.error(chalk.red('Error parsing test cases from markdown:'), error);
    console.log(chalk.yellow('📝 Attempting to extract individual test cases from markdown...'));
    
    // Fallback: try to extract test cases from markdown structure
    return extractTestCasesFromMarkdown(content);
  }
}

/**
 * Fallback function to extract test cases from markdown structure
 */
function extractTestCasesFromMarkdown(content: string): any[] {
  const testCases: any[] = [];
  
  // Split by test case headers
  const testCaseSections = content.split(/### Test Case \d+:/);
  
  for (let i = 1; i < testCaseSections.length; i++) {
    const section = testCaseSections[i];
    
    // Extract test name
    const nameMatch = section.match(/^([^\n]+)/);
    const testName = nameMatch ? nameMatch[1].trim() : `Test Case ${i}`;
    
    // Extract steps
    const stepsMatch = section.match(/#### Test Steps:\s*([\s\S]*?)#### Assertions:/);
    const steps: string[] = [];
    if (stepsMatch) {
      const stepsList = stepsMatch[1].match(/^\d+\.\s*(.+)$/gm);
      if (stepsList) {
        steps.push(...stepsList.map(step => step.replace(/^\d+\.\s*/, '')));
      }
    }
    
    // Extract assertions
    const assertionsMatch = section.match(/#### Assertions:\s*([\s\S]*?)#### Test Data:/);
    const assertions: string[] = [];
    if (assertionsMatch) {
      const assertionsList = assertionsMatch[1].match(/^-\s*(.+)$/gm);
      if (assertionsList) {
        assertions.push(...assertionsList.map(assertion => assertion.replace(/^-\s*/, '')));
      }
    }
    
    // Extract test data
    let testData = {};
    const testDataMatch = section.match(/```json\s*([\s\S]*?)\s*```/);
    if (testDataMatch) {
      try {
        testData = JSON.parse(testDataMatch[1]);
      } catch {
        console.log(chalk.yellow(`⚠️  Could not parse test data for: ${testName}`));
      }
    }
    
    if (steps.length > 0) {
      testCases.push({
        testName,
        steps,
        assertions,
        testData
      });
    }
  }
  
  console.log(chalk.blue(`📄 Extracted ${testCases.length} test cases from markdown structure`));
  return testCases;
}

// Run the test executor only
runTestExecutorOnly()
  .then(() => {
    console.log(chalk.green('\n✅ Test execution completed successfully!'));
    process.exit(0);
  })
  .catch(error => {
    console.error(chalk.red('\n❌ Test execution failed:'), error);
    process.exit(1);
  });
