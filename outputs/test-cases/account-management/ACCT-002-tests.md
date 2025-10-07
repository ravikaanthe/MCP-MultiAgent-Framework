# ACCOUNT-MANAGEMENT Module Test Cases

## Story: ACCT-002
**Feature:** Open New Savings Account  
**Module:** account-management  
**Generated:** 2025-10-07

## Test Suite Summary
- **Total Test Cases:** 6
- **High Priority:** 2
- **Medium Priority:** 3
- **Low Priority:** 1

## Requirements Analysis
**Actions:** Navigate to ParaBank login page, Enter valid credentials (ficusroot/katal@n@ravi), Click 'Log In' button, Select 'Open New Account' option, Select 'SAVINGS' as the account type, Select valid source account (29217) from dropdown, Click 'Open new account' button, Verify new account number is generated, Click on new account number link, Verify account overview reflects updated balances  
**Outcomes:** Login with valid credentials is successful, New savings account is created with unique account number, Initial deposit of $90.00 is transferred from the source account, Transaction history shows the opening deposit transfer  
**Edge Cases:** Login with invalid credentials (invaliduser/invalidpass), Try to access 'Open New Account' page without logging in first, Login with valid credentials but use invalid source account (12345)

## Generated Test Cases


### Test Case 1: Login with valid credentials and complete the new savings account flow
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the valid username 'ficusroot'
3. Enter the valid password 'katal@n@ravi'
4. Click the Log In button
5. Verify that login is successful and user is redirected to the main page (EXPECT: SUCCESS)
6. Select the 'Open New Account' option
7. Select 'SAVINGS' as the account type
8. Select the valid source account '29217' from the dropdown
9. Click the 'Open new account' button
10. Verify that a new savings account number is generated (EXPECT: SUCCESS)
11. Click on the new account number link
12. Verify that the account overview reflects the updated balances, including the initial $90.00 deposit (EXPECT: SUCCESS)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "validUsername": "ficusroot",
  "validPassword": "katal@n@ravi",
  "validSourceAccount": "29217"
}
```

---


### Test Case 2: Login with invalid credentials and verify failure
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the invalid username 'invaliduser'
3. Enter the invalid password 'invalidpass'
4. Click the Log In button
5. Verify that login fails and an error message is displayed (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "invalidUsername": "invaliduser",
  "invalidPassword": "invalidpass"
}
```

---


### Test Case 3: Try to access protected pages without logging in
**Priority:** MEDIUM

#### Test Steps:
1. Attempt to navigate directly to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
2. Verify that access is denied and the user is redirected to the login page (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{}
```

---


### Test Case 4: Complete flow with valid source account
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the valid username 'ficusroot'
3. Enter the valid password 'katal@n@ravi'
4. Click the Log In button
5. Verify that login is successful and user is redirected to the main page (EXPECT: SUCCESS)
6. Select the 'Open New Account' option
7. Select 'SAVINGS' as the account type
8. Select the valid source account '29217' from the dropdown
9. Click the 'Open new account' button
10. Verify that a new savings account number is generated (EXPECT: SUCCESS)
11. Click on the new account number link
12. Verify that the account overview reflects the updated balances, including the initial $90.00 deposit (EXPECT: SUCCESS)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "validUsername": "ficusroot",
  "validPassword": "katal@n@ravi",
  "validSourceAccount": "29217"
}
```

---


### Test Case 5: Try with invalid source account
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the valid username 'ficusroot'
3. Enter the valid password 'katal@n@ravi'
4. Click the Log In button
5. Verify that login is successful and user is redirected to the main page (EXPECT: SUCCESS)
6. Select the 'Open New Account' option
7. Select 'SAVINGS' as the account type
8. Select the invalid source account '12345' from the dropdown
9. Click the 'Open new account' button
10. Verify that an error message is displayed, and the new account is not created (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "validUsername": "ficusroot",
  "validPassword": "katal@n@ravi",
  "invalidSourceAccount": "12345"
}
```

---


### Test Case 6: Attempt to access 'Open New Account' page without logging in
**Priority:** LOW

#### Test Steps:
1. Attempt to navigate directly to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
2. Verify that access is denied and the user is redirected to the login page (EXPECT: FAILURE)

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
  "module": "account-management",
  "storyId": "ACCT-002",
  "testSuite": "Open New Savings Account Tests",
  "testCases": [
  {
    "testName": "Login with valid credentials and complete the new savings account flow",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the valid username 'ficusroot'",
      "Enter the valid password 'katal@n@ravi'",
      "Click the Log In button",
      "Verify that login is successful and user is redirected to the main page (EXPECT: SUCCESS)",
      "Select the 'Open New Account' option",
      "Select 'SAVINGS' as the account type",
      "Select the valid source account '29217' from the dropdown",
      "Click the 'Open new account' button",
      "Verify that a new savings account number is generated (EXPECT: SUCCESS)",
      "Click on the new account number link",
      "Verify that the account overview reflects the updated balances, including the initial $90.00 deposit (EXPECT: SUCCESS)"
    ],
    "testData": {
      "validUsername": "ficusroot",
      "validPassword": "katal@n@ravi",
      "validSourceAccount": "29217"
    },
    "priority": "high"
  },
  {
    "testName": "Login with invalid credentials and verify failure",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the invalid username 'invaliduser'",
      "Enter the invalid password 'invalidpass'",
      "Click the Log In button",
      "Verify that login fails and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "invalidUsername": "invaliduser",
      "invalidPassword": "invalidpass"
    },
    "priority": "medium"
  },
  {
    "testName": "Try to access protected pages without logging in",
    "steps": [
      "Attempt to navigate directly to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Verify that access is denied and the user is redirected to the login page (EXPECT: FAILURE)"
    ],
    "priority": "medium"
  },
  {
    "testName": "Complete flow with valid source account",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the valid username 'ficusroot'",
      "Enter the valid password 'katal@n@ravi'",
      "Click the Log In button",
      "Verify that login is successful and user is redirected to the main page (EXPECT: SUCCESS)",
      "Select the 'Open New Account' option",
      "Select 'SAVINGS' as the account type",
      "Select the valid source account '29217' from the dropdown",
      "Click the 'Open new account' button",
      "Verify that a new savings account number is generated (EXPECT: SUCCESS)",
      "Click on the new account number link",
      "Verify that the account overview reflects the updated balances, including the initial $90.00 deposit (EXPECT: SUCCESS)"
    ],
    "testData": {
      "validUsername": "ficusroot",
      "validPassword": "katal@n@ravi",
      "validSourceAccount": "29217"
    },
    "priority": "high"
  },
  {
    "testName": "Try with invalid source account",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the valid username 'ficusroot'",
      "Enter the valid password 'katal@n@ravi'",
      "Click the Log In button",
      "Verify that login is successful and user is redirected to the main page (EXPECT: SUCCESS)",
      "Select the 'Open New Account' option",
      "Select 'SAVINGS' as the account type",
      "Select the invalid source account '12345' from the dropdown",
      "Click the 'Open new account' button",
      "Verify that an error message is displayed, and the new account is not created (EXPECT: FAILURE)"
    ],
    "testData": {
      "validUsername": "ficusroot",
      "validPassword": "katal@n@ravi",
      "invalidSourceAccount": "12345"
    },
    "priority": "medium"
  },
  {
    "testName": "Attempt to access 'Open New Account' page without logging in",
    "steps": [
      "Attempt to navigate directly to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Verify that access is denied and the user is redirected to the login page (EXPECT: FAILURE)"
    ],
    "priority": "low"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-10-07T00:26:53.839Z*
