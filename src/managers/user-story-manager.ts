import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

/**
 * User Story Manager - Handles reading and managing user stories from modular file structure
 */
export class UserStoryManager {
  private storiesDirectory: string;
  private legacyFilePath: string;

  constructor(storiesDirectory: string = 'user-stories', legacyFilePath: string = 'user-stories.md') {
    this.storiesDirectory = storiesDirectory;
    this.legacyFilePath = legacyFilePath;
  }

  /**
   * Reads all user stories from the modular directory structure
   * @returns Array of user story objects with id, title, content, and module
   */
  async getAllStories(): Promise<UserStory[]> {
    try {
      // Check if new modular structure exists
      const dirExists = await this.directoryExists(this.storiesDirectory);
      
      if (dirExists) {
        return await this.loadStoriesFromModules();
      } else {
        // Fallback to legacy single file
        console.log(chalk.yellow('📁 Using legacy user-stories.md file. Consider migrating to modular structure.'));
        return await this.loadStoriesFromLegacyFile();
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to read user stories:'), error);
      return this.getDefaultStories();
    }
  }

  /**
   * Load stories from the new modular directory structure
   */
  private async loadStoriesFromModules(): Promise<UserStory[]> {
    const allStories: UserStory[] = [];
    
    try {
      const modules = await fs.readdir(this.storiesDirectory);
      
      for (const module of modules) {
        const modulePath = path.join(this.storiesDirectory, module);
        const isDirectory = (await fs.stat(modulePath)).isDirectory();
        
        if (isDirectory) {
          const moduleStories = await this.loadStoriesFromModule(module);
          allStories.push(...moduleStories);
        }
      }
      
      console.log(chalk.green(`📚 Loaded ${allStories.length} stories from ${modules.length} modules`));
      return allStories;
    } catch (error) {
      console.error(chalk.red('❌ Failed to load stories from modules:'), error);
      return [];
    }
  }

  /**
   * Load stories from a specific module directory
   */
  private async loadStoriesFromModule(moduleName: string): Promise<UserStory[]> {
    const stories: UserStory[] = [];
    const modulePath = path.join(this.storiesDirectory, moduleName);
    
    try {
      const files = await fs.readdir(modulePath);
      const markdownFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md');
      
      for (const file of markdownFiles) {
        const filePath = path.join(modulePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const moduleStories = this.parseStoriesFromMarkdown(content, moduleName);
        stories.push(...moduleStories);
      }
      
      console.log(chalk.blue(`📂 Module '${moduleName}': ${stories.length} stories loaded`));
      return stories;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to load stories from module '${moduleName}':`, error));
      return [];
    }
  }

  /**
   * Fallback to load stories from legacy single file
   */
  private async loadStoriesFromLegacyFile(): Promise<UserStory[]> {
    try {
      const content = await fs.readFile(this.legacyFilePath, 'utf-8');
      return this.parseStoriesFromMarkdown(content);
    } catch (error) {
      console.error(chalk.red('❌ Failed to read legacy user stories file:'), error);
      return this.getDefaultStories();
    }
  }

  /**
   * Check if directory exists
   */
  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Gets a specific user story by ID
   * @param storyId - The ID of the story to retrieve
   * @returns The user story content
   */
  async getStoryById(storyId: string): Promise<string> {
    const stories = await this.getAllStories();
    const story = stories.find(s => s.id === storyId);
    
    if (!story) {
      console.warn(chalk.yellow(`⚠️ Story with ID '${storyId}' not found. Using first available story.`));
      return stories[0]?.content || this.getDefaultStoryContent();
    }
    
    return story.content;
  }

  /**
   * Gets user story object by ID
   * @param storyId - The ID of the story to retrieve
   * @returns The user story object with id, title, content, and module
   */
  async getStoryObjectById(storyId: string): Promise<UserStory | null> {
    const stories = await this.getAllStories();
    const story = stories.find(s => s.id === storyId);
    
    if (!story) {
      console.warn(chalk.yellow(`⚠️ Story with ID '${storyId}' not found.`));
      return null;
    }
    
    return story;
  }

  /**
   * Gets user story by index (1-based)
   * @param index - The index of the story (1 = first story)
   * @returns The user story content
   */
  async getStoryByIndex(index: number): Promise<string> {
    const stories = await this.getAllStories();
    
    if (index < 1 || index > stories.length) {
      console.warn(chalk.yellow(`⚠️ Story index ${index} is out of range. Using first story.`));
      return stories[0]?.content || this.getDefaultStoryContent();
    }
    
    return stories[index - 1].content;
  }

  /**
   * Gets user story object by index (1-based)
   * @param index - The index of the story (1 = first story)
   * @returns The user story object with id, title, content, and module
   */
  async getStoryObjectByIndex(index: number): Promise<UserStory | null> {
    const stories = await this.getAllStories();
    
    if (index < 1 || index > stories.length) {
      console.warn(chalk.yellow(`⚠️ Story index ${index} is out of range.`));
      return null;
    }
    
    return stories[index - 1];
  }

  /**
   * Gets stories from a specific module
   * @param moduleName - The name of the module
   * @returns Array of user stories from that module
   */
  async getStoriesByModule(moduleName: string): Promise<UserStory[]> {
    const allStories = await this.getAllStories();
    return allStories.filter(story => story.module === moduleName);
  }

  /**
   * Lists all available modules
   */
  async listAvailableModules(): Promise<string[]> {
    try {
      const dirExists = await this.directoryExists(this.storiesDirectory);
      if (!dirExists) return [];
      
      const items = await fs.readdir(this.storiesDirectory);
      const modules: string[] = [];
      
      for (const item of items) {
        const itemPath = path.join(this.storiesDirectory, item);
        const isDirectory = (await fs.stat(itemPath)).isDirectory();
        if (isDirectory) {
          modules.push(item);
        }
      }
      
      return modules;
    } catch (error) {
      console.error(chalk.red('❌ Failed to list modules:'), error);
      return [];
    }
  }
  /**
   * Lists all available user stories organized by module
   */
  async listAvailableStories(): Promise<void> {
    const stories = await this.getAllStories();
    const modules = await this.listAvailableModules();
    
    console.log(chalk.cyan.bold('\n📚 Available User Stories by Module:'));
    console.log(chalk.cyan('═'.repeat(50)));
    
    if (modules.length > 0) {
      // Group stories by module
      const storiesByModule = new Map<string, UserStory[]>();
      
      stories.forEach(story => {
        const module = story.module || 'legacy';
        if (!storiesByModule.has(module)) {
          storiesByModule.set(module, []);
        }
        storiesByModule.get(module)!.push(story);
      });
      
      // Display stories organized by module
      for (const module of modules) {
        const moduleStories = storiesByModule.get(module) || [];
        if (moduleStories.length > 0) {
          console.log(chalk.yellow.bold(`\n📂 ${module.toUpperCase()} MODULE (${moduleStories.length} stories)`));
          console.log(chalk.yellow('─'.repeat(40)));
          
          moduleStories.forEach((story, index) => {
            console.log(chalk.white(`  ${index + 1}. ${story.title}`));
            console.log(chalk.gray(`     ID: ${story.id}`));
            console.log(chalk.gray(`     Preview: ${story.content.substring(0, 80)}...`));
            console.log();
          });
        }
      }
      
      // Show legacy stories if any
      const legacyStories = storiesByModule.get('legacy') || [];
      if (legacyStories.length > 0) {
        console.log(chalk.magenta.bold(`\n📄 LEGACY STORIES (${legacyStories.length} stories)`));
        console.log(chalk.magenta('─'.repeat(40)));
        legacyStories.forEach((story, index) => {
          console.log(chalk.white(`  ${index + 1}. ${story.title}`));
          console.log(chalk.gray(`     ID: ${story.id}`));
          console.log();
        });
      }
    } else {
      // Fallback to simple list
      stories.forEach((story, index) => {
        console.log(chalk.white(`${index + 1}. ${story.title}`));
        console.log(chalk.gray(`   ID: ${story.id}`));
        console.log(chalk.gray(`   Preview: ${story.content.substring(0, 100)}...`));
        console.log();
      });
    }
    
    console.log(chalk.green(`\n📊 Total: ${stories.length} stories across ${modules.length} modules`));
  }

  /**
   * Adds a new user story to a module
   * @param title - The title of the story
   * @param content - The story content
   * @param moduleName - The module to add the story to
   * @param fileName - Optional specific file name within the module
   */
  async addStory(title: string, content: string, moduleName: string = 'user-management', fileName: string = 'custom-stories.md'): Promise<void> {
    try {
      const moduleDir = path.join(this.storiesDirectory, moduleName);
      const filePath = path.join(moduleDir, fileName);
      
      // Ensure module directory exists
      await fs.mkdir(moduleDir, { recursive: true });
      
      const storyId = this.generateStoryId(title);
      const newStorySection = `\n## Story ${storyId}: ${title}\n\`\`\`\n${content}\n\`\`\`\n`;
      
      // Check if file exists, if not create it with header
      let existingContent = '';
      try {
        existingContent = await fs.readFile(filePath, 'utf-8');
      } catch {
        // File doesn't exist, create with header
        existingContent = `# ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module - Custom Stories\n\nThis file contains custom user stories added to the ${moduleName} module.\n`;
      }
      
      const updatedContent = existingContent + newStorySection;
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      
      console.log(chalk.green(`✅ Added new story: ${title} (ID: ${storyId}) to module: ${moduleName}`));
    } catch (error) {
      console.error(chalk.red('❌ Failed to add new story:'), error);
    }
  }

  /**
   * Parses user stories from markdown content
   * @param content - The markdown content to parse
   * @param moduleName - Optional module name to assign to stories
   */
  private parseStoriesFromMarkdown(content: string, moduleName?: string): UserStory[] {
    const stories: UserStory[] = [];
    
    // Split by ## headers to get individual stories
    const sections = content.split(/^## /m).filter(section => section.trim());
    
    sections.forEach(section => {
      const lines = section.split('\n');
      const titleLine = lines[0]?.trim();
      
      if (!titleLine || titleLine.startsWith('#')) return; // Skip headers
      
      // Extract title and ID from the title line
      // Format: "Story AUTH-001: Basic User Login" or just "Basic User Login"
      const storyIdMatch = titleLine.match(/^Story\s+([A-Z]+-\d+):\s*(.+)$/);
      let id: string;
      let title: string;
      
      if (storyIdMatch) {
        // Extract the proper story ID and title
        id = storyIdMatch[1]; // e.g., "AUTH-001"
        title = storyIdMatch[2]; // e.g., "Basic User Login"
      } else {
        // Fallback: generate ID from title
        title = titleLine.replace(/^Story \d+:\s*/, '').trim();
        id = this.generateStoryId(title);
      }
      
      // Find content between ``` blocks
      const codeBlockStart = section.indexOf('```');
      const codeBlockEnd = section.lastIndexOf('```');
      
      if (codeBlockStart !== -1 && codeBlockEnd !== -1 && codeBlockStart !== codeBlockEnd) {
        const content = section
          .substring(codeBlockStart + 3, codeBlockEnd)
          .trim();
        
        if (content) {
          stories.push({ 
            id, 
            title, 
            content,
            module: moduleName 
          });
        }
      }
    });
    
    return stories;
  }

  /**
   * Generates a story ID from title
   */
  private generateStoryId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 20);
  }

  /**
   * Returns default stories if file reading fails
   */
  private getDefaultStories(): UserStory[] {
    return [
      {
        id: 'user-login',
        title: 'User Login Authentication',
        content: this.getDefaultStoryContent()
      }
    ];
  }

  /**
   * Returns default story content
   */
  private getDefaultStoryContent(): string {
    return `As a user, I want to log into the application
So that I can access my personalized dashboard

Acceptance Criteria:
- User can enter username and password
- Valid credentials redirect to dashboard
- Invalid credentials show error message
- Password field is masked
- Login button is disabled when fields are empty`;
  }
}

/**
 * User Story interface
 */
export interface UserStory {
  id: string;
  title: string;
  content: string;
  module?: string;
}
