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

    const now = new Date;

    for (const user in db.users) {
      await fetchUser(user);
      await fetchUserOrgs(user);
      await fetchUserContribs(user);
    }

    for (const repo in db.repos) {
      await fetchRepo(repo);
      await fetchRepoSettings(repo);
      await fetchRepoContributors(repo);
    }

    for (const user in db.users) {
      // must be done after fetchRepo() so that we are able to ignore repos without stars:
      await fetchUserContribsOrgs(user);

      calculateUserContribsScores(user);
    }

    console.log(`Ran in ${Math.round((new Date - now) / (60 * 1000))} minutes.`);
    console.log(`DB size: ${dbSizeKB()} KB`);

    return;

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
        db.orgs[org.login] = {...db.orgs[org.login], ...filterOrgInPlace(org)};
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
        db.users[user].contribs.repos[repo] = db.users[user].contribs.repos[repo] || {
          full_name: repo
        };
      }
      const today = githubContribs.dateToString(now);
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

      // Keep the DB small:
      ghDataJson.owner = ghDataJson.owner.login;
      for (const field of ["node_id", "keys_url", "collaborators_url", "teams_url", "hooks_url",
                           "issue_events_url", "events_url", "assignees_url", "branches_url",
                           "tags_url", "blobs_url", "git_tags_url", "git_refs_url", "trees_url",
                           "statuses_url", "contributors_url", "subscribers_url",
                           "subscription_url", "commits_url", "git_commits_url", "comments_url",
                           "issue_comment_url", "contents_url", "compare_url", "merges_url",
                           "archive_url", "downloads_url", "issues_url", "pulls_url",
                           "milestones_url", "notifications_url", "labels_url", "releases_url",
                           "deployments_url", "ssh_url", "git_url", "clone_url", "svn_url",
                           "has_issues", "has_projects", "has_downloads", "has_wiki",
                           "has_pages"]) {
        delete ghDataJson[field];
      }

      db.repos[repo] = {...db.repos[repo], ...ghDataJson};

      writeToDb();
    }

    async function fetchRepoSettings(repo) {
      const url = `https://rawgit.com/${repo}/master/.ghuser.io.json`;
      const spinner = ora(`Fetching ${repo}'s settings...`).start();
      const data = await fetch(`${url}`);
      if (data.status == 404) {
        spinner.succeed(`No settings found for ${repo}`);
        return;
      }
      const dataJson = await data.json();
      spinner.succeed(`Fetched ${repo}'s settings`);

      db.repos[repo].settings = dataJson;
      writeToDb();
    }

    async function fetchRepoContributors(repo) {
      const ghUrl = `https://api.github.com/repos/${repo}/stats/contributors`;
      const githubSpinner = ora(`Fetching ${ghUrl}...`).start();

      let ghDataJson;
      for (let i = 3; i >= 0; --i) {
        const ghData = await fetch(`${ghUrl}${urlSuffix}`);
        ghDataJson = await ghData.json();

        if (!Object.keys(ghDataJson).length) {
          // GitHub is still calculating the stats and we need to wait a bit and try again, see
          // https://developer.github.com/v3/repos/statistics/

          if (!i) { // enough retries
            const error = `Failed to fetch https://api.github.com/repos/${repo}/stats/contributors`;
            githubSpinner.fail(error);
            throw error;
          }

          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      githubSpinner.succeed(`Fetched ${ghUrl}`);

      db.repos[repo].contributors = ghDataJson;

      // Keep the DB small:
      for (const contributor of db.repos[repo].contributors) {
        delete contributor.weeks;
        contributor.author = contributor.author.login;
      }

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
              db.orgs[orgsDataJson.login] = filterOrgInPlace(orgsDataJson);
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

    function filterOrgInPlace(org) { // to keep the DB small
      delete org.id;
      delete org.node_id;
      delete org.events_url;
      delete org.hooks_url;
      delete org.issues_url;
      return org;
    }

    function calculateUserContribsScores(user) {
      const spinner = ora(`Calculating scores for ${user}...`).start();

      for (const repo in db.users[user].contribs.repos) {
        const score = db.users[user].contribs.repos[repo];
        score.popularity = logarithmicScoreAscending(1, 10000, db.repos[repo].stargazers_count);

        let totalContribs = 0;
        let userContribs = 0;
        for (const contributor of db.repos[repo].contributors) {
          totalContribs += contributor.total;
          if (contributor.author == user) {
            userContribs = contributor.total;
          }
        }
        score.percentage = 100 * userContribs / totalContribs;
        score.maturity = logarithmicScoreAscending(40, 10000, totalContribs);
        score.total_commits_count = totalContribs;

        const daysOfInactivity =
                (now - Date.parse(db.repos[repo].pushed_at)) / (24 * 60 * 60 * 1000);
        score.activity = logarithmicScoreDescending(3650, 30, daysOfInactivity);

        // When tweaking the total score, validate that:
        // * for brillout:
        //   * devarchy/website is higher than facebook/react
        //   * brillout/awesome-frontend-libraries is higher than facebook/react
        //   * brillout/frontend-catalogs is higher than facebook/react
        //   * brillout/reprop is higher than facebook/react

        score.total_score =
          (3 + score.percentage * 13 / 100) * score.popularity + 2 * score.maturity + score.activity;
        score.total_score_human_formula = "(3 + percentage * 13) * popularity + 2 * maturity + activity";
        score.max_total_score = 95;
      }

      spinner.succeed(`Calculated scores for ${user}`);
      writeToDb();

      function logarithmicScoreAscending(valFor0, valFor5, val) {
        // For example with valFor0=1, valFor5=100000, val being the number of stars on a
        // project and the result being the project popularity:
        //      1 star  => popularity=0
        //     10 stars => popularity=1
        //    100 stars => popularity=2
        //   1000 stars => popularity=3
        //  10000 stars => popularity=4
        // 100000 stars => popularity=5

        let logInput = (val - valFor0) * 99999 / (valFor5 - valFor0) + 1;
        logInput = Math.max(1, logInput);
        logInput = Math.min(100000, logInput);
        return Math.log10(logInput);
      }

      function logarithmicScoreDescending(valFor0, valFor5, val) {
        return 5 - logarithmicScoreAscending(valFor5, valFor0, val);
      }
    }
  }

  function writeToDb() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');
  };

  function dbSizeKB() {
    return Math.round(fs.statSync(dbPath).size / 1024);
  };

})();
