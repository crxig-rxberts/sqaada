module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'jest'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-var': 'error',
    'prefer-const': 'error',
    'space-infix-ops': 'error',
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      }
    }
  ]
};