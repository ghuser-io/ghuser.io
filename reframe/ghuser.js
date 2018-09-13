const urls = {
  landing: 'https://ghuser.io',
  repo: 'https://github.com/ghuser-io/ghuser.io',
  oauthEndpoint: '/login',
  profileQueueEndpoint: '/queue'
};
urls.masterBranch = `${urls.repo}/blob/master`;
urls.docs = `${urls.masterBranch}/docs`;
urls.issues = `${urls.repo}/issues`;

module.exports = {
  urls,
};
