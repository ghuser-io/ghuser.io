# Setting up [ghuser.io](https://ghuser.io)'s infrastructure on AWS

You can run [ghuser.io](https://ghuser.io)'s implementation anywhere. We are currently running it on
AWS by making use of the following services.

## Table of Contents

<!-- toc -->

- [Services](#services)
  * [AWS Lambda](#aws-lambda)
  * [AWS EC2](#aws-ec2)
  * [AWS SQS](#aws-sqs)
  * [AWS Route 53](#aws-route-53)
- [Setting up AWS CLI](#setting-up-aws-cli)

<!-- tocstop -->

## Services

### AWS Lambda

The most important part of [ghuser.io](https://ghuser.io) is a [Reframe web app](../reframe). We
deploy the web server on [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
using [Apex/Up](https://up.docs.apex.sh/). This setup is best described by
[How to deploy a Reframe web app on Up](https://github.com/AurelienLourot/reframe-on-up).

A few AWS IAM adjustments are necessary:
* [set up AWS CLI](#setting-up-aws-cli), and
* go to the [`apex-up/`](apex-up/) subfolder.

### AWS EC2

The [data](../db) of all profiles needs to be refreshed every day. For this we run
[a bot](../db/fetchBot) on an EC2 instance.

To create this EC2 instance:
* [set up AWS CLI](#settings-up-aws-cli), and
* go to the [`ec2/`](ec2/) subfolder.

### AWS SQS

[The bot](../db/fetchBot) also processes profile requests, i.e. when a new user wants to get their
profile. These requests are implemented as
[SQS messages](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html).

To create this SQS queue:
* [set up AWS CLI](#settings-up-aws-cli), and
* go to the [`sqs/`](sqs/) subfolder.

### AWS Route 53

We bought the `ghuser.io` domain from [Route 53](https://aws.amazon.com/route53/).
To see how this is set up:
* [set up AWS CLI](#settings-up-aws-cli), and
* go to the [`dns/`](dns/) subfolder.

## Setting up AWS CLI

In order to run the scripts present in these subfolders you first need to set up
[AWS CLI](https://aws.amazon.com/cli):

```bash
$ sudo pip install awscli==1.16.4
$ aws configure
AWS Access Key ID [None]: ********
AWS Secret Access Key [None]: ********
Default region name [None]: us-east-1
Default output format [None]:
```
