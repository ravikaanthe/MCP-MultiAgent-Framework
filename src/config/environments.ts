/**
 * 🌐 Environment Configuration
 * Centralized configuration for all environments and applications
 */

export interface ApplicationConfig {
  name: string;
  baseUrl: string;
  loginUrl: string;
  openAccountUrl: string;
  overviewUrl: string;
  transferUrl: string;
  credentials: {
    valid: {
      username: string;
      password: string;
    }[];
    invalid: {
      username: string;
      password: string;
    }[];
  };
  selectors: {
    username: string;
    password: string;
    loginButton: string;
    logoutButton?: string;
  };
}

export interface EnvironmentConfig {
  name: string;
  applications: {
    [key: string]: ApplicationConfig;
  };
}

/**
 * 🏦 ParaBank Application Configuration
 * Credentials should be configured via environment variables:
 * - VALID_USERNAME, VALID_PASSWORD
 * - INVALID_USERNAME, INVALID_PASSWORD
 */
const parabankConfig: ApplicationConfig = {
  name: "ParaBank Demo",
  baseUrl: process.env.BASE_URL || "https://parabank.parasoft.com/parabank",
  loginUrl: process.env.LOGIN_URL || "https://parabank.parasoft.com/parabank/index.htm",
  openAccountUrl: process.env.OPEN_ACCOUNT_URL || "https://parabank.parasoft.com/parabank/openaccount.htm",
  overviewUrl: process.env.OVERVIEW_URL || "https://parabank.parasoft.com/parabank/overview.htm",
  transferUrl: process.env.TRANSFER_URL || "https://parabank.parasoft.com/parabank/transfer.htm",
  credentials: {
    valid: [
      { 
        username: process.env.VALID_USERNAME || "", 
        password: process.env.VALID_PASSWORD || "" 
      }
    ],
    invalid: [
      { 
        username: process.env.INVALID_USERNAME || "invaliduser", 
        password: process.env.INVALID_PASSWORD || "invalidpass" 
      }
    ]
  },
  selectors: {
    username: process.env.USERNAME_SELECTOR || 'input[name="username"]',
    password: process.env.PASSWORD_SELECTOR || 'input[name="password"]',
    loginButton: process.env.LOGIN_BUTTON_SELECTOR || 'input[type="submit"][value="Log In"]',
    logoutButton: process.env.LOGOUT_BUTTON_SELECTOR || 'a[href="logout.htm"]'
  }
};

/**
 * 🌍 Environment Configurations
 */
export const environments: { [key: string]: EnvironmentConfig } = {
  development: {
    name: "Development",
    applications: {
      parabank: parabankConfig
    }
  },
  staging: {
    name: "Staging", 
    applications: {
      parabank: {
        ...parabankConfig,
        baseUrl: "https://staging-parabank.parasoft.com/parabank",
        loginUrl: "https://staging-parabank.parasoft.com/parabank/index.htm",
        openAccountUrl: "https://staging-parabank.parasoft.com/parabank/openaccount.htm",
        overviewUrl: "https://staging-parabank.parasoft.com/parabank/overview.htm",
        transferUrl: "https://staging-parabank.parasoft.com/parabank/transfer.htm"
      }
    }
  },
  production: {
    name: "Production",
    applications: {
      parabank: parabankConfig
    }
  }
};

/**
 * 🔧 Environment Helper Functions
 */
export class EnvironmentManager {
  private static currentEnv: string = process.env.TEST_ENV || 'development';
  private static currentApp: string = process.env.TEST_APP || 'parabank';

  /**
   * Get current environment configuration
   */
  static getCurrentEnvironment(): EnvironmentConfig {
    const env = environments[this.currentEnv];
    if (!env) {
      throw new Error(`Environment '${this.currentEnv}' not found. Available: ${Object.keys(environments).join(', ')}`);
    }
    return env;
  }

  /**
   * Get current application configuration
   */
  static getCurrentApplication(): ApplicationConfig {
    const env = this.getCurrentEnvironment();
    const app = env.applications[this.currentApp];
    if (!app) {
      throw new Error(`Application '${this.currentApp}' not found in environment '${this.currentEnv}'. Available: ${Object.keys(env.applications).join(', ')}`);
    }
    return app;
  }

  /**
   * Get valid credentials for current application
   */
  static getValidCredentials(): { username: string; password: string } {
    const app = this.getCurrentApplication();
    return app.credentials.valid[0]; // Return first valid credential set
  }

  /**
   * Get invalid credentials for current application
   */
  static getInvalidCredentials(): { username: string; password: string } {
    const app = this.getCurrentApplication();
    return app.credentials.invalid[0]; // Return first invalid credential set
  }

  /**
   * Get all URLs for current application
   */
  static getUrls() {
    const app = this.getCurrentApplication();
    return {
      baseUrl: app.baseUrl,
      loginUrl: app.loginUrl,
      openAccountUrl: app.openAccountUrl,
      overviewUrl: app.overviewUrl,
      transferUrl: app.transferUrl
    };
  }

  /**
   * Get selectors for current application
   */
  static getSelectors() {
    const app = this.getCurrentApplication();
    return app.selectors;
  }

  /**
   * Set environment and application
   */
  static setEnvironment(env: string, app: string = 'parabank') {
    if (!environments[env]) {
      throw new Error(`Environment '${env}' not found`);
    }
    if (!environments[env].applications[app]) {
      throw new Error(`Application '${app}' not found in environment '${env}'`);
    }
    this.currentEnv = env;
    this.currentApp = app;
  }

  /**
   * Get environment info for logging
   */
  static getEnvironmentInfo() {
    const env = this.getCurrentEnvironment();
    const app = this.getCurrentApplication();
    return {
      environment: env.name,
      application: app.name,
      baseUrl: app.baseUrl
    };
  }
}

export default EnvironmentManager;
