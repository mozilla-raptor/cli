var R = require('ramda');
var H = require('../lib/helpers');
var query = require('raptor-query');
var validator = require('validator');
var common = require('../lib/common');

/**
 * Determine if an object is a `measure` measurement
 * @param {Object} options
 * @returns {Boolean}
 */
var isMeasure = R.pipe(R.prop('measurement'), R.equals('measure'));

/**
 * Determine if an object is a `memory` measurement
 * @param {Object} options
 * @returns {Boolean}
 */
var isMemory = R.pipe(R.prop('measurement'), R.equals('memory'));

/**
 * Determine if an object is a `measure` or `memory` measurement
 * @param {Object} options
 * @returns {Boolean}
 */
var isMeasureOrMemory = R.converge(R.or, [isMeasure, isMemory]);

/**
 * Determine if an object's `context` property is empty
 * @param {Object} options
 * @returns {Boolean}
 */
var noContext = R.pipe(R.prop('context'), R.converge(R.or, [R.isNil, R.isEmpty]));

/**
 * Determine if an object's `metric` property is empty
 * @param {Object} options
 * @returns {Boolean}
 */
var noMetric = R.pipe(R.prop('metric'), R.converge(R.or, [R.isNil, R.isEmpty]));

/**
 * Determine if an object is missing a required context
 * @param {Object} options
 * @returns {Boolean}
 */
var missingContext = R.converge(R.and, [isMeasureOrMemory, noContext]);

/**
 * Determine if an object is missing a required metric
 * @param {Object} options
 * @returns {Boolean}
 */
var missingMetric = R.converge(R.and, [isMeasureOrMemory, noMetric]);

/**
 * Return the time filter of an object with a time property
 * @param {Object} options
 * @returns {String}
 */
var getTimeFilter = R.pipe(
  R.prop('time'),
  R.cond([
    [R.contains(' '), R.identity],
    [R.T, R.concat('time > now() - ')]
  ])
);

/**
 * Convert object with time property to object with timeFilter
 * @param {Object} options
 * @returns {Object}
 */
var formatTime = R.converge(R.merge, [
  R.pipe(getTimeFilter, R.objOf('timeFilter')),
  R.omit('time')
]);

/**
 * Run a query, convert the response to JSON, and output
 * @param options
 * @returns {Promise}
 */
var execute = (options) => {
  return query(options)
    .then(H.JSON)
    .catch(H.exits);
};

/**
 * Command flow:
 * 1. Ensure --context for measure and memory queries
 * 2. Ensure --metric for measure and memory queries
 * 3. Convert --time to timeFormat
 * 4. Pass options to execute to run query
 * @param {Object} options
 * @returns {Promise}
 */
var callback = R.cond([
  [missingContext, H.errors('--context is required for measure or memory queries')],
  [missingMetric, H.errors('--metric is required for measure or memory queries')],
  [R.T, R.pipe(formatTime, execute)]
]);

module.exports = {
  name: 'query',
  help: 'Run a query against an InfluxDB data source',
  callback,
  options: {
    measurement: {
      help: 'InfluxDB measurement to query',
      abbr: 'm',
      metavar: '<measurement>',
      required: true,
      position: 1,
      choices: ['measure', 'memory', 'mtbf', 'power']
    },
    context: {
      help: 'Filter records to a particular application context; required for measure and memory measurements',
      metavar: '<origin>',
      callback: H.validate(validator.isFQDN)
    },
    metric: {
      help: 'Filter records to a particular metric; required for measure and memory measurements',
      metavar: '<name>'
    },
    branch: {
      help: 'Filter records to those run against a particular Gaia branch',
      metavar: '<name>',
      default: 'master'
    },
    device: {
      help: 'Filter records to those run against a particular device',
      metavar: '<identifier>',
      default: 'flame-kk'
    },
    memory: {
      help: 'Filter records to those run against a particular amount of memory for the targeted device',
      metavar: '<memoryMB>',
      default: 512,
      callback: H.validate(validator.isInt),
      transform: H.toInt
    },
    test: {
      help: 'Filter records to those run with a particular test',
      metavar: '<name>',
      default: 'cold-launch'
    },
    node: {
      help: 'Filter records to those run on a particular node',
      metavar: '<name>',
      default: 'moztwlab01'
    },
    time: {
      help: 'Filter records to a particular InfluxDB time query',
      metavar: '<expression>',
      default: '7d'
    },
    host: H.required(common.host),
    port: H.required(common.port),
    username: H.required(common.username),
    password: H.required(common.password),
    database: H.required(common.database),
    protocol: H.required(common.protocol)
  }
};