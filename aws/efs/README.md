This will create an [EFS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEFS.html) on
which we'll store the [profiles' data](https://github.com/ghuser-io/db).

To create the EFS, run

```bash
$ export AWS_ACCOUNT_ID=123456789012
$ export AWS_USERNAME=john
$ ./setup_iam_for_efs.sh
$ sudo apt-get update
$ sudo apt-get install jq
$ ./create_efs.sh subnet-a0123456
```
