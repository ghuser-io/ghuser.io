#!/usr/bin/env bash

set -e

for ext in js css; do
  curl -O https://raw.githubusercontent.com/Semantic-Org/UI-Accordion/2.3.2/accordion.min.$ext
done
