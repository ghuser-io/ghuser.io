#!/usr/bin/env bash

set -e
source utils.sh

msg="$1"
if [[ -z "$msg" ]] || [[ ! -z "$2" ]]; then
  cat <<EOF
Error: bad arguments.

Push a message to the queue.

Usage: $0 MSG
EOF
  exit 1
fi

aws sqs send-message --queue-url "$(queueUrl)" --message-group-id 0 --message-body "$msg"
