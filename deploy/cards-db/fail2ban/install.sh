#!/bin/sh
# One-time setup on the VPS, run as root:  sudo sh install.sh
# (the CI user has no sudo beyond mkdir/chown, so this is not part of the pipeline)
set -eu
cd "$(dirname "$0")"
install -m 644 filter.d/zephyron-postgres.conf /etc/fail2ban/filter.d/
install -m 644 jail.d/zephyron-postgres.local  /etc/fail2ban/jail.d/
fail2ban-client -t
systemctl reload fail2ban
sleep 2
fail2ban-client status zephyron-postgres
