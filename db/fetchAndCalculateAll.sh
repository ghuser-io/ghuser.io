#!/usr/bin/env bash

set -e

# We need bash >= 4 for `${str::n}`, see https://stackoverflow.com/a/27658733/1855917
actual_major_bash_version=${BASH_VERSION:0:1}
expected_major_bash_version=4
if [ "$actual_major_bash_version" -lt "$expected_major_bash_version" ]; then
  echo "At least bash $expected_major_bash_version is needed but you have $BASH_VERSION"
  exit 1
fi

function run {
  pushd data/users/
  userFiles=$(ls *.json)
  popd
  for user in $(echo "$userFiles"); do
    userId="${user::-5}"
    ./fetchUserDetailsAndContribs.js "$userId"
  done

  ./fetchOrgs.js
  ./fetchRepos.js
  ./calculateContribs.js
  ./printDataStats.js
}

time run
