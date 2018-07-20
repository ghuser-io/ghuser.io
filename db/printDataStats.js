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

    const orgsSize = fs.statSync(`data/orgs.json`).size;
    console.log(`  orgs.json: ${toKB(orgsSize)}`);

    const reposSize = fs.statSync(`data/repos.json`).size;
    console.log(`  repos.json: ${toKB(reposSize)}`);

    const totalSize = totalUserSize + totalContribSize + orgsSize + reposSize;
    console.log(`  total: ${toKB(totalSize)}`);

    console.log(`\n=> ${toKB(totalSize / numUsers)}/user`);

    return;

    function toKB(bytes) {
      return `${Math.round(bytes / 1024)} KB`;
    }
  }

})();
