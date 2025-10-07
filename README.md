# Multi-Agent Test Automation Framework

A sophisticated TypeScript-based test automation framework that uses AI agents to collaborate on test creation and execution. The framework leverages Anthropic's Claude API for intelligent analysis and Playwright MCP for browser automation.

## 🏗️ Architecture

The framework consists of 4 specialized AI agents that work together:

### 🔍 Agent 1 - Story Analyst Agent
- **Purpose**: Analyzes user stories and extracts testable requirements
- **Input**: User story text (Gherkin or plain English)
- **Output**: Structured JSON with features, actions, outcomes, edge cases, and acceptance criteria
- **Technology**: Claude API (Sonnet 3.5)

### 🧪 Agent 2 - Test Generator Agent
- **Purpose**: Generates comprehensive test cases from requirements
- **Input**: Requirements from Story Analyst Agent
- **Output**: Array of test cases with priorities, steps, assertions, and test data
- **Technology**: Claude API (Sonnet 3.5)

### 🚀 Agent 3 - Test Executor Agent
- **Purpose**: Executes tests using Playwright MCP integration
- **Input**: Test cases from Test Generator Agent
- **Output**: Test execution results with status, duration, errors, and screenshots
- **Technology**: Playwright MCP, Claude API for natural language to automation conversion

### 📊 Agent 4 - Results Analyzer Agent
- **Purpose**: Analyzes test results and provides intelligent insights
- **Input**: Test execution results
- **Output**: Analysis with metrics, risk assessment, trends, and recommendations
- **Technology**: Claude API (Sonnet 3.5)

### 🤖 Orchestrator
- **Purpose**: Coordinates all agents and manages the complete pipeline
- **Features**: Error handling, retry logic, rate limiting, result persistence

## 🛠️ Tech Stack

- **Language**: TypeScript
- **AI Provider**: Anthropic Claude API
- **Browser Automation**: Playwright MCP
- **Environment**: Node.js 18+
- **Dependencies**:
  - `@anthropic-ai/sdk` - Claude API integration
  - `@modelcontextprotocol/sdk` - MCP client
  - `@playwright/mcp-server` - Playwright MCP server
  - `chalk` - Colored console output
  - `dotenv` - Environment variable management

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js 18 or higher
- npm or yarn
- Anthropic API key

### 2. Installation
```bash
# Clone or download the project
cd multi-agent-test-automation

# Install dependencies
npm install

# Copy environment template
copy .env.example .env
```

### 3. Environment Configuration
Edit `.env` file and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_actual_api_key_here
```

Get your API key from: https://console.anthropic.com/

### 4. Build and Run
```bash
# Build TypeScript
npm run build

# Run the framework
npm start

# Or run in development mode
npm run dev
```

## 📁 Project Structure

```
src/
├── agents/
│   ├── story-analyst.ts      # Agent 1 - Story analysis
│   ├── test-generator.ts     # Agent 2 - Test case generation
│   ├── test-executor.ts      # Agent 3 - Test execution with MCP
│   └── results-analyzer.ts   # Agent 4 - Results analysis
├── orchestrator.ts           # Main orchestrator class
├── types.ts                  # TypeScript type definitions
└── index.ts                  # Entry point and main function
```

## 🎯 Usage

### 📚 Managing User Stories

The framework now includes a flexible **User Story Manager** that allows you to store and manage multiple user stories without editing code.

#### **Quick Start**
```bash
# List all available user stories
npm start --list

# Run the first user story (default)
npm start

# Run a specific story by index
npm start 2

# Run a specific story by ID
npm start user-login
```

#### **User Stories File**
User stories are stored in `user-stories.md`. The framework comes with 5 pre-configured stories:

1. **User Login Authentication** (ID: `user-login-authentic`)
2. **User Registration** (ID: `user-registration`)
3. **Product Search** (ID: `product-search`)
4. **Shopping Cart Management** (ID: `shopping-cart-manage`)
5. **Password Reset** (ID: `password-reset`)

#### **Adding Your Own Stories**

**Method 1: Edit user-stories.md directly**
```markdown
## Your Story Title
```
As a user, I want to...
So that I can...

Acceptance Criteria:
- Criterion 1
- Criterion 2
```
```

**Method 2: Use the CLI tool**
```bash
# Add a new story via command line
npm run story-cli add "New Feature Story" "As a user, I want to test new features..."

# View available stories
npm run story-cli list

# View a specific story
npm run story-cli view 1
npm run story-cli view user-login
```

### 🚀 Running Tests

#### **Command Options**
```bash
# Basic usage
npm start                    # Run first story
npm start 2                  # Run story by index (1-5)
npm start user-login         # Run story by ID
npm start --list             # List all available stories

# Development
npm run dev                  # Run in development mode
npm run build               # Build TypeScript
npm run validate            # Validate setup

# Story management
npm run story-cli list      # List all stories
npm run story-cli view 2    # View specific story
npm run story-cli add       # Add new story
```

#### **Example Workflow**
```bash
# 1. See what stories are available
npm start --list

