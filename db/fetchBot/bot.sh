#!/usr/bin/env bash

source raven-bash

# By default raven-bash swallows stderr in order to send it to Sentry, see
# https://github.com/ViktorStiskala/raven-bash#known-bugs . However since we own the machine where
# this script is running, we prefer to have stderr on the console.
exec 2>&1

source ../../aws/sqs/utils.sh

function assertEquals {
  if [[ "$1" != "$2" ]]; then
    echo "Assertion failed: $1 != $2"
    exit 1
  fi
}

function now {
  echo "$(date +%s)"
}

function updateDb {
  echo "Updating DB..."

  lastRun="$(now)"
  git pull
  pushd ../
  ./fetchAndCalculateAll.sh
  git pull
  git add -A
  git commit -m "[bot] Updated DB."
  git push
  popd
}

# $1: GitHub username
function addUser {
  echo "Adding user $1..."

  git pull
  pushd ../
  ./addUser.js $1
  popd
}

# If there is a message in the SQS queue, returns it as "<Body>,<ReceiptHandle>". Returns an empty
# string otherwise.
#
# $1: VisibilityTimeout in seconds. The ReceiptHandle can only be used to delete the message before
#     this timeout, see https://github.com/aws/aws-sdk-js/issues/1279 . During this period the
#     message also can't be seen by other readers of the queue.
#
# Return var: msg
function getNextSqsMessage {
  request="$(aws sqs receive-message --queue-url $(queueUrl) --visibility-timeout $1 | jq .Messages[0])"
  requestBody="$(echo $request | jq .Body | tr -d \")"
  requestReceiptHandle="$(echo $request | jq .ReceiptHandle | tr -d \")"
  msg="$requestBody,$requestReceiptHandle"
}

# Waits until
# * there is a profile request (and returns the login of the user to be created), or
# * it's time to update the DB (and returns an empty string),
# whatever comes first.
#
# Return var: job
function waitForJob {
  echo "Waiting for a job..."

  while true; do
    # We use a short visibilty timeout here so that this profile request remains visible on the web
    # app:
    getNextSqsMessage 0
    job="$(echo $msg | cut -d',' -f1)"
    if [ ! -z "$job" ]; then
      job="" # break # temporarily disable because of issue143
    fi

    if [ "$(($lastRun + 10 * 60 * 60))" -le "$(now)" ]; then
      break
    fi
    sleep 60
  done
}

lastRun=0
trap "echo Signal received, exiting...; exit;" SIGINT SIGTERM
while true; do
  waitForJob
  if [[ ! -z "$job" ]]; then
    addUser "$job"
  fi
  updateDb
  if [[ ! -z "$job" ]]; then
    echo "Deleting $job's profile request..."
    getNextSqsMessage 10
    login="$(echo $msg | cut -d',' -f1)"
    assertEquals "$login" "$job"
    receiptHandle="$(echo $msg | cut -d',' -f3)"
    aws sqs delete-message --queue-url "$(queueUrl)" --receipt-handle "$receiptHandle"
  fi
done
