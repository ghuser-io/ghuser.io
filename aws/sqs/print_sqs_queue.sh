#!/usr/bin/env bash

set -e
source impl/utils.sh

aws sqs receive-message --queue-url "$(queueUrl)" --max-number-of-messages 10
