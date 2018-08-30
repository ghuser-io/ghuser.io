# `source` me.

QUEUE_NAME=ghuser.fifo

function queueUrl {
  aws sqs get-queue-url --queue-name "$QUEUE_NAME" | jq -r .QueueUrl
}
