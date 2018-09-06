# `fetchBot`

Bot

* refreshing the DB at least once per day, and
* processing profile requests from the [AWS SQS](../../aws/sqs).

Errors will be sent to [Sentry](https://sentry.io) via
[`raven-bash`](https://github.com/ViktorStiskala/raven-bash).

## Table of Contents

<!-- toc -->

- [Install and set up dependencies](#install-and-set-up-dependencies)
  * [Install `raven-bash`](#install-raven-bash)
  * [Create `/etc/raven-bash.conf`](#create-etcraven-bashconf)
  * [Set up AWS CLI](#set-up-aws-cli)
  * [Install other dependencies](#install-other-dependencies)
- [Run the bot](#run-the-bot)

<!-- tocstop -->

## Install and set up dependencies

### Install `raven-bash`

```bash
$ sudo pip install raven-bash==1.0
```

### Create `/etc/raven-bash.conf`

See [`raven-bash`'s documentation](https://github.com/ViktorStiskala/raven-bash#usage).

### Set up AWS CLI

See [here](../../aws).

### Install other dependencies

```bash
$ sudo apt-get update
$ sudo apt-get install jq
```

## Run the bot

```bash
$ ./bot.sh
```

> **NOTE**: in production we currently run this bot on an [EC2 instance](../../aws/ec2).
