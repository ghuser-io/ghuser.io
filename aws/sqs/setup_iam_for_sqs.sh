#!/usr/bin/env bash

set -xe
source ../impl/iam.sh

createPolicyAndGroupForUser sqs SQS sqs-policy.json sqs
