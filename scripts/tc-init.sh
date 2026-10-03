#!/bin/bash
# tc-init.sh — Initialise HTB sur wlan0
# Usage : sudo ./tc-init.sh

set -e

IFACE="wlan0"
ROOT_CLASS="1:1"
ROOT_RATE="100mbit"

echo "[tc-init] Initialisation de HTB sur $IFACE"

# Supprimer toute configuration existante
tc qdisc del dev "$IFACE" root 2>/dev/null || true

# Créer la qdisc racine HTB
tc qdisc add dev "$IFACE" root handle 1: htb default 30

# Classe racine (limite globale)
tc class add dev "$IFACE" parent 1: classid "$ROOT_CLASS" htb \
    rate "$ROOT_RATE" ceil "$ROOT_RATE"

# Classe par défaut (fallback)
tc class add dev "$IFACE" parent "$ROOT_CLASS" classid 1:30 htb \
    rate 10mbit ceil "$ROOT_RATE"

# Classe pour le serveur (portail, pas de limite)
tc class add dev "$IFACE" parent "$ROOT_CLASS" classid 1:100 htb \
    rate "$ROOT_RATE" ceil "$ROOT_RATE"

# Filtre : trafic vers le serveur
tc filter add dev "$IFACE" protocol ip parent 1:0 prio 1 u32 \
    match ip dst 10.10.0.1/32 flowid 1:100

echo "[tc-init] OK"
tc class show dev "$IFACE"
