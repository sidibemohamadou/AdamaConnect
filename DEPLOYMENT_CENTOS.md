# 🚀 Guide de Déploiement CentOS - AeroRecrutement

## 📋 Vue d'ensemble

Ce guide détaille le déploiement complet de l'application AeroRecrutement sur un VPS CentOS depuis GitHub, incluant la configuration de l'environnement, la base de données, et la mise en production.

## 🔧 Prérequis VPS

### Configuration Minimale
- **OS**: CentOS 8+ / Rocky Linux 8+ / AlmaLinux 8+
- **RAM**: 2GB minimum (4GB recommandé)
- **Stockage**: 20GB minimum
- **CPU**: 1 vCPU minimum
- **Accès**: Root ou sudo

### Ports Requis
- **80**: HTTP (Nginx)
- **443**: HTTPS (SSL)
- **5001**: Application Node.js (interne)
- **5432**: PostgreSQL (interne)
- **22**: SSH (administration)

---

## 🛠️ Étape 1: Préparation du Système

### Mise à jour et outils de base

```bash
# Connexion au VPS
ssh root@votre-ip-vps

# Mise à jour complète du système
dnf update -y

# Installation des outils essentiels
dnf install -y git curl wget nano vim unzip firewalld

# Configuration du firewall
systemctl enable --now firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=5001/tcp
firewall-cmd --reload
```

### Installation Node.js 18

```bash
# Installation du module Node.js 18
dnf module list nodejs
dnf module install -y nodejs:18/common

# Vérification
node --version
npm --version

# Installation PM2 pour la gestion des processus
npm install -g pm2
```

### Installation PostgreSQL

```bash
# Installation PostgreSQL 14
dnf install -y postgresql postgresql-server postgresql-contrib

# Initialisation de la base
postgresql-setup --initdb

# Démarrage et activation
systemctl enable --now postgresql

# Vérification
systemctl status postgresql
```

### Installation Nginx

```bash
# Installation Nginx
dnf install -y nginx

# Démarrage et activation
systemctl enable --now nginx

# Vérification
systemctl status nginx
curl http://localhost
```

---

## 🗄️ Étape 2: Configuration PostgreSQL

### Création de la base et utilisateur

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans psql, exécuter:
```

```sql
-- Créer l'utilisateur de production
CREATE USER aerorecrut_prod WITH PASSWORD 'AeroRecrut2024!SecurePass';

-- Créer la base de données
CREATE DATABASE aerorecrut_prod OWNER aerorecrut_prod;

-- Accorder tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE aerorecrut_prod TO aerorecrut_prod;

-- Quitter psql
\q
```

### Configuration des connexions

```bash
# Éditer la configuration PostgreSQL
nano /var/lib/pgsql/data/postgresql.conf

# Décommenter et modifier:
listen_addresses = 'localhost'
port = 5432

# Éditer l'authentification
nano /var/lib/pgsql/data/pg_hba.conf

# Ajouter cette ligne après les commentaires:
local   aerorecrut_prod   aerorecrut_prod   md5

# Redémarrer PostgreSQL
systemctl restart postgresql
```

### Test de connexion

```bash
# Tester la connexion
psql -U aerorecrut_prod -d aerorecrut_prod -h localhost

# Si succès, quitter avec \q
```

---

## 📦 Étape 3: Déploiement de l'Application

### Création de l'utilisateur de déploiement

```bash
# Créer l'utilisateur aerorecrut
useradd -m -s /bin/bash aerorecrut

# Créer le répertoire de l'application
mkdir -p /opt/aerorecrut
chown aerorecrut:aerorecrut /opt/aerorecrut

# Créer le répertoire des uploads
mkdir -p /opt/aerorecrut/uploads/objects/uploads
chown -R aerorecrut:aerorecrut /opt/aerorecrut/uploads
```

### Clonage depuis GitHub

```bash
# Se connecter en tant qu'utilisateur aerorecrut
sudo -u aerorecrut bash

# Aller dans le répertoire
cd /opt/aerorecrut

# Cloner le dépôt (remplacer par votre URL)
git clone https://github.com/votre-username/aerorecrut.git .

