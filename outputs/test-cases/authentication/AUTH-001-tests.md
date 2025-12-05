# AUTHENTICATION Module Test Cases

## Story: AUTH-001
**Feature:** User Authentication & Authorization  
**Module:** authentication  
**Generated:** 2025-12-05

## Test Suite Summary
- **Total Test Cases:** 6
- **High Priority:** 2
- **Medium Priority:** 3
- **Low Priority:** 1

## Requirements Analysis
**Actions:** Navigate to ParaBank login page, Enter valid username 'ficusroot', Enter valid password 'katal@n@ravi', Click 'Log In' button  
**Outcomes:** User is redirected to account overview page, Welcome message with customer name is displayed, Accounts Overview section is displayed, Available accounts are listed with account numbers and balances, Right side navigation menu is displayed with banking options  
**Edge Cases:** Enter invalid username, Enter invalid password, Leave one or both fields empty, Attempt to access account overview page directly without logging in

## Generated Test Cases


### Test Case 1: Login with valid credentials
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter valid username 'ficusroot'
3. Enter valid password 'katal@n@ravi'
4. Click the 'Log In' button
5. Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)
6. Verify that the welcome message with the customer name is displayed
7. Verify that the Accounts Overview section is displayed
8. Verify that the available accounts are listed with account numbers and balances
9. Verify that the right-side navigation menu is displayed with banking options

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
2. Enter invalid username 'invaliduser'
3. Enter valid password 'katal@n@ravi'
4. Click the 'Log In' button
5. Verify that the login is unsuccessful and an error message is displayed (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "invaliduser",
  "password": ""
}
```

---


### Test Case 3: Login with invalid password
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter valid username 'ficusroot'
3. Enter invalid password 'invalidpass'
4. Click the 'Log In' button
5. Verify that the login is unsuccessful and an error message is displayed (EXPECT: FAILURE)

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
2. Leave the username field empty
3. Leave the password field empty
4. Click the 'Log In' button
5. Verify that the login is unsuccessful and an error message is displayed (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "invaliduser",
  "password": "invalidpass"
}
```

---


### Test Case 5: Attempt to access account overview page without login
**Priority:** LOW

#### Test Steps:
1. Navigate directly to the account overview page at https://parabank.parasoft.com/parabank/overview.htm
2. Verify that the user is redirected to the login page and unable to access the account overview page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{}
```

---


### Test Case 6: Verify login page accessibility and input validation
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Verify that the login page is accessible
3. Verify that the username and password fields are properly labeled
4. Verify that the password field masks the input
5. Verify that the login button is clickable when both fields have values
6. Verify that the login completes within 2 seconds
7. Verify that the password is encrypted in transit

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
  "testSuite": "User Authentication & Authorization Tests",
  "testCases": [
  {
    "testName": "Login with valid credentials",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter valid username 'ficusroot'",
      "Enter valid password 'katal@n@ravi'",
      "Click the 'Log In' button",
      "Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Verify that the welcome message with the customer name is displayed",
      "Verify that the Accounts Overview section is displayed",
      "Verify that the available accounts are listed with account numbers and balances",
      "Verify that the right-side navigation menu is displayed with banking options"
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
      "Enter invalid username 'invaliduser'",
      "Enter valid password 'katal@n@ravi'",
      "Click the 'Log In' button",
      "Verify that the login is unsuccessful and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "invaliduser",
      "password": ""
    },
    "priority": "medium"
  },
  {
    "testName": "Login with invalid password",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter valid username 'ficusroot'",
      "Enter invalid password 'invalidpass'",
      "Click the 'Log In' button",
      "Verify that the login is unsuccessful and an error message is displayed (EXPECT: FAILURE)"
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
      "Leave the username field empty",
      "Leave the password field empty",
      "Click the 'Log In' button",
      "Verify that the login is unsuccessful and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "invaliduser",
      "password": "invalidpass"
    },
    "priority": "medium"
  },
  {
    "testName": "Attempt to access account overview page without login",
    "steps": [
      "Navigate directly to the account overview page at https://parabank.parasoft.com/parabank/overview.htm",
      "Verify that the user is redirected to the login page and unable to access the account overview page (EXPECT: FAILURE)"
    ],
    "priority": "low"
  },
  {
    "testName": "Verify login page accessibility and input validation",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Verify that the login page is accessible",
      "Verify that the username and password fields are properly labeled",
      "Verify that the password field masks the input",
      "Verify that the login button is clickable when both fields have values",
      "Verify that the login completes within 2 seconds",
      "Verify that the password is encrypted in transit"
    ],
    "priority": "high"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-12-05T21:26:01.511Z*
