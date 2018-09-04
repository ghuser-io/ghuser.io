This sets up AWS IAM for being able to deploy our web app on Up.

> **NOTES**:
> * See [How to deploy a Reframe web app on Up](https://github.com/AurelienLourot/reframe-on-up/)
>   for more details.
> * [apex-up-policy.json](apex-up-policy.json) comes from
>   [here](https://up.docs.apex.sh/#aws_credentials.iam_policy_for_up_cli).
> * [apex-up-lambda-policy.json](apex-up-lambda-policy.json) is an extended version of the inline
>   policy assigned originally to the default IAM role `ghuser-function` created by Up and
>   assumed/impersonated by our Lambda function. We have added for example permissions to push to
>   SQS.
> * [apex-up-lambda-trust-relationship.json](apex-up-lambda-trust-relationship.json) is the
>   [trust relationship policy document](https://stackoverflow.com/a/34188307/1855917) assigned
>   originally to `ghuser-function`.

```bash
$ export AWS_ACCOUNT_ID=123456789012
$ export AWS_USERNAME=john
$ ./setup_iam_for_apex_up.sh
```
