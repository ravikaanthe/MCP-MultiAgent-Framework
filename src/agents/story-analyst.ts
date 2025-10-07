import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import type { UserStoryRequirements } from '../core/types.js';

/**
 * Agent 1 - Story Analyst Agent
 * Analyzes user stories and extracts testable requirements
 */
export class StoryAnalystAgent {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Analyzes a user story and extracts structured requirements
   * @param userStory - The user story text to analyze
   * @returns Structured requirements object
   */
  async analyzeUserStory(userStory: string): Promise<UserStoryRequirements> {
    console.log(chalk.blue('🔍 Story Analyst Agent: Analyzing user story...'));
    
    try {
      const prompt = `
        Analyze this user story and extract testable requirements:
        
        User Story:
        ${userStory}
        
        Please extract and return a JSON object with:
        - feature: The main feature being tested (string)
        - actions: Array of user actions that can be tested
        - outcomes: Array of expected results/outcomes
        - edgeCases: Array of edge cases and error scenarios to test
        - acceptanceCriteria: Array of specific acceptance criteria
        
        Return ONLY the JSON object, no additional text.
      `;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      const requirements = JSON.parse(content.text) as UserStoryRequirements;
      
      console.log(chalk.green('✅ Story analysis completed'));
      console.log(chalk.gray(`   Feature: ${requirements.feature}`));
      console.log(chalk.gray(`   Actions: ${requirements.actions.length} identified`));
      console.log(chalk.gray(`   Edge cases: ${requirements.edgeCases.length} identified`));
      
      return requirements;
    } catch (error) {
      console.error(chalk.red('❌ Story analysis failed:'), error);
      
      // Fallback structure if API fails
      return {
        feature: 'Unknown Feature',
        actions: ['Navigate to page', 'Perform action'],
        outcomes: ['Expected result'],
        edgeCases: ['Invalid input', 'Network error'],
        acceptanceCriteria: ['Basic functionality works']
      };
    }
  }
}
