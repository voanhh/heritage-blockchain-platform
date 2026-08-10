import js from '@eslint/js';

export default [
  { ignores: ['artifacts', 'cache', 'typechain-types'] },
  js.configs.recommended
];

