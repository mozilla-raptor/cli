'use strict';

let R = require('ramda');

module.exports = (cli) => {
  cli.getOptions = R.pipe(
    R.prop('commandObject'),
    R.converge(R.merge, [
      R.converge(R.pick, [
        R.pipe(R.prop('_events'), R.keys),
        R.identity
      ]),
      R.path(['parent', '_command', 'args', 'options'])
    ])
  );
};
