for (var username of ['AurelienLourot']) {
  exports[username] = require(`./${username}.generated.json`);
}
