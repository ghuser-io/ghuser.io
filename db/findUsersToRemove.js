#!/usr/bin/env node
'use strict';

(async () => {

  const fs = require('fs');
  const ora = require('ora');

  const DbFile = require('./impl/dbFile');
  const github = require('./impl/github');
  const scriptUtils = require('./impl/scriptUtils');

  scriptUtils.printUnhandledRejections();

  await findUsersToRemove();
  return;

  async function findUsersToRemove() {
    // The goal is to find users who meet all these criteria:
    // * have had their profiles for a while,
    // * aren't marked not to be deleted, and
    // * haven't starred the project.

    let spinner;
    const now = new Date;
    const minAgeMonths = 1;

    const users = [];
    for (const file of fs.readdirSync('data/users/')) {
      if (file.endsWith('.json')) {
        const user = new DbFile(`data/users/${file}`);
        if (!user.ghuser_deleted_because && !user.ghuser_keep_because
            && now - Date.parse(user.ghuser_created_at) > minAgeMonths * 30 * 24 * 60 * 60 * 1000) {
          users.push(user);
        }
      }
    }

    const stargazers = await fetchStargazers('ghuser-io/ghuser.io');
    const toRemove = users.map(user => user.login).filter(user => stargazers.indexOf(user) === -1);

    if (toRemove.length) {
      console.log(`
Create this issue on GitHub:

[question] Do you like your profile?

Hi :)

to make sure we're not wasting resources, I'd like to know if you'd like to keep your profile up and running:
`);
      for (const user of toRemove) {
        console.log(`* @${user}: https://ghuser.io/${user}`);
      }

      console.log("\nJust give me a quick sign and I won't bother you again. Thanks!");
    }

    return;

    async function fetchStargazers(repo) {
      const ghUrl = `https://api.github.com/repos/${repo}/stargazers`;
      spinner = ora(`Fetching ${ghUrl}...`).start();
      const ghDataJson = await github.fetchGHJson(ghUrl, spinner);
      spinner.succeed(`Fetched ${ghUrl}`);
      return ghDataJson.map(stargazer => stargazer.login);
    }
  }

})();
