import { copyFile, cp } from 'node:fs/promises';
import { basename, resolve, relative } from 'node:path';
import { FileConfig } from '../types';
import { cacheDir, processPath, tempPath } from './path';
import { debug } from './debug';

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
        await copyFile(source, target);
        debug(`copy file success: ${source} -> ${target}`);
      }),
    );
  } catch (e: any) {
    debug('copy file fail, msg', e.message);
  }
}
export const copyFileToProject = copyFilesByConfig;

export async function copyFileToCacheDir(fileList: FileConfig[]) {
  const list:FileConfig[] = fileList.map((fileConfig) => ({
    ...fileConfig,
    // change the dest to cacheDir
    destDir: cacheDir,
  }));
  return copyFilesByConfig(list);
}

export async function copyFileToTempDirFromCache() {
  await cp(cacheDir, tempPath, {
    recursive: true,
  });
}

export async function copyFileToTempDirFromProject(fileList: FileConfig[]) {
  const list:FileConfig[] = fileList.map((fileConfig) => {
    const { destDir, fileName } = parseFileConfig(fileConfig);

    const projectSource = resolve(processPath, destDir, fileName);

    // change source to project files
    // change the destDir to tempPath
    return {
      ...fileConfig,
      // change the dest to cacheDir
      source: projectSource,
      destDir: tempPath,
    };
  });
  return copyFilesByConfig(list);
}

function parseFileConfig(fileConfig: FileConfig) {
  const { source } = fileConfig;
  const destDir = fileConfig.destDir ? resolve(processPath, fileConfig.destDir) : processPath;
  const fileName = fileConfig.name || basename(source);
  return {
    source,
    destDir,
    fileName,
  };
}
