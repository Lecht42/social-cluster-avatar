import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@jsquash/resize)'],
  moduleNameMapper: {
    '^@jsquash/resize$': '<rootDir>/src/tests/__mocks__/resizeMock.ts',
  },
  testPathIgnorePatterns: ['<rootDir>/dist/'],
}

export default config
