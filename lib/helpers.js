var R = require('ramda');

/**
 * Convert a string to an integer
 * @param {String} value
 * @returns {Number}
 */
module.exports.toInt = R.partialRight(parseInt, [10]);

/**
 * Mark an option as being required
 * @param {Object} option
 * @returns {Object}
 */
module.exports.required = R.merge({ required: true });

/**
 * Generate a function that will emit the specified error when invoked
 * @param {String|Error} err
 * @returns {Function}
 */
module.exports.errors = (err) => () => console.error(err.stack || err) && process.exit(1);

/**
 * Generate a function which will validate a value with the specified validation function
 * @param {Function} validator
 * @returns {Function}
 */
module.exports.validate = (validator) => (value) => validator(value) || `Invalid value of "${value}" specified`;
