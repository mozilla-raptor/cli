module.exports = (cli) => {
  cli
    .find('exit')
    .description('Exits raptor cli shell')
    .hidden();
};
