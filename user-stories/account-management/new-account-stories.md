# ParaBank Account Management Module - New Account Stories

## Story ACCT-001: Open New Checking Account
```
As a ParaBank customer, I want to open a new checking account
So that I can have additional accounts for different financial needs

Pre-requisites: 
- User must be logged in with valid credentials (ficusroot/katal@n@ravi)
- VALID CREDENTIALS: Username "ficusroot" with password "katal@n@ravi" will succeed
- INVALID CREDENTIALS: Any other username/password combination will fail

Test Scenarios Required:
1. POSITIVE TEST: Login with valid credentials and successfully open checking account
2. NEGATIVE TEST: Try to access Open New Account with invalid credentials
3. NEGATIVE TEST: Try to open account without selecting funding source
4. NEGATIVE TEST: Try to open account with insufficient funds

Acceptance Criteria:
- User can navigate to "Open New Account" from the main menu (only after successful login)
- User can select "CHECKING" as the account type
- User can choose an existing account to transfer minimum deposit from
- Minimum deposit amount is clearly displayed ($100.00)
- User can click "Open New Account" button to create account
- New account is created with unique account number
- Success message displays with new account details
- New account appears in account overview with $100.00 balance
- User can immediately access the new account

Test Data Requirements:
- Valid credentials: {"username": "ficusroot", "password": "katal@n@ravi"}
- Invalid credentials: {"username": "wronguser", "password": "wrongpass"}
- Account type: CHECKING
- Minimum deposit: 100.00
- Base URL: https://parabank.parasoft.com/parabank/index.htm
```

## Story ACCT-002: Open New Savings Account
```
As a ParaBank customer, I want to open a new savings account
So that I can save money and earn interest

Pre-requisites: 
- User can navigate to ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
- Page displays "Customer Login" section on the left side
- Username field is labeled "Username:" and accepts text input
- Password field is labeled "Password:" and masks input
- VALID CREDENTIALS: Username "ficusroot" with password "katal@n@ravi" will succeed
- INVALID CREDENTIALS: Any other username/password combination will fail
- "Log In" button is clickable when both fields have values
- Clicking "Log In" button with valid credentials redirects to account overview page
- Clicking "Log In" button with invalid credentials shows error message and blocks access

Test Scenarios Required:
1. POSITIVE TEST: Login with valid credentials (ficusroot/katal@n@ravi) and successfully open savings account
2. NEGATIVE TEST: Login with invalid credentials (invaliduser/invalidpass) and verify login fails
3. NEGATIVE TEST: Try to access Open New Account page without logging in first
4. POSITIVE TEST: Login with valid credentials and test with valid source account 29217
5. NEGATIVE TEST: Login with valid credentials but use invalid source account 12345

Acceptance Criteria:
- User can navigate to "Open New Account" page (only after successful login)
- User can select "SAVINGS" as the account type
- User can select source account 29217 from dropdown for minimum deposit transfer
- Click Open new account
- New savings account is created with unique account number
- Store the new account number in a variable called 'AccountNumber'
- Click on new account number link and Account overview reflects updated balances for both accounts
- New savings account shows initial balance of $90.00
- Transaction history shows the opening deposit transfer

Authentication Rules:
- ONLY ficusroot/katal@n@ravi are valid credentials
- All other username/password combinations should fail login
- Failed login should prevent access to any protected pages
- Protected pages include: openaccount, overview, transfer, admin

Test Data Requirements:
- Valid credentials: {"username": "ficusroot", "password": "katal@n@ravi"}
- Invalid credentials: {"username": "invaliduser", "password": "invalidpass"}
- Valid source account: 29217
- Invalid source account: 12345
- Initial deposit amount: 90
- Base URL: https://parabank.parasoft.com/parabank/index.htm
```

## Story ACCT-003: Account Opening Validation
```
As a ParaBank system, I want to validate account opening requirements
So that accounts are created properly with sufficient funding

Acceptance Criteria:
- System prevents account opening without selecting account type
- System prevents account opening without selecting funding source
- System validates minimum deposit requirement ($100.00)
- Error message displays if source account has insufficient funds
- User cannot proceed without meeting all requirements
- Form validation occurs before submission
- Clear error messages guide user to correct issues
```

## Story ACCT-004: View Account Details
```
As a ParaBank customer, I want to view detailed account information
So that I can monitor my account status and transaction history

Acceptance Criteria:
- User can click on any account number from account overview
- Account details page displays account number, type, and balance
- Account activity/transaction history is visible
- Transactions show date, description, debit/credit, and running balance
- User can navigate back to account overview
- Account information is accurate and up-to-date
- Page loads quickly with all account data
```
