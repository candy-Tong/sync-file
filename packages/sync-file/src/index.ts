import minimist from 'minimist';
import * as process from 'process';
import chalk from 'chalk';
import {
  mkdir,
} from 'node:fs/promises';
import _debug from 'debug';
import {
  cacheDir, tempFilesPath, tempGitPath,
} from './utils/path';
import {
  mainBranchName, cleanTempDir, createEmptyFile, git, latestBranchName,
} from './utils/git';
import {
  copyFileToCacheDirFromConfig, copyFileToProjectFromTempDir,
  copyFileToTempDirFromCache, copyFileToTempDirFromConfig,
  copyFileToTempDirFromProject, rmrf,
} from './utils/file';
import { getPkgAndVersion, installAndLoadPkg } from './utils/package';

const debug = _debug('sync-file:main');
const argv = minimist(process.argv.slice(2));
debug('argv:', argv);

const entryWithVersion: string = argv._[0];

const { name: entry, version } = getPkgAndVersion(entryWithVersion);

if (!entry) {
  throw new Error('no entry');
}

start();

async function start() {
  let sourceDir: string;
  try {
    const entryModule = await import(entry);
    sourceDir = entryModule.default;
  } catch (e) {
    sourceDir = await installAndLoadPkg(entry, version);
  }

  // clear temp dir, rm-rf
  await rmrf(tempGitPath);

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
  await cleanTempDir();
  // copy project files
  await copyFileToTempDirFromProject();
  await git.addAll();
  await git.commit('current project config files');

  // commit the latest config files
  await git.checkout(latestBranchName);
  await cleanTempDir();
  await copyFileToTempDirFromConfig(sourceDir);
  await git.addAll();
  await git.commit('the latest config files');

  // git merge
  await git.merge(mainBranchName);
  // copy files from tempDir to project
  await copyFileToProjectFromTempDir();

  await rmrf(cacheDir);
  // copy files to cache dir
  await copyFileToCacheDirFromConfig(sourceDir);
  console.log(chalk.blue('[auto-sync-file] sync files successfully'));
}
