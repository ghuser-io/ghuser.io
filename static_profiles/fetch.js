#!/usr/bin/env node
'use strict';

(async () => {

  const meow = require('meow');

  const cli = meow(`
usage:
  $ ./fetch.js USER
  $ ./fetch.js --help

positional arguments:
  USER        GitHub username, e.g. AurelienLourot

optional arguments:
  --help      show this help message and exit
`);

  if (cli.input.length < 1) {
    console.error('Error: USER argument missing. See `./fetch.js --help`.');
    process.exit(1);
  }

  if (cli.input.length > 1) {
    console.error('Error: too many positional arguments. See `./fetch.js --help`.');
    process.exit(1);
  }

  const user = cli.input[0];
  console.log(`${user} -- not implemented yet`);

})();
