# AUTHENTICATION Module Test Cases

## Story: AUTH-001
**Feature:** ParaBank Online Login  
**Module:** authentication  
**Generated:** 2025-10-07

## Test Suite Summary
- **Total Test Cases:** 5
- **High Priority:** 2
- **Medium Priority:** 3
- **Low Priority:** 0

## Requirements Analysis
**Actions:** Navigate to ParaBank login page, Enter valid username, Enter valid password, Click Log In button  
**Outcomes:** Redirected to account overview page, Account overview page URL contains '/overview.htm', Welcome message with customer name displayed, Accounts Overview heading displayed, Available accounts listed with account numbers and balances, Right side navigation menu with banking options displayed, Log Out link visible in top navigation  
**Edge Cases:** Enter invalid username, Enter invalid password, Leave username or password field empty, Click Log In button with invalid credentials

## Generated Test Cases


### Test Case 1: Login with valid credentials
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter valid username 'ficusroot' in the Username field
3. Enter valid password 'katal@n@ravi' in the Password field
4. Click the 'Log In' button
5. Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)
6. Verify that the account overview page URL contains '/overview.htm'
7. Verify that the welcome message with the customer name is displayed
8. Verify that the 'Accounts Overview' heading is displayed
9. Verify that the available accounts are listed with account numbers and balances
10. Verify that the right-side navigation menu with banking options is displayed
11. Verify that the 'Log Out' link is visible in the top navigation

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "INTENTIONAL_FAILURE_USER",
  "password": "katal@n@ravi"
}
```

---


### Test Case 2: Login with invalid username
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter invalid username 'invaliduser' in the Username field
3. Enter valid password 'katal@n@ravi' in the Password field
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
2. Enter valid username 'ficusroot' in the Username field
3. Enter invalid password 'invalidpass' in the Password field
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


### Test Case 4: Login with empty username and password
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Leave the Username field empty
3. Leave the Password field empty
4. Click the 'Log In' button
5. Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "",
  "password": ""
}
```

---


### Test Case 5: Verify 'Customer Login' section on the login page
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Verify that the 'Customer Login' section is displayed on the left side of the page
3. Verify that the Username field is labeled 'Username:' and accepts text input
4. Verify that the Password field is labeled 'Password:' and masks the input
5. Verify that the 'Log In' button is clickable when both the Username and Password fields have values

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{}
```

---


## Automation-Ready JSON
```json
{
  "module": "authentication",
  "storyId": "AUTH-001",
  "testSuite": "ParaBank Online Login Tests",
  "testCases": [
  {
    "testName": "Login with valid credentials",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter valid username 'ficusroot' in the Username field",
      "Enter valid password 'katal@n@ravi' in the Password field",
      "Click the 'Log In' button",
      "Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Verify that the account overview page URL contains '/overview.htm'",
      "Verify that the welcome message with the customer name is displayed",
      "Verify that the 'Accounts Overview' heading is displayed",
      "Verify that the available accounts are listed with account numbers and balances",
      "Verify that the right-side navigation menu with banking options is displayed",
      "Verify that the 'Log Out' link is visible in the top navigation"
    ],
    "testData": {
      "username": "INTENTIONAL_FAILURE_USER",
      "password": "katal@n@ravi"
    },
    "priority": "high"
  },
  {
    "testName": "Login with invalid username",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter invalid username 'invaliduser' in the Username field",
      "Enter valid password 'katal@n@ravi' in the Password field",
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
      "Enter valid username 'ficusroot' in the Username field",
      "Enter invalid password 'invalidpass' in the Password field",
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
    "testName": "Login with empty username and password",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Leave the Username field empty",
      "Leave the Password field empty",
      "Click the 'Log In' button",
      "Verify that the login fails and the user is not redirected to the account overview page (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "",
      "password": ""
    },
    "priority": "medium"
  },
  {
    "testName": "Verify 'Customer Login' section on the login page",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Verify that the 'Customer Login' section is displayed on the left side of the page",
      "Verify that the Username field is labeled 'Username:' and accepts text input",
      "Verify that the Password field is labeled 'Password:' and masks the input",
      "Verify that the 'Log In' button is clickable when both the Username and Password fields have values"
    ],
    "testData": {},
    "priority": "high"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-10-07T02:46:14.566Z*
