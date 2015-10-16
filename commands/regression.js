var R = require('ramda');
var regression = require('raptor-regression');

/**
 * Stream stdin for the process and parse as JSON
 * @returns {Promise}
 */
var readStdin = () => {
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

/**
 * Generate regression candidate points by creating a new object with columns as
 * keys, values as the object values, and merge with a base object containing tags
 * @param {Function} merger function which generates new object with base object of tags
 * @param {Array} columns collection of object keys
 * @param {Array} values collection of object values
 * @returns {Array}
 */
var mergeColumnsWithValues = (merger, columns, values) => {
  return R.map(R.pipe(
    R.zipObj(columns),
    merger
  ), values);
};

/**
 * Transform an InfluxDB query resultset into -> Array<{ value: Number }>
 * @returns Array
 */
var transform = R.pipe(
  R.prop('results'), // Each query has a single "results" property;
  R.map(R.prop('series')), // Get all the series from results,
  R.flatten, // Squish all the series together
  R.map(R.converge(mergeColumnsWithValues, [ // Generate all the points per series by merging together:
    R.pipe(R.prop('tags'), R.merge), // The tags for the series as the base of the new point,
    R.prop('columns'), // Use the columns as new keys in the object
    R.prop('values') // And the values as the key-values to the columns
  ])),
  R.flatten // Finally, squish all the points together across series into a single array
);

/**
 * Command flow:
 * 1. Read the contents of stdin, parse as JSON
 * 2. Transform the query results into a format understood by raptor-regression
 * 3. Pass the formatted data to raptor-regression
 * 4. Either output the regression results as JSON to the console,
 * 5. Or output any errors encountered along the way
 */
var callback = () => {
  Promise.resolve()
    .then(readStdin)
    .then(transform)
    .then(regression)
    .then(R.pipe(JSON.stringify, console.log))
    .catch(err => console.error(err.stack || err));
};

module.exports = {
  name: 'regression',
  help: 'search for performance regressions in an InfluxDB result set',
  callback,
  options: {}
};
