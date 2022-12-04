// process dir
import process from 'process';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import _debug from 'debug';

const debug = _debug('sync-file:path');

export const processPath = process.cwd();
export const filePath = fileURLToPath(import.meta.url);
export const tempGitPath = resolve(filePath, '../../.temp');
export const tempFilesPath = resolve(tempGitPath, './files');
export const metadataDir = '.sync-file-cache';
export const cacheDir = resolve(metadataDir, './cache');
export const metadataFilePath = resolve(metadataDir, 'metadata.json');

debug('path', {
  processPath,
  filePath,
  tempPath: tempGitPath,
  metadataDir: cacheDir,
  metadataFilePath,
});
