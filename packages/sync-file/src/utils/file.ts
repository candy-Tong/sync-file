import { cp } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import _debug from 'debug';
import fg from 'fast-glob';
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
  // 从 cache 中找出对应的文件
  const entries = fg.sync([resolve(cacheDir, './**')], { dot: true });

  debug('cache files:', entries);

  await Promise.all(
    entries.map(async (file) => {
      const relativePath = relative(cacheDir, file);
      const projectFile = resolve(processPath, relativePath);
      const dest = resolve(tempFilesPath, relativePath);
      await cp(projectFile, dest, {
        recursive: true,
      });
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
