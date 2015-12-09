'use strict';

let R = require('ramda');

module.exports = (cli) => {
  /**
   * Stringify a value as JSON and output to stdout
   * @param {*} value
   */
  cli.JSON = R.pipe(
    JSON.stringify,
    R.bind(process.stdout.write, process.stdout)
  );
};