module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    jest: true,
    node: true,
    browser: false,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'arrow-body-style': 'off',
    'no-unused-vars': 'warn',
    'func-names': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'jest/expect-expect': 'off',
    'security/detect-object-injection': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};