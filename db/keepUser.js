#!/usr/bin/env node
'use strict';

(() => {

  const meow = require('meow');
  const DbFile = require('./impl/dbFile');

  const cli = meow(`
Mark a user as not to be deleted.

usage:
  $ ./keepUser.js USER REASON
  $ ./keepUser.js --help
  $ ./keepUser.js --version

positional arguments:
  USER        GitHub username, e.g. AurelienLourot
  REASON      Usually a link to an issue
`);

  if (cli.input.length < 2) {
    console.error('Error: USER and/or REASON arguments missing. See `./keepUser.js --help`.');
    process.exit(1);
  }

  if (cli.input.length > 2) {
    console.error('Error: too many positional arguments. See `./keepUser.js --help`.');
    process.exit(1);
  }

  const user = cli.input[0];
  const reason = cli.input[1];

  const userId = user.toLowerCase();
  const userFile = new DbFile(`data/users/${userId}.json`);

  if (!userFile.login) {
    throw `${user} doesn't exist`;
  }
  if (userFile.ghuser_deleted_because) {
    throw `${user} has already been deleted because ${userFile.ghuser_deleted_because}`;
  }

  userFile.ghuser_keep_because = reason;
  userFile.write();
  console.log(`${user} marked as not to be deleted.`);

})();
