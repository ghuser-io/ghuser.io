if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "Error: AWS_ACCOUNT_ID is not set."
  exit 1
fi
envsubst < s3-policy.json.template > s3-policy.json
