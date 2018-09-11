#!/usr/bin/env node
'use strict';

(() => {

  const fs = require('fs');

  const DbFile = require('./impl/dbFile');
  const scriptUtils = require('./impl/scriptUtils');

  scriptUtils.printUnhandledRejections();

  printDataStats();
  return;

  function printDataStats() {
    console.log('data/');

    let numUsers = 0;
    let largestUserFileName;
    let largestUserFileSize = 0;
    let totalUserSize = 0;
    for (const file of fs.readdirSync('data/users/')) {
      if (file.endsWith('.json')) {
        const user = new DbFile(`data/users/${file}`);
        if (!user.ghuser_deleted_because) {
          ++numUsers;
        }
        const userFileSize = fs.statSync(`data/users/${file}`).size;
        if (userFileSize > largestUserFileSize) {
          largestUserFileSize = userFileSize;
          largestUserFileName = file;
        }
        totalUserSize += userFileSize;
      }
    }
    console.log('  users/');
    console.log(`    ${numUsers} users`);
    console.log(`    largest: ${largestUserFileName} (${toKB(largestUserFileSize)})`);
    console.log(`    total: ${toKB(totalUserSize)}`);

    let largestContribFileName;
    let largestContribFileSize = 0;
    let totalContribSize = 0;
    for (const file of fs.readdirSync('data/contribs/')) {
      if (file.endsWith('.json')) {
        const contribList = new DbFile(`data/contribs/${file}`);
        const contribFileSize = fs.statSync(`data/contribs/${file}`).size;
        if (contribFileSize > largestContribFileSize) {
          largestContribFileSize = contribFileSize;
          largestContribFileName = file;
        }
        totalContribSize += contribFileSize;
      }
    }
    console.log('  contribs/');
    console.log(`    largest: ${largestContribFileName} (${toKB(largestContribFileSize)})`);
    console.log(`    total: ${toKB(totalContribSize)}`);

    let numRepos = 0;
    let largestRepoFileName;
    let largestRepoFileSize = 0;
    let totalRepoSize = 0;
    for (const ownerDir of fs.readdirSync('data/repos/')) {
      for (const file of fs.readdirSync(`data/repos/${ownerDir}/`)) {
        if (file.endsWith('.json')) {
          const repo = new DbFile(`data/repos/${ownerDir}/${file}`);
          ++numRepos;
          const repoFileSize = fs.statSync(`data/repos/${ownerDir}/${file}`).size;
          if (repoFileSize > largestRepoFileSize) {
            largestRepoFileSize = repoFileSize;
            largestRepoFileName = `${ownerDir}/${file}`;
          }
          totalRepoSize += repoFileSize;
        }
      }
    }
    console.log('  repos/');
    console.log(`    ${numRepos} repos`);
    console.log(`    largest: ${largestRepoFileName} (${toKB(largestRepoFileSize)})`);
    console.log(`    total: ${toKB(totalRepoSize)}`);

    const orgsSize = fs.statSync(`data/orgs.json`).size;
    console.log(`  orgs.json: ${toKB(orgsSize)}`);

    const nonOrgsSize = fs.statSync(`data/nonOrgs.json`).size;
    console.log(`  nonOrgs.json: ${toKB(nonOrgsSize)}`);

    const totalSize = totalUserSize + totalContribSize + totalRepoSize + orgsSize;
    console.log(`  total: ${toKB(totalSize)}`);

    console.log(`\n=> ${toKB(totalSize / numUsers)}/user`);

    return;

    function toKB(bytes) {
      return `${Math.round(bytes / 1024)} KB`;
    }
  }

})();
