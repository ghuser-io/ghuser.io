#!/usr/bin/env bash

set -e

aws s3api create-bucket --acl public-read --bucket ghuser
aws s3api put-bucket-policy --bucket ghuser --policy "file://./s3-policy.json"
aws s3api put-bucket-cors --bucket ghuser --cors-configuration "file://./s3-cors.json"
