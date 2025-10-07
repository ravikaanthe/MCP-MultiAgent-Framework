# GENERAL Module Test Cases

## Story: open-a-new-savings-account-so-
**Feature:** Open a new savings account  
**Module:** general  
**Generated:** 2025-10-06

## Test Suite Summary
- **Total Test Cases:** 6
- **High Priority:** 2
- **Medium Priority:** 3
- **Low Priority:** 1

## Requirements Analysis
**Actions:** Navigate to ParaBank login page, Enter valid credentials (ficusroot/katal@n@ravi), Click the 'Log In' button, Navigate to 'Open New Account' page, Select 'SAVINGS' as the account type, Select source account 29217 from the dropdown, Click 'Open new account', Click the new account number link  
**Outcomes:** User is redirected to the account overview page, New savings account is created with a unique account number, The new account number is stored in the 'AccountNumber' variable, The account overview page reflects the updated balances for both accounts, The new savings account shows an initial balance of $90.00, The transaction history shows the opening deposit transfer  
**Edge Cases:** Login with invalid credentials (invaliduser/invalidpass), Try to access the 'Open New Account' page without logging in first, Login with valid credentials but use an invalid source account (12345)

## Generated Test Cases


### Test Case 1: Login with valid credentials and complete the main flow
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the valid username 'ficusroot'
3. Enter the valid password 'katal@n@ravi'
4. Click the Log In button
5. Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)
6. Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
7. Select 'SAVINGS' as the account type
8. Select source account '29217' from the dropdown
9. Click 'Open new account'
10. Verify that a new savings account is created with a unique account number (EXPECT: SUCCESS)
11. Store the new account number in the 'AccountNumber' variable
12. Click the new account number link
13. Verify that the account overview page reflects the updated balances for both accounts (EXPECT: SUCCESS)
14. Verify that the new savings account shows an initial balance of $90.00 (EXPECT: SUCCESS)
15. Verify that the transaction history shows the opening deposit transfer (EXPECT: SUCCESS)

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


### Test Case 2: Login with invalid credentials and verify failure
**Priority:** MEDIUM

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the invalid username 'invaliduser'
3. Enter the invalid password 'invalidpass'
4. Click the Log In button
5. Verify that login fails and error message is displayed (EXPECT: FAILURE)

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


### Test Case 3: Try to access protected pages without logging in
**Priority:** MEDIUM

#### Test Steps:
1. Attempt to navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
2. Verify that access is denied and user remains on the login page (EXPECT: FAILURE)

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


