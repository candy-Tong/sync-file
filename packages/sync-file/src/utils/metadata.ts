import {
  access, mkdir, readFile, writeFile,
} from 'node:fs/promises';
import { cacheDir, metadataFilePath } from './path';
import { debug } from './debug';
import { MetaData } from '../types';

/**
 * get metadata from cache file
 * if file not exist, create it
 */
export async function ensureCacheMetaData():Promise<MetaData> {
  try {
    await access(metadataFilePath);
    const file = await readFile(metadataFilePath, {
      encoding: 'utf-8',
    });
    const metadata:MetaData = JSON.parse(file);
    debug('metadata:', metadata);
    return metadata;
  } catch (e: any) {
    debug('read metafile error, msg:', e.message);
    await mkdir(cacheDir, {
      recursive: true,
    });

    await writeFile(metadataFilePath, '{}');
    return {};
  }
}
