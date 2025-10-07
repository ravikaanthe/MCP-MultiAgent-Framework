# GENERAL Module Test Cases

## Story: UNKNOWN-001
**Feature:** Logging into ParaBank online banking account  
**Module:** general  
**Generated:** 2025-10-07

## Test Suite Summary
- **Total Test Cases:** 5
- **High Priority:** 1
- **Medium Priority:** 3
- **Low Priority:** 1

## Requirements Analysis
**Actions:** Navigate to ParaBank login page at https://parabank.parasoft.com/parabank/index.htm, Enter valid username 'ficusroot' in the username field, Enter valid password 'katal@n@ravi' in the password field, Click the 'Log In' button  
**Outcomes:** User is redirected to the account overview page, Account overview page URL contains '/overview.htm', Account overview displays 'Welcome' message with customer name, Account overview shows 'Accounts Overview' heading, Available accounts are listed with account numbers and balances, Right side navigation menu displays banking options (Open New Account, Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out), 'Log Out' link is visible in the top navigation  
**Edge Cases:** Attempt to log in with an invalid username, Attempt to log in with an invalid password, Leave either the username or password field empty and attempt to log in, Enter special characters or symbols in the username or password fields

## Generated Test Cases


### Test Case 1: Login with valid credentials
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter valid username 'ficusroot' in the username field
3. Enter valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)
6. Verify that the account overview page URL contains '/overview.htm'
7. Verify that the account overview displays the 'Welcome' message with the customer name
8. Verify that the account overview shows the 'Accounts Overview' heading
9. Verify that the available accounts are listed with account numbers and balances
10. Verify that the right side navigation menu displays the banking options (Open New Account, Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out)
11. Verify that the 'Log Out' link is visible in the top navigation

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "ficusroot",
  "password": "katal@n@ravi"
}
```

---


### Test Case 2: Login with invalid username
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter an invalid username 'invaliduser' in the username field
3. Enter a valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "invaliduser",
  "password": "katal@n@ravi"
}
```

---


### Test Case 3: Login with invalid password
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter a valid username 'ficusroot' in the username field
3. Enter an invalid password 'invalidpass' in the password field
4. Click the 'Log In' button
5. Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "ficusroot",
  "password": "invalidpass"
}
```

---


### Test Case 4: Login with empty username
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Leave the username field empty
3. Enter a valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "",
  "password": "katal@n@ravi"
}
```

---


### Test Case 5: Login with special characters in username
**Priority:** LOW

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter a username with special characters '!@#$%^&*()' in the username field
3. Enter a valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "!@#$%^&*()",
  "password": "katal@n@ravi"
}
```

---


## Automation-Ready JSON
```json
{
  "module": "general",
  "storyId": "UNKNOWN-001",
  "testSuite": "Logging into ParaBank online banking account Tests",
  "testCases": [
  {
    "testName": "Login with valid credentials",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter valid username 'ficusroot' in the username field",
      "Enter valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Verify that the account overview page URL contains '/overview.htm'",
      "Verify that the account overview displays the 'Welcome' message with the customer name",
      "Verify that the account overview shows the 'Accounts Overview' heading",
      "Verify that the available accounts are listed with account numbers and balances",
      "Verify that the right side navigation menu displays the banking options (Open New Account, Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out)",
      "Verify that the 'Log Out' link is visible in the top navigation"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi"
    },
    "priority": "high"
  },
  {
    "testName": "Login with invalid username",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter an invalid username 'invaliduser' in the username field",
      "Enter a valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "invaliduser",
      "password": "katal@n@ravi"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with invalid password",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter a valid username 'ficusroot' in the username field",
      "Enter an invalid password 'invalidpass' in the password field",
      "Click the 'Log In' button",
      "Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "invalidpass"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with empty username",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Leave the username field empty",
      "Enter a valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "",
      "password": "katal@n@ravi"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with special characters in username",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter a username with special characters '!@#$%^&*()' in the username field",
      "Enter a valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "!@#$%^&*()",
      "password": "katal@n@ravi"
    },
    "priority": "low"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-10-07T02:06:51.656Z*
