For testing purposes, this will create the cheapest possible EC2 instance with the app and the
necessary dev tools.

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

> **WARNING**: [work in progress](create.yml)

```bash
$ ./ansible-playbook.sh create.yml
```
