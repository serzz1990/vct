// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,

    parser: 'babel-eslint',

    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module'
    },

    env: {
        browser: true,
        'es6': true
    },

    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',

    // required to lint *.vue files
    plugins: [
        'html'
    ],

    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,

        // allow async-await
        'generator-star-spacing': 0,

        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        'indent': ['error', 4],

        'no-multiple-empty-lines': [2, { "max": 2, "maxEOF": 1 }],

        'prefer-promise-reject-errors': 'off',
        'no-useless-computed-key': 'off',
        'import/no-webpack-loader-syntax': 'off'
    }
}
