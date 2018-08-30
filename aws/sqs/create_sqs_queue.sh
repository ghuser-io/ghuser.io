#!/usr/bin/env bash

set -e
source impl/utils.sh
aws sqs create-queue --queue-name "$QUEUE_NAME" --attributes FifoQueue=true,VisibilityTimeout=0
