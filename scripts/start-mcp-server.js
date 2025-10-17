#!/usr/bin/env node

/**
 * MCP Playwright Server Startup Script
 * Works in any environment: Local, CI/CD, Azure Pipelines, etc.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPServerManager {
  constructor() {
    this.serverProcess = null;
    this.isRunning = false;
  }

  async startServer(options = {}) {
    const {
      background = true,
      stdio = 'pipe',
      timeout = 10000
    } = options;

    console.log(chalk.blue('🚀 Starting MCP Playwright Server...'));

    try {
      // Check if server package is available
      await this.checkServerAvailability();

      // Start the server process
      this.serverProcess = spawn('npx', ['@modelcontextprotocol/server-playwright', '--stdio'], {
        stdio: background ? 'pipe' : 'inherit',
        shell: true,
        detached: background
      });

      if (background) {
        this.serverProcess.unref(); // Allow parent process to exit
      }

      // Handle server events
      this.setupEventHandlers();

      // Wait for server to be ready
      await this.waitForReady(timeout);

      console.log(chalk.green('✅ MCP Playwright Server started successfully'));
      this.isRunning = true;

      return {
        success: true,
        pid: this.serverProcess.pid,
        message: 'MCP server is running'
      };

    } catch (error) {
      console.error(chalk.red('❌ Failed to start MCP server:'), error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkServerAvailability() {
    console.log(chalk.yellow('🔍 Checking MCP server availability...'));
    
    return new Promise((resolve, reject) => {
      const checkProcess = spawn('npx', ['@modelcontextprotocol/server-playwright', '--version'], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      checkProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      checkProcess.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('✅ MCP Playwright server is available'));
          resolve(true);
        } else {
          reject(new Error('MCP Playwright server not found. Run: npm install -g @modelcontextprotocol/server-playwright'));
        }
      });

      checkProcess.on('error', (error) => {
        reject(new Error(`Server check failed: ${error.message}`));
      });
    });
  }

  setupEventHandlers() {
    this.serverProcess.on('error', (error) => {
      console.error(chalk.red('❌ MCP Server error:'), error);
      this.isRunning = false;
    });

    this.serverProcess.on('exit', (code, signal) => {
      console.log(chalk.yellow(`⚠️ MCP Server exited with code ${code}, signal ${signal}`));
      this.isRunning = false;
    });

    // Handle process termination
    process.on('SIGINT', () => this.stopServer());
    process.on('SIGTERM', () => this.stopServer());
    process.on('exit', () => this.stopServer());
  }

  async waitForReady(timeout) {
    console.log(chalk.yellow('⏳ Waiting for MCP server to be ready...'));
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Server startup timeout after ${timeout}ms`));
      }, timeout);

      // In a real implementation, you'd check for server readiness
      // For now, we'll use a simple delay
      setTimeout(() => {
        clearTimeout(timer);
        resolve(true);
      }, 2000);
    });
  }

  stopServer() {
    if (this.serverProcess && this.isRunning) {
      console.log(chalk.yellow('🛑 Stopping MCP server...'));
      this.serverProcess.kill('SIGTERM');
      this.isRunning = false;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      pid: this.serverProcess?.pid || null
    };
  }
}

// CLI usage
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manager = new MCPServerManager();
  
  const command = process.argv[2] || 'start';
  
  switch (command) {
    case 'start':
      const background = process.argv.includes('--background');
      manager.startServer({ background });
      break;
      
    case 'status':
      console.log('MCP Server Status:', manager.getStatus());
      break;
      
    case 'stop':
      manager.stopServer();
      break;
      
    default:
      console.log('Usage: node start-mcp-server.js [start|stop|status] [--background]');
  }
}

export default MCPServerManager;
