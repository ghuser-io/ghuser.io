const urls = {
  landing: 'https://ghuser.io',
  repo: 'https://github.com/AurelienLourot/ghuser.io',
  oauthEndpoint: '/login',
  profileQueueEndpoint: '/queue'
};
urls.masterBranch = `${urls.repo}/blob/master`;
urls.docs = `${urls.masterBranch}/docs`;
urls.issues = `${urls.repo}/issues`;
urls.profileRequest = `${urls.issues}/new?template=profile-request.md`;

module.exports = {
  urls,
};
