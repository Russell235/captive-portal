#!/bin/bash
# tc-remove.sh — Supprime la classe HTB d'une IP
# Usage : sudo ./tc-remove.sh <IP>

set -e

IFACE="wlan0"
IP="$1"

if [ -z "$IP" ]; then
    echo "Usage: $0 <IP>"
    exit 1
fi

LAST_OCTET=$(echo "$IP" | awk -F. '{print $4}')
CLASSID=$((LAST_OCTET + 1000))

echo "[tc-remove] Suppression de la classe 1:$CLASSID pour $IP"

tc class del dev "$IFACE" classid 1:$CLASSID 2>/dev/null || echo "  (classe inexistante)"

echo "[tc-remove] OK"
