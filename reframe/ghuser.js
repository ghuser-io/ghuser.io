const urls = {
  landing: 'https://ghuser.io',
  mainRepo: 'https://github.com/ghuser-io/ghuser.io',
  fetchBot: 'https://github.com/ghuser-io/db/blob/master/fetchBot',
  oauthEndpoint: '/login',
  profileQueueEndpoint: '/queue'
};
urls.masterBranch = `${urls.mainRepo}/blob/master`;
urls.docs = `${urls.masterBranch}/docs`;
urls.issues = `${urls.mainRepo}/issues`;

module.exports = {
  urls,
};
