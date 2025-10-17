# AUTHENTICATION Module Test Cases

## Story: AUTH-001
**Feature:** Online Banking Login  
**Module:** authentication  
**Generated:** 2025-10-16

## Test Suite Summary
- **Total Test Cases:** 5
- **High Priority:** 1
- **Medium Priority:** 2
- **Low Priority:** 2

## Requirements Analysis
**Actions:** Navigate to ParaBank login page, Enter valid username, Enter valid password, Click the 'Log In' button  
**Outcomes:** User is redirected to the account overview page, Account overview page URL contains '/overview.htm', Account overview page displays a 'Welcome' message with the customer name, Account overview page shows the 'Accounts Overview' heading, Available accounts are listed with account numbers and balances, Right side navigation menu displays banking options, 'Log Out' link is visible in the top navigation  
**Edge Cases:** Enter an invalid username, Enter an invalid password, Leave the username field empty, Leave the password field empty

## Generated Test Cases


### Test Case 1: Login with valid credentials
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter valid username 'ficusroot' in the username field
3. Enter valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify user is redirected to the account overview page (EXPECT: SUCCESS)
6. Verify the account overview page URL contains '/overview.htm'
7. Verify the account overview page displays a 'Welcome' message with the customer name
8. Verify the account overview page shows the 'Accounts Overview' heading
9. Verify the available accounts are listed with account numbers and balances
10. Verify the right side navigation menu displays banking options
11. Verify the 'Log Out' link is visible in the top navigation

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
2. Enter invalid username 'invaliduser' in the username field
3. Enter valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify login fails and an error message is displayed (EXPECT: FAILURE)

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
2. Enter valid username 'ficusroot' in the username field
3. Enter invalid password 'invalidpass' in the password field
4. Click the 'Log In' button
5. Verify login fails and an error message is displayed (EXPECT: FAILURE)

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


### Test Case 4: Login with empty username field
**Priority:** LOW

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Leave the username field empty
3. Enter valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify login fails and an error message is displayed (EXPECT: FAILURE)

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


### Test Case 5: Login with empty password field
**Priority:** LOW

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter valid username 'ficusroot' in the username field
3. Leave the password field empty
4. Click the 'Log In' button
5. Verify login fails and an error message is displayed (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "ficusroot",
  "password": ""
}
```

---


## Automation-Ready JSON
```json
{
  "module": "authentication",
  "storyId": "AUTH-001",
  "testSuite": "Online Banking Login Tests",
  "testCases": [
  {
    "testName": "Login with valid credentials",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter valid username 'ficusroot' in the username field",
      "Enter valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Verify the account overview page URL contains '/overview.htm'",
      "Verify the account overview page displays a 'Welcome' message with the customer name",
      "Verify the account overview page shows the 'Accounts Overview' heading",
      "Verify the available accounts are listed with account numbers and balances",
      "Verify the right side navigation menu displays banking options",
      "Verify the 'Log Out' link is visible in the top navigation"
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
      "Enter invalid username 'invaliduser' in the username field",
      "Enter valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify login fails and an error message is displayed (EXPECT: FAILURE)"
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
      "Enter valid username 'ficusroot' in the username field",
      "Enter invalid password 'invalidpass' in the password field",
      "Click the 'Log In' button",
      "Verify login fails and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "invalidpass"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with empty username field",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Leave the username field empty",
      "Enter valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify login fails and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "",
      "password": "katal@n@ravi"
    },
    "priority": "low"
  },
  {
    "testName": "Login with empty password field",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter valid username 'ficusroot' in the username field",
      "Leave the password field empty",
      "Click the 'Log In' button",
      "Verify login fails and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": ""
    },
    "priority": "low"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-10-16T23:39:49.558Z*
