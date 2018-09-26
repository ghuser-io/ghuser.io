const profileQueueEndpoint = '/_queue';
const dataEndpoint = '/_data';
const baseUrl = 'https://ghuser.io';

const urls = {
  landing: baseUrl,
  mainRepo: 'https://github.com/ghuser-io/ghuser.io',
  fetchBot: 'https://github.com/ghuser-io/db/blob/master/fetchBot',
  oauthEndpoint: '/login',
  profileQueueEndpoint,
  profileQueueUrl: baseUrl+profileQueueEndpoint,
  dataEndpoint,
};
urls.masterBranch = `${urls.mainRepo}/blob/master`;
urls.docs = `${urls.masterBranch}/docs`;
urls.issues = `${urls.mainRepo}/issues`;

module.exports = {
  urls,
};
