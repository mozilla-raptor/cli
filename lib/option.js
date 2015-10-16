var R = require('ramda');

module.exports = R.curry((cli, name, option) => {
  cli.option(name, option);
  return cli;
});
