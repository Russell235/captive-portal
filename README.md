# Portail Captif — Sécurisation de l'Accès Internet en Milieu Scolaire

##  Description du Projet

Ce projet est un **portail captif open-source** conçu pour **sécuriser 
l'accès Internet dans les établissements scolaires**. Il fournit un 
accès Wi-Fi authentifié, surveillé et à bande passante gérée pour les 
élèves, les enseignants et les administrateurs.

Le système est déployé sur un **Raspberry Pi** agissant comme un 
serveur complet et autonome : il gère le point d'accès Wi-Fi, le DHCP, 
le DNS, le portail captif, l'authentification, la base de données et 
la gestion de la bande passante.

##  Problématique

Les établissements scolaires font face à plusieurs défis liés à 
l'accès Internet non contrôlé :

1. **Accès non sécurisé** — Les réseaux Wi-Fi ouverts permettent à 
   n'importe qui de se connecter, créant des risques de sécurité et 
   une congestion de la bande passante.

2. **Absence d'authentification** — Sans identification des 
   utilisateurs, il est impossible de savoir qui utilise le réseau, 
   quand et à quelle fin.

3. **Abus de bande passante** — Quelques utilisateurs peuvent 
   consommer toute la bande passante disponible (streaming, 
   téléchargements), dégradant l'expérience pour tous.

4. **Absence de Qualité de Service (QoS)** — Tous les utilisateurs 
   partagent la même connexion sans différenciation entre la navigation 
   régulière et les activités critiques (examens en ligne, 
   visioconférence).

5. **Absence de traçabilité** — Sans journaux ni suivi des sessions, 
   il est impossible d'enquêter sur des incidents ou de générer des 
   rapports d'utilisation.

6. **Coût élevé des solutions commerciales** — Les solutions 
   d'entreprise (Cisco ISE, Aruba ClearPass) sont coûteuses et 
   nécessitent du matériel spécialisé, les rendant inaccessibles aux 
   petits et moyens établissements.

##  Solution Proposée

Notre solution répond à ces défis en fournissant :

- **Authentification** — Les élèves se connectent avec leur matricule 
  et mot de passe (envoyé par email), garantissant que seuls les 
  utilisateurs autorisés accèdent au réseau.

- **Stack Open-Source** — Construit entièrement avec des outils 
  open-source (openNDS, Node.js, React, PostgreSQL, Raspberry Pi OS), 
  éliminant les coûts de licence.

- **Gestion Intelligente de la Bande Passante** — Trois profils 
  différenciés (restricted, normal, priority) avec adaptation 
  contextuelle :
  - **Multiplicateurs horaires** (heures de cours, pause déjeuner, 
    nuit, weekend)
  - **Boost de session d'examen** (automatique ×2 pendant les examens)

- **Suivi des Sessions** — Chaque connexion est enregistrée (IP, MAC, 
  durée de session, bande passante utilisée) pour le reporting et 
  l'audit.

- **Tableau de Bord Administrateur** — Interface web pour gérer les 
  élèves, les profils, les sessions d'examen et surveiller les 
  sessions en direct.

- **Compatibilité Multi-Plateforme** — Testé sur Android, iOS, 
  Windows et macOS.

##  Architecture

Le système est composé de trois couches principales :

### 1. Couche Réseau
- **hostapd** — Point d'accès Wi-Fi ("RaspAP")
- **dnsmasq** — DHCP (10.10.0.10 - 10.10.0.100) et DNS
- **NAT + forwarding** — Route le trafic de wlan0 vers eth0
- **wlan0** — Interface LAN (10.10.0.1)
- **eth0** — Interface WAN (192.168.8.121)

### 2. Couche Portail Captif
- **openNDS 10.3.1** — Portail captif avec Forward Authentication 
  Service (FAS)
