This sets up AWS IAM for being able to deploy our web app on Up.

> **NOTES**:
> * See [How to deploy a Reframe web app on Up](https://github.com/AurelienLourot/reframe-on-up/)
>   for more details.
> * [apex-up-policy.json](apex-up-policy.json) comes from
>   [here](https://up.docs.apex.sh/#aws_credentials.iam_policy_for_up_cli).

```bash
$ export AWS_ACCOUNT_ID=123456789012
$ export AWS_USERNAME=john
$ ./setup_iam_for_apex_up.sh
```
