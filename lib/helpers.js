var R = require('ramda');

module.exports.toInt = R.partialRight(parseInt, [10]);

module.exports.required = R.merge({ required: true });

module.exports.errors = (err) => () => console.error(err.stack || err) && process.exit(1);

module.exports.validate = (validator) => (value) => validator(value) || `Invalid value of "${value}" specified`;