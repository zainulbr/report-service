module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard', 'plugin:prettier/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        CallExpression: {
          arguments: 'off',
        },
        ignoredNodes: ['ConditionalExpression'],
      },
    ],
    'no-prototype-builtins': 'off',
    'no-trailing-spaces': 0,
    'space-before-function-paren': [0, 'never'],
    'no-undef': 'off',
    'one-var': 'off',
    'no-useless-call': 'error',
    'handle-callback-err': 'off',
    'no-extend-native': 'off',
    'no-useless-escape': 'off',
    'no-inner-declarations': 'off',
    'no-case-declarations': 'off',
    'no-console': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    'standard/computed-property-even-spacing': 'off',
    // "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    'prettier/prettier': 1,
    '@typescript-eslint/no-empty-function': 'off',
  },
}
