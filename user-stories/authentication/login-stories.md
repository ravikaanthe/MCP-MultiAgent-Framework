# ParaBank Authentication Module - Login Stories

## Story AUTH-001: Successful User Login
```
As a ParaBank customer, I want to log into my online banking account
So that I can access my account information and perform banking transactions

Application URL: https://parabank.parasoft.com/parabank/index.htm
Test Credentials: Username: ficusroot, Password: katal@n@ravi

Acceptance Criteria:
- User can navigate to ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
- Page displays "Customer Login" section on the left side
- Username field is labeled "Username:" and accepts text input
- Password field is labeled "Password:" and masks input
- User can enter valid username "ficusroot" in the username field
- User can enter valid password "katal@n@ravi" in the password field
- "Log In" button is clickable when both fields have values
- Clicking "Log In" button with valid credentials redirects to account overview page
- Account overview page URL contains "/overview.htm"
- Account overview displays "Welcome" message with customer name
- Account overview shows "Accounts Overview" heading
- Available accounts are listed with account numbers and balances
- Right side navigation menu displays banking options (Open New Account, Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out)
- "Log Out" link is visible in the top navigation
```

## Story AUTH-002: Invalid Login Credentials
```
As a ParaBank security system, I want to prevent unauthorized access
So that customer accounts remain secure

Application URL: https://parabank.parasoft.com/parabank/index.htm
Test Scenarios: Invalid username/password combinations

Acceptance Criteria:
- User enters invalid username "wronguser" and valid password "katal@n@ravi"
- System displays error message "The username and password could not be verified."
- Error message appears in red text below the login form
- User enters valid username "ficusroot" and invalid password "wrongpass"
- System displays same error message for security consistency
- User enters empty username field and any password
- System shows validation message or disables login button
- User enters any username and empty password field
- System shows validation message or disables login button
- Multiple failed login attempts do not lock the account (demo environment)
- User can retry login immediately after failed attempt
- Login fields remain populated for retry (username only)
- Page remains on login screen after failed attempts
```

## Story AUTH-003: Logout Functionality
```
As a ParaBank customer, I want to securely log out of my account
So that my banking information remains protected when I'm done

Acceptance Criteria:
- "Log Out" link is visible in the top navigation
- Clicking "Log Out" ends the current session
- User is redirected to the main login page
- Attempting to access account pages after logout redirects to login
- Session data is cleared from browser
- "Customer Login" section is displayed again
```

## Story AUTH-004: Session Management
```
As a ParaBank customer, I want my session to be managed securely
So that my account is protected from unauthorized access

Acceptance Criteria:
- User session remains active during normal banking activities
- Session timeout occurs after period of inactivity (if implemented)
- User can navigate between different banking features while logged in
- Browser refresh maintains logged-in state
- Simultaneous login from different browsers is handled appropriately
- Session state is consistent across all banking features
```