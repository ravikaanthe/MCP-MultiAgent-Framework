# Tomorrow's Testing Plan - ParaBank UI & API Tests

**Date:** December 6, 2025  
**Objective:** Verify Multi-Agent Framework supports ALL user stories with UI + API test combinations

---

## ✅ Framework Readiness Checklist

### Environment Configuration
- [x] ✅ All hardcoded values removed
- [x] ✅ Environment variables configured (.env)
- [x] ✅ EnvironmentManager pattern implemented
- [x] ✅ Credentials managed via environment
- [x] ✅ URLs configured for ParaBank

### MCP Browser Automation
- [x] ✅ Real MCP integration (no simulation)
- [x] ✅ Headed mode working (visible browser)
- [x] ✅ Headless mode working (background)
- [x] ✅ Windows spawn issue fixed (npx.cmd → node + tsx)
- [x] ✅ Tool names corrected (playwright_*)
- [x] ✅ Argument format fixed ({selector, text})

### Test Execution Methods
- [x] ✅ Method 1: Direct Prompt Executor (`npm run prompt -- "file.md"`)
- [x] ✅ Method 2: Full AI Pipeline (`npm test -- AUTH-001 --headed`)
- [x] ✅ Both methods verified working with real browser

### GitHub Status
- [x] ✅ All changes committed and pushed to GitHub
- [x] ✅ Clean working directory
- [x] ✅ Ready for new development

---

## 🎯 Tomorrow's Testing Scenarios

### 1. **Authentication Module (UI Tests)**
- [ ] AUTH-001: Successful Login ✅ (Already tested - WORKING)
- [ ] AUTH-002: Invalid Login Credentials ✅ (Already tested - WORKING)
- [ ] AUTH-003: Logout Functionality (NEW - needs testing)
- [ ] AUTH-004: Session Management (NEW - needs testing)

### 2. **Account Management Module (UI + API Tests)**
- [ ] ACCT-001: Open New Savings Account
- [ ] ACCT-002: Open New Checking Account
- [ ] ACCT-003: View Account Details
- [ ] ACCT-004: Account Balance Verification
- [ ] ACCT-005: Invalid Account Creation (negative test)

**API Endpoints to Test:**
- `GET /parabank/services/bank/accounts/{accountId}` - Get account details
- `POST /parabank/services/bank/createAccount` - Create new account
- `GET /parabank/services/bank/accounts/{accountId}/transactions` - Get transactions

### 3. **Fund Transfer Module (UI + API Tests)**
- [ ] TRANS-001: Transfer Between Own Accounts
- [ ] TRANS-002: Transfer with Insufficient Funds (negative test)
- [ ] TRANS-003: Transfer to External Account
- [ ] TRANS-004: Verify Transaction History

**API Endpoints to Test:**
- `POST /parabank/services/bank/transfer` - Transfer funds
- `GET /parabank/services/bank/accounts/{accountId}/transactions` - Transaction history
- `GET /parabank/services/bank/transactions/{transactionId}` - Transaction details

### 4. **Bill Payment Module (UI + API Tests)**
- [ ] BILL-001: Pay Bill to Payee
- [ ] BILL-002: Pay Bill with Insufficient Funds (negative test)
- [ ] BILL-003: Verify Bill Payment History

**API Endpoints to Test:**
- `POST /parabank/services/bank/billpay` - Pay bill
- `GET /parabank/services/bank/customers/{customerId}/billpay` - Payment history

### 5. **Loan Request Module (UI + API Tests)**
- [ ] LOAN-001: Request Loan with Sufficient Collateral
- [ ] LOAN-002: Request Loan with Insufficient Collateral (negative test)
- [ ] LOAN-003: Verify Loan Approval/Denial Status

**API Endpoints to Test:**
- `POST /parabank/services/bank/requestLoan` - Request loan
- `GET /parabank/services/bank/loans/{loanId}` - Loan details

---

## 🔧 Framework Enhancements Needed for Tomorrow

### 1. **API Testing Support** (HIGH PRIORITY)
Current Status: ❌ Framework only supports UI tests  
**Required Changes:**
- [ ] Add API client support (Axios or Fetch)
- [ ] Create API test executor agent
- [ ] Add API test case format to types
- [ ] Support hybrid UI + API test scenarios
- [ ] Add API response validation

**Example API Test Case Structure:**
```typescript
{
  testName: "Verify account creation via API and UI",
  steps: [
    "Login via UI",
    "Create account via API: POST /services/bank/createAccount",
    "Verify account appears in UI account list",
    "Verify account details via API: GET /services/bank/accounts/{id}"
  ],
  apiCalls: [
    {
      endpoint: "/services/bank/createAccount",
      method: "POST",
      body: { type: "SAVINGS", fromAccountId: 12345 }
    }
  ]
}
```

### 2. **Enhanced Test Data Management** (MEDIUM PRIORITY)
- [ ] Add test data for account management scenarios
- [ ] Add test data for transfer scenarios
- [ ] Add test data for bill payment scenarios
- [ ] Configure dynamic account IDs from API responses

### 3. **Results Reporting Enhancements** (LOW PRIORITY)
- [ ] Add API response logging to test results
- [ ] Show API call duration in reports
- [ ] Display API response validation results
- [ ] Compare UI vs API data consistency

