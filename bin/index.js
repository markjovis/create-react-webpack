#! /usr/bin/env node
const { exec } = require('child_process');
const shell = require('shelljs');
const { rimraf } = require('rimraf');

const { displayProgress, progressBar } = require('./progressbar');

const args = process.argv.slice(2);
const count = args.length;
const dir = args[count - 1];

const allowed = /^[a-zA-Z].*/;
const isAllowedName = allowed.test(args);

if (isAllowedName && dir) {
  process.stdout.write('\x1b[32m');
  // shell.exec(`git clone https://github.com/markjovis/react-webpack-template.git ${dir} && rm -rf ${dir}/.git`);
  shell.exec(`git clone https://github.com/markjovis/react-webpack-template.git ${dir}`);
  rimraf(`${dir}/.git`);

  displayProgress(false);

  exec('npm install', { cwd: dir }, (error, stdout) => {
    if (error) {
      progressBar.stop();
      console.error(`\x1b[31m\n\nError: ${error.message}`);
      console.error('\x1b[0m');
      process.exit(1);
    }
    progressBar.stop();
    console.info();
    console.info();
    console.info(`\x1b[33mAll done: ${stdout}`);
    console.info(`\x1b[32m Your app "${args}" was successfully created!`);
    console.info();
    console.info(' ###########################################################################');
    console.info(` ### To run your react app, go to "${args}" folder, and type "npm start". ###`);
    console.info(' ###########################################################################');
    console.info('\x1b[0m');
    process.exit(1);
  });
} else {
  progressBar.stop();
  console.error('\x1b[31mError: A valid "app name" is required! App name must start with a letter (a-z).\n'
    + 'App name can contain numbers but cannot start with numbers. No special characters allowed!');
  console.error('\x1b[0m');
  process.exit(1);
}
