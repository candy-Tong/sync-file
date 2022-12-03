import {
  access, mkdir, readFile, writeFile,
} from 'node:fs/promises';
import { metadataDir, metadataFilePath } from './path';
import { MetaData } from '../types';
import _debug from "debug";
const debug = _debug('sync-file:metadata');


/**
 * get metadata from cache file
 * if file not exist, create it
 */
export async function ensureMetaData():Promise<MetaData> {
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
    await mkdir(metadataDir, {
      recursive: true,
    });

    await writeFile(metadataFilePath, '{}');
    return {};
  }
}

export async function updateMetadata(data: MetaData) {
  await writeFile(metadataFilePath, JSON.stringify(data));
  return {};
}
