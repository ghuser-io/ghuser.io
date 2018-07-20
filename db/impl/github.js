#!/usr/bin/env node
'use strict';

(() => {

  const url = require('url');

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

  module.exports = {
    authify,
  };

})();
