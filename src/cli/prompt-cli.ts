#!/usr/bin/env node

/**
 * Prompt CLI - Command Line Interface for managing test prompts
 * Provides functionality to list, view, and manage generated test prompts
 */

import { TestPromptManager } from '../managers/test-prompt-manager.js';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

class PromptCLI {
  private promptManager: TestPromptManager;

  constructor() {
    this.promptManager = new TestPromptManager();
  }

  /**
   * Display help information
   */
  private showHelp(): void {
    console.log(chalk.blue.bold('📋 Test Prompt CLI'));
    console.log(chalk.blue('═'.repeat(50)));
    console.log(chalk.cyan('Available commands:'));
    console.log(chalk.white('  list                     - List all available prompts'));
    console.log(chalk.white('  view <file>              - View specific prompt file'));
    console.log(chalk.white('  requirements             - List requirements prompts'));
    console.log(chalk.white('  test-cases               - List test case prompts'));
    console.log(chalk.white('  results                  - List test result files'));
    console.log(chalk.white('  clean                    - Clean up old prompt files'));
    console.log(chalk.white('  init                     - Initialize prompt directories'));
    console.log(chalk.white('  help                     - Show this help'));
    console.log();
    console.log(chalk.gray('Examples:'));
    console.log(chalk.gray('  npm run view-prompts'));
    console.log(chalk.gray('  npm run prompt-cli list'));
    console.log(chalk.gray('  npm run prompt-cli view requirements/account-management/ACCT-002-requirements-2023-10-06.md'));
  }

  /**
   * List all available prompt files
   */
  private async listAllPrompts(): Promise<void> {
    try {
      await this.promptManager.initialize();
      
      console.log(chalk.blue.bold('📋 Available Test Prompts'));
      console.log(chalk.blue('═'.repeat(50)));

      // List requirements
      await this.listPromptCategory('Requirements', 'outputs/requirements');
      
      // List test cases
      await this.listPromptCategory('Test Cases', 'outputs/test-cases');
      
      // List test results
      await this.listPromptCategory('Test Results', 'outputs/test-results');

    } catch (error) {
      console.error(chalk.red('❌ Failed to list prompts:'), error);
    }
  }

  /**
   * List prompts in a specific category
   */
  private async listPromptCategory(categoryName: string, dirPath: string): Promise<void> {
    try {
      const exists = await this.directoryExists(dirPath);
      if (!exists) {
        console.log(chalk.yellow(`\n📁 ${categoryName}: No files found (directory doesn't exist)`));
        return;
      }

      const files = await this.getAllFilesRecursively(dirPath);
      
      if (files.length === 0) {
        console.log(chalk.yellow(`\n📁 ${categoryName}: No files found`));
        return;
      }

      console.log(chalk.cyan(`\n📁 ${categoryName} (${files.length} files):`));
      
      // Group files by subdirectory
      const groupedFiles = new Map<string, string[]>();
      
      for (const file of files) {
        const relativePath = path.relative(dirPath, file);
        const dir = path.dirname(relativePath);
        const dirKey = dir === '.' ? 'root' : dir;
        
        if (!groupedFiles.has(dirKey)) {
          groupedFiles.set(dirKey, []);
        }
        groupedFiles.get(dirKey)!.push(relativePath);
      }

      for (const [dir, fileList] of groupedFiles.entries()) {
        if (dir !== 'root') {
          console.log(chalk.gray(`  📂 ${dir}/`));
        }
        
        for (const file of fileList.sort()) {
          const filePath = path.join(dirPath, file);
          const stats = await fs.stat(filePath);
          const size = this.formatFileSize(stats.size);
          const modified = stats.mtime.toISOString().split('T')[0];
          
          console.log(chalk.white(`    📄 ${path.basename(file)} ${chalk.gray(`(${size}, ${modified})`)}`));
        }
      }

    } catch (error) {
      console.error(chalk.red(`❌ Failed to list ${categoryName}:`), error);
    }
  }

