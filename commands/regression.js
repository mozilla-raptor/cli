var R = require('ramda');
var regression = require('raptor-regression');
var H = require('../lib/helpers');

/**
 * Generate regression candidate points by creating a new object with columns as
 * keys, values as the object values, and merge with a base object containing
 * tags and measurement name
 * @param {Function} merger function which generates new object with base object of tags
 * @param {String} name measurement name
 * @param {Array} columns collection of object keys
 * @param {Array} values collection of object values
 * @returns {Array}
 */
var mergeColumnsWithValues = (merger, name, columns, values) => {
  return R.map(R.pipe(
    R.zipObj(columns),
    merger,
    R.merge(R.objOf('name', name))
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
    R.prop('name'), // Set the name as the measurement name,
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
    .then(H.readStdin)
    .then(transform)
    .then(regression)
    .then(H.JSON)
    .catch(H.exits);
};

module.exports = {
  name: 'regression',
  help: 'search for performance regressions in an InfluxDB result set',
  callback,
  options: {}
};
