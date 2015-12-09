module.exports = (cli) => {
  /**
   * Emit a given error to stderr and exit the process as failing
   * @param err
   */
  cli.exits = err => console.error(err.stack || err) && process.exit(1);
};
