#!/usr/bin/env node
'use strict';

(async () => {

  const fetch = require('fetch-retry');
  const fs = require('fs');
  const githubContribs = require('@ghuser/github-contribs');
  const ora = require('ora');

  const dbPath = './db.json';
  const db = require(dbPath);

  const today = githubContribs.dateToString(new Date());

  for (const user in db.users) {
    console.log(`Fetching ${user}...`);

    const githubSpinner = ora(`Fetching api.github.com/users/${user}...`).start();
    const ghData = await fetch(`https://api.github.com/users/${user}`);
    const ghDataJson = await ghData.json();
    db.users[user] = {...db.users[user], ...ghDataJson};
    githubSpinner.succeed(`Fetched api.github.com/users/${user}`);

    if (!db.users[user].contribs) {
      db.users[user].contribs = {
        fetched_at: '2000-01-01',
        repos: []
      };
    }

    // GitHub users might push today a commit authored for example yesterday, so to be on the safe
    // side we always re-fetch at least the contributions of the last few days:
    let since = db.users[user].contribs.fetched_at;
    for (let i = 0; i < 7; ++i) {
      since = githubContribs.dateToString(
        githubContribs.prevDay(githubContribs.stringToDate(since))
      );
    }

    const repos = await githubContribs.fetch(user, since, null, ora);
    db.users[user].contribs.repos = [
      ...new Set([...db.users[user].contribs.repos, ...repos])
    ].sort();
    db.users[user].contribs.fetched_at = today;

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');
  }

})();
