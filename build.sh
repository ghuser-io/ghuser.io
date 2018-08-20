set -e

npm install
npm test

if [ "$TRAVIS_BRANCH" -eq "master" ]; then
  cd reframe/
  npm install
  npm run deploy
fi
