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
    let urlSuffix = '';
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      console.log('GitHub API key found.');
      urlSuffix = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;
    }

    for (const user in db.users) {
      await fetchUser(user);
      await fetchUserOrgs(user);
      await fetchUserContribs(user);
    }

    for (const repo in db.repos) {
      await fetchRepo(repo);
    }

    for (const user in db.users) {
      // must be done after fetchRepo() so that we are able to ignore repos without stars:
      await fetchUserContribsOrgs(user);
    }

    async function fetchUser(user) {
      const ghUserUrl = `https://api.github.com/users/${user}`;
      const githubSpinner = ora(`Fetching ${ghUserUrl}...`).start();
      const ghData = await fetch(`${ghUserUrl}${urlSuffix}`);
      const ghDataJson = await ghData.json();
      githubSpinner.succeed(`Fetched ${ghUserUrl}`);

      db.users[user] = {...db.users[user], ...ghDataJson};
      db.users[user].contribs = db.users[user].contribs || {
        fetched_at: '2000-01-01',
        repos: {}
      };
      writeToDb();
    }

    async function fetchUserOrgs(user) {
      const orgsUrl = db.users[user].organizations_url;
      const orgsSpinner = ora(`Fetching ${orgsUrl}...`).start();
      const orgsData = await fetch(`${orgsUrl}${urlSuffix}`);
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
      for (const repo of repos) {
        db.users[user].contribs.repos[repo] = db.users[user].contribs.repos[repo] || {};
      }
      const today = githubContribs.dateToString(new Date());
      db.users[user].contribs.fetched_at = today;

      db.repos = db.repos || {};
      for (const repo in db.users[user].contribs.repos) {
        db.repos[repo] = db.repos[repo] || {};
      }

      writeToDb();
    }

    async function fetchRepo(repo) {
      const ghRepoUrl = `https://api.github.com/repos/${repo}`;
      const githubSpinner = ora(`Fetching ${ghRepoUrl}...`).start();
      const ghData = await fetch(`${ghRepoUrl}${urlSuffix}`);
      const ghDataJson = await ghData.json();
      githubSpinner.succeed(`Fetched ${ghRepoUrl}`);

      db.repos[repo] = ghDataJson;
      writeToDb();
    }

    async function fetchUserContribsOrgs(user) {
      const orgsSpinner = ora(
        `For each contribution of ${user}, checking if the repo belongs to an org...`).start();

      // Get rid of all contribs to repos without stars:
      const contribsToRemove = [];
      for (const repo in db.users[user].contribs.repos) {
        if (!db.repos[repo].stargazers_count) {
          contribsToRemove.push(repo);
        }
      }
      for (const repo of contribsToRemove) {
        delete db.users[user].contribs.repos[repo];
      }

      const usersAndOrgs = new Set([]);
      for (const repo in db.users[user].contribs.repos) {
        const userOrOrg = repo.split('/')[0];
        usersAndOrgs.add(userOrOrg);
      }

      db.users[user].contribs.organizations = [];
      for (const userOrOrg of usersAndOrgs) {
        let isOrg = false;
        if (!(userOrOrg in db.users)) { // otherwise it's a user that we know already
          if (userOrOrg in db.orgs) {
            isOrg = true; // it's an org that we know already
          } else {
            // it might be an org that we don't know yet
            const orgsData = await fetch(`https://api.github.com/orgs/${userOrOrg}${urlSuffix}`);
            const orgsDataJson = await orgsData.json();
            if (orgsDataJson.login) {
              // it's an org that we didn't know yet
              isOrg = true;
              db.orgs[orgsDataJson.login] = orgsDataJson;
            }
          }
        }

        if (isOrg) {
          db.users[user].contribs.organizations.push(userOrOrg);
        }
      }

      orgsSpinner.succeed(`Checked all contribution' orgs of ${user}`);

      writeToDb();
    }
  }

  function writeToDb() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');
  };

})();
