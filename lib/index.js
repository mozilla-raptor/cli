var parser = require('nomnom');

var Cli = (name) => {
  var cli = parser.script(name);

  return {
    command: require('./command')(cli),
    global: require('./option')(cli),
    start: () => parser.parse()
  };
};

module.exports = Cli;
