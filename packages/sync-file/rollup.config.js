import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.ts',
  plugins: [
    nodeResolve(),
    typescript({
      exclude: 'node_modules/**',
    }),
  ],
  output: [
    {
      format: 'cjs',
      dir: 'dist',
    },
  ],
};
