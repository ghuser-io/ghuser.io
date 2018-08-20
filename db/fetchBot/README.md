# `fetchBot`

Bot refreshing the DB at least once per day.

Errors will be sent to [Sentry](https://sentry.io) via
[`raven-bash`](https://github.com/ViktorStiskala/raven-bash).

## Table of Contents

<!-- toc -->

- [Install `raven-bash`](#install-raven-bash)
- [Create `/etc/raven-bash.conf`](#create-etcraven-bashconf)
- [Run the bot](#run-the-bot)

<!-- tocstop -->

## Install `raven-bash`

```bash
$ sudo pip install raven-bash==1.0
```

## Create `/etc/raven-bash.conf`

See [`raven-bash`'s documentation](https://github.com/ViktorStiskala/raven-bash#usage).

## Run the bot

```bash
$ ./bot.sh
```
