const profileQueueEndpoint = '/queue';
const baseUrl = 'https://ghuser.io';
const fetchBase = (isServer() ? baseUrl : '');

const urls = {
  landing: baseUrl,
  mainRepo: 'https://github.com/ghuser-io/ghuser.io',
  fetchBot: 'https://github.com/ghuser-io/db/blob/master/fetchBot',
  oauthEndpoint: '/login',
  profileQueueEndpoint,
  profileQueueUrl: fetchBase+profileQueueEndpoint,
};
urls.masterBranch = `${urls.mainRepo}/blob/master`;
urls.docs = `${urls.masterBranch}/docs`;
urls.issues = `${urls.mainRepo}/issues`;

module.exports = {
  urls,
};

function isServer() {
  return typeof window === "undefined";
}
