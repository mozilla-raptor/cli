'use strict';

let R = require('ramda');

module.exports = (cli) => {
  /**
   * Stream stdin for the process and parse as JSON
   * @returns {Promise}
   */
  cli.stdin = () => {
    if (process.stdin.isTTY) {
      return Promise.reject(new Error('Using this method requires stdin, no stdin detected'));
    }

    return new Promise((resolve, reject) => {
      var chunks = [];
      var done = R.pipe(R.join(''), JSON.parse, resolve);

      process.openStdin();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => chunks.push(chunk));
      process.stdin.on('end', () => done(chunks));
      process.stdin.on('error', reject);
    });
  };
};
