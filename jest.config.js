module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/index.js'],
  coverageReporters: ['html', 'clover', 'json', 'lcov', 'text'],
};
