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
  python-jinja2 python-yaml python-paramiko python-httplib2 sshpass
$ dpkg -i thirdparty/ansible_1.9.4-1ppa~precise_all.deb
$ apt-mark hold ansible
```

# Create the EC2 instance

> **WARNING**: Not yet tested. Likely not to work yet.

```bash
$ ansible-playbook --private-key secret.pem -i thirdparty/ansible-ec2/ec2.py create.yml
```