# 2. Run the registration story
npm start 2

# 3. Check results
cat test-results.json

# 4. Add your own story
npm run story-cli add "Password Change" "As a user, I want to change my password..."

# 5. Run your new story
npm start password-change
```

## 📊 Output

### Console Output
- Real-time progress with colored emojis
- Step-by-step execution status
- Comprehensive test report with metrics
- Visual formatting with box drawing characters

### File Output
Results are saved to `test-results.json` with complete execution data:

```json
{
  "timestamp": "2025-10-05T...",
  "userStory": "As a user...",
  "requirements": { "feature": "...", "actions": [...] },
  "testCases": [{ "testName": "...", "steps": [...] }],
  "testResults": [{ "testName": "...", "status": "passed" }],
  "analysis": { "passRate": 85.5, "riskLevel": "medium" },
  "totalExecutionTime": 45000
}
```

## 🔧 Configuration

### MCP Integration
The framework automatically attempts to connect to Playwright MCP server. If a compatible MCP server is not available, the framework falls back to simulation mode for demonstration purposes.

To use with actual browser automation, you would need to:
1. Install a compatible Playwright MCP server
2. Update the MCP connection configuration in `test-executor.ts`

The current implementation demonstrates the complete agent collaboration workflow.

### Error Handling
- **API Rate Limiting**: Built-in delays between Claude API calls
- **Test Retries**: Failed tests are retried up to 3 times
- **Graceful Degradation**: Fallback responses if AI services are unavailable
- **MCP Fallback**: Simulation mode if Playwright MCP is unavailable

## 🧪 Available MCP Tools

The Test Executor Agent can use these Playwright MCP tools:
- `playwright_navigate` - Navigate to URL
- `playwright_click` - Click elements
- `playwright_fill` - Fill form fields
- `playwright_screenshot` - Take screenshots
- `playwright_evaluate` - Execute JavaScript
- `playwright_get_text` - Extract text content

## 🔍 Monitoring & Debugging

### Console Logs
Each agent provides detailed logging with emojis:
- 🔍 Story Analyst operations
- 🧪 Test Generator activities
- 🚀 Test Executor actions
- 📊 Results Analyzer insights

### Error Handling
- Try-catch blocks at every agent level
- Detailed error messages with context
- Stack traces for debugging
- Graceful fallbacks for API failures

## 🔮 Extensibility

The framework is designed for easy extension:

### Adding New Agents
1. Create new agent class in `src/agents/`
2. Implement required interface methods
3. Add to orchestrator pipeline

### Custom MCP Tools
1. Extend `MCPToolCall` interface in `types.ts`
2. Add tool mapping in `TestExecutorAgent`
3. Update Claude prompts for new tools

### Additional AI Providers
1. Create provider-specific agent classes
2. Implement common interface
3. Add provider selection logic

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow TypeScript best practices
4. Add comprehensive error handling
5. Include tests for new functionality
6. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**API Key Error**:
```
❌ ANTHROPIC_API_KEY is required!
```
- Ensure `.env` file exists with valid API key
- Check API key format and permissions

**MCP Connection Failed**:
```
⚠️ MCP connection failed, will use simulation mode
```
- Ensure Node.js 18+ is installed
- Check if `@playwright/mcp-server` is available
- Framework will continue in simulation mode

**TypeScript Compilation Errors**:
```bash
npm run build
```
- Ensure all dependencies are installed
- Check TypeScript version compatibility

### Getting Help

1. Check the console output for detailed error messages
2. Review the `test-results.json` file for execution details
3. Enable debug logging by modifying log levels
4. Check network connectivity for API calls

## 🎉 Example Output

```
🤖 MULTI-AGENT TEST AUTOMATION FRAMEWORK
════════════════════════════════════════════════════════════
Starting test automation pipeline...

STEP 1: Story Analysis
──────────────────────────────────
🔍 Story Analyst Agent: Analyzing user story...
✅ Story analysis completed
   Feature: User Authentication
   Actions: 3 identified
   Edge cases: 2 identified

STEP 2: Test Case Generation
──────────────────────────────────
🧪 Test Generator Agent: Generating test cases...
✅ Test case generation completed
   Generated 4 test cases
   Priority breakdown: 2 high, 1 medium, 1 low

STEP 3: Test Execution
──────────────────────────────────
🚀 Test Executor Agent: Initializing MCP connection...
✅ MCP connection established
🎯 Executing test: Successful login with valid credentials
   ✅ Test passed (2340ms)
...

STEP 4: Results Analysis
──────────────────────────────────
📊 Results Analyzer Agent: Analyzing test results...
✅ Results analysis completed
   Risk Level: low
   Pass Rate: 100.0%
   Critical Issues: 0

════════════════════════════════════════════════════════════
                    📊 TEST EXECUTION REPORT
════════════════════════════════════════════════════════════
...
✨ Pipeline completed successfully!
```
