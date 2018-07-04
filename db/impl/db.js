#!/usr/bin/env node
'use strict';

const dbPath = `${__dirname}/../db.json`;
const db = require(dbPath);

const fs = require('fs');

db.write = function () {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf-8');
};

db.sizeKB = function () {
  return Math.round(fs.statSync(dbPath).size / 1024);
};

module.exports = db;
