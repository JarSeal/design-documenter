module.exports = {
    'root': true,
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true,
        'jest': true,
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2020
    },
    'rules': {
        'indent': [
            'error',
            4,
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'no-var': 1,
    }
};
