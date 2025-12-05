# 🤖 Multi-Agent Test Automation Framework

**AI-Powered Test Automation with MCP (Model Context Protocol) & Playwright**

A cutting-edge test automation framework that leverages multiple AI agents and browser automation through Model Context Protocol to generate, execute, and analyze tests intelligently.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Method 1: Full AI Pipeline](#method-1-full-ai-pipeline-4-agents)
  - [Method 2: Direct Prompt Executor](#method-2-direct-prompt-executor)
- [Output & Reports](#output--reports)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Available Commands](#available-commands)

---

## 🌟 Overview

This framework combines the power of **AI agents** (powered by Claude) with **Model Context Protocol (MCP)** for browser automation to create an end-to-end intelligent test automation system.

### What Makes It Unique?

- 🤖 **4 AI Agents** working together in a pipeline using **Claude AI**
- 🎭 **REAL Browser Automation** - No simulation! Actual Playwright browser via MCP
- 🌐 **Real MCP Integration** - Using official Model Context Protocol SDK
- 📊 **AI-Powered Analysis** with beautiful HTML reports
- 🔄 **Two Execution Modes** - Full AI Pipeline or Direct Prompt Executor
- � **Environment-Driven** - Zero hardcoded values, all from environment variables
- 🎨 **Beautiful Visual Reports** with AI insights and recommendations
- ✅ **Production Ready** - Tested on Windows with real browser automation

---

## ✨ Key Features

### 🤖 Multi-Agent Architecture
- **Agent 1 (Story Analyst)**: Analyzes user stories using **Claude 3.5 Sonnet**
- **Agent 2 (Test Generator)**: Generates comprehensive test cases using **Claude 3.5 Sonnet**
- **Agent 3 (Test Executor)**: Executes tests on **REAL browsers** via **Playwright MCP** (no AI needed)
- **Agent 4 (Results Analyzer)**: Provides AI-powered insights using **Claude 3 Haiku**

**Important**: Agent 3 uses **REAL MCP browser automation** - not simulated! Actual Playwright browsers controlled through Model Context Protocol.

### 🎭 Real Browser Automation
- Powered by **Playwright** through **Model Context Protocol (MCP)**
- **REAL browsers** - Chromium, Firefox, or WebKit (no mocking/simulation)
- Uses official **@modelcontextprotocol/sdk** for standardized tool interface
- Supports headed (visible) and headless modes
- Slow-motion mode for debugging
- Windows-compatible with fixed spawn handling (node + tsx direct execution)
- StdioClientTransport for reliable process communication

### 📊 Intelligent Reporting
- Beautiful HTML reports with AI insights
- JSON data files for further analysis
- Coverage gap detection
- Trend analysis
- Smart recommendations
- Risk level assessment

### 🔄 Flexible Execution
- **Full AI Pipeline**: Complete story-to-execution workflow
- **Direct Prompt Executor**: Fast execution from pre-generated test cases

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   USER STORY INPUT                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT 1: Story Analyst (Claude 3.5 Sonnet)                │
│  • Analyzes user story                                      │
│  • Extracts requirements                                    │
│  • Identifies test scenarios                                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT 2: Test Generator (Claude 3.5 Sonnet)               │
│  • Generates test cases                                     │
│  • Creates test data                                        │
│  • Defines test steps                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT 3: Test Executor (Playwright MCP)                   │
│  • Initializes browser via MCP                             │
│  • Executes test steps                                      │
│  • Captures results & errors                                │
│  • Takes screenshots                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT 4: Results Analyzer (Claude 3 Haiku)                │
│  • Analyzes test results                                    │
│  • Detects patterns & trends                                │
│  • Identifies coverage gaps                                 │
│  • Generates recommendations                                │
│  • Creates beautiful HTML reports                           │
└─────────────────────────────────────────────────────────────┘
```

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📦 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **TypeScript**: v5.x
- **Anthropic API Key**: Get from [Anthropic Console](https://console.anthropic.com/)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ravikaanthe/MCP-MultiAgent-Framework.git
cd MCP-MultiAgent-Framework
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install chromium
```

---

## ⚙️ Configuration

### 1. Create Environment File

Create a `.env` file in the project root:

```env
# Anthropic API Key (Required for AI Agents)
ANTHROPIC_API_KEY=sk-ant-api03-your-api-key-here
```

### 2. Configure Test Environments

The framework uses **environment variables** for all configuration (zero hardcoded values).

Edit your `.env` file to configure test environments:

```env
# ParaBank Test Environment Configuration
BASE_URL=https://parabank.parasoft.com/parabank
LOGIN_URL=https://parabank.parasoft.com/parabank/index.htm
OPEN_ACCOUNT_URL=https://parabank.parasoft.com/parabank/openaccount.htm

# Valid Test Credentials
VALID_USERNAME=ficusroot
VALID_PASSWORD=katal@n@ravi

# Invalid Test Credentials (for negative testing)
INVALID_USERNAME=invaliduser
INVALID_PASSWORD=invalidpass

# Test Data
VALID_SOURCE_ACCOUNT=29217
INVALID_SOURCE_ACCOUNT=12345
DEFAULT_ACCOUNT_TYPE=SAVINGS
```

**Environment Manager** (`src/config/environments.ts`) provides centralized access:
```typescript
import EnvironmentManager from './config/environments.js';

// Get credentials
const validCreds = EnvironmentManager.getValidCredentials();
// { username: 'ficusroot', password: 'katal@n@ravi' }

// Get URLs
const urls = EnvironmentManager.getUrls();
// { baseUrl: '...', loginUrl: '...', ... }
```

---

## 🎯 Usage

### Method 1: Full AI Pipeline (4 Agents)

**Complete workflow from user story to execution and analysis.**

#### Command
```bash
npm test -- <STORY_ID> [--headed]
```

#### Examples
```bash
# Execute in headless mode (default)
npm test -- AUTH-001

# Execute with visible browser
npm test -- AUTH-001 --headed

# Execute account management story
npm test -- ACCT-002 --headed
```

#### What Happens:
1. ✅ Agent 1 analyzes the user story
2. ✅ Agent 2 generates test cases
3. ✅ Agent 3 executes tests via Playwright MCP
4. ✅ Agent 4 analyzes results with AI insights
5. ✅ Beautiful HTML report generated

#### Output Location:
```
outputs/
├── test-cases/{module}/{STORY_ID}-tests.md
└── test-results/{module}/{STORY_ID}-results-{timestamp}.{html|json}
```

---

### Method 2: Direct Prompt Executor

**Fast execution from pre-generated test cases.**

#### Command
```bash
npm run prompt -- "<path-to-test-file>"
```

#### Examples
```bash
# Execute authentication tests
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"

# Execute account management tests
npm run prompt -- "outputs/test-cases/account-management/ACCT-002-tests.md"
```

#### What Happens:
1. ✅ Reads test cases from markdown file
2. ✅ Executes tests via Playwright MCP (visible browser)
3. ✅ Analyzes results with AI (Agent 4)
4. ✅ Generates HTML + JSON reports

#### Output Location:
```
outputs/test-results/{module}/{STORY_ID}-results-{timestamp}.{html|json}
```

---

## 📊 Output & Reports

### Report Types

Both execution methods generate the same comprehensive reports:

#### 1. **JSON Report** (Machine-readable)
```json
{
  "storyId": "AUTH-001",
  "module": "authentication",
  "executionTime": "2025-12-05T18:48:31.806Z",
  "totalDuration": 55881,
  "summary": {
    "totalTests": 5,
    "passed": 4,
    "failed": 1,
    "passRate": 80
  },
  "analysis": {
    "summary": "...",
    "riskLevel": "medium",
    "coverageGaps": [...],
    "trends": [...],
    "recommendations": [...]
  },
  "results": [...]
}
```

#### 2. **HTML Report** (Beautiful visual report)

Features:
- 📊 Executive summary with metrics
- 🎨 Color-coded test results
- 📈 Pass rate visualization
- 🚨 Critical issues highlighted
- 💡 AI-powered recommendations
- 🔍 Coverage gap analysis
- 📉 Trend detection
- ⏱️ Step-by-step timing

**Open in Browser:**
```
file:///path/to/outputs/test-results/{module}/{STORY_ID}-results-{timestamp}.html
```

---

## 📁 Project Structure

```
Multi-Agent Test Automation Framework/
├── src/
│   ├── agents/               # 4 AI Agents
│   │   ├── story-analyst.ts      # Agent 1: Analyzes user stories
│   │   ├── test-generator.ts     # Agent 2: Generates test cases
│   │   ├── test-executor.ts      # Agent 3: Executes tests
│   │   └── results-analyzer.ts   # Agent 4: Analyzes results
│   ├── core/                 # Core framework
│   │   ├── orchestrator.ts       # Orchestrates 4-agent pipeline
│   │   └── types.ts              # TypeScript interfaces
│   ├── config/               # Configuration
│   │   └── environments.ts       # Environment management
│   ├── executors/            # Execution engines
│   │   └── prompt-executor.ts    # Direct execution from markdown
│   ├── mcp/                  # Model Context Protocol
│   │   └── playwright-mcp-server.ts  # Playwright MCP server
│   ├── managers/             # Utility managers
│   │   └── test-prompt-manager.ts    # Test case & results manager
│   └── cli/                  # CLI tools
├── user-stories/             # User story input files
│   ├── authentication/
│   └── account-management/
├── outputs/                  # Generated outputs
│   ├── test-cases/              # Generated test cases
│   └── test-results/            # Test results & reports
├── .env                      # Environment variables (API keys)
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── README.md                 # This file
└── ARCHITECTURE.md           # Detailed architecture docs
```

---

## 🐛 Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set" Warning

**Cause**: Missing or invalid Anthropic API key

**Solution**:
1. Create `.env` file in project root
2. Add your API key: `ANTHROPIC_API_KEY=sk-ant-api03-your-key-here`
3. Restart the application

**What happens without API key:**
- ✅ Tests still execute (Agent 3 doesn't need API)
- ✅ Basic metrics are calculated
- ❌ AI insights are unavailable (Agent 4 falls back to basic analysis)

---

### Issue: "spawn EINVAL" Error on Windows

**Status**: ✅ **FIXED** in latest version!

**What was wrong**: Windows cannot spawn `.cmd` files with `{shell: false}` via StdioClientTransport

**How we fixed it**:
```typescript
// OLD (BROKEN on Windows):
const transport = new StdioClientTransport({
  command: 'npx.cmd',
  args: ['tsx', 'src/mcp/playwright-mcp-server.ts', '--headed']
});

// NEW (WORKING on Windows):
const command = 'node';
const tsxLoaderPath = path.resolve(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs');
const transport = new StdioClientTransport({
  command: command,
  args: [tsxLoaderPath, mcpServerPath, '--headed']
});
```

**Result**: MCP server now starts reliably on Windows with REAL browser automation!

---

### Issue: Browser Not Opening

**Cause**: MCP server not starting or wrong configuration

**Solution**:
1. Check if Playwright is installed: `npx playwright install chromium`
2. Verify MCP server path in executor files
3. Run with `--headed` flag to see visible browser
4. Check console logs for MCP server initialization

---

### Issue: "Analysis unavailable due to API error"

**Causes**:
1. Invalid API key
2. API key has no credits
3. Network connectivity issues
4. Anthropic API rate limits

**Solutions**:
1. Verify API key at [console.anthropic.com](https://console.anthropic.com/)
2. Check API usage and credits
3. Test network connectivity
4. Wait and retry if rate-limited

**Fallback**: Framework provides basic analysis even without AI

---

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm test -- <STORY_ID>` | Run full AI pipeline (4 agents) |
| `npm test -- <STORY_ID> --headed` | Run with visible browser |
| `npm run prompt -- "<file>"` | Execute from test case file |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Run in development mode |

---

## 🔗 Related Documentation

- [Architecture Deep Dive](ARCHITECTURE.md) - Detailed technical documentation
- [Anthropic API](https://docs.anthropic.com/) - Claude AI documentation
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [Playwright](https://playwright.dev/) - Browser automation docs

---

## 📄 License

This project is licensed under the ISC License.

---

## 📧 Contact

- **Repository**: [github.com/ravikaanthe/MCP-MultiAgent-Framework](https://github.com/ravikaanthe/MCP-MultiAgent-Framework)
- **Issues**: [GitHub Issues](https://github.com/ravikaanthe/MCP-MultiAgent-Framework/issues)

---

**Made with ❤️ using AI Agents, MCP, and Playwright**
