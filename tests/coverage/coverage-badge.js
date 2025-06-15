const fs = require('fs');
const path = require('path');

class CoverageBadgeGenerator {
  constructor() {
    this.coverageSummaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    this.badgeColors = {
      excellent: 'brightgreen',  
      good: 'green',            
      fair: 'yellow',           
      poor: 'orange',           
      critical: 'red'           
    };
  }

  loadCoverageData() {
    try {
      if (fs.existsSync(this.coverageSummaryPath)) {
        const summaryData = JSON.parse(fs.readFileSync(this.coverageSummaryPath, 'utf8'));
        return summaryData.total;
      } else {
        console.error('❌ Coverage summary not found. Run tests with coverage first.');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading coverage data:', error.message);
      return null;
    }
  }

  getBadgeColor(percentage) {
    if (percentage >= 90) return this.badgeColors.excellent;
    if (percentage >= 80) return this.badgeColors.good;
    if (percentage >= 70) return this.badgeColors.fair;
    if (percentage >= 60) return this.badgeColors.poor;
    return this.badgeColors.critical;
  }

  generateBadgeUrl(label, value, color) {
    const encodedLabel = encodeURIComponent(label);
    const encodedValue = encodeURIComponent(value);
    return `https://img.shields.io/badge/${encodedLabel}-${encodedValue}-${color}`;
  }

  generateCoverageBadges(coverageData) {
    const badges = {
      overall: {},
      individual: {}
    };

    const overallCoverage = (
      coverageData.lines.pct + 
      coverageData.functions.pct + 
      coverageData.branches.pct + 
      coverageData.statements.pct
    ) / 4;

    badges.overall = {
      percentage: overallCoverage.toFixed(1),
      color: this.getBadgeColor(overallCoverage),
      url: this.generateBadgeUrl('Coverage', `${overallCoverage.toFixed(1)}%`, this.getBadgeColor(overallCoverage)),
      markdown: `![Coverage](${this.generateBadgeUrl('Coverage', `${overallCoverage.toFixed(1)}%`, this.getBadgeColor(overallCoverage))})`
    };

    const metrics = ['lines', 'functions', 'branches', 'statements'];
    metrics.forEach(metric => {
      const percentage = coverageData[metric].pct;
      const color = this.getBadgeColor(percentage);
      const label = metric.charAt(0).toUpperCase() + metric.slice(1);
      
      badges.individual[metric] = {
        percentage: percentage.toFixed(1),
        color: color,
        url: this.generateBadgeUrl(label, `${percentage.toFixed(1)}%`, color),
        markdown: `![${label}](${this.generateBadgeUrl(label, `${percentage.toFixed(1)}%`, color)})`
      };
    });

    return badges;
  }

  generateReadmeSection(badges, coverageData) {
    const section = `
## 📊 Test Coverage

### Overall Coverage
${badges.overall.markdown}

**Current Status**: ${badges.overall.percentage}% - ${this.getCoverageLevel(parseFloat(badges.overall.percentage))}

### Detailed Metrics
| Metric | Coverage | Badge |
|--------|----------|-------|
| **Lines** | ${coverageData.lines.covered}/${coverageData.lines.total} (${badges.individual.lines.percentage}%) | ${badges.individual.lines.markdown} |
| **Functions** | ${coverageData.functions.covered}/${coverageData.functions.total} (${badges.individual.functions.percentage}%) | ${badges.individual.functions.markdown} |
| **Branches** | ${coverageData.branches.covered}/${coverageData.branches.total} (${badges.individual.branches.percentage}%) | ${badges.individual.branches.markdown} |
| **Statements** | ${coverageData.statements.covered}/${coverageData.statements.total} (${badges.individual.statements.percentage}%) | ${badges.individual.statements.markdown} |

### Coverage Thresholds
- 🟢 **Excellent**: 90%+ coverage
- 🟡 **Good**: 80-89% coverage  
- 🟠 **Fair**: 70-79% coverage
- 🔴 **Poor**: 60-69% coverage
- ⚫ **Critical**: <60% coverage

*Coverage data updated: ${new Date().toISOString().split('T')[0]}*
`;

    return section;
  }

  getCoverageLevel(percentage) {
    if (percentage >= 90) return 'Excellent 🟢';
    if (percentage >= 80) return 'Good 🟡';
    if (percentage >= 70) return 'Fair 🟠';
    if (percentage >= 60) return 'Poor 🔴';
    return 'Critical ⚫';
  }

  generateCoverageReport() {
    console.log('🎯 Generating Coverage Badges...');
    
    const coverageData = this.loadCoverageData();
    if (!coverageData) {
      return false;
    }

    const badges = this.generateCoverageBadges(coverageData);
    const readmeSection = this.generateReadmeSection(badges, coverageData);

    const badgeData = {
      timestamp: new Date().toISOString(),
      badges,
      coverageData,
      readmeSection
    };

    const outputPath = path.join(process.cwd(), 'coverage', 'badges.json');
    fs.writeFileSync(outputPath, JSON.stringify(badgeData, null, 2));

    const readmePath = path.join(process.cwd(), 'coverage', 'README-coverage-section.md');
    fs.writeFileSync(readmePath, readmeSection);

    console.log('\n📊 Coverage Badge Report');
    console.log('=' .repeat(50));
    console.log(`Overall Coverage: ${badges.overall.percentage}%`);
    console.log(`Badge Color: ${badges.overall.color}`);
    console.log(`Badge URL: ${badges.overall.url}`);
    console.log(`\n📄 Files Generated:`);
    console.log(`- Badge data: ${outputPath}`);
    console.log(`- README section: ${readmePath}`);
    
    console.log('\n🔗 Badge URLs:');
    console.log(`Overall: ${badges.overall.url}`);
    Object.keys(badges.individual).forEach(metric => {
      console.log(`${metric}: ${badges.individual[metric].url}`);
    });

    console.log('\n📝 Markdown for README:');
    console.log(badges.overall.markdown);

    return true;
  }
}

function main() {
  const generator = new CoverageBadgeGenerator();
  
  try {
    const success = generator.generateCoverageReport();
    if (!success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Badge generation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CoverageBadgeGenerator; 