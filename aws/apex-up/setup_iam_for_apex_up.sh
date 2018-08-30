#!/usr/bin/env bash

set -xe
source ../impl/iam.sh

createPolicyAndGroupForUser apex-up up.docs.apex.sh apex-up-policy.json apex-up
