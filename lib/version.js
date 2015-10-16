/**
 * Global version CLI flag (-v)
 * @type {{flag: boolean, abbr: string, help: string, callback: Function}}
 */
module.exports = {
  flag: true,
  abbr: 'v',
  help: 'outputs the raptor cli tool version',
  callback: () => {
    console.log(require('../package.json').version);
    process.exit(0);
  }
};
