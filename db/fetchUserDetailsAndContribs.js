#!/usr/bin/env node
'use strict';

(async () => {

  const githubContribs = require('@ghuser/github-contribs');
  const meow = require('meow');
  const ora = require('ora');

  const DbFile = require('./impl/dbFile');
  const fetchJson = require('./impl/fetchJson');
  const github = require('./impl/github');
  const scriptUtils = require('./impl/scriptUtils');

  const cli = meow(`
usage:
  $ ./fetchUserDetailsAndContribs.js USER
  $ ./fetchUserDetailsAndContribs.js --help
  $ ./fetchUserDetailsAndContribs.js --version

positional arguments:
  USER        GitHub username, e.g. AurelienLourot
`);

  if (cli.input.length < 1) {
    console.error('Error: USER argument missing. See `./fetchUserDetailsAndContribs.js --help`.');
    process.exit(1);
  }

  if (cli.input.length > 1) {
    console.error('Error: too many positional arguments. See `./fetchUserDetailsAndContribs.js --help`.');
    process.exit(1);
  }

  const user = cli.input[0];

  scriptUtils.printUnhandledRejections();

  await fetchUserDetailsAndContribs(user);
  return;

  async function fetchUserDetailsAndContribs(user) {
    let spinner;

    const userId = user.toLowerCase();
    const userFilePath = `data/users/${userId}.json`;
    const userFile = new DbFile(userFilePath);
    if (!userFile.login) {
      throw `${userFilePath} is malformed. Did you run ./addUser.js ?`;
    }
    if (userFile.ghuser_deleted_because) {
      console.log(`${userFile.login} has been deleted, skipping...`);
      return;
    }

    await fetchDetails();
    await fetchOrgs();
    await fetchContribs();
    await fetchPopularForks();
    await fetchSettings();
    return;

    async function fetchDetails() {
      const userLogin = userFile.login;
      const ghUserUrl = `https://api.github.com/users/${userLogin}`;
      spinner = ora(`Fetching ${ghUserUrl}...`).start();
      const ghDataJson = await github.fetchGHJson(
        ghUserUrl, spinner, [304],
        userFile.contribs && userFile.contribs.fetched_at && new Date(userFile.contribs.fetched_at)
      );
      if (ghDataJson === 304) {
        spinner.succeed(`${userLogin} didn't change`);
        return;
      }
      spinner.succeed(`Fetched ${ghUserUrl}`);

      Object.assign(userFile, ghDataJson);

      // Keep the DB small:
      for (const field of ["id", "node_id", "gravatar_id", "followers_url", "following_url",
                           "gists_url", "starred_url", "subscriptions_url", "events_url",
                           "received_events_url", "site_admin", "hireable", "public_repos",
                           "followers", "following", "private_gists", "total_private_repos",
                           "owned_private_repos", "disk_usage", "collaborators",
                           "two_factor_authentication", "plan", "url"]) {
        delete userFile[field];
      }

      userFile.write();
    }

    async function fetchOrgs() {
      const orgsUrl = userFile.organizations_url;
      spinner = ora(`Fetching ${orgsUrl}...`).start();
      const orgsDataJson = await github.fetchGHJson(orgsUrl, spinner);
      spinner.succeed(`Fetched ${orgsUrl}`);

      userFile.organizations = [];
      for (const org of orgsDataJson) {
        userFile.organizations.push(org.login);
      }

      userFile.write();
    }

    async function fetchContribs() {
      userFile.contribs = userFile.contribs || {
        fetched_at: '2000-01-01T00:00:00.000Z',
        repos: []
      };

      // GitHub users might push today a commit authored for example yesterday, so to be on the safe
      // side we always re-fetch at least the contributions of the last few days before the last
      // time we fetched:
      let since = githubContribs.stringToDate(userFile.contribs.fetched_at);
      for (let i = 0; i < 7; ++i) {
        since = githubContribs.prevDay(since);
      }
      since = githubContribs.dateToString(since);

      const now = new Date;
      const repos = await githubContribs.fetch(userFile.login, since, null, ora);
      for (const repo of repos) {
        if (userFile.contribs.repos.indexOf(repo) === -1) {
          userFile.contribs.repos.push(repo);
        }
      }
      userFile.contribs.fetched_at = now.toISOString();

      userFile.write();
    }

    async function fetchPopularForks() {
      // fetchUserContribs() won't find forks as they are not considered to be contributions. But
      // the user might well have popular forks.

      spinner = ora(`Fetching ${user}'s popular forks...`).start();

      const perPage = 100;
      for (let page = 1; page <= 5; ++page) {
        const ghUrl = `${userFile.repos_url}?page=${page}&per_page=${perPage}`;
        const ghDataJson = await github.fetchGHJson(ghUrl, spinner);

        for (const repo of ghDataJson) {
          if (repo.fork && repo.stargazers_count >= 1 &&
              userFile.contribs.repos.indexOf(repo.full_name) === -1) {
            userFile.contribs.repos.push(repo.full_name);
          }
        }

        if (ghDataJson.length < perPage) {
          break;
        }
      }

      spinner.succeed(`Fetched ${user}'s popular forks`);
      userFile.write();
    }

    async function fetchSettings() {
      const url = `https://rawgit.com/${user}/ghuser.io.settings/master/ghuser.io.json`;
      spinner = ora(`Fetching ${user}'s settings...`).start();

      const dataJson = await fetchJson(url, spinner, [404]);
      if (dataJson == 404) {
        spinner.succeed(`${user} has no settings`);
        return;
      }
      spinner.succeed(`Fetched ${user}'s settings`);

      userFile.settings = dataJson;
      userFile.write();
    }
  }

})();
