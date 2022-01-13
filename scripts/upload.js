const { src, dest, series, parallel, task } = require('gulp');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { spawnSync, execSync, fork } = require('child_process');
const { join, resolve } = require('path');
const chalk = require('chalk');
const fs = require('fs');
const del = require('del');
const os = require('os');

const paths = {
  root: path.join(__dirname, '../'),
  app: path.join(__dirname, '../app'),
  dist: path.join(__dirname, '../build'),
  ossFile: path.join(__dirname, 'oss.js')
};

const platform = 'darwin';

task('macos-pack', (done) => {
  const { version } = require(join(paths.root, 'package.json'));
  const filename = `kraken-${platform}-${version}.tar.gz`;
  const fileFullPath = join(paths.dist, filename);
  // Make sure packed file not exists.
  rimraf.sync(fileFullPath);

  try {
    // Ignore lib files, which is already copied to app shared frameworks.
    execSync(`tar --exclude ./${platform}/lib -zcvf ${filename} ./${platform}`, {
      cwd: paths.dist,
      stdio: 'inherit',
    });
    done();
  } catch (err) {
    done(err.message);
  }
});

task('macos-upload', (done) => {
  const { version } = require(join(paths.root, 'package.json'));
  const filename = `kraken-${platform}-${version}.tar.gz`;
  const fileFullPath = join(paths.dist, filename);
  execSync(`node ${paths.ossFile} -s ${fileFullPath} -n ${filename}`, {
    cwd: paths.scripts,
    stdio: 'inherit',
    env: {
      OSS_AK: process.env.OSS_AK,
      OSS_SK: process.env.OSS_SK
    }
  });
  done();
});

// Run tasks
series('macos-pack', 'macos-upload')((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(chalk.green('Success.'));
  }
});