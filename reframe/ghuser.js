const urls = {
  landing: 'https://ghuser.io',
  repo: 'https://github.com/AurelienLourot/ghuser.io',
  oauthEndpoint: '/login'
};
urls.docs = `${urls.repo}/blob/master/docs`;
urls.issues = `${urls.repo}/issues`;
urls.profileRequest = `${urls.issues}/new?template=profile-request.md`;
urls.oauth = `${urls.landing}${urls.oauthEndpoint}`;

module.exports = {
  urls,
};
