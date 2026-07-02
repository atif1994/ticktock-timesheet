/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
      diagnostics: false,
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|png|jpg|svg|ico)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};

module.exports = config;
