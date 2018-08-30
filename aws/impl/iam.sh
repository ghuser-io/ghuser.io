# Helper functions for AWS IAM. Source this script.

function createPolicyAndGroupForUser {
  policyName="$1"
  policyDescr="$2"
  policyDoc="$3"
  groupName="$4"

  if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: AWS_ACCOUNT_ID is not set."
    exit 1
  fi
  if [ -z "$AWS_USERNAME" ]; then
    echo "Error: AWS_USERNAME is not set."
    exit 1
  fi

  aws iam create-policy --policy-name "$policyName" --description "$policyDescr" \
      --policy-document "file://./$policyDoc"
  aws iam create-group --group-name "$groupName"
  aws iam attach-group-policy --group-name "$groupName" \
      --policy-arn "arn:aws:iam::$AWS_ACCOUNT_ID:policy/$policyName"
  aws iam add-user-to-group --group-name "$groupName" --user-name "$AWS_USERNAME"
}
