#!/usr/bin/env bash

set -e

HOSTED_ZONE_ID=/hostedzone/Z2XLL8YMM7K4J0

scriptDir=$(dirname "$0")

# This is for ACM validation via DNS, because we didn't manage to get validation via e-mail working,
# see:
# * https://github.com/apex/up/issues/618
# * dns_create.sh
aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch "file://$scriptDir/dns_upsert_cname_acm_record_set.json"

#aws route53 list-hosted-zones > output.txt
#aws route53 get-hosted-zone --id $HOSTED_ZONE_ID > output.txt
#aws route53 list-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID >> output.txt
