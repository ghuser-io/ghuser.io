#!/usr/bin/env bash

set -xe
source ../impl/iam.sh

createPolicyAndGroupForUser efs EFS efs-policy.json efs
