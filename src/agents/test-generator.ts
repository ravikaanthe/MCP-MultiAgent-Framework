import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import type { UserStoryRequirements, TestCase } from '../core/types.js';
import EnvironmentManager from '../config/environments.js';

/**
 * Agent 2 - Test Generator Agent
 * Generates comprehensive test cases from requirements
 */
export class TestGeneratorAgent {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Generates test cases from analyzed requirements
   * @param requirements - Structured requirements from Story Analyst Agent
   * @returns Array of test cases with priorities
   */
  async generateTestCases(requirements: UserStoryRequirements): Promise<TestCase[]> {
    console.log(chalk.blue('🧪 Test Generator Agent: Generating test cases...'));
    
    // Get credentials and URLs from environment configuration
    const validCreds = EnvironmentManager.getValidCredentials();
    const invalidCreds = EnvironmentManager.getInvalidCredentials();
    const urls = EnvironmentManager.getUrls();
    
    try {
      const prompt = `
        You are a senior QA engineer creating comprehensive test cases for this feature:
        
        Feature: ${requirements.feature}
        Actions: ${requirements.actions.join(', ')}
        Outcomes: ${requirements.outcomes.join(', ')}
        Edge Cases: ${requirements.edgeCases.join(', ')}
        Acceptance Criteria: ${requirements.acceptanceCriteria.join(', ')}
        
        INSTRUCTIONS:
        1. Create test cases in NATURAL LANGUAGE FORMAT with clear steps
        2. Use expectation markers: (EXPECT: SUCCESS) or (EXPECT: FAILURE)
        3. Generate 4-6 test cases covering positive, negative, and edge cases
        4. Base ALL test scenarios on the specific requirements provided above
        5. DO NOT assume any specific functionality not mentioned in the requirements
        
        Test Case Structure:
        - POSITIVE TESTS: Main happy path flows based on the actions/outcomes
        - NEGATIVE TESTS: Invalid inputs, unauthorized access, error conditions
        - EDGE CASES: Boundary conditions from the edge cases provided
        
        For web applications, use these credentials if login is required:
        - Valid username: "${validCreds.username}"
        - Valid password: "${validCreds.password}"
        - Invalid username: "${invalidCreds.username}"
        - Invalid password: "${invalidCreds.password}"
        - Base URL: "${urls.baseUrl}"
        
        For each test case, provide:
        - testName: Clear descriptive name specific to the feature
        - steps: Natural language steps with INLINE VALIDATIONS
        - testData: Object with relevant test data (adapt to the feature requirements)
        - priority: "high" for main flows, "medium" for negative tests, "low" for edge cases
        
        EXAMPLE FORMAT:
        {
          "testName": "Login with valid credentials and access main feature",
          "steps": [
            "Navigate to the application URL",
            "Enter valid credentials",
            "Click login button",
            "Verify login success (EXPECT: SUCCESS)",
            "Perform main feature action",
            "Verify expected outcome (EXPECT: SUCCESS)"
          ],
          "testData": {
            "username": "${validCreds.username}",
            "password": "${validCreds.password}"
          },
          "priority": "high"
        }
        
        Return ONLY a valid JSON array of test cases with no additional text or formatting.
      `;

      console.log(chalk.gray('   Sending request to Claude API...'));
      
      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      console.log(chalk.gray('   Parsing response...'));
      console.log(chalk.gray(`   Raw response length: ${content.text.length} chars`));
      
      // Clean the response to ensure it's valid JSON
      let cleanResponse = content.text.trim();
      
      // Remove any markdown formatting that might have been added
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse the JSON
      const testCases = JSON.parse(cleanResponse) as TestCase[];
      
      console.log(chalk.green('✅ Test case generation completed'));
      console.log(chalk.gray(`   Generated ${testCases.length} test cases`));
      
      // Fill in credentials from environment if they're empty or placeholder
      testCases.forEach(tc => {
        if (tc.testData) {
          // Check if test case expects valid credentials (success scenarios)
          const stepsText = tc.steps.join(' ').toLowerCase();
          const expectsSuccess = stepsText.includes('expect: success');
          const expectsFailure = stepsText.includes('expect: failure');
          
          // Fill in valid credentials for success scenarios or empty username
          if ((expectsSuccess || (!expectsFailure && tc.testName.toLowerCase().includes('valid'))) && 
              (!tc.testData.username || tc.testData.username === '')) {
            tc.testData.username = validCreds.username;
            tc.testData.password = validCreds.password;
            console.log(chalk.gray(`   Filled valid credentials for: ${tc.testName}`));
          }
          // Fill in invalid credentials for failure scenarios
          else if ((expectsFailure || tc.testName.toLowerCase().includes('invalid')) && 
                   (!tc.testData.username || tc.testData.username === 'invaliduser')) {
            if (tc.testName.toLowerCase().includes('invalid username')) {
              tc.testData.username = invalidCreds.username;
              tc.testData.password = validCreds.password;  // Valid password
              console.log(chalk.gray(`   Filled invalid username + valid password for: ${tc.testName}`));
            } else if (tc.testName.toLowerCase().includes('invalid password')) {
              tc.testData.username = validCreds.username;  // Valid username
              tc.testData.password = invalidCreds.password;
              console.log(chalk.gray(`   Filled valid username + invalid password for: ${tc.testName}`));
            } else {
              tc.testData.username = invalidCreds.username;
              tc.testData.password = invalidCreds.password;
              console.log(chalk.gray(`   Filled invalid credentials for: ${tc.testName}`));
            }
          }
          // Fill empty passwords with valid password if username is set
          else if (tc.testData.username && (!tc.testData.password || tc.testData.password === '')) {
            tc.testData.password = validCreds.password;
            console.log(chalk.gray(`   Filled missing password for: ${tc.testName}`));
          }
        }
      });
      
      const highPriority = testCases.filter(tc => tc.priority === 'high').length;
      const mediumPriority = testCases.filter(tc => tc.priority === 'medium').length;
      const lowPriority = testCases.filter(tc => tc.priority === 'low').length;
      
      console.log(chalk.gray(`   Priority breakdown: ${highPriority} high, ${mediumPriority} medium, ${lowPriority} low`));
      
      return testCases;
    } catch (error) {
      console.error(chalk.red('❌ Test case generation failed:'), error);
      console.error(chalk.red('   Falling back to manual test cases...'));
      
      // Get credentials and URLs from environment for fallback cases
      const validCreds = EnvironmentManager.getValidCredentials();
      const invalidCreds = EnvironmentManager.getInvalidCredentials();
      const urls = EnvironmentManager.getUrls();
      const sourceAccount = process.env.VALID_SOURCE_ACCOUNT || "";
      const accountType = process.env.DEFAULT_ACCOUNT_TYPE || "SAVINGS";
      
      // Enhanced fallback test cases with improved natural language format
      return [
        {
          testName: 'Login with valid credentials and complete main flow',
          steps: [
            `Navigate to the ParaBank login page at '${urls.loginUrl}'`,
            `Enter the valid username '${validCreds.username}'`,
            `Enter the valid password '${validCreds.password}'`,
            'Click the Log In button',
            'Verify that login succeeds and user is redirected to account overview page (EXPECT: SUCCESS)',
            'Navigate to the Open New Account page',
            `Select '${accountType}' as account type`,
            `Select valid source account '${sourceAccount}' from dropdown`,
            'Click the \'Open new account\' button',
            'Verify that new savings account is created successfully (EXPECT: SUCCESS)'
          ],
          assertions: [], // Validations are now embedded in steps with EXPECT markers
          testData: {
            username: validCreds.username,
            password: validCreds.password,
            sourceAccount: sourceAccount,
            accountType: accountType
          },
          priority: 'high'
        },
        {
          testName: 'Login with invalid credentials and verify failure',
          steps: [
            `Navigate to the ParaBank login page at '${urls.loginUrl}'`,
            `Enter the invalid username '${invalidCreds.username}'`,
            `Enter the invalid password '${invalidCreds.password}'`,
            'Click the Log In button',
            'Verify that login fails and error message is displayed (EXPECT: FAILURE)',
            'Attempt to navigate to protected account overview page',
            'Verify that access is denied and user remains on login page (EXPECT: FAILURE)'
          ],
          assertions: [], // Validations are now embedded in steps with EXPECT markers
          testData: {
            username: invalidCreds.username,
            password: invalidCreds.password
          },
          priority: 'medium'
        },
        {
          testName: 'Attempt to access protected pages without logging in',
          steps: [
            `Navigate directly to the ParaBank Open New Account page at '${urls.openAccountUrl}'`,
            'Verify that user is redirected to login page and cannot access protected page (EXPECT: FAILURE)'
          ],
          assertions: [], // Validations are now embedded in steps with EXPECT markers
          testData: {
            username: '',
            password: ''
          },
          priority: 'medium'
        },
        {
          testName: 'Complete flow with valid source account',
          steps: [
            `Navigate to the ParaBank login page at '${urls.loginUrl}'`,
            `Enter the valid username '${validCreds.username}'`,
            `Enter the valid password '${validCreds.password}'`,
            'Click the Log In button',
            'Verify that login succeeds and user is redirected to account overview page (EXPECT: SUCCESS)',
            `Navigate to the Open New Account page at '${urls.openAccountUrl}'`,
            `Select '${accountType}' as account type`,
            `Select valid source account '${sourceAccount}' from dropdown`,
            'Click the \'Open new account\' button',
            'Verify that new account is created successfully (EXPECT: SUCCESS)'
          ],
          assertions: [], // Validations are now embedded in steps with EXPECT markers
          testData: {
            username: validCreds.username,
            password: validCreds.password,
            sourceAccount: sourceAccount,
            accountType: accountType
          },
          priority: 'high'
        },
        {
          testName: 'Attempt to open account with invalid source account',
          steps: [
            `Navigate to the ParaBank login page at '${urls.loginUrl}'`,
            `Enter the valid username '${validCreds.username}'`,
            `Enter the valid password '${validCreds.password}'`,
            'Click the Log In button',
            'Verify that login succeeds and user is redirected to account overview page (EXPECT: SUCCESS)',
            `Navigate to the Open New Account page at '${urls.openAccountUrl}'`,
            `Select '${accountType}' as account type`,
            `Select invalid source account '${process.env.INVALID_SOURCE_ACCOUNT || "99999"}' from dropdown`,
            'Click the \'Open new account\' button',
            'Verify that account creation fails with appropriate error message (EXPECT: FAILURE)'
          ],
          assertions: [], // Validations are now embedded in steps with EXPECT markers
          testData: {
            username: validCreds.username,
            password: validCreds.password,
            sourceAccount: process.env.INVALID_SOURCE_ACCOUNT || "99999",
            accountType: accountType
          },
          priority: 'medium'
        },
        {
          testName: 'Verify network error handling',
          steps: [
            'Simulate a network error (e.g., by disabling the internet connection)',
            'Attempt to perform various banking actions (e.g., login, open account, transfer funds)',
            'Verify that application handles network error gracefully and displays appropriate error messages (EXPECT: FAILURE)',
            'Restore the network connection',
            'Verify that application resumes normal operation (EXPECT: SUCCESS)'
          ],
          assertions: [], // Validations are now embedded in steps with EXPECT markers
          testData: {
            networkError: true
          },
          priority: 'low'
        }
      ];
    }
  }
}
