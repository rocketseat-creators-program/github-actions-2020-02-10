module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "globals": {
    '__SERVER__': false,
    'ts-jest': {
			diagnostics: false
		}
  },
  collectCoverage: true,
  "collectCoverageFrom": [
    "**/*.ts",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!src/__tests__/**",
    "!src/models/**",
    "!src/main.ts",
    "!src/lambda.ts",
    "!src/app.ts",
  ],
  testEnvironment: 'node'
}