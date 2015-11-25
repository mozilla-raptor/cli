var R = require('ramda');
var H = require('../lib/helpers');
var track = require('raptor-track');
var validator = require('validator');
var common = require('../lib/common');

var callback = (options) => {
  Promise.resolve()
    .then(H.readStdin)
    .then(data => track(options, data))
    .then(H.JSON)
    .catch(H.exits);
};

module.exports = {
  name: 'track',
  help: 'Track regressions',
  callback,
  options: {
    host: H.required(common.host),
    port: H.required(common.port),
    username: H.required(common.username),
    password: H.required(common.password),
    database: H.required(common.database),
    protocol: H.required(common.protocol)
  }
};