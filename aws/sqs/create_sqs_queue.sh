#!/usr/bin/env bash

set -e
source utils.sh
aws sqs create-queue --queue-name "$QUEUE_NAME" \
    --attributes FifoQueue=true,ContentBasedDeduplication=true,VisibilityTimeout=0
