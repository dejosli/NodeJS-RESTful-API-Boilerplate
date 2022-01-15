module.exports = {
  env: {
    node: true,
    jest: true,
    commonjs: true,
    es6: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
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
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'jest/expect-expect': 'off',
    'security/detect-object-injection': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
