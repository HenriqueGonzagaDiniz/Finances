import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'node_modules', 'dev-dist', 'scripts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        indexedDB: 'readonly',
        crypto: 'readonly',
        structuredClone: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['vite.config.ts', 'scripts/**/*.mjs', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __filename: 'readonly',
      },
    },
  },
];
