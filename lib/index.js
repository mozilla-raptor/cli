var parser = require('nomnom');

/**
 * Initialize a new command line interface
 * @param {String} name top-level cli command
 * @returns {{command: {Function}, global: {Function}, start: {Function}}}
 */
var Cli = (name) => {
  var cli = parser.script(name);

  return {
    command: require('./command')(cli),
    global: require('./option')(cli),
    start: () => parser.parse()
  };
};

module.exports = Cli;
