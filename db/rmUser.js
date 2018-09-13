#!/usr/bin/env node
'use strict';

(() => {

  const meow = require('meow');
  const DbFile = require('./impl/dbFile');

  const cli = meow(`
usage:
  $ ./rmUser.js USER REASON [--force]
  $ ./rmUser.js --help
  $ ./rmUser.js --version

positional arguments:
  USER        GitHub username, e.g. AurelienLourot
  REASON      Will be concatenated to a string ending with "because ", e.g.
              "you asked us to remove your profile in https://github.com/ghuser-io/ghuser.io/issues/666"

optional arguments:
  --force     If the user is marked as not to be deleted, delete anyway
`, {
    boolean: [
      'force',
    ],
  });

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
  const userFile = new DbFile(`data/users/${userId}.json`);

  if (!cli.flags.force && userFile.ghuser_keep_because) {
    throw `${user} is marked as not to be deleted: ${userFile.ghuser_keep_because}`;
  }

  userFile.deleteAllPropsBut(['login']);
  userFile.login = userFile.login || user;
  userFile.ghuser_deleted_because = reason;
  userFile.write();
  console.log(`${user} marked as deleted. You should now run ./fetchAndCalculateAll.sh`);

})();
