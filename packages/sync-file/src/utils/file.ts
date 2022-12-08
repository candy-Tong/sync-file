import { cp, rm } from 'node:fs/promises';
import {
  resolve, relative, posix, win32,
} from 'node:path';
import _debug from 'debug';
import fg from 'fast-glob';
import chalk from 'chalk';
import { access } from 'fs/promises';
import {
  cacheDir, processPath, tempFilesPath,
} from './path';

const debug = _debug('sync-file:file');

export async function copyFileToProjectFromTempDir() {
  await cp(tempFilesPath, processPath, {
    recursive: true,
  });
  debug('copy files, temp dir > project');
}

export async function copyFileToCacheDirFromConfig(sourceDir: string) {
  await cp(sourceDir, cacheDir, {
    recursive: true,
  });
  debug('copy files, config > cache');
}

export async function copyFileToTempDirFromCache() {
  await cp(cacheDir, tempFilesPath, {
    recursive: true,
  });
  debug('copy files, cache > temp dir');
}

export async function copyFileToTempDirFromProject() {
  // find all project file according to cache file
  // fast-glob not support to use window \ seq，must use POSIX seq /
  const normalizePath = resolve(cacheDir, './**').split(win32.sep).join(posix.sep);
  const entries = fg.sync([normalizePath], { dot: true });

  debug('cache files:', entries);

  await Promise.all(
    entries.map(async (file) => {
      const relativePath = relative(cacheDir, file);
      const projectFile = resolve(processPath, relativePath);
      const dest = resolve(tempFilesPath, relativePath);
      try {
        await cp(projectFile, dest, {
          recursive: true,
        });
      } catch (e) {
        console.log(chalk.red(`[auto-sync-file] copy file from project fail, maybe not exist, file: ${projectFile}`));
      }
    }),
  );
  debug('copy files, project > temp dir');
}

export async function copyFileToTempDirFromConfig(sourceDir: string) {
  await cp(sourceDir, tempFilesPath, {
    recursive: true,
  });
  debug('copy files, config > temp dir');
}

export async function rmrf(path:string) {
  try {
    await access(path);
  } catch (e) {
    debug('path not exist:', path);
    return null;
  }
  return rm(path, {
    maxRetries: 2,
    force: true,
    recursive: true,
    retryDelay: 100,
  });
}
