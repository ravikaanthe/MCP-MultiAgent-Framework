# 🏗️ Architecture Deep Dive

## Multi-Agent Test Automation Framework - Technical Documentation

This document provides an in-depth technical overview of the framework's architecture, components, data flow, and implementation details.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Details](#component-details)
3. [Data Flow](#data-flow)
4. [Model Context Protocol (MCP)](#model-context-protocol-mcp)
5. [Agent Implementation](#agent-implementation)
6. [Execution Modes](#execution-modes)
7. [Error Handling & Resilience](#error-handling--resilience)
8. [Performance Considerations](#performance-considerations)
9. [Extension Points](#extension-points)

---

## 🎯 System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  • CLI Commands (npm test, npm run prompt)                      │
│  • Configuration Files (.env, environments.ts)                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌────────────────────┐        ┌───────────────────────┐
│  Full AI Pipeline  │        │ Direct Prompt         │
│  (Orchestrator)    │        │ Executor              │
└────────┬───────────┘        └─────────┬─────────────┘
         │                              │
         ▼                              │
┌──────────────────────────────────────┼─────────────────────────┐
│           AGENT LAYER                │                         │
├──────────────────┬───────────────────┼─────────────────────────┤
│  Agent 1         │  Agent 2          │  Agent 3  │  Agent 4   │
│  Story Analyst   │  Test Generator   │  Executor │  Analyzer   │
│  (Claude Sonnet) │  (Claude Sonnet)  │  (MCP)    │  (Haiku)   │
└──────────────────┴───────────────────┴───────────┴─────────────┘
                                        │
                                        ▼
┌──────────────────────────────────────────────────────────────────┐
│            MODEL CONTEXT PROTOCOL (MCP) LAYER                    │
│  • Playwright MCP Server                                         │
│  • StdioClientTransport                                         │
│  • Tool-based browser automation                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                  BROWSER AUTOMATION LAYER                        │
│  • Playwright (Chromium/Firefox/WebKit)                         │
│  • Real browser instances                                        │
│  • Headed/Headless modes                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Details

### 1. Orchestrator (`src/core/orchestrator.ts`)

**Purpose**: Coordinates the complete 4-agent pipeline

**Key Responsibilities**:
- Initialize all agents with API keys
- Manage agent execution sequence
- Handle inter-agent data passing
- Persist results and artifacts
- Error handling and recovery

**Implementation**:
```typescript
class TestAutomationOrchestrator {
  private apiKey: string;
  private promptManager: TestPromptManager;
  private headedMode: boolean;

  async runPipeline(userStory: string, module?: string, storyId?: string) {
    // 1. Initialize agents
    const storyAnalyst = new StoryAnalystAgent(this.apiKey);
    const testGenerator = new TestGeneratorAgent(this.apiKey);
    const testExecutor = new TestExecutorAgent({ headed: this.headedMode });
    const resultsAnalyzer = new ResultsAnalyzerAgent(this.apiKey);

    // 2. Execute pipeline
    const storyAnalysis = await storyAnalyst.analyzeUserStory(userStory);
    const testCases = await testGenerator.generateTests(storyAnalysis);
    const testResults = await testExecutor.executeTests(testCases);
    const analysis = await resultsAnalyzer.analyzeResults(testResults);

    // 3. Generate reports
    const htmlReport = resultsAnalyzer.generateHTMLReport(...);
    await this.promptManager.saveTestResults(...);
  }
}
```

**Configuration**:
- API key from environment variables
- Headed/headless browser mode
- Output directory management

---

### 2. Agent 1: Story Analyst (`src/agents/story-analyst.ts`)

**Purpose**: Analyzes user stories and extracts testable requirements

**Input Format**:
```
User Story: As a customer, I want to login to ParaBank
```

**AI Model**: Claude 3.5 Sonnet
**Why**: Superior comprehension and structured output generation

**Output Structure**:
```typescript
interface StoryAnalysis {
  summary: string;
  features: string[];
  userActions: string[];
  expectedOutcomes: string[];
  edgeCases: string[];
  acceptanceCriteria: string[];
}
```

**Processing Flow**:
1. Send user story to Claude with analysis prompt
2. Parse structured JSON response
3. Validate extracted requirements
4. Return analysis object

**Prompt Engineering**:
- Instructs Claude to identify key scenarios
- Extracts acceptance criteria
- Identifies edge cases and error conditions
- Structures output as testable requirements

---

### 3. Agent 2: Test Generator (`src/agents/test-generator.ts`)

**Purpose**: Generates comprehensive test cases from requirements

**Input**: `StoryAnalysis` from Agent 1

**AI Model**: Claude 3.5 Sonnet
**Why**: Complex test case generation requiring logical reasoning

**Output Structure**:
```typescript
interface TestCase {
  testName: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  testSteps: string[];
  testData: {
    username?: string;
    password?: string;
    expectedResult?: string;
    [key: string]: any;
  };
  assertions: string[];
}
```

**Test Generation Strategy**:
- **Positive test cases**: Happy path scenarios
- **Negative test cases**: Error conditions
- **Edge cases**: Boundary conditions
- **Security test cases**: Authentication, authorization
- **Performance indicators**: Where applicable

**Test Prioritization**:
- HIGH: Critical business flows
- MEDIUM: Important features
- LOW: Edge cases and optional features

---

### 4. Agent 3: Test Executor (`src/agents/test-executor.ts`)

**Purpose**: Executes tests using Playwright via MCP

**Input**: Array of `TestCase` objects

**Technology**: 
- **Playwright**: Browser automation
- **MCP (Model Context Protocol)**: Standardized tool interface
- **StdioClientTransport**: Process-based communication

**Key Features**:
- Real browser automation (not mocked)
- Headed/headless mode support
- Screenshot capture on failure
- Step-by-step execution tracking
- Error recovery mechanisms

**MCP Tools Used**:
```typescript
- playwright_navigate: Navigate to URLs
- playwright_click: Click elements
- playwright_type: Type text into inputs
- playwright_select: Select dropdown options
- playwright_get_text: Get element text content
- playwright_wait_for_selector: Wait for elements
- playwright_screenshot: Capture screenshots
- playwright_close: Close browser
```

**Execution Flow**:
1. Initialize MCP client and Playwright server
2. Parse test steps into MCP tool calls
3. Execute each step sequentially
4. Capture step duration and status
5. Handle errors gracefully
6. Collect results

**Windows Compatibility**:
```typescript
// Special handling for Windows spawn issues
const command = 'node';
const tsxLoaderPath = 'node_modules/tsx/dist/cli.mjs';
const transport = new StdioClientTransport({
  command: command,
  args: [tsxLoaderPath, mcpServerPath, '--headed']
});
```

---

### 5. Agent 4: Results Analyzer (`src/agents/results-analyzer.ts`)

**Purpose**: Provides AI-powered insights from test results

**Input**: Array of `TestResult` objects

**AI Model**: Claude 3 Haiku
**Why**: Fast, cost-effective for analysis tasks

**Output Structure**:
```typescript
interface TestAnalysis {
  summary: string;
  passRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  coverageGaps: string[];
  trends: string[];
  recommendations: string[];
  criticalIssues: string[];
}
```

**Analysis Capabilities**:
- **Metrics calculation**: Pass rate, durations, error counts
- **Risk assessment**: Based on pass rate thresholds
- **Pattern detection**: Identify recurring failures
- **Coverage gaps**: Identify untested scenarios
- **Trend analysis**: Compare with historical data
- **Smart recommendations**: AI-powered suggestions

**Fallback Mechanism**:
```typescript
try {
  // Call Claude API for AI analysis
  const analysis = await this.analyzeWithAI(results);
} catch (error) {
  // Fallback to basic analysis if API fails
  return {
    summary: `${passedTests}/${totalTests} tests passed`,
    riskLevel: passRate < 70 ? 'high' : 'medium',
    coverageGaps: ['Analysis unavailable due to API error'],
    recommendations: ['Review failed tests manually']
  };
}
```

**Report Generation**:
- **JSON**: Machine-readable structured data
- **HTML**: Beautiful visual report with:
  - Executive summary
  - Color-coded metrics
  - Test details with step breakdowns
  - AI insights and recommendations
  - Critical issues highlighted

---

## 🔄 Data Flow

### Full AI Pipeline Flow

```
1. USER INPUT
   └─> user-stories/{module}/{STORY_ID}.md

2. AGENT 1: Story Analysis
   ├─> Input: User story text
   ├─> Claude API call
   └─> Output: StoryAnalysis (JSON)

3. AGENT 2: Test Generation
   ├─> Input: StoryAnalysis
   ├─> Claude API call
   └─> Output: TestCase[] (Markdown + JSON)
       └─> Saved to: outputs/test-cases/{module}/{STORY_ID}-tests.md

4. AGENT 3: Test Execution
   ├─> Input: TestCase[]
   ├─> MCP browser automation
   └─> Output: TestResult[]

5. AGENT 4: Results Analysis
   ├─> Input: TestResult[]
   ├─> Claude API call (or fallback)
   └─> Output: TestAnalysis + HTML/JSON reports
       └─> Saved to: outputs/test-results/{module}/{STORY_ID}-results-{timestamp}.{html|json}
```

### Direct Prompt Executor Flow

```
1. USER INPUT
   └─> outputs/test-cases/{module}/{STORY_ID}-tests.md

2. PARSE TEST CASES
   ├─> Read markdown file
   ├─> Extract test cases
   └─> Parse test steps

3. AGENT 3: Test Execution (same as above)
   ├─> Initialize MCP browser
   ├─> Execute test steps
   └─> Collect results

4. AGENT 4: Results Analysis (same as above)
   └─> Generate HTML/JSON reports
```

---

## 🔌 Model Context Protocol (MCP)

### What is MCP?

Model Context Protocol is a standardized way for AI assistants to interact with external tools and services through a unified interface.

### MCP Implementation in Framework

#### Server Side (`src/mcp/playwright-mcp-server.ts`)

```typescript
class PlaywrightMCPServer {
  private server: Server;
  private browser: Browser | null = null;
  private page: Page | null = null;

  setupToolHandlers() {
    // Define available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'playwright_navigate',
          description: 'Navigate browser to a URL',
          inputSchema: { /* ... */ }
        },
        // ... other tools
      ]
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'playwright_navigate':
          await this.page!.goto(args.url);
          return { content: [{ type: 'text', text: `Navigated to ${args.url}` }] };
        // ... other tool implementations
      }
    });
  }
}
```

#### Client Side (Agent 3)

```typescript
// Initialize MCP client
this.mcpClient = new Client(
  { name: 'test-executor', version: '1.0.0' },
  { capabilities: {} }
);

// Connect via stdio transport
const transport = new StdioClientTransport({
  command: 'node',
  args: [tsxLoader, mcpServerPath, '--headed']
});

await this.mcpClient.connect(transport);

// Call tools
await this.mcpClient.callTool({
  name: 'playwright_navigate',
  arguments: { url: 'https://example.com' }
});
```

### Benefits of MCP

1. **Standardization**: Consistent interface for all tools
2. **Decoupling**: Browser automation separated from test logic
3. **Flexibility**: Easy to add new tools or swap implementations
4. **Reliability**: Process isolation prevents crashes from affecting agents
5. **Security**: Controlled access to browser capabilities

---

## 🤖 Agent Implementation

### API Key Management

```typescript
// Entry points load dotenv
import { config } from 'dotenv';
config();

// Pass API key to agents
const apiKey = process.env.ANTHROPIC_API_KEY || '';
const agent = new StoryAnalystAgent(apiKey);
```

**Key Points**:
- Only entry points (`orchestrator.ts`, `prompt-executor.ts`) load dotenv
- Agents receive API key via constructor
- Agent 3 (Test Executor) doesn't need API key
- Fallback mechanisms handle missing API keys gracefully

### Error Handling

```typescript
async analyzeUserStory(userStory: string): Promise<StoryAnalysis> {
  try {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [/* ... */]
    });
    
    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Story analysis failed:', error);
    throw new Error(`Failed to analyze story: ${error.message}`);
  }
}
```

### Rate Limiting

```typescript
// Built-in retry logic in orchestrator
private async executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await this.delay(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
}
```

---

## 🎮 Execution Modes

### Mode 1: Full AI Pipeline

**When to use**:
- Creating tests from new user stories
- Need complete AI-powered workflow
- Want story analysis and test generation

**Commands**:
```bash
npm test -- AUTH-001              # Headless
npm test -- AUTH-001 --headed     # Visible browser
```

**Stages**:
1. Story Analysis (30-60s)
2. Test Generation (30-90s)
3. Test Execution (variable)
4. Results Analysis (10-30s)

**Total Time**: 2-5 minutes depending on complexity

---

### Mode 2: Direct Prompt Executor

**When to use**:
- Quick test execution
- Tests already generated
- Debugging specific scenarios
- CI/CD pipelines (with pre-generated tests)

**Commands**:
```bash
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"
```

**Stages**:
1. Parse markdown (instant)
2. Test Execution (variable)
3. Results Analysis (10-30s)

**Total Time**: 1-3 minutes (skips Agents 1 & 2)

---

## 🛡️ Error Handling & Resilience

### Agent-Level Error Handling

```typescript
// Agent try-catch with fallback
try {
  const analysis = await this.callAnthropicAPI();
  return analysis;
} catch (error) {
  logger.error('API call failed', error);
  return this.generateFallbackAnalysis();
}
```

### MCP Error Handling

```typescript
// Graceful MCP failures
try {
  await this.mcpClient.callTool({ name: 'playwright_click', arguments: {...} });
} catch (error) {
  throw new Error(`Step failed: ${error.message}`);
  // Test continues, failure recorded
}
```

### Browser Recovery

```typescript
// Cleanup on failure
finally {
  if (this.mcpClient) {
    await this.mcpClient.close(); // Closes browser and server
  }
}
```

---

## ⚡ Performance Considerations

### Optimization Strategies

1. **Parallel Test Execution** (Future Enhancement)
   - Currently sequential for simplicity
   - Can be parallelized using worker threads

2. **Caching**
   - Test cases cached as markdown files
   - Reusable without regeneration

3. **Selective Agent Usage**
   - Direct Prompt Executor skips Agents 1 & 2
   - 50-70% time savings

4. **API Model Selection**
   - Sonnet 3.5 for complex tasks (Agents 1 & 2)
   - Haiku for simpler analysis (Agent 4)
   - Balances quality and cost

5. **Browser Optimization**
   - Headless mode for CI/CD (faster)
   - Headed mode for debugging (visual)
   - Reuse browser context where possible

---

## 🔧 Extension Points

### Adding New Test Types

```typescript
// Extend test generator prompt
const customPrompt = `
  Generate ${testType} tests including:
  - Performance benchmarks
  - Accessibility checks
  - Security scans
`;
```

### Adding New MCP Tools

```typescript
// In playwright-mcp-server.ts
{
  name: 'playwright_custom_action',
  description: 'Custom automation action',
  inputSchema: { /* ... */ }
}

case 'playwright_custom_action':
  // Implementation
  return { content: [/* ... */] };
```

### Custom Reporting

```typescript
// Extend results analyzer
class CustomResultsAnalyzer extends ResultsAnalyzerAgent {
  generateCustomReport(results: TestResult[]): string {
    // Custom report logic
  }
}
```

### Environment Extensions

```typescript
// Add new environment in environments.ts
{
  name: 'production',
  applications: {
    'myapp': { /* config */ }
  }
}
```

---

## 📊 Technical Specifications

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 18+ |
| Language | TypeScript | 5.x |
| AI Provider | Anthropic Claude | API v1 |
| Browser | Playwright | Latest |
| Protocol | MCP SDK | 0.5.0 |
| Type Safety | TypeScript | Strict mode |

### API Usage

| Agent | Model | Avg Tokens | Cost per Run* |
|-------|-------|------------|---------------|
| Agent 1 | Sonnet 3.5 | 2,000-4,000 | $0.06-$0.12 |
| Agent 2 | Sonnet 3.5 | 3,000-8,000 | $0.09-$0.24 |
| Agent 3 | N/A | 0 | $0.00 |
| Agent 4 | Haiku | 1,000-2,000 | $0.01-$0.02 |
| **Total** | | | **$0.16-$0.38** |

*Approximate costs based on Anthropic pricing (Dec 2025)

---

## 🔐 Security Considerations

1. **API Key Management**
   - Stored in `.env` (never committed)
   - Accessed via `process.env`
   - Validated before use

2. **Test Data**
   - Credentials in environment config
   - No hardcoded secrets
   - Test data separate from code

3. **Browser Security**
   - Isolated browser contexts
   - Configurable security headers
   - Screenshot sanitization (future)

4. **Code Execution**
   - MCP process isolation
   - No eval() or dynamic code execution
   - Validated tool inputs

---

## 📈 Future Enhancements

1. **Visual Regression Testing**
   - Screenshot comparison
   - Pixel-perfect validation

2. **API Testing Integration**
   - REST API validation
   - GraphQL support

3. **Mobile Testing**
   - Mobile browser emulation
   - App testing via Appium MCP

4. **CI/CD Integration**
   - GitHub Actions workflow
   - Docker containerization
   - Cloud execution (AWS, Azure)

5. **Advanced AI Features**
   - Self-healing tests
   - Auto-fixing failed tests
   - Predictive failure analysis

---

## 📚 References

- [Anthropic Claude Documentation](https://docs.anthropic.com/)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: December 2025  
**Framework Version**: 1.0.0  
**Documentation Version**: 1.0.0
