For testing purposes, this will create the cheapest possible EC2 instance with the app and the
necessary dev tools.

# Table of Contents

<!-- toc -->

- [Create an EC2 key pair](#create-an-ec2-key-pair)
- [Install ansible](#install-ansible)
- [Set up [boto](http://boto.cloudhackers.com/en/latest/getting_started.html)](#set-up-botohttpbotocloudhackerscomenlatestgetting_startedhtml)
- [Create an EC2 instance](#create-an-ec2-instance)
- [List all EC2 instances](#list-all-ec2-instances)
- [Terminate all EC2 instances](#terminate-all-ec2-instances)
- [FAQ](#faq)
  * [Sometimes the playbook ends with `Exception ignored`](#sometimes-the-playbook-ends-with-exception-ignored)

<!-- tocstop -->

# Create an EC2 key pair

```bash
$ sudo apt-get update
$ sudo apt-get install jq
$ aws ec2 create-key-pair --key-name ghuser | jq -r '.KeyMaterial' > secret.pem
$ chmod 600 secret.pem
```

# Install ansible

```bash
$ sudo -H pip3.5 install ansible boto boto3
...
Successfully installed ansible-2.6.1 boto-2.49.0 boto3-1.7.56 botocore-1.10.56 [...]
```

# Set up [boto](http://boto.cloudhackers.com/en/latest/getting_started.html)

```
$ sed s/default/Credentials/g ~/.aws/credentials > ~/.boto
```

# Create an EC2 instance

```bash
$ ./ansible-playbook.sh create.yml
```

# List all EC2 instances

```bash
$ ./ansible-inventory.sh --list | jq -r '.ec2'
{
  "hosts": [
    "18.207.151.144"
  ]
}
```

# Terminate all EC2 instances

```bash
$ ./ansible-playbook.sh terminate.yml
```

# FAQ

## Sometimes the playbook ends with `Exception ignored`

e.g.

```
Exception ignored in: <function WeakValueDictionary.__init__.<locals>.remove at 0x788849d5eae8>
Traceback (most recent call last):
  File "/usr/lib/python3.5/weakref.py", line 117, in remove
TypeError: 'NoneType' object is not callable
```

This is a Python bug, see [ansible#21982](https://github.com/ansible/ansible/issues/21982).
