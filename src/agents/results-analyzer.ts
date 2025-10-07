import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import type { TestResult, TestAnalysis } from '../core/types.js';

/**
 * Agent 4 - Results Analyzer Agent
 * Analyzes test results and provides intelligent insights
 */
export class ResultsAnalyzerAgent {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }

  /**
   * Analyzes test execution results and provides insights
   * @param testResults - Array of test results from execution
   * @returns Analysis with metrics, trends, and recommendations
   */
  async analyzeResults(testResults: TestResult[]): Promise<TestAnalysis> {
    console.log(chalk.blue('📊 Results Analyzer Agent: Analyzing test results...'));
    
    try {
      // Calculate basic metrics
      const totalTests = testResults.length;
      const passedTests = testResults.filter(r => r.status === 'passed').length;
      const failedTests = testResults.filter(r => r.status === 'failed').length;
      const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
      const avgDuration = testResults.length > 0 
        ? testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length 
        : 0;

      // Prepare data for Claude analysis
      const resultsData = testResults.map(result => ({
        testName: result.testName,
        status: result.status,
        duration: result.duration,
        errorCount: result.errors.length,
        stepCount: result.steps.length,
        failedSteps: result.steps.filter(s => s.status === 'failed').length
      }));

      const prompt = `
        Analyze these test execution results and provide insights:
        
        Test Results Summary:
        - Total Tests: ${totalTests}
        - Passed: ${passedTests}
        - Failed: ${failedTests}
        - Pass Rate: ${passRate.toFixed(1)}%
        - Average Duration: ${avgDuration.toFixed(0)}ms
        
        Detailed Results:
        ${JSON.stringify(resultsData, null, 2)}
        
        Failed Test Details:
        ${testResults
          .filter(r => r.status === 'failed')
          .map(r => `${r.testName}: ${r.errors.join(', ')}`)
          .join('\n')}
        
        Provide analysis in this JSON format:
        {
          "summary": "Brief overview of test results",
          "riskLevel": "high|medium|low based on pass rate and critical failures",
          "passRate": ${passRate},
          "coverageGaps": ["array of missing test scenarios or areas"],
          "trends": ["array of patterns in failures"],
          "recommendations": ["array of actionable improvements"],
          "criticalIssues": ["array of urgent items requiring immediate attention"]
        }
        
        Risk Level Guidelines:
        - high: Pass rate < 70% or critical functionality failing
        - medium: Pass rate 70-90% or non-critical issues
        - low: Pass rate > 90% with minor issues only
        
        Return ONLY the JSON object, no additional text.
      `;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      const analysis = JSON.parse(content.text) as TestAnalysis;
      
      console.log(chalk.green('✅ Results analysis completed'));
      console.log(chalk.gray(`   Risk Level: ${analysis.riskLevel}`));
      console.log(chalk.gray(`   Pass Rate: ${analysis.passRate.toFixed(1)}%`));
      console.log(chalk.gray(`   Critical Issues: ${analysis.criticalIssues.length}`));
      
      return analysis;
    } catch (error) {
      console.error(chalk.red('❌ Results analysis failed:'), error);
      
      // Fallback analysis
      const totalTests = testResults.length;
      const passedTests = testResults.filter(r => r.status === 'passed').length;
      const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
      
      return {
        summary: `Executed ${totalTests} tests with ${passRate.toFixed(1)}% pass rate`,
        riskLevel: passRate < 70 ? 'high' : passRate < 90 ? 'medium' : 'low',
        passRate,
        coverageGaps: ['Analysis unavailable due to API error'],
        trends: ['Unable to analyze trends'],
        recommendations: ['Review failed tests manually', 'Check test environment'],
        criticalIssues: testResults.filter(r => r.status === 'failed').map(r => r.testName)
      };
    }
  }

  /**
   * Generates and displays a comprehensive test report
   * @param analysis - Analysis results from analyzeResults
   * @param testResults - Original test results
   */
  generateReport(analysis: TestAnalysis, testResults: TestResult[]): void {
    console.log('\n' + chalk.cyan('═'.repeat(80)));
    console.log(chalk.cyan.bold('                    📊 TEST EXECUTION REPORT'));
    console.log(chalk.cyan('═'.repeat(80)));
    
    // Summary Section
    console.log(chalk.white.bold('\n📋 SUMMARY'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.white(`${analysis.summary}`));
    
    // Metrics Section
    console.log(chalk.white.bold('\n📈 METRICS'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.white(`Pass Rate:       ${analysis.passRate.toFixed(1)}%`));
    console.log(chalk.white(`Risk Level:      ${this.getRiskLevelColor(analysis.riskLevel)(analysis.riskLevel.toUpperCase())}`));
    console.log(chalk.white(`Total Tests:     ${testResults.length}`));
    console.log(chalk.white(`Passed:          ${chalk.green(testResults.filter(r => r.status === 'passed').length)}`));
    console.log(chalk.white(`Failed:          ${chalk.red(testResults.filter(r => r.status === 'failed').length)}`));
    
    // Test Details
    console.log(chalk.white.bold('\n🧪 TEST DETAILS'));
    console.log(chalk.gray('─'.repeat(40)));
    testResults.forEach(result => {
      const statusIcon = result.status === 'passed' ? '✅' : '❌';
      const statusColor = result.status === 'passed' ? chalk.green : chalk.red;
      console.log(chalk.white(`${statusIcon} ${result.testName}`));
      console.log(chalk.gray(`   Duration: ${result.duration}ms, Steps: ${result.steps.length}, Errors: ${result.errors.length}`));
      
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          console.log(chalk.red(`   ❌ ${error}`));
        });
      }
    });
    
    // Coverage Gaps
    if (analysis.coverageGaps.length > 0) {
      console.log(chalk.white.bold('\n🔍 COVERAGE GAPS'));
      console.log(chalk.gray('─'.repeat(40)));
      analysis.coverageGaps.forEach(gap => {
        console.log(chalk.yellow(`⚠️  ${gap}`));
      });
    }
    
    // Trends
    if (analysis.trends.length > 0) {
      console.log(chalk.white.bold('\n📊 TRENDS'));
      console.log(chalk.gray('─'.repeat(40)));
      analysis.trends.forEach(trend => {
        console.log(chalk.blue(`📈 ${trend}`));
      });
    }
    
    // Critical Issues
    if (analysis.criticalIssues.length > 0) {
      console.log(chalk.white.bold('\n🚨 CRITICAL ISSUES'));
      console.log(chalk.gray('─'.repeat(40)));
      analysis.criticalIssues.forEach(issue => {
        console.log(chalk.red(`🚨 ${issue}`));
      });
    }
    
    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log(chalk.white.bold('\n💡 RECOMMENDATIONS'));
      console.log(chalk.gray('─'.repeat(40)));
      analysis.recommendations.forEach(recommendation => {
        console.log(chalk.cyan(`💡 ${recommendation}`));
      });
    }
    
    console.log(chalk.cyan('\n' + '═'.repeat(80)));
  }

  /**
   * Generate HTML report for test results
   */
  generateHTMLReport(analysis: TestAnalysis, testResults: TestResult[], storyId: string): string {
    const timestamp = new Date().toISOString();
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const failedTests = testResults.filter(r => r.status === 'failed').length;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Results Report - ${storyId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #007acc; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #007acc; margin: 0; }
        .header .story-id { color: #666; font-size: 18px; margin-top: 5px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007acc; }
        .metric-value { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .metric-label { color: #666; font-size: 14px; }
        .pass-rate { color: ${analysis.passRate >= 80 ? '#28a745' : analysis.passRate >= 60 ? '#ffc107' : '#dc3545'}; }
        .risk-level { color: ${analysis.riskLevel === 'low' ? '#28a745' : analysis.riskLevel === 'medium' ? '#ffc107' : '#dc3545'}; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; }
        .test-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid; }
        .test-passed { border-left-color: #28a745; }
        .test-failed { border-left-color: #dc3545; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-details { color: #666; font-size: 14px; }
        .test-errors { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 10px; margin-top: 10px; }
        .error-item { color: #856404; margin: 5px 0; }
        .test-steps { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; margin-top: 10px; }
        .test-steps h4 { margin: 0 0 10px 0; color: #495057; font-size: 14px; }
        .step-item { margin: 8px 0; padding: 8px 12px; background: white; border-radius: 4px; border-left: 3px solid; font-family: 'Courier New', monospace; font-size: 13px; }
        .step-passed { border-left-color: #28a745; }
        .step-failed { border-left-color: #dc3545; background: #fff5f5; }
        .step-status { font-weight: bold; margin-right: 8px; }
        .step-duration { color: #666; font-size: 11px; float: right; }
        .step-error { color: #dc3545; font-size: 12px; margin-top: 4px; font-style: italic; }
        .summary-text { background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #007acc; }
        .list-item { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .timestamp { color: #666; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Test Execution Report</h1>
            <div class="story-id">Story: ${storyId}</div>
        </div>

        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value pass-rate">${analysis.passRate.toFixed(1)}%</div>
                <div class="metric-label">Pass Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${testResults.length}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="color: #28a745;">${passedTests}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="color: #dc3545;">${failedTests}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value risk-level">${analysis.riskLevel.toUpperCase()}</div>
                <div class="metric-label">Risk Level</div>
            </div>
        </div>

        <div class="section">
            <h2>📋 Summary</h2>
            <div class="summary-text">${analysis.summary}</div>
        </div>

        <div class="section">
            <h2>🧪 Test Results</h2>
            ${testResults.map(result => `
                <div class="test-item ${result.status === 'passed' ? 'test-passed' : 'test-failed'}">
                    <div class="test-name">
                        ${result.status === 'passed' ? '✅' : '❌'} ${result.testName}
                    </div>
                    <div class="test-details">
                        Duration: ${result.duration}ms | Steps: ${result.steps.length} | Status: ${result.status.toUpperCase()}
                    </div>
                    
                    ${result.steps.length > 0 ? `
                        <div class="test-steps">
                            <h4>📋 Test Steps Executed:</h4>
                            ${result.steps.map((step, index) => `
                                <div class="step-item ${step.status === 'passed' ? 'step-passed' : 'step-failed'}">
                                    <span class="step-status">${step.status === 'passed' ? '✅' : '❌'}</span>
                                    <strong>Step ${index + 1}:</strong> ${step.step}
                                    <span class="step-duration">${step.duration}ms</span>
                                    ${step.error ? `<div class="step-error">Error: ${step.error}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${result.errors.length > 0 ? `
                        <div class="test-errors">
                            <strong>⚠️ Test-Level Errors:</strong>
                            ${result.errors.map(error => `<div class="error-item">❌ ${error}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>

        ${analysis.coverageGaps.length > 0 ? `
            <div class="section">
                <h2>🔍 Coverage Gaps</h2>
                ${analysis.coverageGaps.map(gap => `<div class="list-item">⚠️ ${gap}</div>`).join('')}
            </div>
        ` : ''}

        ${analysis.criticalIssues.length > 0 ? `
            <div class="section">
                <h2>🚨 Critical Issues</h2>
                ${analysis.criticalIssues.map(issue => `<div class="list-item" style="background: #fff3cd; border-left: 4px solid #dc3545;">🚨 ${issue}</div>`).join('')}
            </div>
        ` : ''}

        ${analysis.recommendations.length > 0 ? `
            <div class="section">
                <h2>💡 Recommendations</h2>
                ${analysis.recommendations.map(rec => `<div class="list-item" style="background: #e3f2fd; border-left: 4px solid #007acc;">💡 ${rec}</div>`).join('')}
            </div>
        ` : ''}

        <div class="timestamp">
            Generated on ${timestamp}
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Returns appropriate color function for risk level
   */
  private getRiskLevelColor(riskLevel: string) {
    switch (riskLevel) {
      case 'high':
        return chalk.red.bold;
      case 'medium':
        return chalk.yellow.bold;
      case 'low':
        return chalk.green.bold;
      default:
        return chalk.white;
    }
  }
}
