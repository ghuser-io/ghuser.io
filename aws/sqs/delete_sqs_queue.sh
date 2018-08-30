#!/usr/bin/env bash

set -e
source impl/utils.sh

aws sqs delete-queue --queue-url "$(queueUrl)"
