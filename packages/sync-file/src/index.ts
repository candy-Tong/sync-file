import minimist from 'minimist';
import * as process from 'process';
import {
  mkdir,
  rm,
} from 'node:fs/promises';
import _debug from 'debug';
import { cacheDir, tempFilesPath, tempGitPath } from './utils/path';
import {
  mainBranchName, cleanGitDir, createEmptyFile, git, latestBranchName,
} from './utils/git';
import {
  copyFileToCacheDirFromConfig, copyFileToProjectFromTempDir,
  copyFileToTempDirFromCache, copyFileToTempDirFromConfig,
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

async function start() {
  const entryModule = await import(entry);

  const sourceDir: string = entryModule.default;

  // clear temp dir, rm-rf
  await rm(tempGitPath, {
    force: true,
    recursive: true,
  });

  // create a temporary git repository
  await mkdir(tempFilesPath, {
    recursive: true,
  });
  // ensure cacheDir exist
  await mkdir(cacheDir, {
    recursive: true,
  });

  // create cache branch, copy file from last copy cache
  // git init
  await git.init(mainBranchName);
  // create empty file to avoid commit nothing
  await createEmptyFile();
  await copyFileToTempDirFromCache();
  await git.addAll();
  await git.commit('last cache config files');

  // create the latest branch
  await git.branch(latestBranchName);

  // commit current project files
  await cleanGitDir();
  // copy project files
  await copyFileToTempDirFromProject();
  await git.addAll();
  await git.commit('current project config files');

  // commit the latest config files
  await git.checkout(latestBranchName);
  await cleanGitDir();
  await copyFileToTempDirFromConfig(sourceDir);
  await git.addAll();
  await git.commit('the latest config files');

  // git merge
  await git.merge(mainBranchName);

  // copy files from tempDir to project
  await copyFileToProjectFromTempDir();

  await rm(cacheDir, {
    force: true,
    recursive: true,
  });
  // copy files to cache dir
  await copyFileToCacheDirFromConfig(sourceDir);
  // await updateMetadata(syncConfig);
}

// await copyFileToProject(syncConfig.fileList);
