module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'airbnb/whitespace', 'prettier'],

  plugins: ['prettier'],

  parser: 'babel-eslint',

  ecmaFeatures: {
    classes: true,
    jsx: true,
    modules: true,
  },

  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    semi: 'error',
    'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx']}],
    'no-use-before-define': [
      'error',
      {functions: true, classes: true, variables: false},
    ], // disable the rule for variables, but enable it for functions and classes, this is mainly for styles being declared after components
  },
};
