var validator = require('validator');
var helpers = require('./helpers');

module.exports = {
  host: {
    help: 'InfluxDB database hostname',
    metavar: '<host>',
    default: 'localhost'
  },
  port: {
    help: 'InfluxDB database port',
    metavar: '<port>',
    default: 8086,
    callback: validator.isInt,
    transform: helpers.toInt
  },
  username: {
    help: 'InfluxDB database username',
    metavar: '<username>',
    default: 'root'
  },
  password: {
    help: 'InfluxDB database password',
    metavar: '<password>',
    default: 'root'
  },
  database: {
    help: 'InfluxDB database name',
    metavar: '<name>'
  },
  protocol: {
    help: 'InfluxDB database protocol',
    metavar: '<protocol>',
    default: 'http',
    choices: ['http', 'https']
  }
};
