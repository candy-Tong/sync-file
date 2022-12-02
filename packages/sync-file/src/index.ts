import minimist from 'minimist';
import * as process from 'process';
import * as path from 'path';
import {
  fileURLToPath,
} from 'url';
import {
  mkdir,
  rm,
} from 'node:fs/promises';
import { run } from './utils/utils';

const argv = minimist(process.argv.slice(2));
console.log(argv);

// process dir
const processPath = process.cwd();
const filePath = fileURLToPath(import.meta.url);
const tempPath = path.resolve(filePath, '../../.temp');
console.log('processPath', processPath);
console.log('filePath', filePath);
console.log('tempPath', tempPath);

const entry = argv._[0];

if (!entry) {
  throw new Error('no entry');
}

start();

async function start() {
  const entryFunc = await import(entry);

  const syncConfig = entryFunc.default();
  console.log(syncConfig);

  // clear temp dir, rm-rf
  await rm(tempPath, {
    force: true,
    recursive: true,
  });

  // create a temporary git repository
  await mkdir(tempPath);

  //  create main branch, copy file from last copy cache
  // git init
  await run('git', ['init', '-b', 'main'], {
    cwd: tempPath,
  });

  // copy file from last copy cache

  //  create current branch, copy current file in the project

  //   create latest branch, copy file from the target path
}
