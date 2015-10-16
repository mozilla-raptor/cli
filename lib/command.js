var R = require('ramda');

/**
 * Augment a Cli instance with a new command
 * @param {Object} cli
 * @param {Object} command
 * @chainable
 * @returns {cli}
 */
module.exports = R.curry((cli, command) => {
  cli
    .command(command.name)
    .help(command.help)
    .options(command.options)
    .callback(command.callback);

  return cli;
});
