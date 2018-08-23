#!/usr/bin/env node
'use strict';

(async () => {

  const fs = require('fs');
  const meow = require('meow');
  const ora = require('ora');

  const DbFile = require('./impl/dbFile');
  const fetchJson = require('./impl/fetchJson');
  const github = require('./impl/github');
  const scriptUtils = require('./impl/scriptUtils');

  const rateLimitFilePath = 'data/rate_limit.json';
  const cli = meow(`
usage:
  $ ./measureApiRate.js CMD
  $ ./measureApiRate.js --help
  $ ./measureApiRate.js --version

positional arguments:
  CMD        Either 'start' or 'stop'

available commands:
  start      Fetch /rate_limit from GitHub and dump it to ${rateLimitFilePath}
  stop       Fetch /rate_limit from GitHub, compare it to ${rateLimitFilePath} and delete this file
`);

  if (cli.input.length < 1) {
    console.error('Error: CMD argument missing. See `./measureApiRate.js --help`.');
    process.exit(1);
  }

  if (cli.input.length > 1) {
    console.error('Error: too many positional arguments. See `./measureApiRate.js --help`.');
    process.exit(1);
  }

  const cmd = cli.input[0];

  scriptUtils.printUnhandledRejections();

  const rateLimitFile = new DbFile(rateLimitFilePath);

  switch (cmd) {
  case 'start':
    {
      rateLimitFile._comment = 'DO NOT EDIT MANUALLY - See ../measureApiRate.js';
      const rateLimit = await fetchRateLimit();
      Object.assign(rateLimitFile, rateLimit);
      rateLimitFile.write();
      break;
    }
  case 'stop':
    {
      if (!rateLimitFile.rate) {
        console.error(
          `Error: ${rateLimitFilePath} malformed. Did you run './measureApiRate.js start'?`
        );
        process.exit(1);
      }
      const rateLimit = await fetchRateLimit();
      if (rateLimit.rate.reset !== rateLimitFile.rate.reset) {
        console.log("GitHub's rate limit got reset in between.");
      } else {
        const numApiCalls = rateLimitFile.rate.remaining - rateLimit.rate.remaining;
        console.log(`${numApiCalls} GitHub API calls were made.`);
      }
      fs.unlinkSync(rateLimitFilePath);
      break;
    }
  default:
    {
      console.error(`Error: unknown command '${cmd}'.`);
      process.exit(1);
    }
  }
  return;

  async function fetchRateLimit() {
    let spinner;
    const ghUrl = `https://api.github.com/rate_limit`;
    spinner = ora(`Fetching ${ghUrl}...`).start();
    const ghDataJson = await fetchJson(github.authify(ghUrl), spinner);
    spinner.succeed(`Fetched ${ghUrl}`);
    return ghDataJson;
  }

})();
