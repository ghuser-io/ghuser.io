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
$ sudo apt-get update
$ sudo apt-get install software-properties-common python-software-properties python-support \
  python-jinja2 python-yaml python-paramiko python-httplib2 sshpass python-boto
...
Setting up python-boto (2.20.1-2ubuntu2) ...
$ dpkg -i thirdparty/ansible_1.9.4-1ppa~precise_all.deb
$ apt-mark hold ansible
```

# Set up [boto](http://boto.cloudhackers.com/en/latest/getting_started.html)

```
$ sed s/default/Credentials/g ~/.aws/credentials > ~/.boto
```

# Create the EC2 instance

> **WARNING**: [work in progress](create.yml)

```bash
$ ansible-playbook --private-key secret.pem -i thirdparty/ansible-ec2/ec2.py create.yml
```
