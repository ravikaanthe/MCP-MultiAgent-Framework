/**
 * 🧪 Test Data Generator
 * Generates test data using environment configuration
 */

import EnvironmentManager from './environments.js';

export interface TestDataTemplate {
  username?: string;
  password?: string;
  sourceAccount?: string;
  accountType?: string;
  initialDeposit?: number;
  baseUrl?: string;
  loginUrl?: string;
  openAccountUrl?: string;
  overviewUrl?: string;
  transferUrl?: string;
}

export class TestDataGenerator {
  /**
   * Generate test data with valid credentials
   */
  static generateValidCredentialsTestData(overrides: Partial<TestDataTemplate> = {}): TestDataTemplate {
    const validCreds = EnvironmentManager.getValidCredentials();
    const urls = EnvironmentManager.getUrls();
    
    return {
      username: validCreds.username,
      password: validCreds.password,
      sourceAccount: process.env.VALID_SOURCE_ACCOUNT || "",
      accountType: process.env.DEFAULT_ACCOUNT_TYPE || "SAVINGS",
      initialDeposit: Number(process.env.DEFAULT_INITIAL_DEPOSIT) || 100,
      baseUrl: urls.baseUrl,
      loginUrl: urls.loginUrl,
      openAccountUrl: urls.openAccountUrl,
      overviewUrl: urls.overviewUrl,
      transferUrl: urls.transferUrl,
      ...overrides
    };
  }

  /**
   * Generate test data with invalid credentials
   */
  static generateInvalidCredentialsTestData(overrides: Partial<TestDataTemplate> = {}): TestDataTemplate {
    const invalidCreds = EnvironmentManager.getInvalidCredentials();
    const urls = EnvironmentManager.getUrls();
    
    return {
      username: invalidCreds.username,
      password: invalidCreds.password,
      baseUrl: urls.baseUrl,
      loginUrl: urls.loginUrl,
      openAccountUrl: urls.openAccountUrl,
      overviewUrl: urls.overviewUrl,
      transferUrl: urls.transferUrl,
      ...overrides
    };
  }

  /**
   * Generate test data for protected page access without credentials
   */
  static generateNoCredentialsTestData(overrides: Partial<TestDataTemplate> = {}): TestDataTemplate {
    const urls = EnvironmentManager.getUrls();
    
    return {
      baseUrl: urls.baseUrl,
      loginUrl: urls.loginUrl,
      openAccountUrl: urls.openAccountUrl,
      overviewUrl: urls.overviewUrl,
      transferUrl: urls.transferUrl,
      ...overrides
    };
  }

  /**
   * Generate test data for invalid source account testing
   */
  static generateInvalidSourceAccountTestData(overrides: Partial<TestDataTemplate> = {}): TestDataTemplate {
    const validCreds = EnvironmentManager.getValidCredentials();
    const urls = EnvironmentManager.getUrls();
    
    return {
      username: validCreds.username,
      password: validCreds.password,
      sourceAccount: process.env.INVALID_SOURCE_ACCOUNT || "99999", // Invalid source account from env
      accountType: process.env.DEFAULT_ACCOUNT_TYPE || "SAVINGS",
      initialDeposit: Number(process.env.DEFAULT_INITIAL_DEPOSIT) || 100,
      baseUrl: urls.baseUrl,
      loginUrl: urls.loginUrl,
      openAccountUrl: urls.openAccountUrl,
      overviewUrl: urls.overviewUrl,
      transferUrl: urls.transferUrl,
      ...overrides
    };
  }

  /**
   * Get environment-specific URLs for JSON generation
   */
  static getEnvironmentUrls() {
    return EnvironmentManager.getUrls();
  }

  /**
   * Get environment-specific credentials for JSON generation
   */
  static getEnvironmentCredentials() {
    return {
      valid: EnvironmentManager.getValidCredentials(),
      invalid: EnvironmentManager.getInvalidCredentials()
    };
  }
}

export default TestDataGenerator;
