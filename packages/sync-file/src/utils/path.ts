// process dir
import process from 'process';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { debug } from './debug';

export const processPath = process.cwd();
export const filePath = fileURLToPath(import.meta.url);
export const tempPath = resolve(filePath, '../../.temp');
export const cacheDir = '.sync-file-cache';
export const metadataFilePath = resolve(cacheDir, 'metadata.json');

debug('path', {
  processPath,
  filePath,
  tempPath,
  metadataDir: cacheDir,
  metadataFilePath,
});