# Vérifier les fichiers
ls -la
```

### Configuration de l'environnement

```bash
# Créer le fichier de configuration production
sudo -u aerorecrut nano /opt/aerorecrut/.env.production
```

```bash
# Contenu du fichier .env.production
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://aerorecrut_prod:AeroRecrut2024!SecurePass@localhost:5432/aerorecrut_prod
SESSION_SECRET=AeroRecrut2024SessionSecretTresSecurise123456789
DEV_LOGIN_ENABLED=false
PRIVATE_OBJECT_DIR=/opt/aerorecrut/uploads
PUBLIC_OBJECT_SEARCH_PATHS=/opt/aerorecrut/uploads
LOG_LEVEL=info
```

### Installation et build

```bash
# Installation des dépendances de production
sudo -u aerorecrut npm ci --production

# Build de l'application
sudo -u aerorecrut npm run build

# Vérifier que le build existe
ls -la dist/
```

---

## 🔄 Étape 4: Migrations et Données

### Application des migrations

```bash
# Appliquer les migrations de base de données
sudo -u aerorecrut npm run db:push
```

### Injection des données de démonstration

```bash
# Injecter les données de test (optionnel pour la démo)
sudo -u aerorecrut psql -U aerorecrut_prod -d aerorecrut_prod -h localhost -f database/seed-data.sql

# Créer les fichiers de test
sudo -u aerorecrut chmod +x database/test-files/create-test-documents.sh
sudo -u aerorecrut ./database/test-files/create-test-documents.sh
```

---

## ⚙️ Étape 5: Configuration des Services

### Service Systemd

```bash
# Créer le fichier de service
nano /etc/systemd/system/aerorecrut.service
```

```ini
[Unit]
Description=AeroRecrutement - Plateforme de Gestion des Candidatures
Documentation=https://github.com/votre-repo/aerorecrut
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=aerorecrut
Group=aerorecrut
WorkingDirectory=/opt/aerorecrut
EnvironmentFile=/opt/aerorecrut/.env.production
ExecStart=/usr/bin/node dist/index.js
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=30
Restart=always
RestartSec=5
StartLimitInterval=60s
StartLimitBurst=3

# Logs
StandardOutput=journal
StandardError=journal
SyslogIdentifier=aerorecrut

# Sécurité
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/aerorecrut /var/log/aerorecrut /tmp
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes
RestrictRealtime=yes
RestrictNamespaces=yes

# Ressources
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
```

```bash
# Activer et démarrer le service
systemctl daemon-reload
systemctl enable aerorecrut
systemctl start aerorecrut

# Vérifier le statut
systemctl status aerorecrut
```

### Configuration Nginx

```bash
# Créer la configuration Nginx
nano /etc/nginx/conf.d/aerorecrut.conf
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Logs
    access_log /var/log/nginx/aerorecrut_access.log;
    error_log /var/log/nginx/aerorecrut_error.log;
    
    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Gestion des uploads de fichiers
    client_max_body_size 50M;
    
    # Proxy vers l'application Node.js
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:5001/health;
        access_log off;
    }
}
```

```bash
# Tester la configuration Nginx
nginx -t

# Recharger Nginx
systemctl reload nginx
```

---

## 🔐 Étape 6: Configuration SSL (Optionnel)

### Installation Certbot

```bash
# Installation Certbot
dnf install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Configuration du renouvellement automatique
crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## ✅ Étape 7: Vérification du Déploiement

### Tests de fonctionnement

```bash
# Vérifier que l'application répond
curl http://localhost:5001/api/jobs
curl http://votre-domaine.com/api/jobs

# Vérifier les logs
journalctl -u aerorecrut -f

# Vérifier Nginx
tail -f /var/log/nginx/aerorecrut_access.log
```

### Vérification des services

```bash
# Statut de tous les services
systemctl status aerorecrut nginx postgresql

# Vérifier les ports
netstat -tlnp | grep -E ':(80|443|5001|5432)'

# Vérifier les processus
ps aux | grep -E '(node|nginx|postgres)'
```

---

## 🔄 Étape 8: Mise à jour et Maintenance

### Script de mise à jour

```bash
# Créer un script de mise à jour
nano /opt/aerorecrut/update.sh
```

```bash
#!/bin/bash
set -e

echo "🔄 Mise à jour AeroRecrutement..."

# Aller dans le répertoire
cd /opt/aerorecrut

# Sauvegarder la base
pg_dump -U aerorecrut_prod -h localhost aerorecrut_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm ci --production

# Rebuild l'application
npm run build

# Appliquer les migrations
npm run db:push

# Redémarrer l'application
systemctl restart aerorecrut

echo "✅ Mise à jour terminée !"
```

