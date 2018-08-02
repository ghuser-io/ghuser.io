#!/usr/bin/env bash

set -e

./fetchAndCalculateAll.sh
git add -A
git commit -m "[bot] Updated DB."
git push
cd ../reframe/
npm run deploy
