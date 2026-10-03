#!/bin/bash
# tc-add.sh — Ajoute une classe HTB pour une IP cliente
# Usage : sudo ./tc-add.sh <IP> <DOWNLOAD_KBPS> <UPLOAD_KBPS>

set -e

IFACE="wlan0"
IP="$1"
DOWN="$2"
UP="$3"

if [ -z "$IP" ] || [ -z "$DOWN" ] || [ -z "$UP" ]; then
    echo "Usage: $0 <IP> <DOWNLOAD_KBPS> <UPLOAD_KBPS>"
    exit 1
fi

LAST_OCTET=$(echo "$IP" | awk -F. '{print $4}')
CLASSID=$((LAST_OCTET + 1000))

echo "[tc-add] Ajout de $IP (classid 1:$CLASSID) — ${DOWN}kbps down / ${UP}kbps up"

# Supprimer l'ancienne règle si elle existe
tc class del dev "$IFACE" classid 1:$CLASSID 2>/dev/null || true

# Créer la classe HTB pour le download (trafic vers le client)
tc class add dev "$IFACE" parent 1:1 classid 1:$CLASSID htb \
    rate "${DOWN}kbit" ceil "${DOWN}kbit" burst 32k

# Filtre : tout le trafic à destination de l'IP cliente
tc filter add dev "$IFACE" protocol ip parent 1:0 prio 2 u32 \
    match ip dst "$IP"/32 flowid 1:$CLASSID

echo "[tc-add] OK pour $IP"
