module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    ecmascript: 6,
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': 'always-multiline',
    'no-multiple-empty-lines': 0,
    'arrow-parens': 0,
    'implicit-arrow-linebreak': 0,
    'lines-between-class-members': 0,
    'no-nested-ternary': 'off',
    'max-len': ['error', { code: 120 }],
    'operator-linebreak': 'warn',
    'object-curly-newline': ['error', { multiline: true }],
  },
};
