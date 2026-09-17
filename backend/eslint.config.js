const globals = require('globals')

module.exports = [
    {
        files: ['**/*.js'],
        ignores: ['node_modules/**'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'no-var': 'error',
            'prefer-const': 'error',
            'eqeqeq': 'error',
        },
    },
]