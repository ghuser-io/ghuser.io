This will create an
[AWS SQS queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html).
Profile requests will be added to this queue and processed by the [fetchBot](../../db/fetchBot/).

# Table of Contents

<!-- toc -->

- [Create the queue](#create-the-queue)
- [Push a message to the queue](#push-a-message-to-the-queue)
- [Print the queue's content](#print-the-queues-content)
- [Delete the queue](#delete-the-queue)

<!-- tocstop -->

## Create the queue

```bash
$ export AWS_ACCOUNT_ID=123456789012
$ export AWS_USERNAME=john
$ ./setup_iam_for_sqs.sh
$ ./create_sqs_queue.sh
```

## Push a message to the queue

> **WARNING**: don't use in production.

```bash
$ sudo apt-get update
$ sudo apt-get install jq
$ ./push_to_sqs_queue.sh myMessage
```

## Print the queue's content

```bash
$ sudo apt-get update
$ sudo apt-get install jq
$ ./print_sqs_queue.sh
```

## Delete the queue

> **WARNING**: don't use in production.

```bash
$ sudo apt-get update
$ sudo apt-get install jq
$ ./delete_sqs_queue.sh
```
