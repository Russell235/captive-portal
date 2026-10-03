#!/bin/bash
IFACE="wlan0"
echo "=== Classes HTB sur $IFACE ==="
tc class show dev "$IFACE"
echo ""
echo "=== Filtres ==="
tc filter show dev "$IFACE"
