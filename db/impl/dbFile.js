#!/usr/bin/env node
'use strict';

(() => {

  const fs = require('fs');
  const path = require('path');

  class DbFile {
    constructor(filePath) {
      let readObj = {};
      try {
        readObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) { // we tolerate 'No such file'
        if (e.code !== 'ENOENT') {
          throw e;
        }
        mkdirpSync(path.dirname(filePath));
      }

      Object.assign(this, readObj);
      this._path = () => filePath;
    }

    write() {
      fs.writeFileSync(this._path(), JSON.stringify(this, null, 2) + '\n', 'utf-8');
    }

    deleteAllPropsBut(exceptions) {
      Object.keys(this).forEach(prop => {
        if (prop.startsWith('_') || prop in exceptions) {
          return;
        }
        delete this[prop];
      });
    }
  }
  module.exports = DbFile;
  return;

  // See https://stackoverflow.com/a/24311711/1855917
  function mkdirSync(dirPath) {
    try {
      fs.mkdirSync(dirPath);
    } catch (e) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }
  function mkdirpSync(dirPath) {
    const parts = dirPath.split(path.sep);
    for (let i = 1; i <= parts.length; ++i) {
      mkdirSync(path.join.apply(null, parts.slice(0, i)));
    }
  }

})();
