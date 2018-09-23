#!/usr/bin/env bash

set -e

if [[ -z "$1" ]] || [[ ! -z "$2" ]]; then
  echo "Usage:    $0 SUBNET_ID"
  echo "  e.g.    $0 subnet-a0123456"
  exit 1
fi
subnetId="$1"

fsId=$(aws efs create-file-system --creation-token ghuser3 | jq -r '.FileSystemId')

seconds=60
echo "Waiting $seconds seconds for $fsId to be created..."
sleep "$seconds"

echo aws efs create-mount-target --file-system-id "$fsId" --subnet-id "$subnetId"
