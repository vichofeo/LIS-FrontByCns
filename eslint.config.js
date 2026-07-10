// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  // ── Ignorados ────────────────────────────────────────────────────────────
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      '**/*.spec.ts',
      'projects/**/dist/**/*',        //builds de sub-proyectos
      'projects/**/node_modules/**/*', //por si cada proyecto tiene los suyos
    ],
  },

  // ── TypeScript (fuentes) ─────────────────────────────────────────────────
  {
    files: ['src/**/*.ts', 'projects/**/*.ts'], //explícito, más claro
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        // projectService busca el tsconfig más cercano a cada archivo
        // automáticamente, así que cubre src/ y cada projects/*/
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.json',               // raíz (src/)
            './projects/*/tsconfig.lib.json', // libs
            './projects/*/tsconfig.app.json', // apps
          ],
        },
      },
    },
    rules: {
      // '@angular-eslint/directive-selector': [
      //   'error',
      //   { type: 'attribute', prefix: 'app', style: 'camelCase' },
      // ],
      // '@angular-eslint/component-selector': [
      //   'error',
      //   { type: 'element', prefix: 'app', style: 'kebab-case' },
      // ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field', 'protected-static-field', 'private-static-field', '#private-static-field',
            'public-decorated-field', 'protected-decorated-field', 'private-decorated-field',
            'public-instance-field', 'protected-instance-field', 'private-instance-field', '#private-instance-field',
            'public-abstract-field', 'protected-abstract-field',
            'public-field', 'protected-field', 'private-field', '#private-field',
            'static-field', 'instance-field', 'abstract-field', 'decorated-field', 'field',
            'static-initialization',
            'public-constructor', 'protected-constructor', 'private-constructor', 'constructor',
            'signature', 'call-signature',
            'public-static-accessor', 'protected-static-accessor', 'private-static-accessor', '#private-static-accessor',
            'public-decorated-accessor', 'protected-decorated-accessor', 'private-decorated-accessor',
            'public-instance-accessor', 'protected-instance-accessor', 'private-instance-accessor', '#private-instance-accessor',
            'public-abstract-accessor', 'protected-abstract-accessor',
            'public-accessor', 'protected-accessor', 'private-accessor', '#private-accessor',
            'static-accessor', 'instance-accessor', 'abstract-accessor', 'decorated-accessor', 'accessor',
            'public-static-get', 'protected-static-get', 'private-static-get', '#private-static-get',
            'public-decorated-get', 'protected-decorated-get', 'private-decorated-get',
            'public-instance-get', 'protected-instance-get', 'private-instance-get', '#private-instance-get',
            'public-abstract-get', 'protected-abstract-get',
            'public-get', 'protected-get', 'private-get', '#private-get',
            'static-get', 'instance-get', 'abstract-get', 'decorated-get', 'get',
            'public-static-set', 'protected-static-set', 'private-static-set', '#private-static-set',
            'public-decorated-set', 'protected-decorated-set', 'private-decorated-set',
            'public-instance-set', 'protected-instance-set', 'private-instance-set', '#private-instance-set',
            'public-abstract-set', 'protected-abstract-set',
            'public-set', 'protected-set', 'private-set', '#private-set',
            'static-set', 'instance-set', 'abstract-set', 'decorated-set', 'set',
            'public-static-method', 'protected-static-method', 'private-static-method', '#private-static-method',
            'public-decorated-method', 'protected-decorated-method', 'private-decorated-method',
            'public-instance-method', 'protected-instance-method', 'private-instance-method', '#private-instance-method',
            'public-abstract-method', 'protected-abstract-method',
            'public-method', 'protected-method', 'private-method', '#private-method',
            'static-method', 'instance-method', 'abstract-method', 'decorated-method',
          ],
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      // 'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // ── Templates HTML ───────────────────────────────────────────────────────
  {
    files: ['src/**/*.html', 'projects/**/*.html'], // ← explícito también
    extends: [
      ...angular.configs.templateRecommended,
    ],
    rules: {
      // '@angular-eslint/template/banana-in-box': 'error',
      // '@angular-eslint/template/no-negated-async': 'error',
      // '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-any': 'warn',
      // '@angular-eslint/template/no-duplicate-attributes': 'error',
      // // Accesibilidad
      // '@angular-eslint/template/alt-text': 'error',
      // '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      // '@angular-eslint/template/table-scope': 'error',
      // '@angular-eslint/template/valid-aria': 'error',
      // '@angular-eslint/template/click-events-have-key-events': 'warn',
      // '@angular-eslint/template/interactive-supports-focus': 'warn',
      // '@angular-eslint/template/mouse-events-have-key-events': 'warn',
      // '@angular-eslint/template/no-autofocus': 'warn',
      // '@angular-eslint/template/no-distracting-elements': 'error',
      // '@angular-eslint/template/role-has-required-aria': 'error',
    },
  },
);
