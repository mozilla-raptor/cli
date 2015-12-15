'use strict';

let cosmic = require('cosmiconfig');
let config = require('../../package.json').config.cosmic;
let R = require('ramda');

const MODULE = 'raptor';
const BASE = cosmic(MODULE, config);

module.exports = (cli) => {
  return BASE.then(base => {
    let options = base ? base.config : {};

    cli.on('command_registered', (instance) => {
      let command = instance.command;
      let pairs = R.toPairs(options[command._name]);

      R.map(R.apply((key, value) => command[key] = value), pairs);
    });
  });
};
