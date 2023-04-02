/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'prettier/prettier'
  ],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true
      }
    ],
    curly: 'warn',
    'simple-import-sort/imports': 'error'
  }
};
