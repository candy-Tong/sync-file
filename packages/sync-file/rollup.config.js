import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './src/index.ts',
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript({
      exclude: 'node_modules/**',
    }),
  ],
  output: [
    {
      format: 'esm',
      dir: 'dist',
    },
  ],
  external: [
    // this package build into bundle will cause fail
    'chalk',
  ],
};
