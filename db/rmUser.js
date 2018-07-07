#!/usr/bin/env node
'use strict';

(() => {

  const meow = require('meow');

  const db = require('./impl/db');

  const cli = meow(`
usage:
  $ ./rmUser.js USER REASON
  $ ./rmUser.js --help
  $ ./rmUser.js --version

positional arguments:
  USER        GitHub username, e.g. AurelienLourot
  REASON      Will be concatenated to a string ending with "because ", e.g.
              "you asked us to remove your profile in https://github.com/AurelienLourot/ghuser.io/issues/666"
`);

  if (cli.input.length < 2) {
    console.error('Error: USER and/or REASON arguments missing. See `./rmUser.js --help`.');
    process.exit(1);
  }

  if (cli.input.length > 2) {
    console.error('Error: too many positional arguments. See `./rmUser.js --help`.');
    process.exit(1);
  }

  const user = cli.input[0];
  const reason = cli.input[1];

  const userId = user.toLowerCase();
  db.users[userId] = {
    login: user,
    ghuser_deleted_because: reason
  };
  db.write();
  console.log(`${user} marked as deleted. You should now run ./fetch.js`);

})();
