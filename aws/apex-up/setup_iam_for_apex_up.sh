#!/usr/bin/env bash

set -e

scriptDir=$(dirname "$0")

# Comes from https://up.docs.apex.sh/#aws_credentials.iam_policy_for_up_cli
aws iam create-policy --policy-name apex-up --description up.docs.apex.sh \
    --policy-document "file://$scriptDir/apex-up-policy.json"

aws iam create-group --group-name apex-up
aws iam attach-group-policy --group-name apex-up \
    --policy-arn arn:aws:iam::840993272713:policy/apex-up
aws iam add-user-to-group --group-name apex-up --user-name lourot
