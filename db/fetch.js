#!/usr/bin/env node
'use strict';

(async () => {

  const fetch = require('fetch-retry');
  const fs = require('fs');
  const githubContribs = require('@ghuser/github-contribs');
  const ora = require('ora');

  const dbPath = './db.json';
  const db = require(dbPath);

  // See https://stackoverflow.com/a/28431880/1855917
  const dateToString = date => {
    return date.toISOString().substring(0, 10);
  };
  const today = dateToString(new Date());

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
    const repos = await githubContribs(user, db.users[user].contribs.fetched_at, null, ora);
    db.users[user].contribs.repos = [
      ...new Set([...db.users[user].contribs.repos, ...repos])
    ].sort();
    db.users[user].contribs.fetched_at = today;

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');
  }

})();
