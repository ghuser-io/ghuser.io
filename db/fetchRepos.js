#!/usr/bin/env node
'use strict';

(async () => {

  const fs = require('fs');
  const ora = require('ora');

  const DbFile = require('./impl/dbFile');
  const fetchJson = require('./impl/fetchJson');
  const github = require('./impl/github');
  const githubColors = require('github-colors');
  const scriptUtils = require('./impl/scriptUtils');

  scriptUtils.printUnhandledRejections();

  await fetchRepos();
  return;

  async function fetchRepos() {
    let spinner;

    const repos = new DbFile('data/repos.json');
    repos._comment = 'DO NOT EDIT MANUALLY - See ../README.md';
    repos.repos = repos.repos || {};

    const users = [];
    for (const file of fs.readdirSync('data/users/')) {
      if (file.endsWith('.json')) {
        const user = new DbFile(`data/users/${file}`);
        if (!user.ghuser_deleted_because) {
          users.push(user);
        }
      }
    }

    let referencedRepos = new Set([]);
    for (const user of users) {
      referencedRepos = new Set([...referencedRepos, ...user.contribs.repos]);
    }

    const now = new Date;
    for (const repo of referencedRepos) {
      if (!repos.repos[repo] || !repos.repos[repo].removed_from_github) {
        await fetchRepo(repo);
      }
    }

    stripUnreferencedRepos();
    stripUnsuccessfulOrEmptyRepos();

    for (const repo in repos.repos) {
      if (!repos.repos[repo].removed_from_github) {
        await fetchRepoContributors(repo);
        await fetchRepoLanguages(repo);
        await fetchRepoSettings(repo);
        markRepoAsFullyFetched(repo);
      }
    }

    return;

    async function fetchRepo(repo) {
      repos.repos[repo] = repos.repos[repo] || {};

      const ghRepoUrl = `https://api.github.com/repos/${repo}`;
      spinner = ora(`Fetching ${ghRepoUrl}...`).start();

      const maxAgeHours = 6;
      if (repos.repos[repo].fetching_since || repos.repos[repo].fetched_at &&
          now - Date.parse(repos.repos[repo].fetched_at) < maxAgeHours * 60 * 60 * 1000) {
        spinner.succeed(`${repo} is still fresh`);
        return;
      }

      const ghDataJson = await fetchJson(github.authify(ghRepoUrl), spinner, [304, 404],
                                         new Date(repos.repos[repo].fetched_at));
      switch (ghDataJson) {
      case 304:
        spinner.succeed(`${repo} didn't change`);
        return;
      case 404:
        repos.repos[repo].removed_from_github = true;
        spinner.succeed(`${repo} was removed from GitHub`);
        repos.write();
        return;
      }
      repos.repos[repo].fetching_since = now.toISOString();;

      spinner.succeed(`Fetched ${ghRepoUrl}`);

      ghDataJson.owner = ghDataJson.owner.login;
      repos.repos[repo] = {...repos.repos[repo], ...ghDataJson};

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
        delete repos.repos[repo][field];
      }

      repos.write();
    }

    function stripUnreferencedRepos() {
      // Deletes repos that are not referenced by any user's contribution.

      const toBeDeleted = [];
      for (const repo in repos.repos) {
        if (!referencedRepos.has(repo)) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete repos.repos[repo];
      }

      repos.write();
    }

    function stripUnsuccessfulOrEmptyRepos() {
      // Deletes repos with no stars or no commits.

      const toBeDeleted = [];
      for (const repo in repos.repos) {
        if (repos.repos[repo].removed_from_github || repos.repos[repo].stargazers_count < 1 ||
            repos.repos[repo].size === 0) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete repos.repos[repo];
      }

      repos.write();
    }

    async function fetchRepoContributors(repo) {
      repos.repos[repo].contributors = repos.repos[repo].contributors || {};
      spinner = ora(`Fetching ${repo}'s contributors...`).start();

      if (!repos.repos[repo].fetching_since ||
          repos.repos[repo].fetched_at &&
          new Date(repos.repos[repo].fetched_at) > new Date(repos.repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      // This endpoint only gives us the 100 greatest contributors, so if it looks like there
      // can be more, we use the next endpoint to get the 500 greatest ones:
      let firstMethodFailed = false;
      if (Object.keys(repos.repos[repo].contributors).length < 100) {
        const ghUrl = `https://api.github.com/repos/${repo}/stats/contributors`;

        let ghDataJson;
        for (let i = 3; i >= 0; --i) {
          ghDataJson = await fetchJson(github.authify(ghUrl), spinner);

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
            repos.repos[repo].contributors[contributor.author.login] = contributor.total;
          }
        }
      }

      if (firstMethodFailed || Object.keys(repos.repos[repo].contributors).length >= 100) {
        const perPage = 100;
        for (let page = 1; page <= 5; ++page) {
          const ghUrl = `https://api.github.com/repos/${repo}/contributors?page=${page}&per_page=${perPage}`;
          const ghDataJson = await fetchJson(github.authify(ghUrl), spinner);
          for (const contributor of ghDataJson) {
            repos.repos[repo].contributors[contributor.login] = contributor.contributions;
          }

          if (ghDataJson.length < perPage) {
            break;
          }
        }
      }

      if (Object.keys(repos.repos[repo].contributors).length >= 500) {
        // We could use https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
        // in order to fetch more than 500 contributors.
        spinner.fail();
        throw 'Not implemented yet';
      }

      spinner.succeed(`Fetched ${repo}'s contributors`);
      repos.write();
    }

    async function fetchRepoLanguages(repo) {
      const ghUrl = `https://api.github.com/repos/${repo}/languages`;
      spinner = ora(`Fetching ${ghUrl}...`).start();

      if (!repos.repos[repo].fetching_since ||
          repos.repos[repo].fetched_at &&
          new Date(repos.repos[repo].fetched_at) > new Date(repos.repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      const ghDataJson = await fetchJson(github.authify(ghUrl), spinner);
      spinner.succeed(`Fetched ${ghUrl}`);

      for (let language in ghDataJson) {
        ghDataJson[language] = {
          bytes: ghDataJson[language],
          color: githubColors.get(language, true).color
        };
      }

      repos.repos[repo].languages = ghDataJson;
      repos.write();
    }

    async function fetchRepoSettings(repo) {
      const url = `https://rawgit.com/${repo}/master/.ghuser.io.json`;
      spinner = ora(`Fetching ${repo}'s settings...`).start();

      if (!repos.repos[repo].fetching_since ||
          repos.repos[repo].fetched_at &&
          new Date(repos.repos[repo].fetched_at) > new Date(repos.repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      const dataJson = await fetchJson(url, spinner, [404]);
      if (dataJson == 404) {
        spinner.succeed(`${repo} has no settings`);
        return;
      }
      spinner.succeed(`Fetched ${repo}'s settings`);

      repos.repos[repo].settings = dataJson;
      repos.write();
    }

    function markRepoAsFullyFetched(repo) {
      if (repos.repos[repo].fetching_since) {
        repos.repos[repo].fetched_at = repos.repos[repo].fetching_since;
        delete repos.repos[repo].fetching_since;
        repos.write();
      }
    }
  }

})();
