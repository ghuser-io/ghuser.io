#!/usr/bin/env bash

source raven-bash

while true; do
  git pull
  pushd ../
  ./fetchAndCalculateAll.sh
  git pull
  git add -A
  git commit -m "[bot] Updated DB."
  git push
  popd

  sleep "$((10 * 60 * 60))"
done
