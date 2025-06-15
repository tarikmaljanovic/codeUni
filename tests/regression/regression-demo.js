const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RegressionDemo {
  constructor() {
    this.backups = new Map();
    this.scenarios = [
      {
        name: 'Component API Change',
        description: 'Change a component prop name',
        file: 'app/components/course.js',
        type: 'component-api'
      },
      {
        name: 'UI Element Removal',
        description: 'Remove a critical UI element',
        file: 'app/components/landing.js',
        type: 'ui-removal'
      },
      {
        name: 'Business Logic Change',
        description: 'Change validation logic',
        file: 'app/validationSchemas/courseValidation.js',
        type: 'business-logic'
      },
      {
        name: 'CSS Class Change',
        description: 'Change CSS class names',
        file: 'app/globals.scss',
        type: 'css-change'
      },
      {
        name: 'Function Signature Change',
        description: 'Change function parameters',
        file: 'app/components/textEditor.js',
        type: 'function-signature'
      }
    ];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    
      success: '\x1b[32m', 
      warning: '\x1b[33m', 
      error: '\x1b[31m',   
      reset: '\x1b[0m'     
    };
    
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async backupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        this.backups.set(filePath, content);
        this.log(`✓ Backed up ${filePath}`, 'success');
        return true;
      }
    } catch (error) {
      this.log(`✗ Failed to backup ${filePath}: ${error.message}`, 'error');
      return false;
    }
    return false;
  }

  async restoreFile(filePath) {
    try {
      if (this.backups.has(filePath)) {
        fs.writeFileSync(filePath, this.backups.get(filePath));
        this.log(`✓ Restored ${filePath}`, 'success');
        return true;
      }
    } catch (error) {
      this.log(`✗ Failed to restore ${filePath}: ${error.message}`, 'error');
      return false;
    }
    return false;
  }

  async introduceRegression(scenario) {
    const { file, type } = scenario;
    
    if (!await this.backupFile(file)) {
      return false;
    }

    try {
      let content = fs.readFileSync(file, 'utf8');
      let modifiedContent = content;

      switch (type) {
        case 'component-api':
          modifiedContent = content.replace(/props\.course/g, 'props.courseData');
          break;

        case 'ui-removal':
          modifiedContent = content.replace(
            /<button[^>]*>Login<\/button>/g, 
            '<!-- Login button removed -->'
          );
          break;

        case 'business-logic':
          modifiedContent = content.replace(
            /\.min\(3,/g, 
            '.min(10,'
          );
          break;

        case 'css-change':
          modifiedContent = content.replace(
            /\.course-card/g, 
            '.course-item'
          );
          break;

        case 'function-signature':
          modifiedContent = content.replace(
            /handleSave\(content\)/g, 
            'handleSave(content, metadata)'
          );
          break;

        default:
          this.log(`Unknown regression type: ${type}`, 'warning');
          return false;
      }

      fs.writeFileSync(file, modifiedContent);
      this.log(`✓ Introduced regression in ${file}`, 'warning');
      return true;

    } catch (error) {
      this.log(`✗ Failed to introduce regression: ${error.message}`, 'error');
      return false;
    }
  }

  async runTests(testType = 'all') {
    this.log(`\n🧪 Running ${testType} tests...`, 'info');
    
    try {
      let command;
      switch (testType) {
        case 'unit':
          command = 'npm test -- --passWithNoTests';
          break;
        case 'integration':
          command = 'npm test -- --testPathPattern=integration --passWithNoTests';
          break;
        case 'system':
          command = 'npm run test:system:headless || true';
          break;
        default:
          command = 'npm test -- --passWithNoTests';
      }

      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 60000 
      });
      
      this.log('✓ Tests completed', 'success');
      return { success: true, output };

    } catch (error) {
      this.log('✗ Tests failed (as expected for regression demo)', 'error');
      return { success: false, output: error.stdout || error.message };
    }
  }

  async restoreAllFiles() {
    this.log('\n🔄 Restoring all files...', 'info');
    
    for (const [filePath] of this.backups) {
      await this.restoreFile(filePath);
    }
    
    this.backups.clear();
    this.log('✓ All files restored', 'success');
  }

  async demonstrateScenario(scenario) {
    this.log(`\n${'='.repeat(60)}`, 'info');
    this.log(`📋 SCENARIO: ${scenario.name}`, 'info');
    this.log(`📝 Description: ${scenario.description}`, 'info');
    this.log(`📁 File: ${scenario.file}`, 'info');
    this.log(`${'='.repeat(60)}`, 'info');

    this.log('\n1️⃣ Running tests BEFORE introducing regression...', 'info');
    const beforeResults = await this.runTests('unit');
    
    if (beforeResults.success) {
      this.log('✅ Tests PASSED - System is working correctly', 'success');
    } else {
      this.log('❌ Tests FAILED - There might be existing issues', 'warning');
    }

    this.log('\n2️⃣ Introducing regression...', 'warning');
    const regressionIntroduced = await this.introduceRegression(scenario);
    
    if (!regressionIntroduced) {
      this.log('❌ Failed to introduce regression, skipping scenario', 'error');
      return;
    }

    this.log('\n3️⃣ Running tests AFTER introducing regression...', 'info');
    const afterResults = await this.runTests('unit');
    
    if (afterResults.success) {
      this.log('⚠️ Tests still PASSED - Regression not caught by tests', 'warning');
      this.log('💡 This indicates we need better test coverage', 'warning');
    } else {
      this.log('✅ Tests FAILED - Regression successfully caught!', 'success');
      this.log('🛡️ Our test suite is protecting against this type of change', 'success');
    }


    this.log('\n4️⃣ Restoring original code...', 'info');
    await this.restoreFile(scenario.file);


    this.log('\n5️⃣ Verifying restoration...', 'info');
    const restoredResults = await this.runTests('unit');
    
    if (restoredResults.success) {
      this.log('✅ Tests PASSED - Code successfully restored', 'success');
    } else {
      this.log('❌ Tests still FAILING - Restoration may have failed', 'error');
    }

    this.log(`\n✨ Scenario "${scenario.name}" completed\n`, 'info');
  }

  async runFullDemo() {
    this.log('🚀 Starting Regression Testing Demonstration', 'info');
    this.log('=' .repeat(80), 'info');
    
    this.log('\n📊 This demo will:', 'info');
    this.log('  1. Run tests to establish baseline', 'info');
    this.log('  2. Introduce various types of breaking changes', 'info');
    this.log('  3. Show how tests catch these regressions', 'info');
    this.log('  4. Restore original code', 'info');
    this.log('  5. Verify everything works again', 'info');


    this.log('\n🏁 Running baseline tests...', 'info');
    const baselineResults = await this.runTests('unit');
    
    if (baselineResults.success) {
      this.log('✅ Baseline tests PASSED - Ready for regression demo', 'success');
    } else {
      this.log('⚠️ Baseline tests have some failures - Demo will continue', 'warning');
    }


    for (const scenario of this.scenarios) {
      try {
        await this.demonstrateScenario(scenario);

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        this.log(`❌ Error in scenario "${scenario.name}": ${error.message}`, 'error');
        await this.restoreFile(scenario.file);
      }
    }


    await this.restoreAllFiles();


    this.log('\n🏆 Running final verification tests...', 'info');
    const finalResults = await this.runTests('unit');
    
    if (finalResults.success) {
      this.log('✅ Final tests PASSED - All regressions cleaned up', 'success');
    } else {
      this.log('❌ Final tests FAILED - Manual cleanup may be needed', 'error');
    }

    this.log('\n🎉 Regression Testing Demonstration Complete!', 'success');
    this.log('=' .repeat(80), 'info');
  }

  async runQuickDemo() {
    this.log('⚡ Running Quick Regression Demo', 'info');
    

    const scenario = this.scenarios[0]; 
    await this.demonstrateScenario(scenario);
    
    this.log('✨ Quick demo complete!', 'success');
  }
}


async function main() {
  const demo = new RegressionDemo();
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Regression Testing Demonstration

Usage:
  node regression-demo.js [options]

Options:
  --quick, -q     Run quick demo (single scenario)
  --full, -f      Run full demo (all scenarios) [default]
  --help, -h      Show this help message

Examples:
  node regression-demo.js --quick
  node regression-demo.js --full
    `);
    return;
  }

  try {
    if (args.includes('--quick') || args.includes('-q')) {
      await demo.runQuickDemo();
    } else {
      await demo.runFullDemo();
    }
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    await demo.restoreAllFiles();
    process.exit(1);
  }
}


process.on('SIGINT', async () => {
  console.log('\n🛑 Demo interrupted - cleaning up...');
  const demo = new RegressionDemo();
  await demo.restoreAllFiles();
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = RegressionDemo; 