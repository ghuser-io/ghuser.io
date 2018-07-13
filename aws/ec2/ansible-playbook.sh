set -e

curl -s https://raw.githubusercontent.com/ansible/ansible/e238ae9/contrib/inventory/ec2.py > inventory/ec2.py
chmod 755 inventory/ec2.py

# See https://docs.ansible.com/ansible/2.6/reference_appendices/python_3_support.html#using-python-3-on-the-managed-machines-with-commands-and-playbooks
python3.5 $(which ansible-playbook) --private-key secret.pem -i inventory/ec2.py "$@"
