var R = require('ramda');

/**
 * Augment a Cli instance with a new global option
 * @param {Cli} cli Cli instance
 * @param {String} name name of Cli global option
 * @param {Object} option global option
 */
module.exports = R.curry((cli, name, option) => {
  cli.option(name, option);
  return cli;
});
