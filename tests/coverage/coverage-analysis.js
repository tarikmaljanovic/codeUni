const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CoverageAnalyzer {
  constructor() {
    this.coverageDir = path.join(process.cwd(), 'coverage');
    this.coverageJsonPath = path.join(this.coverageDir, 'coverage-final.json');
    this.coverageSummaryPath = path.join(this.coverageDir, 'coverage-summary.json');
    this.htmlReportPath = path.join(this.coverageDir, 'lcov-report', 'index.html');
    
    this.thresholds = {
      excellent: 90,
      good: 80,
      fair: 70,
      poor: 60
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',     
      success: '\x1b[32m',  
      warning: '\x1b[33m',  
      error: '\x1b[31m',    
      header: '\x1b[35m',   
      reset: '\x1b[0m'      
    };
    
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async runCoverageTests() {
    this.log('🧪 Running tests with coverage analysis...', 'header');
    
    try {
      const command = 'npm test -- --coverage --testPathIgnorePatterns=tests/regression/ --watchAll=false';
      
      this.log('Executing: ' + command, 'info');
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 120000 
      });
      
      this.log('✅ Coverage tests completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('⚠️ Tests completed with some failures (coverage data still generated)', 'warning');
      return true;
    }
  }

  loadCoverageData() {
    this.log('\n📊 Loading coverage data...', 'header');
    
    try {
      if (fs.existsSync(this.coverageJsonPath)) {
        const coverageData = JSON.parse(fs.readFileSync(this.coverageJsonPath, 'utf8'));
        this.log('✅ Detailed coverage data loaded', 'success');
        this.detailedCoverage = coverageData;
      } else {
        this.log('❌ Detailed coverage data not found', 'error');
        this.detailedCoverage = {};
      }

      if (fs.existsSync(this.coverageSummaryPath)) {
        const summaryData = JSON.parse(fs.readFileSync(this.coverageSummaryPath, 'utf8'));
        this.log('✅ Summary coverage data loaded', 'success');
        this.summaryCoverage = summaryData;
        return true;
      } else {
        this.log('❌ Summary coverage data not found', 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Error loading coverage data: ${error.message}`, 'error');
      return false;
    }
  }

  getCoverageLevel(percentage) {
    if (percentage >= this.thresholds.excellent) return { level: 'Excellent', color: 'success' };
    if (percentage >= this.thresholds.good) return { level: 'Good', color: 'success' };
    if (percentage >= this.thresholds.fair) return { level: 'Fair', color: 'warning' };
    if (percentage >= this.thresholds.poor) return { level: 'Poor', color: 'warning' };
    return { level: 'Critical', color: 'error' };
  }

  analyzeOverallCoverage() {
    this.log('\n📈 Overall Coverage Analysis', 'header');
    this.log('=' .repeat(50), 'info');

    const total = this.summaryCoverage.total;
    
    const metrics = [
      { name: 'Lines', data: total.lines },
      { name: 'Functions', data: total.functions },
      { name: 'Branches', data: total.branches },
      { name: 'Statements', data: total.statements }
    ];

    metrics.forEach(metric => {
      const percentage = metric.data.pct;
      const coverage = this.getCoverageLevel(percentage);
      const covered = metric.data.covered;
      const total = metric.data.total;
      
      this.log(
        `${metric.name.padEnd(12)}: ${percentage.toFixed(1)}% (${covered}/${total}) - ${coverage.level}`,
        coverage.color
      );
    });

    const avgCoverage = metrics.reduce((sum, metric) => sum + metric.data.pct, 0) / metrics.length;
    const overallLevel = this.getCoverageLevel(avgCoverage);
    
    this.log('\n' + '='.repeat(50), 'info');
    this.log(`Overall Coverage: ${avgCoverage.toFixed(1)}% - ${overallLevel.level}`, overallLevel.color);
  }

  analyzeFileCoverage() {
    this.log('\n📁 File-by-File Coverage Analysis', 'header');
    this.log('=' .repeat(80), 'info');

    const files = Object.keys(this.detailedCoverage)
      .filter(file => file.includes('app/components/') && !file.includes('__tests__'))
      .sort();

    if (files.length === 0) {
      this.log('No component files found in coverage data', 'warning');
      return;
    }

    files.forEach(filePath => {
      const fileData = this.detailedCoverage[filePath];
      const fileName = path.basename(filePath);
      
      const lineCoverage = (fileData.s ? Object.values(fileData.s).filter(v => v > 0).length / Object.keys(fileData.s).length * 100 : 0);
      const functionCoverage = (fileData.f ? Object.values(fileData.f).filter(v => v > 0).length / Object.keys(fileData.f).length * 100 : 0);
      const branchCoverage = (fileData.b ? Object.values(fileData.b).flat().filter(v => v > 0).length / Object.values(fileData.b).flat().length * 100 : 0);
      
      const avgCoverage = (lineCoverage + functionCoverage + branchCoverage) / 3;
      const level = this.getCoverageLevel(avgCoverage);
      
      this.log(
        `${fileName.padEnd(25)} | Lines: ${lineCoverage.toFixed(1)}% | Functions: ${functionCoverage.toFixed(1)}% | Branches: ${branchCoverage.toFixed(1)}% | ${level.level}`,
        level.color
      );
    });
  }

  findUncoveredAreas() {
    this.log('\n🔍 Uncovered Areas Analysis', 'header');
    this.log('=' .repeat(60), 'info');

    const uncoveredFiles = [];
    const partiallyTestedFiles = [];

    Object.keys(this.detailedCoverage).forEach(filePath => {
      if (!filePath.includes('app/components/') || filePath.includes('__tests__')) return;

      const fileData = this.detailedCoverage[filePath];
      const fileName = path.basename(filePath);
      
      const uncoveredLines = [];
      if (fileData.s) {
        Object.keys(fileData.s).forEach(statementId => {
          if (fileData.s[statementId] === 0) {
            const lineNumber = fileData.statementMap[statementId]?.start?.line;
            if (lineNumber) uncoveredLines.push(lineNumber);
          }
        });
      }

      const uncoveredFunctions = [];
      if (fileData.f) {
        Object.keys(fileData.f).forEach(functionId => {
          if (fileData.f[functionId] === 0) {
            const functionName = fileData.fnMap[functionId]?.name || `Function ${functionId}`;
            const lineNumber = fileData.fnMap[functionId]?.loc?.start?.line;
            uncoveredFunctions.push({ name: functionName, line: lineNumber });
          }
        });
      }

      if (uncoveredLines.length > 0 || uncoveredFunctions.length > 0) {
        const totalStatements = Object.keys(fileData.s || {}).length;
        const coveredStatements = Object.values(fileData.s || {}).filter(v => v > 0).length;
        const coveragePercentage = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0;

        if (coveragePercentage === 0) {
          uncoveredFiles.push({
            file: fileName,
            path: filePath,
            uncoveredLines,
            uncoveredFunctions
          });
        } else {
          partiallyTestedFiles.push({
            file: fileName,
            path: filePath,
            coverage: coveragePercentage,
            uncoveredLines,
            uncoveredFunctions
          });
        }
      }
    });

    if (uncoveredFiles.length > 0) {
      this.log('\n❌ Completely Uncovered Files:', 'error');
      uncoveredFiles.forEach(file => {
        this.log(`  • ${file.file}`, 'error');
        if (file.uncoveredFunctions.length > 0) {
          this.log(`    Functions: ${file.uncoveredFunctions.map(f => f.name).join(', ')}`, 'error');
        }
      });
    }

    const significantGaps = partiallyTestedFiles.filter(file => file.coverage < 70);
    if (significantGaps.length > 0) {
      this.log('\n⚠️ Files with Significant Coverage Gaps:', 'warning');
      significantGaps.forEach(file => {
        this.log(`  • ${file.file} (${file.coverage.toFixed(1)}% covered)`, 'warning');
        if (file.uncoveredFunctions.length > 0) {
          this.log(`    Uncovered functions: ${file.uncoveredFunctions.slice(0, 3).map(f => f.name).join(', ')}${file.uncoveredFunctions.length > 3 ? '...' : ''}`, 'warning');
        }
        if (file.uncoveredLines.length > 0) {
          this.log(`    Uncovered lines: ${file.uncoveredLines.slice(0, 5).join(', ')}${file.uncoveredLines.length > 5 ? '...' : ''}`, 'warning');
        }
      });
    }

    return { uncoveredFiles, partiallyTestedFiles };
  }

  generateRecommendations(uncoveredAreas) {
    this.log('\n💡 Coverage Improvement Recommendations', 'header');
    this.log('=' .repeat(60), 'info');

    const recommendations = [];

    const total = this.summaryCoverage.total;
    
    if (total.lines.pct < 80) {
      recommendations.push({
        priority: 'High',
        area: 'Line Coverage',
        current: `${total.lines.pct.toFixed(1)}%`,
        target: '80%+',
        action: 'Add tests for uncovered code paths and edge cases'
      });
    }

    if (total.functions.pct < 75) {
      recommendations.push({
        priority: 'High',
        area: 'Function Coverage',
        current: `${total.functions.pct.toFixed(1)}%`,
        target: '75%+',
        action: 'Write tests for untested functions and methods'
      });
    }

    if (total.branches.pct < 70) {
      recommendations.push({
        priority: 'Medium',
        area: 'Branch Coverage',
        current: `${total.branches.pct.toFixed(1)}%`,
        target: '70%+',
        action: 'Add tests for conditional logic and error handling paths'
      });
    }

    if (uncoveredAreas.uncoveredFiles.length > 0) {
      recommendations.push({
        priority: 'Critical',
        area: 'Untested Files',
        current: `${uncoveredAreas.uncoveredFiles.length} files`,
        target: '0 files',
        action: `Create test files for: ${uncoveredAreas.uncoveredFiles.slice(0, 3).map(f => f.file).join(', ')}`
      });
    }

    const lowCoverageFiles = uncoveredAreas.partiallyTestedFiles.filter(f => f.coverage < 50);
    if (lowCoverageFiles.length > 0) {
      recommendations.push({
        priority: 'High',
        area: 'Low Coverage Files',
        current: `${lowCoverageFiles.length} files < 50%`,
        target: '70%+ coverage',
        action: `Improve tests for: ${lowCoverageFiles.slice(0, 3).map(f => f.file).join(', ')}`
      });
    }

    if (recommendations.length === 0) {
      this.log('🎉 Excellent! No major coverage improvements needed.', 'success');
      this.log('Consider aiming for 90%+ coverage across all metrics.', 'info');
    } else {
      recommendations.forEach((rec, index) => {
        const priorityColor = rec.priority === 'Critical' ? 'error' : 
                             rec.priority === 'High' ? 'warning' : 'info';
        
        this.log(`\n${index + 1}. ${rec.area} [${rec.priority} Priority]`, priorityColor);
        this.log(`   Current: ${rec.current} → Target: ${rec.target}`, 'info');
        this.log(`   Action: ${rec.action}`, 'info');
      });
    }

    return recommendations;
  }

  generateCoverageReport() {
    this.log('\n📋 Coverage Report Summary', 'header');
    this.log('=' .repeat(60), 'info');

    const total = this.summaryCoverage.total;
    const timestamp = new Date().toISOString();

    const report = {
      timestamp,
      overall: {
        lines: total.lines.pct,
        functions: total.functions.pct,
        branches: total.branches.pct,
        statements: total.statements.pct
      },
      files: {
        total: Object.keys(this.detailedCoverage).length,
        tested: Object.keys(this.detailedCoverage).filter(file => {
          const fileData = this.detailedCoverage[file];
          const covered = Object.values(fileData.s || {}).filter(v => v > 0).length;
          return covered > 0;
        }).length
      },
      thresholds: {
        met: total.lines.pct >= 80 && total.functions.pct >= 75 && total.branches.pct >= 70,
        details: {
          lines: total.lines.pct >= 80,
          functions: total.functions.pct >= 75,
          branches: total.branches.pct >= 70
        }
      }
    };

    const reportPath = path.join(this.coverageDir, 'coverage-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📄 Detailed report saved to: ${reportPath}`, 'success');
    
    if (fs.existsSync(this.htmlReportPath)) {
      this.log(`🌐 HTML report available at: ${this.htmlReportPath}`, 'success');
    }

    return report;
  }

  async runCompleteAnalysis() {
    this.log('🚀 Starting Comprehensive Test Coverage Analysis', 'header');
    this.log('=' .repeat(80), 'info');

    const testsSuccessful = await this.runCoverageTests();
    if (!testsSuccessful) {
      this.log('❌ Failed to run coverage tests', 'error');
      return false;
    }

    const dataLoaded = this.loadCoverageData();
    if (!dataLoaded) {
      this.log('❌ Failed to load coverage data', 'error');
      return false;
    }

    this.analyzeOverallCoverage();

    this.analyzeFileCoverage();

    const uncoveredAreas = this.findUncoveredAreas();

    const recommendations = this.generateRecommendations(uncoveredAreas);

    const report = this.generateCoverageReport();

    this.log('\n🎯 Analysis Complete!', 'header');
    this.log('=' .repeat(40), 'info');
    
    const avgCoverage = (report.overall.lines + report.overall.functions + report.overall.branches + report.overall.statements) / 4;
    const level = this.getCoverageLevel(avgCoverage);
    
    this.log(`Overall Coverage: ${avgCoverage.toFixed(1)}% (${level.level})`, level.color);
    this.log(`Files Analyzed: ${report.files.total}`, 'info');
    this.log(`Files with Tests: ${report.files.tested}`, 'info');
    this.log(`Thresholds Met: ${report.thresholds.met ? 'Yes' : 'No'}`, report.thresholds.met ? 'success' : 'warning');
    
    if (recommendations.length > 0) {
      this.log(`Recommendations: ${recommendations.length} improvement areas identified`, 'warning');
    } else {
      this.log('Recommendations: Coverage targets met! 🎉', 'success');
    }

    return true;
  }
}

async function main() {
  const analyzer = new CoverageAnalyzer();
  
  try {
    await analyzer.runCompleteAnalysis();
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CoverageAnalyzer; 