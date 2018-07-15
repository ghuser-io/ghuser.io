set -e

./impl/wrapper.sh ansible-playbook --private-key secret.pem "$@"
