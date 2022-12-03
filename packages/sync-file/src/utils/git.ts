import { readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { run } from './index';
import { tempPath } from './path';
import { debug } from './debug';

export async function gitAddAll() {
  try {
    await run('git', ['add', '-A'], {
      cwd: tempPath,
    });
  } catch (e: any) {
    debug('git add error, mgs:', e.message);
  }
}

export async function gitCommit(message: string) {
  try {
    await run('git', ['commit', '-m', message], {
      cwd: tempPath,
    });
  } catch (e: any) {
    debug('git commit error, mgs:', e.message);
  }
}

/**
 * create and checkout branch
 * @returns {Promise<void>}
 */
export async function gitCheckout(branchName:string) {
  await run('git', ['checkout', '-b', branchName], {
    cwd: tempPath,
  });
}

export async function gitInit(branchName: string) {
  await run('git', ['init', branchName], {
    cwd: tempPath,
  });
}

export async function gitBranch(branchName: string) {
  await run('git', ['branch', branchName], {
    cwd: tempPath,
  });
}

export const git = {
  init: gitInit,
  addAll: gitAddAll,
  commit: gitCommit,
  checkout: gitCheckout,
  branch: gitBranch,
};

/**
 * create an empty file.
 * because git must add file to commit
 * @returns {Promise<void>}
 */
export async function createEmptyFile() {
  await writeFile(resolve(tempPath, '.empty'), '');
}