### Test Case 4: Complete flow with valid source account
**Priority:** HIGH

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the valid username 'ficusroot'
3. Enter the valid password 'katal@n@ravi'
4. Click the Log In button
5. Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)
6. Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
7. Select 'SAVINGS' as the account type
8. Select source account '29217' from the dropdown
9. Click 'Open new account'
10. Verify that a new savings account is created with a unique account number (EXPECT: SUCCESS)
11. Store the new account number in the 'AccountNumber' variable
12. Click the new account number link
13. Verify that the account overview page reflects the updated balances for both accounts (EXPECT: SUCCESS)
14. Verify that the new savings account shows an initial balance of $90.00 (EXPECT: SUCCESS)
15. Verify that the transaction history shows the opening deposit transfer (EXPECT: SUCCESS)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "ficusroot",
  "password": "katal@n@ravi",
  "sourceAccount": "29217"
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
5. Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)
6. Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
7. Select 'SAVINGS' as the account type
8. Select source account '12345' from the dropdown
9. Click 'Open new account'
10. Verify that the account is not created and an error message is displayed (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "ficusroot",
  "password": "katal@n@ravi",
  "sourceAccount": "12345"
}
```

---


### Test Case 6: Login with valid credentials but use an invalid source account
**Priority:** LOW

#### Test Steps:
1. Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'
2. Enter the valid username 'ficusroot'
3. Enter the valid password 'katal@n@ravi'
4. Click the Log In button
5. Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)
6. Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'
7. Select 'SAVINGS' as the account type
8. Select source account '12345' from the dropdown
9. Click 'Open new account'
10. Verify that the account is not created and an error message is displayed (EXPECT: FAILURE)

#### Assertions:
- Validations are embedded in test steps with EXPECT markers

#### Test Data:
```json
{
  "username": "ficusroot",
  "password": "katal@n@ravi",
  "sourceAccount": "12345"
}
```

---


## Automation-Ready JSON
```json
{
  "module": "general",
  "storyId": "open-a-new-savings-account-so-",
  "testSuite": "Open a new savings account Tests",
  "testCases": [
  {
    "testName": "Login with valid credentials and complete the main flow",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the valid username 'ficusroot'",
      "Enter the valid password 'katal@n@ravi'",
      "Click the Log In button",
      "Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Select 'SAVINGS' as the account type",
      "Select source account '29217' from the dropdown",
      "Click 'Open new account'",
      "Verify that a new savings account is created with a unique account number (EXPECT: SUCCESS)",
      "Store the new account number in the 'AccountNumber' variable",
      "Click the new account number link",
      "Verify that the account overview page reflects the updated balances for both accounts (EXPECT: SUCCESS)",
      "Verify that the new savings account shows an initial balance of $90.00 (EXPECT: SUCCESS)",
      "Verify that the transaction history shows the opening deposit transfer (EXPECT: SUCCESS)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi"
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
      "Verify that login fails and error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "invaliduser",
      "password": "invalidpass"
    },
    "priority": "medium"
  },
  {
    "testName": "Try to access protected pages without logging in",
    "steps": [
      "Attempt to navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Verify that access is denied and user remains on the login page (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "",
      "password": ""
    },
    "priority": "medium"
  },
  {
    "testName": "Complete flow with valid source account",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the valid username 'ficusroot'",
      "Enter the valid password 'katal@n@ravi'",
      "Click the Log In button",
      "Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Select 'SAVINGS' as the account type",
      "Select source account '29217' from the dropdown",
      "Click 'Open new account'",
      "Verify that a new savings account is created with a unique account number (EXPECT: SUCCESS)",
      "Store the new account number in the 'AccountNumber' variable",
      "Click the new account number link",
      "Verify that the account overview page reflects the updated balances for both accounts (EXPECT: SUCCESS)",
      "Verify that the new savings account shows an initial balance of $90.00 (EXPECT: SUCCESS)",
      "Verify that the transaction history shows the opening deposit transfer (EXPECT: SUCCESS)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi",
      "sourceAccount": "29217"
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
      "Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Select 'SAVINGS' as the account type",
      "Select source account '12345' from the dropdown",
      "Click 'Open new account'",
      "Verify that the account is not created and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi",
      "sourceAccount": "12345"
    },
    "priority": "medium"
  },
  {
    "testName": "Login with valid credentials but use an invalid source account",
    "steps": [
      "Navigate to the ParaBank login page at 'https://parabank.parasoft.com/parabank/index.htm'",
      "Enter the valid username 'ficusroot'",
      "Enter the valid password 'katal@n@ravi'",
      "Click the Log In button",
      "Verify that login is successful and user is redirected to the account overview page (EXPECT: SUCCESS)",
      "Navigate to the 'Open New Account' page at 'https://parabank.parasoft.com/parabank/openaccount.htm'",
      "Select 'SAVINGS' as the account type",
      "Select source account '12345' from the dropdown",
      "Click 'Open new account'",
      "Verify that the account is not created and an error message is displayed (EXPECT: FAILURE)"
    ],
    "testData": {
      "username": "ficusroot",
      "password": "katal@n@ravi",
      "sourceAccount": "12345"
    },
    "priority": "low"
  }
]
}
```

---
*Generated by Multi-Agent Test Automation Framework on 2025-10-06T23:52:24.409Z*
