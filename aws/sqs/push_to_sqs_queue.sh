#!/usr/bin/env bash

set -e
source impl/utils.sh

msg="$1"
if [[ -z "$msg" ]] || [[ ! -z "$2" ]]; then
  cat <<EOF
Error: bad arguments.

Push a message to the queue.

Usage: $0 MSG
EOF
  exit 1
fi

now=$(date +%s%N)
msgId="$(echo -n $msg$now | md5sum | awk '{print $1}')"
aws sqs send-message --queue-url "$(queueUrl)" --message-group-id 0 \
    --message-deduplication-id "$msgId" --message-body "$msg"
