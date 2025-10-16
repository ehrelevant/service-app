import expo from 'eslint-plugin-expo';
import globals from 'globals';
import imsort from '@bastidood/eslint-plugin-imsort';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import ts from 'typescript-eslint';
import turbo from 'eslint-plugin-turbo';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['**/node_modules/**/*', '**/build/**/*', '**/dist/**/*'] },
  { languageOptions: { globals: { ...globals.node } } },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx}'],
    extends: [js.configs.recommended, ...ts.configs.recommended, ...ts.configs.stylistic, imsort.configs.all, prettier],
    plugins: { '@bastidood/imsort': imsort },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      expo,
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'expo/use-dom-exports': 'error',
      'expo/no-env-var-destructuring': 'error',
      'expo/no-dynamic-env-var': 'error',
      'react/no-unknown-property': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/no-this-in-sfc': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      turbo,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
]);
