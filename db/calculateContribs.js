#!/usr/bin/env node
'use strict';

(() => {

  const fs = require('fs');
  const ora = require('ora');

  const DbFile = require('./impl/dbFile');
  const scriptUtils = require('./impl/scriptUtils');

  scriptUtils.printUnhandledRejections();

  calculateContribs();
  return;

  function calculateContribs() {
    let spinner;

    const orgs = new DbFile('data/orgs.json');

    const users = {};
    for (const file of fs.readdirSync('data/users/')) {
      if (file.endsWith('.json')) {
        const user = new DbFile(`data/users/${file}`);
        if (!user.ghuser_deleted_because) {
          users[file] = user;

          // Make sure the corresponding contrib file exists (not the case if it's a new user):
          (new DbFile(`data/contribs/${file}`)).write();
        }
      }
    }

    const contribs = {};
    for (const file of fs.readdirSync('data/contribs/')) {
      if (file.endsWith('.json')) {
        const contribList = new DbFile(`data/contribs/${file}`);
        contribList._comment = 'DO NOT EDIT MANUALLY - See ../../README.md';
        contribList.repos = {};
        contribs[file] = contribList;
      }
    }

    const repos = {};
    for (const ownerDir of fs.readdirSync('data/repos/')) {
      for (const file of fs.readdirSync(`data/repos/${ownerDir}/`)) {
        const ext = '.json';
        if (file.endsWith(ext)) {
          const repo = new DbFile(`data/repos/${ownerDir}/${file}`);
          const full_name = `${ownerDir}/${file}`.slice(0, -ext.length);
          repos[full_name] = repo;
        }
      }
    }

    stripUnreferencedContribs();

    for (const filename in contribs) {
      calculateScores(filename);
      stripInsignificantContribs(filename);
      calculateOrgs(filename);
    }

    return;

    function stripUnreferencedContribs() {
      // Deletes contrib files that aren't referenced by any user.

      const toBeDeleted = [];
      for (const contribList in contribs) {
        if (!users[contribList]) {
          toBeDeleted.push(contribList);
        }
      }
      for (const contribList of toBeDeleted) {
        delete contribs[contribList];
        fs.unlinkSync(`data/contribs/${contribList}`);
      }
    }

    function calculateScores(filename) {
      const userLogin = users[filename].login;

      spinner = ora(`Calculating scores for ${userLogin}...`).start();

      for (const repo of users[filename].contribs.repos) {
        if (!repos[repo]) {
          continue; // repo has been stripped
        }

        const full_name = repos[repo].full_name;
        const score = contribs[filename].repos[full_name] = {
          full_name,
          name: repos[repo].name,
          stargazers_count: repos[repo].stargazers_count,
          popularity: logarithmicScoreAscending(1, 10000, repos[repo].stargazers_count)
        };

        let totalContribs = 0;
        for (const contributor in repos[repo].contributors) {
          totalContribs += repos[repo].contributors[contributor];
        }

        score.percentage = repos[repo].contributors[userLogin] &&
                           100 * repos[repo].contributors[userLogin] / totalContribs || 0;
        score.maturity = logarithmicScoreAscending(40, 10000, totalContribs);
        score.total_commits_count = totalContribs;

        const daysOfInactivity =
                (Date.parse(repos[repo].fetched_at) - Date.parse(repos[repo].pushed_at))
                / (24 * 60 * 60 * 1000);
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
      contribs[filename].write();
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

    function stripInsignificantContribs(filename) {
      // Deletes contributions to forks if the user has done 0%.

      const toBeDeleted = [];
      for (const repo in contribs[filename].repos) {
        const score = contribs[filename].repos[repo];
        if (repos[repo] && repos[repo].fork && score.percentage === 0) {
          toBeDeleted.push(repo);
        }
      }
      for (const repo of toBeDeleted) {
        delete contribs[filename].repos[repo];
      }

      contribs[filename].write();
    }

    function calculateOrgs(filename) {
      contribs[filename].organizations = getContribsOwners(contribs[filename].repos).filter(
        owner => orgs.orgs[owner] && orgs.orgs[owner].login);
      contribs[filename].write();
      return;

      function getContribsOwners(contribRepos) {
        let result = new Set([]);
        for (const repo in contribRepos) {
          const originalOwner = repo.split('/')[0];
          const currentOwner = contribRepos[repo].full_name.split('/')[0];
          result = new Set([...result, originalOwner, currentOwner]);
        }
        return [...result];
      }
    }
  }

})();
