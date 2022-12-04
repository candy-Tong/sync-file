import { copyFile, cp, mkdir } from 'node:fs/promises';
import { basename, resolve, relative } from 'node:path';
import _debug from 'debug';
import fg from 'fast-glob';
import { FileConfig } from '../types';
import {
  cacheDir, processPath, tempFilesPath, tempGitPath,
} from './path';

const debug = _debug('sync-file:file');

/**
 * copy file to dest.
 * @returns {Promise<void>}
 * @param fileList
 */
async function copyFilesByConfig(fileList: FileConfig[]) {
  try {
    await Promise.all(
      fileList.map(async (fileConfig) => {
        const { source, destDir, fileName } = parseFileConfig(fileConfig);
        const target = resolve(destDir, fileName);

        // ensure the destDir exist
        await mkdir(destDir, {
          recursive: true,
        });

        await copyFile(source, target);
        debug(`copy file success: ${source} -> ${target}`);
      }),
    );
  } catch (e: any) {
    debug('copy file fail, msg', e.message);
  }
}
export const copyFileToProject = copyFilesByConfig;

export async function copyFileToProjectFromTempDir() {
  await cp(tempFilesPath, processPath, {
    recursive: true,
  });
}

export async function copyFileToCacheDirFromConfig(sourceDir: string) {
  await cp(sourceDir, cacheDir, {
    recursive: true,
  });
}

export async function copyFileToTempDirFromCache() {
  await cp(cacheDir, tempFilesPath, {
    recursive: true,
  });
}

export async function copyFileToTempDirFromProject() {
  // 从 cache 中找出对应的文件
  const entries = fg.sync([resolve(cacheDir, './**')], { dot: true });

  console.log(entries);

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
}

export async function copyFileToTempDirFromConfig(sourceDir: string) {
  await cp(sourceDir, tempFilesPath, {
    recursive: true,
  });
}

function parseFileConfig(fileConfig: FileConfig) {
  const { source } = fileConfig;
  const destDir = fileConfig.destDir ? resolve(processPath, fileConfig.destDir) : processPath;
  const fileName = fileConfig.name || basename(source);
  const relativeDestDir = relative(processPath, destDir);
  return {
    source,
    destDir,
    fileName,
    relativeDestDir,
  };
}
