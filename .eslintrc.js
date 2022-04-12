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
  plugins: ['security', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: [
          'node_modules',
          'src/',
          'src/api',
          'src/core',
          'src/config',
        ],
      },
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'func-names': 'off',
    'arrow-body-style': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'warn',
    'consistent-return': 'off',
    'jest/expect-expect': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['warn', { args: 'none' }],
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
