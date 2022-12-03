import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import _debug from 'debug';
import { run } from './index';
import { tempPath } from './path';

const debug = _debug('sync-file:git');

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
  debug('git commit success', message);
}

/**
 * create and checkout branch
 * @returns {Promise<void>}
 */
export async function gitCheckout(branchName:string) {
  await run('git', ['checkout', branchName], {
    cwd: tempPath,
  });
  debug('git checkout branch', branchName);
}

export async function gitInit(branchName: string) {
  await run('git', ['init', '-b', branchName], {
    cwd: tempPath,
  });
  debug('git init, default branch', branchName);
}

export async function gitBranch(branchName: string) {
  await run('git', ['branch', branchName], {
    cwd: tempPath,
  });
  debug('git branch', branchName);
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
