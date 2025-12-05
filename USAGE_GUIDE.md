# Framework Usage Guide

Complete guide for running tests with the Multi-Agent Test Automation Framework.

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Execution Methods](#execution-methods)
3. [Browser Modes](#browser-modes)
4. [Command Reference](#command-reference)
5. [Creating User Stories](#creating-user-stories)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
✅ Node.js 18+ installed
✅ Anthropic API key in `.env` file
✅ Dependencies installed (`npm install`)

### Run Your First Test
```powershell
# Run a test with visible browser
npm test -- AUTH-001 --headed

# Run a test in background
npm test -- AUTH-001
```

---

## Execution Methods

This framework supports **2 execution methods**:

### 🤖 Method 1: Full AI Pipeline (Recommended)
**Uses**: All 4 agents working together via MCP protocol

**When to use**: 
- When you have user stories and want AI to generate tests
- For comprehensive test coverage with AI insights
- When you need automated test analysis and recommendations

**Command**:
```powershell
npm test -- <STORY-ID> [--headed]
```

**Process**:
1. 🔍 Story Analyst analyzes your user story
2. 🧪 Test Generator creates test cases
3. 🚀 Test Executor runs tests via MCP (with visible/hidden browser)
4. 📊 Results Analyzer provides insights

**Example**:
```powershell
# Headed mode (visible browser)
npm test -- AUTH-001 --headed

# Headless mode (background)
npm test -- AUTH-001
```

**Output**:
- Console: Real-time progress with colored output
- JSON: `outputs/test-results-{timestamp}.json`
- Markdown: `outputs/analysis-report-{timestamp}.md`

---

### 🎯 Method 2: Direct Prompt Execution
**Uses**: Pre-generated test cases executed directly

**When to use**:
- When you already have generated test cases
- For quick test execution without analysis
- For debugging specific test cases

**Command**:
```powershell
npm run prompt -- <TEST-FILE-PATH>
```

**Process**:
1. Reads test cases from markdown file
2. Executes tests directly with Playwright
3. Shows results in console

**Example**:
```powershell
# Run pre-generated tests (always in headed mode)
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"
```

**Note**: This method **always runs in headed mode** (visible browser) for demonstration purposes.

---

## Browser Modes

### 🖥️ Headed Mode (Visible Browser)
**What it does**: Opens a visible Chrome browser window where you can see test execution

**Use cases**:
- Debugging tests
- Demonstrating to stakeholders
- Learning how tests work
- Verifying UI changes

**How to enable**:
```powershell
# Full AI Pipeline
npm test -- AUTH-001 --headed

# Direct Prompt (always headed)
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"
```

**What you'll see**:
- Browser window opens
- Actions performed step-by-step
- Forms filled, buttons clicked
- Real-time test execution

**MCP Server Configuration**:
```
Browser Mode: HEADED (visible browser)
- slowMo: 500ms (slowed down for visibility)
- headless: false
```

---

### 🚀 Headless Mode (Background)
**What it does**: Runs tests in background without visible browser (faster)

**Use cases**:
- CI/CD pipelines
- Automated testing
- Performance testing
- Regression testing

**How to enable**:
```powershell
# Full AI Pipeline (default mode)
npm test -- AUTH-001
```

**What you'll see**:
- No browser window
- Console output only
- Faster execution
- Lower resource usage

**MCP Server Configuration**:
```
Browser Mode: HEADLESS (background)
- headless: true
- no GUI overhead
```

---

## Command Reference

### Full AI Pipeline

#### Basic Commands
```powershell
# Run with headless mode (default)
npm test -- AUTH-001

# Run with headed mode (visible browser)
npm test -- AUTH-001 --headed

# Run different story
npm test -- AUTH-002 --headed
```

#### Available Stories
| Story ID | Description | Module |
|----------|-------------|--------|
| AUTH-001 | Successful User Login | Authentication |
| AUTH-002 | Invalid Login Credentials | Authentication |
| AUTH-003 | Logout Functionality | Authentication |
| AUTH-004 | Session Management | Authentication |
| ACCT-001 | View Account Overview | Account Management |
| ACCT-002 | Open New Account | Account Management |

#### What Happens During Execution

**Headless Mode** (`npm test -- AUTH-001`):
```
🔍 Story Analyst: Analyzing story...
   ✓ Requirements extracted

🧪 Test Generator: Creating test cases...
   ✓ 4 test cases generated

🚀 Test Executor: Initializing MCP Server...
   ✓ MCP Server started in HEADLESS mode
   ✓ Browser launched in background
   ✓ Executing tests...
      Test 1: ✓ Passed (2.3s)
      Test 2: ✓ Passed (1.8s)

📊 Results Analyzer: Analyzing results...
   ✓ Pass Rate: 100%
   ✓ Risk Level: Low
```

**Headed Mode** (`npm test -- AUTH-001 --headed`):
```
🔍 Story Analyst: Analyzing story...
   ✓ Requirements extracted

🧪 Test Generator: Creating test cases...
   ✓ 4 test cases generated

🚀 Test Executor: Initializing MCP Server...
   ✓ MCP Server started in HEADED mode
   ✓ Browser window opening... [VISIBLE]
   ✓ Executing tests with slowMo (500ms)...
      Test 1: ✓ Passed (3.5s) - Watch browser!
      Test 2: ✓ Passed (2.9s)

📊 Results Analyzer: Analyzing results...
   ✓ Pass Rate: 100%
   ✓ Risk Level: Low
```

---

### Direct Prompt Execution

#### Basic Commands
```powershell
# Execute pre-generated test file
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"

# Execute test from different module
npm run prompt -- "outputs/test-cases/account-management/ACCT-002-tests.md"
```

#### What Happens
```
📖 Reading test cases from: AUTH-001-tests.md
   ✓ Found 4 test cases

🚀 Launching browser (HEADED mode)...
   ✓ Browser opened

🎯 Executing Test 1: Successful Login
   Step 1: Navigate to ParaBank ✓
   Step 2: Enter username ✓
   Step 3: Enter password ✓
   Step 4: Click login button ✓
   Step 5: Verify account page ✓
   ✓ Test Passed (2.4s)

🎯 Executing Test 2: Invalid Credentials
   ...

✨ Execution Complete
   Total: 4 tests
   Passed: 3
   Failed: 1
   Pass Rate: 75%
```

---

## Creating User Stories

### Story Format (JIRA-Compatible)

Create markdown files in `user-stories/<module>/` directory:

```markdown
# Module Name - Feature Stories

## Story AUTH-001: Feature Title

**Story ID**: AUTH-001  
**Story Type**: Feature  
**Priority**: High  
**Estimate**: 3 Story Points  
**Sprint**: Sprint 1  
**Module**: Authentication  
**Epic**: User Authentication

### User Story
```
As a [user role]
I want to [action]
So that I can [benefit]
```

### Description
Detailed description of the feature...

### Pre-conditions
- Condition 1
- Condition 2

### Test Data
- **URL**: https://example.com
- **Username**: testuser
- **Password**: testpass

### Acceptance Criteria
- Criterion 1: User can do X
- Criterion 2: System validates Y
- Criterion 3: Page displays Z

### Definition of Done
- [ ] Functionality works
- [ ] Tests pass
- [ ] Code reviewed

### Dependencies
- None or list dependencies

### Notes
- Additional information
```

### Example Structure

```
user-stories/
├── authentication/
│   └── login-stories.md        # AUTH-001 to AUTH-004
├── account-management/
│   └── account-stories.md      # ACCT-001 to ACCT-004
└── README.md
```

### Adding New Stories

1. **Create or edit markdown file**:
```powershell
# Create new file
New-Item "user-stories/payments/payment-stories.md"
```

2. **Add story in JIRA format** (see template above)

3. **Run the story**:
```powershell
npm test -- PAY-001 --headed
```

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ "Story ID not found"
**Problem**: Story doesn't exist in user-stories directory

**Solution**:
```powershell
# List available stories
Get-ChildItem -Recurse "user-stories/*.md"

# Check story ID matches exactly
npm test -- AUTH-001  # Correct
npm test -- auth-001  # Wrong (case-sensitive)
```

---

#### ❌ "MCP Server failed to start"
**Problem**: MCP server process couldn't be spawned

**Solution**:
```powershell
# Test MCP server standalone
npx tsx src/mcp/playwright-mcp-server.ts --headed

# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
npm install
```

---

#### ❌ "Browser doesn't open in headed mode"
**Problem**: --headed flag not working

**Solution**:
```powershell
# Make sure to use -- before flags
npm test -- AUTH-001 --headed  # Correct
npm test AUTH-001 --headed     # Wrong

# Test MCP server directly
npx tsx src/mcp/playwright-mcp-server.ts --headed
```

---

#### ❌ "ANTHROPIC_API_KEY is required"
**Problem**: Missing or invalid API key

**Solution**:
```powershell
# Check .env file exists
Test-Path ".env"

# Verify content
Get-Content ".env"

# Should contain:
ANTHROPIC_API_KEY=sk-ant-api03-...

# If missing, create .env:
"ANTHROPIC_API_KEY=your-key-here" | Out-File -Encoding ASCII ".env"
```

---

#### ❌ Tests fail in headless but pass in headed
**Problem**: Timing issues or element loading

**Solution**:
```powershell
# Use headed mode for debugging
npm test -- AUTH-001 --headed

# Check MCP server slowMo setting in playwright-mcp-server.ts
# Increase if actions are too fast

# MCP auto-waits are enabled - check for dynamic content issues
```

---

#### ❌ "Cannot find module" errors
**Problem**: Dependencies not installed

**Solution**:
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
npm install

# Verify TypeScript compilation
npm run build
```

---

### Verification Commands

#### Check Framework Setup
```powershell
# Verify Node.js version
node --version  # Should show v18.x.x or higher

# Verify dependencies
npm list --depth=0

# Test TypeScript compilation
npm run build

# Verify API key
$env:ANTHROPIC_API_KEY  # Should show key (don't share!)
```

#### Test MCP Server Standalone
```powershell
# Test headed mode
npx tsx src/mcp/playwright-mcp-server.ts --headed

# Test headless mode
npx tsx src/mcp/playwright-mcp-server.ts --headless

# Test with slowMo
npx tsx src/mcp/playwright-mcp-server.ts --headed --slowMo=1000
```

#### Verify User Stories
```powershell
# List all story files
Get-ChildItem -Recurse "user-stories/*.md"

# Check specific story
Get-Content "user-stories/authentication/login-stories.md"
```

---

## Testing Checklist

Before running tests, ensure:

- ✅ Node.js 18+ installed
- ✅ Dependencies installed (`npm install`)
- ✅ `.env` file with ANTHROPIC_API_KEY
- ✅ User story exists in correct location
- ✅ Story ID matches file content
- ✅ Internet connection available (for API calls)

### Test Both Modes

#### Full AI Pipeline - Headed
```powershell
npm test -- AUTH-001 --headed
```
**Expected**: Browser window opens, you see test execution

#### Full AI Pipeline - Headless
```powershell
npm test -- AUTH-001
```
**Expected**: No browser window, console output only

#### Direct Prompt - Headed (Always)
```powershell
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"
```
**Expected**: Browser window opens, pre-generated tests execute

---

## Quick Reference Card

### Most Common Commands

```powershell
# Run test with visible browser
npm test -- AUTH-001 --headed

# Run test in background
npm test -- AUTH-001

# Run pre-generated tests
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"

# Test MCP server
npx tsx src/mcp/playwright-mcp-server.ts --headed

# List available stories
Get-ChildItem -Recurse "user-stories/*.md"
```

### Flags

| Flag | Purpose | Example |
|------|---------|---------|
| `--headed` | Visible browser | `npm test -- AUTH-001 --headed` |
| (none) | Headless/background | `npm test -- AUTH-001` |

### Story IDs

| Module | Story IDs | File Location |
|--------|-----------|---------------|
| Authentication | AUTH-001 to AUTH-004 | `user-stories/authentication/login-stories.md` |
| Account Management | ACCT-001 to ACCT-004 | `user-stories/account-management/account-stories.md` |

---

## Summary

**Two Ways to Run Tests**:
1. **Full AI Pipeline** (`npm test`) - AI generates and executes tests
2. **Direct Prompt** (`npm run prompt`) - Execute pre-generated tests

**Two Browser Modes**:
1. **Headed** (`--headed` flag) - Visible browser for debugging/demos
2. **Headless** (default) - Background mode for automation

**Both methods use MCP protocol** for advanced browser automation with AI-driven element finding and self-healing capabilities.

---

*For detailed framework architecture, see [FRAMEWORK_OVERVIEW.md](FRAMEWORK_OVERVIEW.md)*
