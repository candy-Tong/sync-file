import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { resolve } from 'path';
import _debug from 'debug';
import { tempPkgPath } from './path';

const debug = _debug('sync-file:package');
const tempPkgEntryPath = resolve(tempPkgPath, 'index.js');

export async function installAndLoadPkg(name: string): Promise<string> {
  await rm(tempPkgPath, {
    force: true,
    recursive: true,
  });
  await mkdir(tempPkgPath, {
    recursive: true,
  });
  await execa('npm', ['init', '-y'], {
    stdio: debug.enabled ? 'inherit' : 'ignore',
    cwd: tempPkgPath,
  });
  await execa('npm', ['i', name, '--ignore-script', '-D'], {
    stdio: debug.enabled ? 'inherit' : 'ignore',
    cwd: tempPkgPath,
  });
  await writeFile(tempPkgEntryPath, `
    module.exports = require('${name}')
  `);
  const res = await import(tempPkgEntryPath);
  debug('module result:', res.default);
  return res.default;
}