- **FAS** — Redirige vers le backend Node.js (http://10.10.0.1:443/)
- **Jardin clos** — Autorise uniquement les ports essentiels avant 
  l'authentification

### 3. Couche Applicative
- **Backend** — Node.js 20 + Express (API REST, authentification, 
  gestion des sessions)
- **Frontend** — React 19 + Tailwind 4 (portail élève + tableau de 
  bord admin)
- **Base de données** — PostgreSQL 17 (15 tables : students, devices, 
  sessions, profiles, exam_sessions, etc.)
- **QoS** — tc/HTB pour la limitation de bande passante
- **Email** — Nodemailer (SMTP Gmail)

##  Technologies

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Système d'exploitation | Raspberry Pi OS | Debian 13 |
| Portail captif | openNDS | 10.3.1 |
| Backend | Node.js + Express | 20 / 5.x |
| Frontend | React + Vite | 19 / 8.x |
| Base de données | PostgreSQL | 17 |
| Serveur web | Apache | 2.x |
| Email | Nodemailer | - |
| Authentification | JWT + bcrypt | - |
| QoS | tc / HTB | - |
| Services réseau | hostapd, dnsmasq | - |

## Structure du Projet
captive-portal/
├── backend/ # Backend Node.js Express
│ ├── config/ # Configuration base de données
│ ├── controllers/ # Logique métier
│ ├── middleware/ # Auth, admin, gestion erreurs
│ ├── routes/ # Routes API
│ ├── services/ # Services externes
│ ├── utils/ # Utilitaires (bandwidth, email, tokens)
│ └── server.js # Point d'entrée
├── captive_portal_frontend/ # Frontend React
│ ├── src/
│ │ ├── components/ # Composants UI réutilisables
│ │ ├── pages/ # Pages élève + admin
│ │ ├── lib/ # Services API, auth
│ │ └── App.jsx # Application principale
│ └── package.json
├── scripts/ # Scripts de gestion bande passante
│ ├── tc-init.sh # Initialise HTB sur wlan0
│ ├── tc-add.sh # Ajoute classe client
│ ├── tc-remove.sh # Supprime classe client
│ └── tc-list.sh # Liste classes actives
└── README.md
##  Fonctionnalités

### Pour les Élèves
- Connexion au Wi-Fi avec redirection automatique vers le portail
- Authentification avec matricule + mot de passe
- Accès Internet après connexion réussie
- Bande passante ajustée automatiquement selon profil et heure
- Déconnexion (Sign Out)

### Pour les Administrateurs
- Gestion des élèves (créer, modifier, supprimer)
- Attribution des profils de bande passante (restricted, normal, priority)
- Création de sessions d'examen avec boost automatique
- Surveillance des sessions actives et appareils
- Consultation des logs et journal d'audit
- Génération de rapports

### Gestion de la Bande Passante
- **3 profils** : restricted (1 Mbps), normal (2 Mbps), priority (5 Mbps)
- **Multiplicateurs horaires** : heures de cours (×1.5), déjeuner (×0.7), 
  soirée (×1.0), nuit (×0.5)
- **Boost examen** : multiplicateur automatique (défaut ×2) pendant 
  les sessions d'examen
- **Application dynamique** : la bande passante est appliquée à la 
  connexion via tc/HTB

##  Tests

| OS | Appareil | Résultat |
|----|----------|----------|
| Android | Redmi Note 13 | ✅ Réussi |
| iOS | iPhone 13, 12 | ✅ Réussi |
| Windows | Lenovo Laptop | ✅ Réussi |
| macOS | MacBook Air | ✅ Réussi |

**Précision de la bande passante** : ~95% (1.8-1.9 Mbps mesurés 
pour 2 Mbps demandés)

##  Sécurité

- Mots de passe hachés avec **bcrypt**
- Sessions sécurisées avec **JWT**
- Identifiants SMTP dans `.env` (non commités sur Git)
- Identifiants base de données protégés
- Prêt pour HTTPS (port 443)
- Timeout de session : 12 heures (configurable)

##  Documentation

Ce projet fait partie d'un **Projet de Fin d'Études (PFE)** à 
The ICT University, Faculté des Technologies de l'Information et 
de la communication


## Auteur

**Russell Lewis Soh**  
Licence en reseau et securite  
The ICT University

##  Licence

Ce projet est sous licence **GNU General Public License v3.0** — 
voir le fichier LICENSE pour plus de détails.

##  Remerciements

- La communauté openNDS pour l'excellente solution de portail captif
- La Fondation Raspberry Pi
- The ICT University pour le support académique
- Mon superviseur pour ses conseils tout au long du projet

## Contact

Pour toute question ou collaboration :
- **Email** : russellelewislib@gmail.com
- **GitHub** : [@Russell235](https://github.com/Russell235)
