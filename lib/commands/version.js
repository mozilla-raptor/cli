'use strict';

let pkg = require('../../package.json');

module.exports = (cli) => {
  cli.version(pkg.version);

  cli
    .command('version')
    .description('Outputs the raptor cli tool version')
    .action(() => cli.log(cli._version));
};
