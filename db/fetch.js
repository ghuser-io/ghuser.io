#!/usr/bin/env node
'use strict';

(async () => {

  const fetch = require('fetch-retry');
  const fs = require('fs');
  const githubContribs = require('@ghuser/github-contribs');
  const ora = require('ora');

  const dbPath = './db.json';
  const db = require(dbPath);

  await fetchUsers();

  async function fetchUsers() {
    for (const user in db.users) {
      await fetchUser(user);
      await fetchUserOrgs(user);
      await fetchUserContribs(user);
    }

    async function fetchUser(user) {
      const ghUserUrl = `https://api.github.com/users/${user}`;
      const githubSpinner = ora(`Fetching ${ghUserUrl}...`).start();
      const ghData = await fetch(ghUserUrl);
      const ghDataJson = await ghData.json();
      githubSpinner.succeed(`Fetched ${ghUserUrl}`);

      db.users[user] = {...db.users[user], ...ghDataJson};
      db.users[user].contribs = db.users[user].contribs || {
        fetched_at: '2000-01-01',
        repos: []
      };
      writeToDb();
    }

    async function fetchUserOrgs(user) {
      const orgsUrl = db.users[user].organizations_url;
      const orgsSpinner = ora(`Fetching ${orgsUrl}...`).start();
      const orgsData = await fetch(orgsUrl);
      const orgsDataJson = await orgsData.json();
      orgsSpinner.succeed(`Fetched ${orgsUrl}`);

      db.users[user].organizations = [];
      db.orgs = db.orgs || {};
      for (const org of orgsDataJson) {
        db.users[user].organizations.push(org.login);
        db.orgs[org.login] = {...db.orgs[org.login], ...org};
      }
      writeToDb();
    }

    async function fetchUserContribs(user) {
      // GitHub users might push today a commit authored for example yesterday, so to be on the safe
      // side we always re-fetch at least the contributions of the last few days before the last
      // time we fetched:
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
      const today = githubContribs.dateToString(new Date());
      db.users[user].contribs.fetched_at = today;
      writeToDb();
    }
  }

  function writeToDb() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');
  };

})();
