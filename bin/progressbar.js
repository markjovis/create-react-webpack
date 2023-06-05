const process = require('process');
const term = require('terminal-kit').terminal;

let progressBar = null;
let progress = 0;

function displayProgress(complete) {
  // Add random progress
  progress += Math.random() / 10;
  if (!complete) {
    if (progress > 0.99) progress = 0.1;
  }
  progressBar.update(progress);
  if (progress >= 1) {
    // Cleanup and exit
    setTimeout(() => { term('\n'); process.exit(); }, 200);
  } else {
    setTimeout(displayProgress, 100 + Math.random() * 1000);
  }
}

progressBar = term.progressBar({
  width: 120,
  title: 'Installing npm packages. Please wait:',
  eta: false,
  percent: false
});

module.exports = {
  displayProgress,
  progressBar
};
