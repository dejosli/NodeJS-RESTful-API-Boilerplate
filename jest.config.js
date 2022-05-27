module.exports = {
  restoreMocks: true,
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  coverageReporters: ['html', 'clover', 'json', 'lcov', 'text'],
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/index.js'],
};
