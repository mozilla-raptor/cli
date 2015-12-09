module.exports = (cli) => {
  /**
   * Generate a function that will emit the specified error when invoked
   * @param {String|Error} err
   * @returns {Function}
   */
  cli.errors = (err) => () => cli.exits(err);
};