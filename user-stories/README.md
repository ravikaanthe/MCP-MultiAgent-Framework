# ParaBank Test Automation - User Stories Index

Welcome to the ParaBank Multi-Agent Test Automation Framework User Stories repository. This directory contains organized user stories for testing the ParaBank online banking application.

## 🏦 Application Under Test

**ParaBank Demo Banking Application**
- **URL**: https://parabank.parasoft.com/parabank/index.htm
- **Test Credentials**: 
  - Username: `ficusroot`
  - Password: `katal@n@ravi`

## 📁 Story Modules

```
user-stories/
├── authentication/         # Login, logout, session management
├── account-management/     # Opening accounts, viewing details  
├── transactions/          # Fund transfers between accounts
├── bill-pay/             # Bill payment and payee management
└── README.md             # This file
```

## 🎯 Story Overview by Module

### 🔐 Authentication Module (4 Stories)
**Location:** `authentication/login-stories.md`
- **AUTH-001**: Successful User Login - Core login functionality with valid credentials
- **AUTH-002**: Invalid Login Credentials - Security validation and error handling
- **AUTH-003**: Logout Functionality - Secure session termination
- **AUTH-004**: Session Management - Session handling and security

### 🏦 Account Management Module (4 Stories)
**Location:** `account-management/new-account-stories.md`
- **ACCT-001**: Open New Checking Account - Create checking accounts with funding
- **ACCT-002**: Open New Savings Account - Create savings accounts with transfers
- **ACCT-003**: Account Opening Validation - Input validation and error handling
- **ACCT-004**: View Account Details - Account information and transaction history

### 💸 Transactions Module (4 Stories)
**Location:** `transactions/transfer-funds-stories.md`
- **TRANS-001**: Transfer Funds Between Own Accounts - Internal account transfers
- **TRANS-002**: Transfer Funds Validation - Amount and account validation
- **TRANS-003**: Transfer Confirmation and History - Transaction confirmation and tracking
- **TRANS-004**: Transfer to External Account - External bank transfers (future feature)

### 💳 Bill Pay Module (5 Stories)
**Location:** `bill-pay/bill-payment-stories.md`
- **BILL-001**: Add New Payee - Create payee records for bill payments
- **BILL-002**: Pay Bill to Existing Payee - Process payments to saved payees
- **BILL-003**: Bill Payment Validation - Payment validation and error handling
- **BILL-004**: View Payment History - Payment tracking and history
- **BILL-005**: Manage Payees - Payee maintenance and management

## 🚀 Using Stories with the Framework

### CLI Commands

```bash
# List all ParaBank stories
node dist/cli/story-cli.js list

# List stories from specific banking module
node dist/cli/story-cli.js list --module authentication
node dist/cli/story-cli.js list --module account-management
node dist/cli/story-cli.js list --module transactions
node dist/cli/story-cli.js list --module bill-pay

# Run tests for specific banking story
node dist/cli/story-cli.js test --story AUTH-001
node dist/cli/story-cli.js test --story ACCT-001
node dist/cli/story-cli.js test --story TRANS-001
node dist/cli/story-cli.js test --story BILL-001

# Run all tests for a banking module
node dist/cli/story-cli.js test --module authentication
node dist/cli/story-cli.js test --module account-management
```

### Test Execution Order

**Recommended test execution sequence:**
1. **Authentication** - Ensure login works before other tests
2. **Account Management** - Create additional accounts for transfer tests
3. **Transactions** - Test fund transfers between accounts
4. **Bill Pay** - Test bill payment functionality

### Framework Integration

The framework automatically discovers ParaBank stories:

```typescript
// Get stories from specific banking module
const authStories = await userStoryManager.getStoriesByModule('authentication');
const accountStories = await userStoryManager.getStoriesByModule('account-management');

// Get specific banking story
const loginStory = await userStoryManager.getStoryById('AUTH-001');
```

## 🔧 Banking Test Configuration

### Environment Setup
- Ensure ParaBank application is accessible
- Test credentials are pre-configured in stories
- Framework uses Playwright MCP for browser automation
- Generated test prompts are stored for review

### Test Data
- **Username**: ficusroot
- **Password**: katal@n@ravi
- **Minimum Deposit**: $100.00 (for new accounts)
- **Application URL**: https://parabank.parasoft.com/parabank/index.htm

## 📊 Test Coverage

**Total Stories**: 17 banking scenarios
- **Authentication**: 4 stories covering login security
- **Account Management**: 4 stories covering account operations
- **Transactions**: 4 stories covering fund transfers
- **Bill Pay**: 5 stories covering bill payment features

## 🛠️ Adding New Banking Stories

To add new ParaBank stories:

```bash
# Add to existing banking module
node dist/cli/story-cli.js add --module transactions --title "ATM Withdrawals"

# Create new banking module
node dist/cli/story-cli.js add --module loans --title "Loan Application"
```

## 📋 Story Format Standard

All ParaBank stories follow this format:

```markdown
## Story [MODULE-ID]: [Title]
\`\`\`
As a ParaBank customer, I want to [action]
So that [business value]

Pre-requisites: [Any setup requirements]
Application URL: https://parabank.parasoft.com/parabank/index.htm
Test Credentials: Username: ficusroot, Password: katal@n@ravi

Acceptance Criteria:
- [Testable criterion 1]
- [Testable criterion 2]
- [Additional criteria...]
\`\`\`
```

---

**Ready to test ParaBank!** 🏦 Use the CLI commands above to start automated testing of the banking application.