---

## 📋 Pre-Testing Setup (To Do Tonight/Tomorrow Morning)

### Environment Verification
```bash
# 1. Check all environment variables are set
npm run verify-env

# 2. Verify MCP server can start
npm run test-mcp

# 3. Run a quick smoke test
npm test -- AUTH-001 --headed
```

### Create New User Stories
**Directory Structure:**
```
user-stories/
├── authentication/
│   └── login-stories.md ✅ (exists)
├── account-management/ ⚠️ (create tomorrow)
│   └── account-stories.md
├── transactions/ ⚠️ (create tomorrow)
│   └── transfer-stories.md
├── bill-pay/ ⚠️ (create tomorrow)
│   └── billpay-stories.md
└── loans/ ⚠️ (create tomorrow)
    └── loan-stories.md
```

---

## 🚀 Execution Plan for Tomorrow

### Phase 1: Framework Enhancement (1-2 hours)
1. Add API testing capabilities to framework
2. Update test-executor to support API calls
3. Create API client utility
4. Test API integration with simple GET request

### Phase 2: User Story Creation (1 hour)
1. Create account-management stories (ACCT-001 to ACCT-005)
2. Create transaction stories (TRANS-001 to TRANS-004)
3. Create bill payment stories (BILL-001 to BILL-003)
4. Create loan request stories (LOAN-001 to LOAN-003)

### Phase 3: Test Execution (2-3 hours)
1. Run authentication tests (verify existing tests still work)
2. Run account management tests (UI + API hybrid)
3. Run transaction tests (UI + API hybrid)
4. Run bill payment tests (UI + API hybrid)
5. Run loan request tests (UI + API hybrid)

### Phase 4: Results Analysis (30 minutes)
1. Review all test results
2. Analyze pass/fail rates
3. Identify framework issues
4. Document any bugs or improvements needed

---

## 🎯 Success Criteria for Tomorrow

### Framework Capability
- [ ] ✅ Framework successfully executes ALL new user stories
- [ ] ✅ UI tests work without issues
- [ ] ✅ API tests work without issues
- [ ] ✅ Hybrid UI + API tests work seamlessly
- [ ] ✅ Both execution methods (Direct Prompt + Full Pipeline) work

### Test Coverage
- [ ] ✅ All authentication scenarios pass
- [ ] ✅ All account management scenarios execute (UI + API)
- [ ] ✅ All transaction scenarios execute (UI + API)
- [ ] ✅ All bill payment scenarios execute (UI + API)
- [ ] ✅ All loan request scenarios execute (UI + API)
- [ ] ✅ Negative test cases work correctly

### Quality Metrics
- [ ] ✅ Pass rate > 80% for all modules
- [ ] ✅ All test results properly saved (JSON + HTML)
- [ ] ✅ Test execution time < 5 minutes per story
- [ ] ✅ No framework crashes or errors
- [ ] ✅ Comprehensive test reports generated

---

## 📝 Notes

### ParaBank API Documentation
**Base URL:** `https://parabank.parasoft.com/parabank/services/bank`

**Available Endpoints:**
- `/customers/{customerId}` - Customer info
- `/accounts/{accountId}` - Account details
- `/createAccount` - Create new account
- `/transfer` - Transfer funds
- `/billpay` - Pay bill
- `/requestLoan` - Request loan
- `/transactions/{transactionId}` - Transaction details

**Authentication:**
Most API endpoints require session authentication or basic auth with ParaBank credentials.

### Known Issues to Watch
1. **ParaBank Demo Site Availability** - Sometimes down for maintenance
2. **Session Timeout** - May need to handle re-login during long test runs
3. **API Rate Limiting** - Unknown if ParaBank has rate limits
4. **Dynamic Account IDs** - Need to capture and reuse from API responses

---

## 💡 Quick Commands Reference

### Run Specific Story Tests
```bash
# Authentication tests
npm test -- AUTH-001 --headed
npm test -- AUTH-002 --headed
npm test -- AUTH-003 --headed

# Account management tests (tomorrow)
npm test -- ACCT-001 --headed
npm test -- ACCT-002 --headed

# Transaction tests (tomorrow)
npm test -- TRANS-001 --headed

# Run without visible browser (faster)
npm test -- AUTH-001
```

### Direct Prompt Execution
```bash
# Run specific test file directly
npm run prompt -- "outputs/test-cases/authentication/AUTH-001-tests.md"
npm run prompt -- "outputs/test-cases/account-management/ACCT-001-tests.md"
```

### Verify Framework Status
```bash
# Check git status
git status

# Check environment variables
cat .env

# Verify Node modules
npm list --depth=0

# Run type checking
npm run type-check
```

---

## 🎉 Expected Outcome

By end of tomorrow's testing session:
1. ✅ Framework proven to handle ALL ParaBank user stories
2. ✅ UI + API hybrid testing working seamlessly
3. ✅ Comprehensive test coverage across all modules
4. ✅ Production-ready multi-agent test automation framework
5. ✅ Complete documentation of capabilities and results

---

**Last Updated:** December 5, 2025  
**Status:** ✅ Framework Ready - Waiting for Tomorrow's Tests!  
**GitHub:** All changes committed and pushed to main branch
