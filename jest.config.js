/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    moduleNameMapper: {
      '^@/resources/(.*)$': 'C:\\Users\\rivux\\OneDrive\\Desktop\\Projects\\Locale-API-Project\\src\\resources/$1',
      '^@/utils/(.*)$': 'C:\\Users\\rivux\\OneDrive\\Desktop\\Projects\\Locale-API-Project\\src\\utils/$1',
      '^@/middleware/(.*)$': 'C:\\Users\\rivux\\OneDrive\\Desktop\\Projects\\Locale-API-Project\\src\\middleware/$1',
    },
  };
  