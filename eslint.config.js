import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  configPrettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Image: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        Date: 'readonly',
        navigator: 'readonly',
        gsap: 'readonly',
        audio: 'readonly',
        Howl: 'readonly',
        attacks: 'readonly',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'off', // Allow console for game debugging
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-undef': 'warn', // Warn instead of error for game development
      'no-case-declarations': 'off', // Allow declarations in case blocks for game logic
    },
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
  },
];
