/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/app/root.ts',
    '<rootDir>/app/entry.*.ts',
    '<rootDir>/app/i18n.ts',
    '<rootDir>/app/i18n.server.ts',
    '<rootDir>/app/utils/mocks.ts',
  ],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/app/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(@web3-storage)/)'],
}
