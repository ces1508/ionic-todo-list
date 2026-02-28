module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/zone-flags.ts',
    '!src/polyfills.ts'
  ],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1',
    '@models/(.*)': '<rootDir>/src/app/models/$1',
    '@components/(.*)': '<rootDir>/src/app/components/$1',
    '@pages/(.*)': '<rootDir>/src/app/pages/$1',
    '@services/(.*)': '<rootDir>/src/app/services/$1',
    '@utils/(.*)': '<rootDir>/src/app/utils/$1',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@adapters/(.*)': '<rootDir>/src/app/adapters/$1',
    '@repositories/(.*)': '<rootDir>/src/app/repositories/$1'
  },
  testMatch: ['**/*.spec.ts']
};
