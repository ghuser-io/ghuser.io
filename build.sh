set -e

npm install
npm test

if [ "$TRAVIS_BRANCH" == "master" ]; then
  cd reframe/
  npm install
  npm run deploy
fi
