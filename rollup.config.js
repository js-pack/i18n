import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import prettier from 'rollup-plugin-prettier';

import packageJson from './package.json';
const license = fs.readFileSync('./LICENSE.md', { encoding: 'utf-8' });
let preamble =
  '/*! *****************************************************************************\n';
preamble += license;
preamble += `***************************************************************************** */\n`;

export default [
  {
    input: './src/index.ts',
    output: [
      { file: packageJson.main, format: 'cjs' },
      { file: packageJson.module, format: 'esm' },
    ],
    plugins: [
      typescript({
        tsconfigOverride: { exclude: ['**/*.test.ts'] },
      }),
      terser({
        compress: false,
        mangle: false,
        format: {
          comments: false,
          preamble,
        },
      }),
      prettier({
        parser: 'babel',
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
      }),
    ],
  },
];
