#!/usr/bin/env node
'use strict';

(() => {

  const printUnhandledRejections = () => {
    process.on('unhandledRejection', (e, p) => { // https://stackoverflow.com/a/44752070/1855917
      console.error(p);
      throw e;
    });
  };

  module.exports = {
    printUnhandledRejections,
  };

})();
