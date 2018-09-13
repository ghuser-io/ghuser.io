#!/usr/bin/env node
'use strict';

(async () => {

  const assert = require('assert');
  const fs = require('fs');
  const Mode = require('stat-mode');
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

    const users = [];
    for (const file of fs.readdirSync('data/users/')) {
      if (file.endsWith('.json')) {
        const user = new DbFile(`data/users/${file}`);
        if (!user.ghuser_deleted_because) {
          users.push(user);
        }
      }
    }

    const fastResumeTempFile = 'data/repos/passed_strip_phase.temp';
    const fastResumeTempFileExists = fs.existsSync(fastResumeTempFile);

    let referencedRepos = new Set([]);
    if (!fastResumeTempFileExists) {
      for (const user of users) {
        for (const repo in (user.contribs && user.contribs.repos || [])) {
          const full_name = user.contribs.repos[repo];
          referencedRepos.add(full_name);

          // Make sure the corresponding repo file exists:
          (new DbFile(`data/repos/${full_name}.json`)).write();
        }
      }
    }

    const repos = {};
    for (const ownerDir of fs.readdirSync('data/repos/')) {
      if ((new Mode(fs.statSync(`data/repos/${ownerDir}`))).isDirectory()) {
        for (const file of fs.readdirSync(`data/repos/${ownerDir}/`)) {
          const ext = '.json';
          if (file.endsWith(ext)) {
            const repo = new DbFile(`data/repos/${ownerDir}/${file}`);
            repo._comment = 'DO NOT EDIT MANUALLY - See ../../../README.md';
            const full_name = `${ownerDir}/${file}`.slice(0, -ext.length);
            repos[full_name] = repo;
          }
        }
      }
    }

    if (!fastResumeTempFileExists) {
      for (const repo of referencedRepos) {
        if (!repos[repo] || !repos[repo].removed_from_github) {
          await fetchRepo(repo);
        }
      }
      stripUnreferencedRepos();
      stripUnsuccessfulOrEmptyRepos();
    }

    fs.writeFileSync(
      fastResumeTempFile,
      "I'm a temporary file. I exist to make fetchRepos.js faster to resume if it was aborted.\n",
      'utf-8'
    );

    for (const repo in repos) {
      if (!repos[repo].removed_from_github) {
        await fetchRepoContributors(repo);
        await fetchRepoPullRequests(repo);
        await fetchRepoLanguages(repo);
        await fetchRepoSettings(repo);
        markRepoAsFullyFetched(repo);
      }
    }

    createRenamedRepos();

    fs.unlinkSync(fastResumeTempFile);

    return;

    async function fetchRepo(repo) {
      const ghRepoUrl = `https://api.github.com/repos/${repo}`;
      spinner = ora(`Fetching ${ghRepoUrl}...`).start();

      const now = new Date;
      const maxAgeHours = 6;
      if (repos[repo].fetching_since || repos[repo].fetched_at &&
          now - Date.parse(repos[repo].fetched_at) < maxAgeHours * 60 * 60 * 1000) {
        spinner.succeed(`${repo} is still fresh`);
        return;
      }

      const ghDataJson = await github.fetchGHJson(ghRepoUrl, spinner, [304, 404, 451],
                                                  new Date(repos[repo].fetched_at));
      switch (ghDataJson) {
      case 304:
        spinner.succeed(`${repo} didn't change`);
        return;
      case 404:
        repos[repo].removed_from_github = true;
        spinner.succeed(`${repo} was removed from GitHub`);
        repos[repo].write();
        return;
      case 451: // Unavailable for legal reasons
        // Probably a DCMA takedown, like https://github.com/worktips/worktips
        repos[repo].removed_from_github = true;
        spinner.succeed(`${repo} is blocked for legal reasons`);
        repos[repo].write();
        return;
      }
      repos[repo].fetching_since = now.toISOString();;

      spinner.succeed(`Fetched ${ghRepoUrl}`);

      ghDataJson.owner = ghDataJson.owner.login;
      Object.assign(repos[repo], ghDataJson);

      // Keep the DB small:
      for (const field of [
        "node_id", "keys_url", "collaborators_url", "teams_url", "hooks_url", "issue_events_url",
        "events_url", "assignees_url", "branches_url", "tags_url", "blobs_url", "git_tags_url",
        "git_refs_url", "trees_url", "statuses_url", "contributors_url", "subscribers_url",
        "subscription_url", "commits_url", "git_commits_url", "comments_url", "issue_comment_url",
        "contents_url", "compare_url", "merges_url", "archive_url", "downloads_url", "issues_url",
        "milestones_url", "notifications_url", "labels_url", "releases_url", "deployments_url",
        "ssh_url", "git_url", "clone_url", "svn_url", "has_issues", "has_projects", "has_downloads",
        "has_wiki", "has_pages", "id", "forks_url", "permissions", "allow_squash_merge",
        "allow_merge_commit", "allow_rebase_merge", "stargazers_url", "watchers_count",
        "forks_count", "open_issues_count", "forks", "open_issues", "watchers", "parent", "source",
        "network_count", "subscribers_count"]) {
        delete repos[repo][field];
      }

      repos[repo].write();
    }

    function stripUnreferencedRepos() {
      // Deletes repos that are not referenced by any user's contribution.

      const toBeDeleted = [];
      for (const repo in repos) {
        if (!referencedRepos.has(repo)) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete repos[repo];
        fs.unlinkSync(`data/repos/${repo}.json`);
      }
    }

    function stripUnsuccessfulOrEmptyRepos() {
      // Deletes repos with no stars or no commits.

      const toBeDeleted = [];
      for (const repo in repos) {
        if (repos[repo].removed_from_github || repos[repo].stargazers_count < 1 ||
            repos[repo].size === 0) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete repos[repo];
        fs.unlinkSync(`data/repos/${repo}.json`);
      }
    }

    async function fetchRepoContributors(repo) {
      repos[repo].contributors = repos[repo].contributors || {};
      spinner = ora(`Fetching ${repo}'s contributors...`).start();

      if (!repos[repo].fetching_since || repos[repo].fetched_at &&
          new Date(repos[repo].fetched_at) > new Date(repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      // This endpoint only gives us the 100 greatest contributors, so if it looks like there
      // can be more, we use the next endpoint to get the 500 greatest ones:
      let firstMethodFailed = false;
      if (Object.keys(repos[repo].contributors).length < 100) {
        const ghUrl = `https://api.github.com/repos/${repo}/stats/contributors`;

        let ghDataJson;
        for (let i = 3; i >= 0; --i) {
          ghDataJson = await github.fetchGHJson(ghUrl, spinner);

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
            if (!contributor.author) { // rare but happens
              continue;
            }
            repos[repo].contributors[contributor.author.login] = contributor.total;
          }
        }
      }

      // This endpoint only gives us the 500 greatest contributors, so if it looks like there
      // can be more, we use the next endpoint to get all commits:
      if (firstMethodFailed ||
            Object.keys(repos[repo].contributors).length >= 100 &&
            Object.keys(repos[repo].contributors).length < 500) {
        const perPage = 100;
        for (let page = 1; page <= 5; ++page) {
          const ghUrl = `https://api.github.com/repos/${repo}/contributors?page=${page}&per_page=${perPage}`;
          const ghDataJson = await github.fetchGHJson(ghUrl, spinner);
          for (const contributor of ghDataJson) {
            repos[repo].contributors[contributor.login] = contributor.contributions;
          }

          if (ghDataJson.length < perPage) {
            break;
          }
        }
      }

      if (Object.keys(repos[repo].contributors).length >= 500) {
        const contributors = {};
        const perPage = 100;
        for (let page = 1;; ++page) {
          const ghUrl = `https://api.github.com/repos/${repo}/commits?page=${page}&per_page=${perPage}`;
          const ghDataJson = await github.fetchGHJson(ghUrl, spinner);
          for (const commit of ghDataJson) {
            const author_login = commit.author && commit.author.login;
            const committer_login = commit.committer && commit.committer.login;
            if (author_login) {
              if (!(author_login in contributors)) {
                contributors[author_login] = 0;
              }
              ++contributors[author_login];
            }
            if (committer_login && committer_login !== author_login) {
              if (!(committer_login in contributors)) {
                contributors[committer_login] = 0;
              }
              ++contributors[committer_login];
            }
          }

          if (ghDataJson.length < perPage) {
            break;
          }

          if (page >= 1000) {
            spinner.fail();
            throw 'fetchRepoContributors(): Infinite loop?';
          }
        }

        Object.assign(repos[repo].contributors, contributors);
      }

      spinner.succeed(`Fetched ${repo}'s contributors`);
      repos[repo].write();
    }

    async function fetchRepoPullRequests(repo) {
      spinner = ora(`Fetching ${repo}'s pull requests...`).start();

      if (!repos[repo].fetching_since || repos[repo].fetched_at &&
          new Date(repos[repo].fetched_at) > new Date(repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      const authors = new Set(repos[repo].pulls_authors || []);

      const pullsUrlSuffix = '{/number}';
      assert(repos[repo].pulls_url.endsWith(pullsUrlSuffix));
      const pullsUrl = repos[repo].pulls_url.slice(0, -pullsUrlSuffix.length);

      const perPage = 100;
      for (let page = 1;; ++page) {
        const ghUrl = `${pullsUrl}?state=all&page=${page}&per_page=${perPage}`;
        const ghDataJson = await github.fetchGHJson(ghUrl, spinner);
        for (const pr of ghDataJson) {
          authors.add(pr.user.login);
        }

        if (ghDataJson.length < perPage) {
          break;
        }

        // They are sorted from newest to oldest in ghDataJson by default:
        if (ghDataJson.length > 0 &&
              new Date(repos[repo].fetched_at) >
              new Date(ghDataJson[ghDataJson.length - 1].created_at)) {
          break;
        }

        if (page >= 10000) {
          spinner.fail();
          throw 'fetchRepoPullRequests(): Infinite loop?';
        }
      }

      spinner.succeed(`Fetched ${repo}'s pull requests`);

      repos[repo].pulls_authors = [...authors];
      repos[repo].write();
    }

    async function fetchRepoLanguages(repo) {
      const ghUrl = `https://api.github.com/repos/${repo}/languages`;
      spinner = ora(`Fetching ${ghUrl}...`).start();

      if (!repos[repo].fetching_since || repos[repo].fetched_at &&
          new Date(repos[repo].fetched_at) > new Date(repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      const ghDataJson = await github.fetchGHJson(ghUrl, spinner);
      spinner.succeed(`Fetched ${ghUrl}`);

      for (let language in ghDataJson) {
        ghDataJson[language] = {
          bytes: ghDataJson[language],
          color: githubColors.get(language, true).color
        };
      }

      repos[repo].languages = ghDataJson;
      repos[repo].write();
    }

    async function fetchRepoSettings(repo) {
      spinner = ora(`Fetching ${repo}'s settings...`).start();

      if (!repos[repo].fetching_since || repos[repo].fetched_at &&
          new Date(repos[repo].fetched_at) > new Date(repos[repo].pushed_at)) {
        spinner.succeed(`${repo} hasn't changed`);
        return;
      }

      for (const fileName of ['.ghuser.io.json', '.github/ghuser.io.json']) {
        const url = `https://rawgit.com/${repo}/master/${fileName}`;
        const dataJson = await fetchJson(url, spinner, [404]);
        if (dataJson == 404) {
          continue;
        }

        spinner.succeed(`Fetched ${repo}'s settings`);
        repos[repo].settings = dataJson;
        repos[repo].write();
        return;
      }

      spinner.succeed(`${repo} has no settings`);
    }

    function markRepoAsFullyFetched(repo) {
      if (repos[repo].fetching_since) {
        repos[repo].fetched_at = repos[repo].fetching_since;
        delete repos[repo].fetching_since;
        repos[repo].write();
      }
    }

    function createRenamedRepos() {
      // Some repos got renamed/moved after the latest contributions and need to be created as well
      // with their new name, so they can be found by the frontend.

      for (const repo in repos) {
        const latest_name = repos[repo].full_name;
        if (repo !== latest_name && !repos[latest_name]) {
          // Will create the folder if needed:
          (new DbFile(`data/repos/${latest_name}.json`)).write();

          fs.copyFileSync(`data/repos/${repo}.json`, `data/repos/${latest_name}.json`);
          repos[latest_name] = new DbFile(`data/repos/${latest_name}.json`);
        }
      }
    }
  }

})();
