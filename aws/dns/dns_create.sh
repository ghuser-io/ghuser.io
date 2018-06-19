#!/usr/bin/env bash

set -e

DOMAIN_NAME=ghuser.io

# Take that, bot:
ADDRESS="4"
ADDRESS=". $ADDRESS"
ADDRESS="str$ADDRESS"
ADDRESS="ein$ADDRESS"
ADDRESS="nst$ADDRESS"
ADDRESS="cke$ADDRESS"
ADDRESS="Fal$ADDRESS"
ADDRESS="${ADDRESS}2"
PHONE=$((2256329 * 720 + 4 * 10))
PHONE="+49.$PHONE"
EMAIL="n.l"
EMAIL="lie${EMAIL}our"
EMAIL="ure${EMAIL}ot@"
EMAIL="a${EMAIL}gma"
EMAIL="${EMAIL}il."
EMAIL="${EMAIL}com"

CONTACT="FirstName=Aurelien,LastName=Lourot,ContactType=PERSON,OrganizationName=,\
AddressLine1=$ADDRESS,AddressLine2=,City=Berlin,State=,CountryCode=DE,ZipCode=10997,\
PhoneNumber=$PHONE,Email=$EMAIL,Fax=,ExtraParams=[]"

aws route53domains register-domain --domain-name $DOMAIN_NAME --duration-in-years 1 \
    --auto-renew --admin-contact "$CONTACT" --registrant-contact "$CONTACT" \
    --tech-contact "$CONTACT" --privacy-protect-admin-contact --privacy-protect-registrant-contact

# Useless: the e-mail address is still not exposed via WHOIS, so we can't do ACM validation via
# e-mail. Thus we use validation via DNS instead, see dns_update.sh
#aws route53domains update-domain-contact-privacy --domain-name $DOMAIN_NAME --no-tech-privacy

#aws route53domains get-domain-detail --domain-name $DOMAIN_NAME > output.txt
