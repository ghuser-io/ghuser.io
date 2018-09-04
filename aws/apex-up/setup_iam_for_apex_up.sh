#!/usr/bin/env bash

set -xe
source ../impl/iam.sh

createPolicyAndGroupForUser apex-up up.docs.apex.sh apex-up-policy.json apex-up

aws iam create-policy --policy-name apex-up-lambda \
    --policy-document "file://./apex-up-lambda-policy.json"
aws iam create-role --role-name apex-up-lambda \
    --assume-role-policy-document "file://./apex-up-lambda-trust-relationship.json"
aws iam attach-role-policy --role-name apex-up-lambda \
    --policy-arn "arn:aws:iam::$AWS_ACCOUNT_ID:policy/apex-up-lambda"
