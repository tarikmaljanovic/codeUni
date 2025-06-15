const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/app/components/$1',
    '^@validationSchemas/(.*)$': '<rootDir>/app/validationSchemas/$1',
  },
  
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
  
  coverageDirectory: 'tests/coverage/reports',
  
  testMatch: [
    '<rootDir>/tests/unit/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/tests/integration/**/*.{test,spec}.{js,jsx}',
  ],

  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
  ],
  
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  verbose: true,
  
  clearMocks: true,
  
  restoreMocks: true,
}

module.exports = createJestConfig(customJestConfig) 