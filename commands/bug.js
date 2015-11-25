var H = require('../lib/helpers');
var bug = require('raptor-bug');
var validator = require('validator');

var callback = (options) => {
  Promise.resolve()
    .then(H.readStdin)
    .then(data => bug(options, data))
    .then(H.JSON)
    .catch(H.exits)
};

module.exports = {
  name: 'bug',
  help: 'File bugs for Raptor regressions',
  callback,
  options: {
    url: {
      help: 'Bugzilla API URL where bug will be filed',
      full: 'bz-url',
      metavar: '<url>',
      default: 'https://bugzilla.mozilla.org/rest/',
      callback: H.validate(validator.isURL)
    },
    username: {
      help: 'Bugzilla API username authorized to create bugs',
      full: 'bz-username',
      metavar: '<username>',
      required: true
    },
    password: {
      help: 'Bugzilla API password for username',
      full: 'bz-password',
      metavar: '<password>',
      required: true
    },
    timeout: {
      help: 'Bugzilla API timeout threshold',
      full: 'bz-timeout',
      metavar: '<milliseconds>',
      default: 30 * 1000
    },
    token: {
      help: 'Access Token for URL shortening service',
      full: 'shorten-token',
      metavar: '<token>',
      required: true
    }
  }
};