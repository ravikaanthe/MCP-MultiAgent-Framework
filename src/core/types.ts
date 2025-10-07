// Type definitions for the multi-agent test automation framework

export interface UserStoryRequirements {
  feature: string;
  actions: string[];
  outcomes: string[];
  edgeCases: string[];
  acceptanceCriteria: string[];
}

export interface TestCase {
  testName: string;
  steps: string[];
  assertions: string[];
  testData: Record<string, any>;
  priority: 'high' | 'medium' | 'low';
}

export interface TestStepResult {
  step: string;
  status: 'passed' | 'failed';
  error?: string;
  duration?: number;
}

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed';
  duration: number;
  steps: TestStepResult[];
  errors: string[];
  screenshots: string[];
}

export interface TestAnalysis {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  passRate: number;
  coverageGaps: string[];
  trends: string[];
  recommendations: string[];
  criticalIssues: string[];
}

export interface PipelineResults {
  timestamp: string;
  userStory: string;
  requirements: UserStoryRequirements;
  testCases: TestCase[];
  testResults: TestResult[];
  analysis: TestAnalysis;
  totalExecutionTime: number;
}

export interface MCPToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface MCPResult {
  success: boolean;
  result?: any;
  error?: string;
}
