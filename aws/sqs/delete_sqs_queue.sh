#!/usr/bin/env bash

set -e
source utils.sh

aws sqs delete-queue --queue-url "$(queueUrl)"
