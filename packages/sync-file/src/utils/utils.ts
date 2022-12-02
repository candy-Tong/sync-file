import type { Options as ExecaOptions } from 'execa';
import { execa } from 'execa';

export function run(bin:string, args:string[] = [], opts:ExecaOptions<string> = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}
