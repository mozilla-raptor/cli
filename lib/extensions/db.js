'use strict';

module.exports = (cli) => {
  cli.usesDatabase = (command) => {
    command
      .option('--host <host>', 'InfluxDB database hostname', 'localhost')
      .option('--port <port>', 'InfluxDB database port', 8086)
      .option('--username <username>', 'InfluxDB database username', 'root')
      .option('--password <password>', 'InfluxDB database password', 'root')
      .option('--database <name>', 'InfluxDB database name')
      .option('--protocol <protocol>', 'InfluxDB database protocol', 'http')
  };
};
