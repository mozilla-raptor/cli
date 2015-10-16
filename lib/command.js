var R = require('ramda');

module.exports = R.curry((cli, command) => {
  cli
    .command(command.name)
    .help(command.help)
    .options(command.options)
    .callback(command.callback);

  return cli;
});
