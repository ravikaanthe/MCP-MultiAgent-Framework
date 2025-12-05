/**
 * MCP Playwright Server
 * Provides Playwright browser automation through Model Context Prot        {
          name: 'playwright_type',
          description: 'Type text into an input field',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the input element',
              },
              text: {
                type: 'string',
                description: 'Text to type',
              },
            },
            required: ['selector', 'text'],
          },
        },
        {
          name: 'playwright_select',
          description: 'Select an option from a dropdown',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the select element',
              },
              value: {
                type: 'string',
                description: 'Value to select',
              },
            },
            required: ['selector', 'value'],
          },
        },
        {
          name: 'playwright_screenshot',th headed and headless modes via configuration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

interface BrowserConfig {
  headless: boolean;
  slowMo?: number;
  devtools?: boolean;
}

class PlaywrightMCPServer {
  private server: Server;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private browserConfig: BrowserConfig;

  constructor(config: BrowserConfig = { headless: false, slowMo: 500 }) {
    this.browserConfig = config;
    
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
    
    console.log(`[MCP Server] Initialized with config: ${JSON.stringify(this.browserConfig)}`);
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'playwright_navigate',
          description: 'Navigate browser to a URL',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'The URL to navigate to',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'playwright_init',
          description: 'Initialize browser with specific configuration (headed/headless)',
          inputSchema: {
            type: 'object',
            properties: {
              headless: {
                type: 'boolean',
                description: 'Run browser in headless mode',
                default: false,
              },
              slowMo: {
                type: 'number',
                description: 'Slow down operations by specified milliseconds',
                default: 500,
              },
            },
          },
        },
        {
          name: 'playwright_click',
          description: 'Click an element on the page',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element to click',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'playwright_type',
          description: 'Type text into an input field',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the input field',
              },
              text: {
                type: 'string',
                description: 'Text to type',
              },
            },
            required: ['selector', 'text'],
          },
        },
        {
          name: 'playwright_screenshot',
          description: 'Take a screenshot of the page',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to save the screenshot',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'playwright_get_text',
          description: 'Get text content from an element',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'playwright_wait_for_selector',
          description: 'Wait for an element to appear on the page',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element to wait for',
              },
              timeout: {
                type: 'number',
                description: 'Timeout in milliseconds (default: 30000)',
              },
            },
            required: ['selector'],
          },
        },
        {
          name: 'playwright_close',
          description: 'Close the browser',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: No arguments provided',
            },
          ],
          isError: true,
        };
      }

      try {
        // Handle browser initialization tool
        if (name === 'playwright_init') {
          const headless = (args.headless as boolean) ?? this.browserConfig.headless;
          const slowMo = (args.slowMo as number) ?? this.browserConfig.slowMo;
          
          this.browserConfig = { headless, slowMo };
          console.log(`[MCP Server] Browser config updated: headless=${headless}, slowMo=${slowMo}`);
          
          // Close existing browser if any
          if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
          }
          
          return {
            content: [{
              type: 'text',
              text: `Browser configuration updated: ${JSON.stringify(this.browserConfig)}`,
            }],
          };
        }
        
        // Initialize browser if needed (using current config)
        if (!this.browser && name !== 'playwright_close') {
          console.log(`[MCP Server] Launching browser with config: ${JSON.stringify(this.browserConfig)}`);
          this.browser = await chromium.launch({
            headless: this.browserConfig.headless,
            slowMo: this.browserConfig.slowMo,
            devtools: this.browserConfig.devtools,
          });
          this.context = await this.browser.newContext();
          this.page = await this.context.newPage();
          console.log(`[MCP Server] Browser launched successfully (headed=${!this.browserConfig.headless})`);
        }

        switch (name) {
          case 'playwright_navigate':
            await this.page!.goto(args.url as string);
            return {
              content: [
                {
                  type: 'text',
                  text: `Navigated to ${args.url}`,
                },
              ],
            };

          case 'playwright_click':
            await this.page!.click(args.selector as string);
            return {
              content: [
                {
                  type: 'text',
                  text: `Clicked element: ${args.selector}`,
                },
              ],
            };

          case 'playwright_type':
            await this.page!.fill(args.selector as string, args.text as string);
            return {
              content: [
                {
                  type: 'text',
                  text: `Typed "${args.text}" into ${args.selector}`,
                },
              ],
            };

          case 'playwright_select':
            await this.page!.selectOption(args.selector as string, args.value as string);
            return {
              content: [
                {
                  type: 'text',
                  text: `Selected "${args.value}" from ${args.selector}`,
                },
              ],
            };

          case 'playwright_screenshot':
            await this.page!.screenshot({ path: args.path as string });
            return {
              content: [
                {
                  type: 'text',
                  text: `Screenshot saved to ${args.path}`,
                },
              ],
            };

          case 'playwright_get_text':
            const text = await this.page!.textContent(args.selector as string);
            return {
              content: [
                {
                  type: 'text',
                  text: text || '',
                },
              ],
            };

          case 'playwright_wait_for_selector':
            const timeout = (args.timeout as number) || 30000;
            await this.page!.waitForSelector(args.selector as string, { timeout });
            return {
              content: [
                {
                  type: 'text',
                  text: `Element found: ${args.selector}`,
                },
              ],
            };

          case 'playwright_close':
            await this.cleanup();
            return {
              content: [
                {
                  type: 'text',
                  text: 'Browser closed',
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private async cleanup() {
    console.log('[MCP Server] Cleaning up browser resources...');
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.page = null;
    console.log('[MCP Server] Cleanup complete');
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('[MCP Server] Playwright MCP server running on stdio');
    console.log(`[MCP Server] Browser mode: ${this.browserConfig.headless ? 'HEADLESS' : 'HEADED (visible browser)'}`);
  }
}

// Parse command line arguments for configuration
const args = process.argv.slice(2);
const headlessArg = args.includes('--headless');
const headedArg = args.includes('--headed');
const slowMoArg = args.find(arg => arg.startsWith('--slowMo='));
const slowMo = slowMoArg ? parseInt(slowMoArg.split('=')[1]) : 500;

// Determine headless mode (default to headed for visibility)
const headless = headlessArg ? true : (headedArg ? false : false);

console.log('[MCP Server] Starting with configuration:');
console.log(`  - Headless: ${headless}`);
console.log(`  - SlowMo: ${slowMo}ms`);

// Start the server with configuration
const server = new PlaywrightMCPServer({ headless, slowMo });
server.start().catch(console.error);
