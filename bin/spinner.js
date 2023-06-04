const process = require('process');
const readLine = require('readline');
const cliSpinners = require('cli-spinners');

const std = process.stdout;

const spin = (message) => {
  let index = 0;
  process.stdout.write('\x1B[?25l');
  const spinx = cliSpinners.aesthetic;
  const spinners = spinx.frames;

  return setInterval(() => {
    let line = spinners[index];

    if (line === undefined) {
      index = 0;
      line = spinners[index];
    }
    std.write(`\x1b[32m${message} ${line}`);
    readLine.cursorTo(std, 0, 0);
    index = index > spinners.length ? 0 : index + 1;
  }, 500);
};

module.exports = {
  spin
};
