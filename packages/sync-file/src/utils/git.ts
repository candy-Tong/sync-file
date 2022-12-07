import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import _debug from 'debug';
import { execa, Options as ExecaOptions } from 'execa';
import chalk from 'chalk';
import { tempFilesPath, tempGitPath } from './path';
import { rmrf } from './file';

const debug = _debug('sync-file:git');
export const latestBranchName = 'latest';
export const mainBranchName = 'master';

export function run(bin:string, args:string[] = [], opts:ExecaOptions<string> = {}) {
  return execa(bin, args, {
    stdio: debug.enabled ? 'inherit' : 'ignore',
    ...opts,
  });
}

export async function gitAddAll() {
  try {
    await run('git', ['add', '-A'], {
      cwd: tempGitPath,
    });
  } catch (e: any) {
    debug('git add error, mgs:', e.message);
  }
}

export async function gitCommit(message: string) {
  try {
    await run('git', ['commit', '-m', message], {
      cwd: tempGitPath,
    });
  } catch (e: any) {
    debug('git commit error, mgs:', e.message);
  }
  debug('git commit success', message);
}

/**
 * create and checkout branch
 * @returns {Promise<void>}
 */
export async function gitCheckout(branchName:string) {
  await run('git', ['checkout', branchName], {
    cwd: tempGitPath,
  });
  debug('git checkout branch', branchName);
}

export async function gitInit(branchName: string) {
  // git init -b can set the default branch for git
  // but i maybe not support in old version git
  await run('git', ['init'], {
    cwd: tempGitPath,
  });
  debug('git init, default branch', branchName);
}

export async function gitBranch(branchName: string) {
  await run('git', ['branch', branchName], {
    cwd: tempGitPath,
  });
  debug('git branch', branchName);
}

export async function gitMerge(branchName: string) {
  try {
    await run('git', ['merge', branchName, '-m', `merge ${branchName}`], {
      cwd: tempGitPath,
    });
    debug('git merge', branchName);
  } catch (e) {
    console.error(chalk.red('[auto-sync-file] git merge error. please handle conflict'));
  }
}

export const git = {
  init: gitInit,
  addAll: gitAddAll,
  commit: gitCommit,
  checkout: gitCheckout,
  branch: gitBranch,
  merge: gitMerge,
};

const emptyFileName = '.empty';
/**
 * create an empty file.
 * because maybe there are no file at the begining
 * git must add file to commit
 * @returns {Promise<void>}
 */
export async function createEmptyFile() {
  await writeFile(resolve(tempGitPath, emptyFileName), '');
}

export async function cleanGitDir() {
  await rmrf(tempFilesPath);
}
