#!/usr/bin/env node
'use strict';

(async () => {

  const fetch = require('fetch-retry');
  const fs = require('fs');
  const githubColors = require('github-colors');
  const githubContribs = require('@ghuser/github-contribs');
  const ora = require('ora');
  const assert = require('assert');
  const url = require('url');

  const db = require('./impl/db');

  process.on('unhandledRejection', (e, p) => { // https://stackoverflow.com/a/44752070/1855917
    console.error(p);
    throw e;
  });

  await fetchUsers();
  return;

  async function fetchUsers() {
    const authify = (() => {
      let query = '';
      let auth = '';
      if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        console.log('GitHub API key found.');
        query = `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;
      }
      if (process.env.GITHUB_USERNAME && process.env.GITHUB_PASSWORD) {
        console.log('GitHub credentials found.');
        auth = `${process.env.GITHUB_USERNAME}:${process.env.GITHUB_PASSWORD}`;
      }

      return addr => {
        const result = url.parse(addr);
        result.auth = auth;
        if (query) {
          result.search = result.search && `${result.search}&${query}` || `?${query}`;
        }
        return url.format(result);
      };
    })();

    const now = new Date;
    let spinner;

    let numUsers = 0;
    for (const userId in db.users) {
      assert(userId.toLowerCase()===userId);
      if (!db.users[userId].ghuser_deleted_because) {
        ++numUsers;
        await fetchUser(userId);
        await fetchUserOrgs(userId);
        await fetchUserContribs(userId);
        await fetchUserPopularForks(userId);
      }
    }
    stripUnreferencedOrgs();

    stripUnreferencedRepos();
    for (const repo in db.repos) {
      await fetchRepo(repo);
    }
    stripUnsuccessfulOrEmptyRepos();

    for (const repo in db.repos) {
      await fetchRepoContributors(repo);
    }

    for (const userId in db.users) {
      if (!db.users[userId].ghuser_deleted_because) {
        calculateUserContribsScores(userId);
        stripInsignificantUserContribs(userId);
        await fetchUserContribsOrgs(userId);
      }
    }

    for (const repo in db.repos) {
      await fetchRepoLanguages(repo);
      await fetchRepoSettings(repo);
      markRepoAsFullyFetched(repo);
    }

    const elapsedMs = new Date - now;
    console.log(`Ran in ${Math.round(elapsedMs / (60 * 1000))} minutes.`);
    console.log(`${numUsers} users`);
    console.log(`DB size: ${db.sizeKB()} KB`);
    console.log(`=> ${Math.round(elapsedMs / (60 * 1000) / numUsers)} minutes/user`);
    console.log(`=> ${Math.round(db.sizeKB() / numUsers)} KB/user`);

    return;

    async function fetchUser(userId) {
      const userLogin = db.users[userId].login;
      const ghUserUrl = `https://api.github.com/users/${userLogin}`;
      spinner = ora(`Fetching ${ghUserUrl}...`).start();
      const ghDataJson = await fetchJson(authify(ghUserUrl));
      spinner.succeed(`Fetched ${ghUserUrl}`);

      db.users[userId] = {...db.users[userId], ...ghDataJson};
      db.users[userId].contribs = db.users[userId].contribs || {
        fetched_at: '2000-01-01T00:00:00.000Z',
        repos: {}
      };

      // Keep the DB small:
      for (const field of ["id", "node_id", "gravatar_id", "followers_url", "following_url",
                           "gists_url", "starred_url", "subscriptions_url", "events_url",
                           "received_events_url", "site_admin", "hireable", "public_repos",
                           "public_gists", "followers", "following", "private_gists",
                           "total_private_repos","owned_private_repos", "disk_usage",
                           "collaborators", "two_factor_authentication", "plan", "url"]) {
        delete db.users[userId][field];
      }

      db.write();
    }

    async function fetchUserOrgs(userId) {
      const orgsUrl = db.users[userId].organizations_url;
      spinner = ora(`Fetching ${orgsUrl}...`).start();
      const orgsDataJson = await fetchJson(authify(orgsUrl));
      spinner.succeed(`Fetched ${orgsUrl}`);

      db.users[userId].organizations = [];
      db.orgs = db.orgs || {};
      for (const org of orgsDataJson) {
        db.users[userId].organizations.push(org.login);
        db.orgs[org.login] = {...db.orgs[org.login], ...filterOrgInPlace(org)};
      }

      db.write();
    }

    async function fetchUserContribs(userId) {
      // GitHub users might push today a commit authored for example yesterday, so to be on the safe
      // side we always re-fetch at least the contributions of the last few days before the last
      // time we fetched:
      let since = githubContribs.stringToDate(db.users[userId].contribs.fetched_at);
      for (let i = 0; i < 7; ++i) {
        since = githubContribs.prevDay(since);
      }
      since = githubContribs.dateToString(since);

      const userLogin = db.users[userId].login;
      const repos = await githubContribs.fetch(userLogin, since, null, ora);
      for (const repo of repos) {
        db.users[userId].contribs.repos[repo] = db.users[userId].contribs.repos[repo] || {
          full_name: repo
        };
      }
      db.users[userId].contribs.fetched_at = now.toISOString();

      db.repos = db.repos || {};
      for (const repo in db.users[userId].contribs.repos) {
        db.repos[repo] = db.repos[repo] || {};
      }

      db.write();
    }

    async function fetchUserPopularForks(userId) {
      // fetchUserContribs() won't find forks as they are not considered to be contributions. But
      // the user might well have popular forks.

      spinner = ora(`Fetching ${userId}'s popular forks...`).start();

      const perPage = 100;
      for (let page = 1; page <= 5; ++page) {
        const ghUrl = `${db.users[userId].repos_url}?page=${page}&per_page=${perPage}`;
        const ghDataJson = await fetchJson(authify(ghUrl));

        for (const repo of ghDataJson) {
          if (repo.fork && repo.stargazers_count >= 1) {
            db.users[userId].contribs.repos[repo.full_name] = db.users[userId].contribs.repos[repo.full_name] || {
              full_name: repo.full_name
            };
            db.repos[repo.full_name] = db.repos[repo.full_name] || {};
          }
        }

        if (ghDataJson.length < perPage) {
          break;
        }
      }

      spinner.succeed(`Fetched ${userId}'s popular forks`);
      db.write();
    }

    function stripUnreferencedOrgs() {
      // Deletes orgs that are not referenced by any user.

      const referencedOrgs = new Set([]);
      for (const userId in db.users) {
        if (!db.users[userId].ghuser_deleted_because) {
          for (const org of db.users[userId].organizations) {
            referencedOrgs.add(org);
          }
          if (db.users[userId].contribs.organizations) {
            for (const org of db.users[userId].contribs.organizations) {
              referencedOrgs.add(org);
            }
          }
        }
      }

      const toBeDeleted = [];
      for (const org in db.orgs) {
        if (!referencedOrgs.has(org)) {
          toBeDeleted.push(org);
        }
      }
      for (const org of toBeDeleted) {
        delete db.orgs[org];
      }

      db.write();
    }

    function stripUnreferencedRepos() {
      // Deletes repos that are not referenced by any user's contribution.

      const referencedRepos = new Set([]);
      for (const userId in db.users) {
        if (!db.users[userId].ghuser_deleted_because) {
          for (const repo in db.users[userId].contribs.repos) {
            referencedRepos.add(repo);
          }
        }
      }

      const toBeDeleted = [];
      for (const repo in db.repos) {
        if (!referencedRepos.has(repo)) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete db.repos[repo];
      }

      db.write();
    }

    async function fetchRepo(repo) {
      const ghRepoUrl = `https://api.github.com/repos/${repo}`;
      spinner = ora(`Fetching ${ghRepoUrl}...`).start();

      const maxAgeHours = 6;
      if (db.repos[repo].fetching ||
          now - Date.parse(db.repos[repo].fetched_at) < maxAgeHours * 60 * 60 * 1000) {
        spinner.succeed(`${repo} is still fresh`);
        return;
      }

      const ghDataJson = await fetchJson(authify(ghRepoUrl), [404]);
      if (ghDataJson == 404) {
        db.repos[repo].removed_from_github = true;
        spinner.succeed(`${repo} was removed from GitHub`);
        db.write();
        return;
      }
      db.repos[repo].fetching = true;

      spinner.succeed(`Fetched ${ghRepoUrl}`);

      ghDataJson.owner = ghDataJson.owner.login;
      db.repos[repo] = {...db.repos[repo], ...ghDataJson};

      // Keep the DB small:
      for (const field of [
        "node_id", "keys_url", "collaborators_url", "teams_url", "hooks_url", "issue_events_url",
        "events_url", "assignees_url", "branches_url", "tags_url", "blobs_url", "git_tags_url",
        "git_refs_url", "trees_url", "statuses_url", "contributors_url", "subscribers_url",
        "subscription_url", "commits_url", "git_commits_url", "comments_url", "issue_comment_url",
        "contents_url", "compare_url", "merges_url", "archive_url", "downloads_url", "issues_url",
        "pulls_url", "milestones_url", "notifications_url", "labels_url", "releases_url",
        "deployments_url", "ssh_url", "git_url", "clone_url", "svn_url", "has_issues",
        "has_projects", "has_downloads", "has_wiki", "has_pages", "id", "forks_url", "permissions",
        "allow_squash_merge", "allow_merge_commit", "allow_rebase_merge", "stargazers_url",
        "watchers_count", "forks_count", "open_issues_count", "forks", "open_issues", "watchers",
        "parent", "source", "network_count", "subscribers_count"]) {
        delete db.repos[repo][field];
      }

      db.write();
    }

    function markRepoAsFullyFetched(repo) {
      if (db.repos[repo].fetching) {
        db.repos[repo].fetched_at = now.toISOString();
        delete db.repos[repo].fetching;
        db.write();
      }
    }

    function stripUnsuccessfulOrEmptyRepos() {
      // Deletes repos with no stars or no commits.

      const toBeDeleted = [];
      for (const repo in db.repos) {
        if (db.repos[repo].removed_from_github || db.repos[repo].stargazers_count < 1 ||
            db.repos[repo].size === 0) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete db.repos[repo];
      }

      db.write();
    }

    async function fetchRepoLanguages(repo) {
      const ghUrl = `https://api.github.com/repos/${repo}/languages`;
      spinner = ora(`Fetching ${ghUrl}...`).start();

      if (!db.repos[repo].fetching ||
          db.repos[repo].fetched_at &&
          new Date(db.repos[repo].fetched_at) > new Date(db.repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      const ghDataJson = await fetchJson(authify(ghUrl));
      spinner.succeed(`Fetched ${ghUrl}`);

      for (let language in ghDataJson) {
        ghDataJson[language] = {
          bytes: ghDataJson[language],
          color: githubColors.get(language, true).color
        };
      }

      db.repos[repo].languages = ghDataJson;
      db.write();
    }

    async function fetchRepoSettings(repo) {
      const url = `https://rawgit.com/${repo}/master/.ghuser.io.json`;
      spinner = ora(`Fetching ${repo}'s settings...`).start();

      if (!db.repos[repo].fetching ||
          db.repos[repo].fetched_at &&
          new Date(db.repos[repo].fetched_at) > new Date(db.repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      const dataJson = await fetchJson(url, [404]);
      if (dataJson == 404) {
        spinner.succeed(`${repo} has no settings`);
        return;
      }
      spinner.succeed(`Fetched ${repo}'s settings`);

      db.repos[repo].settings = dataJson;
      db.write();
    }

    async function fetchRepoContributors(repo) {
      db.repos[repo].contributors = db.repos[repo].contributors || {};
      spinner = ora(`Fetching ${repo}'s contributors...`).start();

      if (!db.repos[repo].fetching ||
          db.repos[repo].fetched_at &&
          new Date(db.repos[repo].fetched_at) > new Date(db.repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      // This endpoint only gives us the 100 greatest contributors, so if it looks like there
      // can be more, we use the next endpoint to get the 500 greatest ones:
      let firstMethodFailed = false;
      if (Object.keys(db.repos[repo].contributors).length < 100) {
        const ghUrl = `https://api.github.com/repos/${repo}/stats/contributors`;

        let ghDataJson;
        for (let i = 3; i >= 0; --i) {
          ghDataJson = await fetchJson(authify(ghUrl));

          if (ghDataJson && Object.keys(ghDataJson).length > 0) {
            break; // worked
          }

          // GitHub is still calculating the stats and we need to wait a bit and try again, see
          // https://developer.github.com/v3/repos/statistics/

          if (!i) {
            // Too many retries. This happens on brand new repos.
            firstMethodFailed = true;
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 3000));
        }

        if (!firstMethodFailed) {
          for (const contributor of ghDataJson) {
            db.repos[repo].contributors[contributor.author.login] = contributor.total;
          }
        }
      }

      if (firstMethodFailed || Object.keys(db.repos[repo].contributors).length >= 100) {
        const perPage = 100;
        for (let page = 1; page <= 5; ++page) {
          const ghUrl = `https://api.github.com/repos/${repo}/contributors?page=${page}&per_page=${perPage}`;
          const ghDataJson = await fetchJson(authify(ghUrl));
          for (const contributor of ghDataJson) {
            db.repos[repo].contributors[contributor.login] = contributor.contributions;
          }

          if (ghDataJson.length < perPage) {
            break;
          }
        }
      }

      if (Object.keys(db.repos[repo].contributors).length >= 500) {
        // We could use https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
        // in order to fetch more than 500 contributors.
        spinner.fail();
        throw 'Not implemented yet';
      }

      spinner.succeed(`Fetched ${repo}'s contributors`);
      db.write();
    }

    async function fetchUserContribsOrgs(userId) {
      spinner = ora(
        `For each contribution of ${userId}, checking if the repo belongs to an org...`).start();

      const usersAndOrgs = getUserContribsOwners(userId);
      db.users[userId].contribs.organizations = [];
      for (const userOrOrg of usersAndOrgs) {
        let isOrg = false;
        if (!(userOrOrg in db.users)) { // otherwise it's a user that we know already
          if (userOrOrg in db.orgs) {
            isOrg = true; // it's an org that we know already
          } else {
            // it might be an org that we don't know yet
            const orgsDataJson =
                    await fetchJson(authify(`https://api.github.com/orgs/${userOrOrg}`), [404]);
            if (orgsDataJson != 404) {
              // it's an org that we didn't know yet
              isOrg = true;
              db.orgs[orgsDataJson.login] = filterOrgInPlace(orgsDataJson);
            }
          }
        }

        if (isOrg) {
          db.users[userId].contribs.organizations.push(userOrOrg);
        }
      }

      spinner.succeed(`Checked all contribution' orgs of ${userId}`);
      db.write();

      return;

      function getUserContribsOwners(userId) {
        const usersAndOrgs = new Set([]);
        for (const repo in db.users[userId].contribs.repos) {
          const userOrOrg = repo.split('/')[0];
          usersAndOrgs.add(userOrOrg);
        }
        return usersAndOrgs;
      }
    }

    function filterOrgInPlace(org) { // to keep the DB small
      delete org.id;
      delete org.node_id;
      delete org.events_url;
      delete org.hooks_url;
      delete org.issues_url;
      delete org.repos_url;
      delete org.members_url;
      delete org.public_members_url;
      delete org.description;
      delete org.company;
      delete org.blog;
      delete org.location;
      delete org.email;
      delete org.has_organization_projects;
      delete org.has_repository_projects;
      delete org.public_repos;
      delete org.public_gists;
      delete org.followers;
      delete org.following;
      return org;
    }

    function calculateUserContribsScores(userId) {
      const userLogin = db.users[userId].login;

      spinner = ora(`Calculating scores for ${userLogin}...`).start();

      for (const repo in db.users[userId].contribs.repos) {
        if (!db.repos[repo]) {
          continue; // repo has been stripped
        }

        const score = db.users[userId].contribs.repos[repo];
        score.popularity = logarithmicScoreAscending(1, 10000, db.repos[repo].stargazers_count);

        let totalContribs = 0;
        for (const contributor in db.repos[repo].contributors) {
          totalContribs += db.repos[repo].contributors[contributor];
        }

        score.percentage = db.repos[repo].contributors[userLogin] &&
                           100 * db.repos[repo].contributors[userLogin] / totalContribs || 0;
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

      spinner.succeed(`Calculated scores for ${userLogin}`);
      db.write();
      return;

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

    function stripInsignificantUserContribs(userId) {
      // Deletes contributions to forks if the user has done 0%.

      const toBeDeleted = [];
      for (const repo in db.users[userId].contribs.repos) {
        const score = db.users[userId].contribs.repos[repo];
        if (db.repos[repo] && db.repos[repo].fork && score.percentage === 0) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete db.users[userId].contribs.repos[repo];
      }

      db.write();
    }

    async function fetchJson(url, acceptedErrorCodes=[]) {
      // If the HTTP status code is 2xx, returns the object represented by the fetched json.
      // Else if the HTTP status code is in acceptedErrorCodes, returns it.
      // Else throws the HTTP status code.

      const data = await fetch(url);
      const statusIsOk = Math.floor(data.status / 100) === 2;
      if (!statusIsOk && acceptedErrorCodes.indexOf(data.status) > -1) {
        return data.status;
      }

      try {
        var dataJson = await data.json();
      } catch (e) {}

      if (!statusIsOk) {
        spinner.fail();
        if (dataJson) {
          console.error(dataJson);
        }
        for (const envvar of ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_USERNAME',
                              'GITHUB_PASSWORD']) {
          if (!process.env[envvar]) {
            console.log(`Consider setting the environment variable ${envvar}.`);
            break;
          }
        }
        throw data.status;
      }

      return dataJson;
    }
  }

})();
