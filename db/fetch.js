#!/usr/bin/env node
'use strict';

(async () => {

  const dbPath = './db.json';

  const fetch = require('fetch-retry');
  const fs = require('fs');
  const db = require(dbPath);

  for (const user in db.users) {
    const ghData = await fetch(`https://api.github.com/users/${user}`);
    const ghDataJson = await ghData.json();
    db.users[user] = ghDataJson;
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');

})();