```bash
# Rendre le script exécutable
chmod +x /opt/aerorecrut/update.sh
chown aerorecrut:aerorecrut /opt/aerorecrut/update.sh
```

### Sauvegarde automatique

```bash
# Créer un script de sauvegarde
nano /opt/aerorecrut/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/aerorecrut/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Sauvegarde de la base
pg_dump -U aerorecrut_prod -h localhost aerorecrut_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Sauvegarde des uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz uploads/

# Nettoyer les anciennes sauvegardes (garder 7 jours)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Sauvegarde terminée: $DATE"
```

```bash
# Automatiser les sauvegardes
crontab -e
# Ajouter: 0 2 * * * /opt/aerorecrut/backup.sh
```

---

## 🚨 Plan de Rollback

### Procédure de Rollback Rapide

```bash
# 1. Arrêter l'application
systemctl stop aerorecrut

# 2. Revenir à la version précédente
cd /opt/aerorecrut
git log --oneline -10  # Voir les derniers commits
git checkout COMMIT_HASH_PRECEDENT

# 3. Restaurer la base si nécessaire
# Lister les sauvegardes disponibles
ls -la backups/

# Restaurer une sauvegarde
dropdb -U postgres aerorecrut_prod
createdb -U postgres -O aerorecrut_prod aerorecrut_prod
psql -U aerorecrut_prod -d aerorecrut_prod < backups/db_backup_YYYYMMDD_HHMMSS.sql

# 4. Rebuild et redémarrer
sudo -u aerorecrut npm ci --production
sudo -u aerorecrut npm run build
systemctl start aerorecrut

# 5. Vérifier le fonctionnement
systemctl status aerorecrut
curl http://localhost:5001/api/jobs
```

---

## 📊 Monitoring et Logs

### Consultation des logs

```bash
# Logs de l'application
journalctl -u aerorecrut -f

# Logs Nginx
tail -f /var/log/nginx/aerorecrut_access.log
tail -f /var/log/nginx/aerorecrut_error.log

# Logs PostgreSQL
tail -f /var/lib/pgsql/data/log/postgresql-*.log
```

### Monitoring des ressources

```bash
# Utilisation CPU/RAM
top
htop

# Espace disque
df -h

# Connexions réseau
netstat -tlnp

# Processus de l'application
ps aux | grep node
```

---

## 🔐 Sécurisation

### Configuration du firewall

```bash
# Règles de firewall strictes
firewall-cmd --permanent --remove-service=dhcpv6-client
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="0.0.0.0/0" port protocol="tcp" port="22" accept'
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="0.0.0.0/0" port protocol="tcp" port="80" accept'
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="0.0.0.0/0" port protocol="tcp" port="443" accept'
firewall-cmd --reload
```

### Sécurisation des fichiers

```bash
# Permissions strictes
chmod 750 /opt/aerorecrut
chmod 640 /opt/aerorecrut/.env.production
chown -R aerorecrut:aerorecrut /opt/aerorecrut

# Sécuriser PostgreSQL
sudo -u postgres psql -c "ALTER USER aerorecrut_prod WITH PASSWORD 'NouveauMotDePasseTresSecurise2024!';"
```

### Fail2ban (Protection SSH)

```bash
# Installation Fail2ban
dnf install -y epel-release
dnf install -y fail2ban

# Configuration
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
nano /etc/fail2ban/jail.local

# Activer la protection SSH
systemctl enable --now fail2ban
```

---

## 🧪 Tests Post-Déploiement

### Checklist de Validation

```bash
# 1. Vérifier que l'application répond
curl -I http://votre-domaine.com
curl http://votre-domaine.com/api/jobs

# 2. Tester l'authentification
curl -X POST http://votre-domaine.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mohamed.admin@aerorecrut.com","password":"admin123"}'

# 3. Vérifier la base de données
psql -U aerorecrut_prod -d aerorecrut_prod -c "SELECT COUNT(*) FROM users;"

# 4. Tester l'upload (après connexion)
# Via l'interface web

# 5. Vérifier les logs
journalctl -u aerorecrut --since "5 minutes ago"
```

### Tests Fonctionnels

1. **✅ Page d'accueil**: `http://votre-domaine.com`
2. **✅ Connexion admin**: `http://votre-domaine.com/admin/login`
3. **✅ Connexion candidat**: `http://votre-domaine.com/login`
4. **✅ API Jobs**: `http://votre-domaine.com/api/jobs`
5. **✅ DevLogin désactivé**: `http://votre-domaine.com/dev-login` (doit être inaccessible)

