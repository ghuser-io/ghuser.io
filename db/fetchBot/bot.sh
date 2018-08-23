#!/usr/bin/env bash

source raven-bash

# By default raven-bash swallows stderr in order to send it to Sentry, see
# https://github.com/ViktorStiskala/raven-bash#known-bugs . However since we own the machine where
# this script is running, we prefer to have stderr on the console.
exec 2>&1

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