  /**
   * View contents of a specific prompt file
   */
  private async viewPromptFile(fileName: string): Promise<void> {
    try {
      let filePath = fileName;
      
      // If not an absolute path, look in outputs directory
      if (!path.isAbsolute(fileName)) {
        filePath = path.join('outputs', fileName);
      }

      const exists = await this.fileExists(filePath);
      if (!exists) {
        console.error(chalk.red(`❌ File not found: ${filePath}`));
        return;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      
      console.log(chalk.blue.bold(`📄 ${path.basename(filePath)}`));
      console.log(chalk.blue('═'.repeat(50)));
      console.log(chalk.gray(`Path: ${filePath}`));
      console.log(chalk.gray(`Size: ${this.formatFileSize(stats.size)}`));
      console.log(chalk.gray(`Modified: ${stats.mtime.toISOString()}`));
      console.log(chalk.blue('─'.repeat(50)));
      console.log(content);

    } catch (error) {
      console.error(chalk.red('❌ Failed to view file:'), error);
    }
  }

  /**
   * Initialize prompt directories
   */
  private async initializeDirectories(): Promise<void> {
    try {
      console.log(chalk.blue('🚀 Initializing test prompt directories...'));
      await this.promptManager.initialize();
      console.log(chalk.green('✅ Prompt directories initialized successfully'));
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize directories:'), error);
    }
  }

  /**
   * Clean up old prompt files
   */
  private async cleanupOldFiles(): Promise<void> {
    try {
      console.log(chalk.blue('🧹 Cleaning up old prompt files...'));
      
      const outputsDir = 'outputs';
      if (!(await this.directoryExists(outputsDir))) {
        console.log(chalk.yellow('📁 No outputs directory found'));
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep files from last 7 days

      let deletedCount = 0;
      const allFiles = await this.getAllFilesRecursively(outputsDir);
      
      for (const file of allFiles) {
        const stats = await fs.stat(file);
        if (stats.mtime < cutoffDate) {
          await fs.unlink(file);
          deletedCount++;
          console.log(chalk.gray(`🗑️  Deleted: ${path.relative(outputsDir, file)}`));
        }
      }

      console.log(chalk.green(`✅ Cleanup completed: ${deletedCount} files deleted`));

    } catch (error) {
      console.error(chalk.red('❌ Failed to cleanup files:'), error);
    }
  }

  // Utility methods
  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async getAllFilesRecursively(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        const subFiles = await this.getAllFilesRecursively(fullPath);
        files.push(...subFiles);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  /**
   * Main CLI entry point
   */
  async run(): Promise<void> {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      await this.listAllPrompts();
      return;
    }

    const command = args[0].toLowerCase();

    switch (command) {
      case 'list':
        await this.listAllPrompts();
        break;
        
      case 'view':
        if (args.length < 2) {
          console.error(chalk.red('❌ Please specify a file to view'));
          console.log(chalk.gray('Usage: npm run prompt-cli view <filename>'));
          return;
        }
        await this.viewPromptFile(args[1]);
        break;
        
      case 'requirements':
        await this.listPromptCategory('Requirements', 'outputs/requirements');
        break;
        
      case 'test-cases':
        await this.listPromptCategory('Test Cases', 'outputs/test-cases');
        break;
        
      case 'results':
        await this.listPromptCategory('Test Results', 'outputs/test-results');
        break;
        
      case 'clean':
        await this.cleanupOldFiles();
        break;
        
      case 'init':
        await this.initializeDirectories();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        this.showHelp();
        break;
        
      default:
        console.error(chalk.red(`❌ Unknown command: ${command}`));
        this.showHelp();
        break;
    }
  }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new PromptCLI();
  cli.run().catch(error => {
    console.error(chalk.red('❌ CLI Error:'), error);
    process.exit(1);
  });
}
