import { writeFile, readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import _debug from 'debug';
import { run } from './index';
import {tempFilesPath, tempGitPath} from './path';

const debug = _debug('sync-file:git');
export const latestBranchName = 'latest';
export const mainBranchName = 'main';

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
  await run('git', ['init', '-b', branchName], {
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
  await run('git', ['merge', branchName], {
    cwd: tempGitPath,
  });
  debug('git merge', branchName);
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
  await rm(tempFilesPath, {
    force: true,
    recursive: true,
  });
}
