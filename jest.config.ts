import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': '<rootDir>/tests/styleMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './babel.config.jest.js' }],
  },
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
};

export default config;
