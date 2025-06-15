module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    'app/components/**/*.{js,jsx}',
    'app/validationSchemas/**/*.{js,jsx}',
    '!app/**/*.d.ts',
    '!app/**/node_modules/**',
    '!app/**/*.config.js',
    '!app/**/*.stories.{js,jsx}',
    '!app/**/coverage/**',
    '!app/**/dist/**',
    '!app/**/build/**',
    '!app/**/__tests__/**',
    '!app/**/__mocks__/**',
    '!app/layout.js',
    '!app/page.js',
    '!app/**/page.js',
    '!app/**/layout.js',
    '!app/**/loading.js',
    '!app/**/error.js',
    '!app/**/not-found.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,    
      functions: 75,   
      lines: 80,       
      statements: 80,  
    },
    'app/components/': {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85,
    },
    'app/validationSchemas/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },    
    'app/components/landing.js': {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90,
    },
    'app/components/course.js': {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90,
    },
    'app/components/textEditor.js': {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  coverageReporters: [
    'text',           
    'text-summary',   
    'html',           
    'lcov',           
    'json',           
    'json-summary',   
    'cobertura',      
    'clover',         
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageWatermarks: {
    statements: [70, 85],  
    functions: [70, 85],
    branches: [65, 80],    
    lines: [70, 85],
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/.next/',
    '/dist/',
    '/build/',
    '__tests__',
    '__mocks__',
    '.stories.',
    '.config.js',
  ],
  forceCoverageMatch: [
    '**/app/components/**/*.js',
    '**/app/validationSchemas/**/*.js',
  ],
  environments: {
    development: {
      global: {
        branches: 60,
        functions: 65,
        lines: 70,
        statements: 70,
      }
    },
    staging: {
      global: {
        branches: 70,
        functions: 75,
        lines: 80,
        statements: 80,
      }
    },
    production: {
      global: {
        branches: 80,
        functions: 85,
        lines: 90,
        statements: 90,
      }
    }
  },
  qualityGates: {
    newCodeCoverage: {
      lines: 85,
      branches: 75,
      functions: 80,
    },
    maxCoverageDecrease: {
      lines: 2,      
      branches: 3,   
      functions: 2,  
    },
    minTests: 20,
    maxTestTime: 60,
  },
  analysis: {
    criticalFiles: [
      'app/validationSchemas/**/*.js',
    ],
    uiFiles: [
      'app/components/landing.js',
      'app/components/course.js',
    ],
    complexity: {
      highComplexity: 10,
      requiredCoverageForHighComplexity: 90,
    },
      changeAnalysis: {
      modifiedFileCoverage: 85,
      newFilesCoverage: 80,
    }
  },
  integrations: {
    sonarqube: {
      enabled: false,
      serverUrl: 'http://localhost:9000',
      projectKey: 'codeuni',
    },
    codecov: {
      enabled: false,
      token: process.env.CODECOV_TOKEN,
    },
    github: {
      enabled: false,
      token: process.env.GITHUB_TOKEN,
      commentOnPR: true,
    }
  }
}; 