#!/usr/bin/env bash

set -e

for ext in py ini; do
  curl -O https://raw.githubusercontent.com/ansible/ansible/e238ae9/contrib/inventory/ec2.$ext
done
