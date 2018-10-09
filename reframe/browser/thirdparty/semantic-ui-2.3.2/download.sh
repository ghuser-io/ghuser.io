#!/usr/bin/env bash

set -e

# We need bash >= 4 for `${str^}`, see https://unix.stackexchange.com/a/51987/36560
actual_major_bash_version=${BASH_VERSION:0:1}
expected_major_bash_version=4
if [ "$actual_major_bash_version" -lt "$expected_major_bash_version" ]; then
  echo "At least bash $expected_major_bash_version is needed but you have $BASH_VERSION"
  exit 1
fi

for component in accordion; do
  for ext in js css; do
    curl -O https://raw.githubusercontent.com/Semantic-Org/UI-${component^}/2.3.2/$component.min.$ext
  done
done
