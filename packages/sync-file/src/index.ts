import minimist from 'minimist';
import * as process from 'process';
import {
  mkdir,
  rm,
} from 'node:fs/promises';
import _debug from 'debug';
import { normalizeSyncConfig } from './utils';
import { UserSyncConfig } from './types';
import { processPath, tempPath } from './utils/path';
import { ensureMetaData, updateMetadata } from './utils/metadata';
import { createEmptyFile, git } from './utils/git';
import {
  copyFileToCacheDir,
  copyFileToProject,
  copyFileToTempDirFromCache,
  copyFileToTempDirFromProject,
} from './utils/file';

const debug = _debug('sync-file:main');
const argv = minimist(process.argv.slice(2));
debug('argv:', argv);

const entry = argv._[0];

if (!entry) {
  throw new Error('no entry');
}

start();

const projectBranchName = 'project';
const latestBranchName = 'latest';
const cacheBranchName = 'main';

async function start() {
  const entryFunc = await import(entry);

  const userSyncConfig: UserSyncConfig = entryFunc.default(processPath);
  const syncConfig = normalizeSyncConfig(userSyncConfig);
  debug('normalize syncConfig:', syncConfig);

  // clear temp dir, rm-rf
  await rm(tempPath, {
    force: true,
    recursive: true,
  });

  // create a temporary git repository
  await mkdir(tempPath);

  // create cache branch, copy file from last copy cache
  // git init
  await git.init(cacheBranchName);

  // commit with empty file
  await createEmptyFile();
  await git.addAll();
  await git.commit('init');

  // init branch
  await git.branch(projectBranchName);
  await git.branch(latestBranchName);

  // copy file from last copy cache

  // ensure cache dir exist
  const metadata = await ensureMetaData();
  await copyFileToTempDirFromCache();
  await git.addAll();
  await git.commit('files from last config');

  // create 'project' branch, copy current file in the project
  await git.checkout(projectBranchName);
  if (metadata.fileList) {
  // copy project
    await copyFileToTempDirFromProject(metadata.fileList);
  }

  // create 'latest' branch, copy file from the target path
  await git.checkout(latestBranchName);
  await copyFileToProject(syncConfig.fileList);

  // git merge

  // copy files from tempDir to project

  // copy files to cache dir
  await copyFileToCacheDir(syncConfig.fileList);
  updateMetadata(syncConfig);
}
