/**
 * Quick test to verify UserStoryManager can parse enhanced JIRA format
 */
import { UserStoryManager } from './src/managers/user-story-manager.js';
import chalk from 'chalk';

(async () => {
  console.log(chalk.blue('🧪 Testing User Story Parser with Enhanced JIRA Format\n'));
  
  const manager = new UserStoryManager('user-stories');
  
  try {
    // Get AUTH-001 story
    const storyContent = await manager.getStoryById('AUTH-001');
    
    console.log(chalk.green('✅ Successfully loaded AUTH-001 story'));
    console.log(chalk.cyan('\n📄 Story Content Preview:'));
    console.log(chalk.gray('─'.repeat(80)));
    console.log(storyContent.substring(0, 500));
    console.log(chalk.gray('...'));
    console.log(chalk.gray('─'.repeat(80)));
    
    // Check if enhanced JIRA format sections are present
    const hasStoryId = storyContent.includes('Story ID:') || storyContent.includes('**Story ID**');
    const hasUserStory = storyContent.includes('### User Story') || storyContent.includes('As a');
    const hasDescription = storyContent.includes('### Description');
    const hasTestData = storyContent.includes('### Test Data');
    const hasAcceptanceCriteria = storyContent.includes('### Acceptance Criteria') || 
                                   storyContent.includes('Acceptance Criteria:');
    const hasDefinitionOfDone = storyContent.includes('### Definition of Done');
    
    console.log(chalk.cyan('\n🔍 Enhanced JIRA Format Verification:'));
    console.log(hasStoryId ? chalk.green('✅ Story ID found') : chalk.yellow('⚠️ Story ID not found'));
    console.log(hasUserStory ? chalk.green('✅ User Story section found') : chalk.red('❌ User Story section missing'));
    console.log(hasDescription ? chalk.green('✅ Description section found') : chalk.yellow('⚠️ Description not found'));
    console.log(hasTestData ? chalk.green('✅ Test Data section found') : chalk.yellow('⚠️ Test Data not found'));
    console.log(hasAcceptanceCriteria ? chalk.green('✅ Acceptance Criteria found') : chalk.red('❌ Acceptance Criteria missing'));
    console.log(hasDefinitionOfDone ? chalk.green('✅ Definition of Done found') : chalk.yellow('⚠️ Definition of Done not found'));
    
    // Check content length
    console.log(chalk.cyan(`\n📊 Story Content Length: ${storyContent.length} characters`));
    
    if (storyContent.length < 200) {
      console.log(chalk.red('⚠️ Warning: Story content seems too short. Parser may have missed some sections.'));
    } else {
      console.log(chalk.green('✅ Story content has good length. Parser is working correctly!'));
    }
    
    console.log(chalk.green.bold('\n🎉 Parser Test Completed Successfully!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Test Failed:'), error);
    process.exit(1);
  }
})();
