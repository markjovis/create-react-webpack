#! /usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const shell = require('shelljs');
const { rimraf } = require('rimraf');
const ProgressBar = require('progress');

let interval;
let currentStep;

const totalSteps = 100;
const bar = new ProgressBar('Processing [:bar] :percent :etas', {
  total: totalSteps,
  width: 40,
  clear: false
});

const args = process.argv.slice(2);
const count = args.length;
const dir = args[count - 1];
const allowed = /^[a-zA-Z].*/;
const isAllowedName = allowed.test(args);

function displayProgress() {
  currentStep = 0;
  interval = setInterval(() => {
    currentStep++;
    bar.tick();

    if (currentStep >= totalSteps) {
      clearInterval(interval);
      console.info('\nPlease wait ...');
    }
  }, 1000);
}

function checkDirectory(directoryPath) {
  try {
    if (fs.existsSync(directoryPath)) {
      const files = fs.readdirSync(directoryPath);
      if (files.length === 0) {
        return 'Warning: The specified directory already exists but it is empty.';
      }
      return 'Error: The specified directory already exists and it is not empty. Please remove existing directory or specify a different one.';
    }
    return 'Directory does not exist';
  } catch (error) {
    return `An error occurred: ${error.message}`;
  }
}

function terminalQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

console.info('\n\n\x1b[1m\x1b[37m*** CREATE REACT WEBPACK PROJECT (create-react-webpack-proj) UTILITY ***\x1b[0m\n');

(async () => {
  if (isAllowedName && dir) {
    const dirResult = checkDirectory(`./${dir}`);
    if (dirResult.includes('Warning:')) {
      console.warn(dirResult);

      let usrResponse = await terminalQuestion('Proceed? (y/n) ');
      usrResponse = usrResponse.toLowerCase();

      if (usrResponse === 'n' || usrResponse === 'no') {
        console.info('User aborted. Process terminated.');
        process.exit(1);
      }
      if (usrResponse !== 'y' && usrResponse !== 'yes') {
        console.warn('Invalid response. Please answer "Y" or "N" or "YES" or "NO". Please try again.');
        process.exit(1);
      }
    } else if (dirResult !== 'Directory does not exist') {
      console.error(`\x1b[31m${dirResult}`);
      process.exit(1);
    }

    displayProgress();
    process.stdout.write('\x1b[32m');
    shell.exec(`git clone https://github.com/markjovis/react-webpack-template.git ${dir}`);
    rimraf(`${dir}/.git`);

    console.info('Cloning completed successfully.');
    console.info('Now installing NPM packages ...');

    exec('npm install', { cwd: dir }, (error, stdout) => {
      if (error) {
        clearInterval(interval);
        console.error(`\x1b[31m\n\nError: ${error.message}`);
        console.error('\x1b[0m');
        process.exit(1);
      }

      clearInterval(interval);
      bar.tick(100);
      console.log(`\nProcess completed in ${currentStep} seconds.`);

      console.info();
      console.info();
      console.info(`\x1b[33mAll done: ${stdout}`);
      console.info(`\x1b[32m Your app "${args}" was successfully created!`);
      console.info();
      console.info(' ############################################################################');
      console.info(` ### To run your react app, go to "${args}" folder, and type "npm start". ###`);
      console.info(' ############################################################################');
      console.info('\x1b[0m');
      process.exit(1);
    });
  } else {
    clearInterval(interval);
    console.error('\x1b[31mError: A valid "app name" is required! App name must start with a letter (a-z).\n'
    + 'App name can contain numbers but cannot start with numbers. No special characters allowed!');
    console.error('\x1b[0m');
    process.exit(1);
  }
})();
