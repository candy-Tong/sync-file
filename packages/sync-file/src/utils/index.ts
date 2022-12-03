import type { Options as ExecaOptions } from 'execa';
import { execa } from 'execa';
import { SyncConfig, UserSyncConfig } from '../types';

export function run(bin:string, args:string[] = [], opts:ExecaOptions<string> = {}) {
  return execa(bin, args, {
    // stdio: debug.enabled ? 'inherit' : 'ignore',
    stdio: 'ignore',
    ...opts,
  });
}

export function normalizeSyncConfig(config:UserSyncConfig):SyncConfig {
  if (config instanceof Array) {
    return {
      fileList: config,
    };
  }
  return config;
}
