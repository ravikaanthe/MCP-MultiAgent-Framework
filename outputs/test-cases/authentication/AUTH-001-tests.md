# AUTHENTICATION Module Test Cases

## Story: AUTH-001
**Feature:** User Authentication & Authorization  
**Module:** authentication  
**Generated:** 2025-12-05

## Test Suite Summary
- **Total Test Cases:** 5
- **High Priority:** 2
- **Medium Priority:** 2
- **Low Priority:** 1

## Requirements Analysis
**Actions:** Navigate to ParaBank login page, Enter valid username in the username field, Enter valid password in the password field, Click the 'Log In' button  
**Outcomes:** User is redirected to the account overview page, Welcome message with customer name is displayed, Accounts Overview section is displayed, Available accounts are listed with account numbers and balances, Right side navigation menu with banking options is visible, Log Out link is displayed in the top navigation  
**Edge Cases:** Enter invalid username and/or password, Leave username and/or password fields empty, Click 'Log In' button without entering any credentials

## Generated Test Cases


### Test Case 1: Login with valid credentials
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter a valid username 'ficusroot' in the username field
3. Enter a valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)
6. Verify that the welcome message with the customer name is displayed
7. Verify that the Accounts Overview section is displayed
8. Verify that the available accounts are listed with account numbers and balances
9. Verify that the right side navigation menu with banking options is visible
10. Verify that the Log Out link is displayed in the top navigation

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


### Test Case 2: Login with invalid username and valid password
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter an invalid username 'invaliduser' in the username field
3. Enter a valid password 'katal@n@ravi' in the password field
4. Click the 'Log In' button
5. Verify that the user is not redirected to the account overview page (EXPECT: FAILURE)
6. Verify that an error message is displayed indicating that the username or password is invalid

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


### Test Case 3: Login with valid username and invalid password
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Enter a valid username 'ficusroot' in the username field
3. Enter an invalid password 'invalidpass' in the password field
4. Click the 'Log In' button
5. Verify that the user is not redirected to the account overview page (EXPECT: FAILURE)
6. Verify that an error message is displayed indicating that the username or password is invalid

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


### Test Case 4: Login with empty username and password fields
**Priority:** LOW

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Leave the username field empty
3. Leave the password field empty
4. Click the 'Log In' button
5. Verify that the user is not redirected to the account overview page (EXPECT: FAILURE)
6. Verify that an error message is displayed indicating that the username and password fields are required

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


### Test Case 5: Verify the ParaBank login page elements
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm
2. Verify that the page displays the 'Customer Login' section on the left side
3. Verify that the username field is labeled 'Username:' and accepts text input
4. Verify that the password field is labeled 'Password:' and masks the input
5. Verify that the Log In button is clickable when both the username and password fields have values
6. Verify that clicking the Log In button with valid credentials redirects the user to the account overview page

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
      "Enter a valid username 'ficusroot' in the username field",
      "Enter a valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify that the user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Verify that the welcome message with the customer name is displayed",
      "Verify that the Accounts Overview section is displayed",
      "Verify that the available accounts are listed with account numbers and balances",
      "Verify that the right side navigation menu with banking options is visible",
      "Verify that the Log Out link is displayed in the top navigation"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi"
    },
    "priority": "high"
  },
  {
    "testName": "Login with invalid username and valid password",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter an invalid username 'invaliduser' in the username field",
      "Enter a valid password 'katal@n@ravi' in the password field",
      "Click the 'Log In' button",
      "Verify that the user is not redirected to the account overview page (EXPECT: FAILURE)",
      "Verify that an error message is displayed indicating that the username or password is invalid"
    ],
    "testData": {
      "username": "invaliduser",
      "password": "katal@n@ravi"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with valid username and invalid password",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Enter a valid username 'ficusroot' in the username field",
      "Enter an invalid password 'invalidpass' in the password field",
      "Click the 'Log In' button",
      "Verify that the user is not redirected to the account overview page (EXPECT: FAILURE)",
      "Verify that an error message is displayed indicating that the username or password is invalid"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "invalidpass"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with empty username and password fields",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Leave the username field empty",
      "Leave the password field empty",
      "Click the 'Log In' button",
      "Verify that the user is not redirected to the account overview page (EXPECT: FAILURE)",
      "Verify that an error message is displayed indicating that the username and password fields are required"
    ],
    "testData": {
      "username": "",
      "password": ""
    },
    "priority": "low"
  },
  {
    "testName": "Verify the ParaBank login page elements",
    "steps": [
      "Navigate to the ParaBank login page at https://parabank.parasoft.com/parabank/index.htm",
      "Verify that the page displays the 'Customer Login' section on the left side",
      "Verify that the username field is labeled 'Username:' and accepts text input",
      "Verify that the password field is labeled 'Password:' and masks the input",
      "Verify that the Log In button is clickable when both the username and password fields have values",
      "Verify that clicking the Log In button with valid credentials redirects the user to the account overview page"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi"
    },
    "priority": "high"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-12-05T05:37:13.738Z*
