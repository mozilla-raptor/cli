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

module.exports.JSON = R.pipe(JSON.stringify, console.log);

/**
 * Emit a given error to stderr and exit the process as failing
 * @param err
 */
module.exports.exits = err => console.error(err.stack || err) && process.exit(1);

/**
 * Generate a function that will emit the specified error when invoked
 * @param {String|Error} err
 * @returns {Function}
 */
module.exports.errors = (err) => () => module.exports.exits(err);

/**
 * Generate a function which will validate a value with the specified validation function
 * @param {Function} validator
 * @returns {Function}
 */
module.exports.validate = (validator) => (value) => validator(value) || `Invalid value of "${value}" specified`;

/**
 * Stream stdin for the process and parse as JSON
 * @returns {Promise}
 */
module.exports.readStdin = () => {
  return new Promise((resolve, reject) => {
    var chunks = [];
    var done = R.pipe(R.join(''), JSON.parse, resolve);

    process.openStdin();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => chunks.push(chunk));
    process.stdin.on('end', () => done(chunks));
    process.stdin.on('error', reject);
  });
};
