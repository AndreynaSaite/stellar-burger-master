/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@ui-pages(.*)$': '<rootDir>/src/components/ui/pages$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices(.*)$': '<rootDir>/src/services/slices$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@store$': '<rootDir>/src/services/store.ts',
    '^@selectors(.*)$': '<rootDir>/src/services/selectors$1',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
