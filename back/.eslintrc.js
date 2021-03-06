module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['prettier'],
  rules: {
    semi: ['error', 'always'],
    'no-var': 1,
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