---

## 🔧 Dépannage

### Problèmes Courants

#### Application ne démarre pas
```bash
# Vérifier les logs
journalctl -u aerorecrut -n 50

# Vérifier la configuration
sudo -u aerorecrut node -c "console.log(process.env.DATABASE_URL)"

# Tester la connexion DB
sudo -u aerorecrut psql $DATABASE_URL -c "SELECT 1;"
```

#### Erreur de connexion base de données
```bash
# Vérifier PostgreSQL
systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"

# Vérifier les connexions
netstat -tlnp | grep 5432
```

#### Nginx ne sert pas l'application
```bash
# Vérifier la configuration
nginx -t

# Vérifier les logs
tail -f /var/log/nginx/error.log

# Redémarrer Nginx
systemctl restart nginx
```

#### Upload de fichiers ne fonctionne pas
```bash
# Vérifier les permissions
ls -la /opt/aerorecrut/uploads/
chown -R aerorecrut:aerorecrut /opt/aerorecrut/uploads/
chmod -R 755 /opt/aerorecrut/uploads/
```

---

## 📈 Optimisations Production

### Performance

```bash
# Configuration PM2 pour clustering
sudo -u aerorecrut nano /opt/aerorecrut/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'aerorecrut',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: '/var/log/aerorecrut/err.log',
    out_file: '/var/log/aerorecrut/out.log',
    log_file: '/var/log/aerorecrut/combined.log',
    time: true
  }]
}
```

### Optimisation PostgreSQL

```bash
# Éditer la configuration PostgreSQL
nano /var/lib/pgsql/data/postgresql.conf

# Optimisations recommandées:
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
```

---

## 📋 Checklist de Déploiement

### Avant le Déploiement
- [ ] VPS configuré avec CentOS 8+
- [ ] Accès SSH fonctionnel
- [ ] Nom de domaine pointé vers le VPS
- [ ] Dépôt GitHub accessible
- [ ] Variables d'environnement préparées

### Pendant le Déploiement
- [ ] Système mis à jour
- [ ] Node.js 18 installé
- [ ] PostgreSQL configuré
- [ ] Nginx installé
- [ ] Application clonée et buildée
- [ ] Base de données migrée
- [ ] Services systemd configurés

### Après le Déploiement
- [ ] Application accessible via HTTP
- [ ] Connexions de test fonctionnelles
- [ ] Upload de fichiers opérationnel
- [ ] DevLogin désactivé
- [ ] SSL configuré (si applicable)
- [ ] Monitoring en place
- [ ] Sauvegardes configurées

---

## 🆘 Support et Maintenance

### Commandes Utiles

```bash
# Redémarrer l'application
systemctl restart aerorecrut

# Voir les logs en temps réel
journalctl -u aerorecrut -f

# Vérifier l'état de tous les services
systemctl status aerorecrut nginx postgresql

# Mise à jour rapide
cd /opt/aerorecrut && ./update.sh

# Sauvegarde manuelle
cd /opt/aerorecrut && ./backup.sh
```

### Contacts d'Urgence
- **Développeur**: Mohamed
- **Logs**: `/var/log/nginx/` et `journalctl -u aerorecrut`
- **Documentation**: Ce guide + README.md

---

## 🎯 Validation Finale

### Tests de Réception

1. **✅ Accès public**: Page d'accueil charge correctement
2. **✅ Authentification**: Tous les comptes de test fonctionnent
3. **✅ Candidatures**: Flow complet candidat → admin
4. **✅ Upload**: Documents s'uploadent et sont accessibles
5. **✅ RH**: Fiches de paie et gestion employés
6. **✅ Sécurité**: DevLogin désactivé, SSL actif
7. **✅ Performance**: Temps de réponse < 3 secondes
8. **✅ Monitoring**: Logs accessibles et clairs

### Métriques de Succès
- **Uptime**: 99.9%
- **Temps de réponse**: < 2 secondes
- **Sécurité**: Aucune vulnérabilité critique
- **Fonctionnalité**: 100% des features critiques opérationnelles

---

**🚀 Déploiement CentOS Terminé avec Succès !**

*Guide validé pour CentOS 8+, Rocky Linux 8+, AlmaLinux 8+*