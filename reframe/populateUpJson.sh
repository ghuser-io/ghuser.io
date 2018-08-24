# Injects envvar value inside lines such as
#   "GITHUB_CLIENT_ID": "$GITHUB_CLIENT_ID",

sed -ri 's/^(.*)\"([a-zA-Z_]+)\"(.*)\"(\$[a-zA-Z_]+)\"(.*)$/echo "\1\\\"\2\\\"\3\\\"\4\\\"\5"/e' up.json
cat up.json
