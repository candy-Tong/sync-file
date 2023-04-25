import { mkdir, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { resolve } from 'path';
import _debug from 'debug';
import { tempPkgPath } from './path';
import { rmrf } from './file';
import {pathToFileURL} from 'url'

const debug = _debug('sync-file:package');
const tempPkgEntryPath = resolve(tempPkgPath, 'index.js');

export async function installAndLoadPkg(name: string, version?: string): Promise<string> {
  await rmrf(tempPkgPath);
  await mkdir(tempPkgPath, {
    recursive: true,
  });
  await writeFile(resolve(tempPkgPath,'package.json'), '{}')

  const pkgWithVersion = version ? `${name}@${version}` : name;
  await execa('npm', ['i', pkgWithVersion, '--ignore-script', '-D'], {
    stdio: debug.enabled ? 'inherit' : 'ignore',
    cwd: tempPkgPath,
  });
  await writeFile(tempPkgEntryPath, `
    module.exports = require('${name}')
  `);
  const res = await import(pathToFileURL(tempPkgEntryPath).toString());
  debug('module result:', res.default);
  return res.default;
}

export function getPkgAndVersion(name: string) {
  // 报名带 version
  if (name.includes('@', 1)) {
    const index = name.lastIndexOf('@');
    return {
      name: name.substring(0, index),
      version: name.substring(index + 1),
    };
  }
  return {
    name,
  };
}
