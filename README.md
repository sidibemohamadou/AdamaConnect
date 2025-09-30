# 🛫 AeroRecrutement - Plateforme de Gestion des Candidatures

## 📋 Vue d'ensemble

AeroRecrutement est une plateforme complète de gestion des candidatures et des ressources humaines spécialement conçue pour le secteur aéroportuaire en Guinée-Bissau. L'application permet la gestion complète du cycle de vie des candidatures, de l'onboarding des employés, et des processus RH.

## 🚀 Installation Locale

### Prérequis

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **pgAdmin** (recommandé pour la gestion de la base)
- **Git**

### 1. Clonage et Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-repo/aerorecrut.git
cd aerorecrut

# Installer les dépendances
npm install
```

### 2. Configuration de la Base de Données

#### Option A: Script Automatique
```bash
# Rendre le script exécutable
chmod +x setup-database.sh

# Configurer la base pour le développement
./setup-database.sh development
```

#### Option B: Configuration Manuelle
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base et l'utilisateur
CREATE DATABASE aerorecrut;
CREATE USER aerorecrut_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE aerorecrut TO aerorecrut_user;
```

### 3. Variables d'Environnement

```bash
# Copier le template
cp .env.template .env.development

# Éditer le fichier .env.development
DATABASE_URL=postgresql://aerorecrut_user:votre_mot_de_passe@localhost:5432/aerorecrut
NODE_ENV=development
PORT=5001
SESSION_SECRET=votre_secret_session_unique
DEV_LOGIN_ENABLED=true
```

### 4. Injection des Données de Test

#### Via pgAdmin (Recommandé)
1. Ouvrir pgAdmin
2. Se connecter à votre serveur PostgreSQL
3. Sélectionner la base `aerorecrut`
4. Ouvrir l'outil de requête (Query Tool)
5. Ouvrir le fichier `database/seed-data.sql`
6. Exécuter le script complet
7. Vérifier les données dans les tables

#### Via ligne de commande
```bash
# Appliquer les migrations
npm run db:push

# Injecter les données de test
psql -U aerorecrut_user -d aerorecrut -f database/seed-data.sql
```

### 5. Création des Fichiers de Test

```bash
# Créer les documents de test
chmod +x database/test-files/create-test-documents.sh
./database/test-files/create-test-documents.sh
```

### 6. Démarrage de l'Application

```bash
# Mode développement
npm run dev

# Ou utiliser le script
chmod +x start-dev.sh
./start-dev.sh
```

L'application sera disponible sur `http://localhost:5001`

## 🔐 Comptes de Connexion pour Tests

### 🛡️ Super Administrateur (Mohamed)
- **URL**: `/admin/login` ou `/api/login`
- **Email**: `mohamed.admin@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Accès**: Toutes les fonctionnalités, gestion utilisateurs

### 👥 Ressources Humaines (Marie)
- **URL**: `/admin/login`
- **Email**: `marie.rh@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Accès**: Gestion RH, paie, employés, candidatures

### 🎯 Recruteur (Pierre)
- **URL**: `/admin/login`
- **Email**: `pierre.recruteur@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Accès**: Gestion candidatures, entretiens, notation

### 👔 Manager (Sophie)
- **URL**: `/admin/login`
- **Email**: `sophie.manager@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Accès**: Gestion équipe, évaluations performance

### 👤 Candidats de Test
- **URL**: `/login`
- **Comptes disponibles**:
  - `jean.dupont@example.com` / `candidate123`
  - `fatou.fall@example.com` / `candidate123`
  - `amadou.ba@example.com` / `candidate123`
  - `aissatou.diop@example.com` / `candidate123`
  - `moussa.sow@example.com` / `candidate123`
  - `mariama.kane@example.com` / `candidate123`

### 🔧 DevLogin (Développement Seulement)
- **URL**: `/dev-login`
- **Activation**: Variable `DEV_LOGIN_ENABLED=true` dans `.env`
- **Sécurité**: Audit automatique, désactivable en production

## 🗺️ Navigation et Fonctionnalités

### Pages Principales

| Rôle | URL | Description |
|------|-----|-------------|
| Public | `/` | Page d'accueil avec offres d'emploi |
| Candidat | `/login` | Connexion candidat |
| Admin/RH | `/admin/login` | Connexion administration |
| Dev | `/dev-login` | Connexion développement (dev seulement) |

### Fonctionnalités par Rôle

#### 👤 Candidat
- ✅ Consultation des offres avec filtres avancés
- ✅ Candidature avec upload CV + lettre de motivation
- ✅ Suivi des candidatures avec timeline
- ✅ Complétion de profil en 4 étapes
- ✅ Dashboard personnel avec statistiques
- ✅ Processus d'onboarding avec achievements

#### 🎯 Recruteur
- ✅ Gestion des candidatures assignées
- ✅ Système de notation des candidats
- ✅ Gestion des entretiens
- ✅ Top 10 automatique des candidats

#### 👥 RH
- ✅ Gestion complète des employés
- ✅ Système de paie avec génération PDF
- ✅ Gestion des congés et demandes
- ✅ Processus d'onboarding
- ✅ Gestion des contrats

#### 🛡️ Admin
- ✅ Gestion des offres d'emploi
- ✅ Gestion des utilisateurs et rôles
- ✅ Analytics et KPIs
- ✅ Export CSV des données
- ✅ Audit DevLogin

## 🔍 Tests et Validation

### Checklist QA Pré-Présentation

#### ✅ Authentification
- [ ] Connexion admin avec `mohamed.admin@aerorecrut.com`
- [ ] Connexion candidat avec `jean.dupont@example.com`
- [ ] DevLogin fonctionne en développement
- [ ] Déconnexion propre sur toutes les pages

#### ✅ Candidatures (Flow Critique)
- [ ] Candidat peut voir les offres sur la page d'accueil
- [ ] Filtres fonctionnent (mot-clé, lieu, contrat, expérience)
- [ ] Pagination des résultats
- [ ] Candidature avec upload CV + lettre
- [ ] Documents visibles dans l'interface candidat
- [ ] Timeline de candidature s'affiche

#### ✅ Administration
- [ ] Admin peut créer/modifier/supprimer des offres
- [ ] Liste des candidatures avec filtres
- [ ] Changement de statut des candidatures
- [ ] Export CSV des candidatures
- [ ] Gestion des utilisateurs (admin seulement)

#### ✅ RH
- [ ] Accès au dashboard RH
- [ ] Création de fiches de paie
- [ ] Gestion des employés
- [ ] Processus d'onboarding
- [ ] Gestion des congés

#### ✅ Upload et Documents
- [ ] Upload de CV fonctionne
- [ ] Upload de lettre de motivation
- [ ] Documents accessibles via l'interface
- [ ] Métadonnées enregistrées en base

### Script de Test Rapide

```bash
# Tester les endpoints critiques
curl -X GET http://localhost:5001/api/jobs
curl -X GET http://localhost:5001/api/admin/applications
curl -X GET http://localhost:5001/api/users
```

## 🚀 Déploiement sur VPS CentOS

### Prérequis VPS
- CentOS 8+ ou Rocky Linux 8+
- Accès root ou sudo
- 2GB RAM minimum
- 20GB espace disque

### 1. Préparation du VPS

```bash
# Mise à jour du système
sudo dnf update -y

# Installation des outils de base
sudo dnf install -y git curl wget nano

# Installation Node.js 18
sudo dnf module install -y nodejs:18/common

# Installation PostgreSQL
sudo dnf install -y postgresql postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql

# Installation Nginx
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# Configuration du firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=5001/tcp
sudo firewall-cmd --reload
```

### 2. Configuration de la Base de Données

```bash
# Créer l'utilisateur et la base
sudo -u postgres createuser -P aerorecrut_prod
sudo -u postgres createdb -O aerorecrut_prod aerorecrut_prod

# Configurer PostgreSQL pour les connexions
sudo nano /var/lib/pgsql/data/postgresql.conf
# Décommenter: listen_addresses = 'localhost'

sudo nano /var/lib/pgsql/data/pg_hba.conf
# Ajouter: local aerorecrut_prod aerorecrut_prod md5

sudo systemctl restart postgresql
```

### 3. Déploiement de l'Application

```bash
# Créer l'utilisateur de déploiement
sudo useradd -m -s /bin/bash aerorecrut
sudo mkdir -p /opt/aerorecrut
sudo chown aerorecrut:aerorecrut /opt/aerorecrut

# Cloner le dépôt
sudo -u aerorecrut git clone https://github.com/votre-repo/aerorecrut.git /opt/aerorecrut
cd /opt/aerorecrut

# Configuration de production
sudo -u aerorecrut cp .env.template .env.production
sudo -u aerorecrut nano .env.production
```

### 4. Variables d'Environnement Production

```bash
# Contenu de .env.production
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://aerorecrut_prod:mot_de_passe_securise@localhost:5432/aerorecrut_prod
SESSION_SECRET=secret_session_production_tres_securise
DEV_LOGIN_ENABLED=false
PRIVATE_OBJECT_DIR=/opt/aerorecrut/uploads
```

### 5. Build et Démarrage

```bash
# Installation des dépendances
sudo -u aerorecrut npm ci --production

# Build de l'application
sudo -u aerorecrut npm run build

# Application des migrations
sudo -u aerorecrut npm run db:push

# Injection des données de démo (optionnel)
sudo -u aerorecrut psql -U aerorecrut_prod -d aerorecrut_prod -f database/seed-data.sql
```

### 6. Configuration Nginx

```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/conf.d/aerorecrut.conf
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

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
    }

    client_max_body_size 50M;
}
```

### 7. Service Systemd

```bash
# Créer le service
sudo nano /etc/systemd/system/aerorecrut.service
```

```ini
[Unit]
Description=AeroRecrutement Application
After=network.target postgresql.service

[Service]
Type=simple
User=aerorecrut
WorkingDirectory=/opt/aerorecrut
EnvironmentFile=/opt/aerorecrut/.env.production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Activer et démarrer le service
sudo systemctl daemon-reload
sudo systemctl enable aerorecrut
sudo systemctl start aerorecrut

# Vérifier le statut
sudo systemctl status aerorecrut
```

### 8. Configuration SSL (Optionnel)

```bash
# Installation Certbot
sudo dnf install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configuration DevLogin

### Activation/Désactivation

Le DevLogin est un outil de développement sécurisé qui permet d'émuler différents rôles utilisateur.

#### En Développement
```bash
# Dans .env.development
DEV_LOGIN_ENABLED=true
```

#### En Production (OBLIGATOIRE)
```bash
# Dans .env.production
DEV_LOGIN_ENABLED=false
```

### Utilisation DevLogin

1. Accéder à `/dev-login`
2. Sélectionner un rôle (admin, hr, recruiter, candidate, etc.)
3. Connexion automatique avec audit logging

### Audit DevLogin

Les connexions DevLogin sont automatiquement auditées :
- Timestamp de connexion
- Rôle émulé
- Adresse IP
- User Agent
- Accessible via `/api/admin/dev-login-audit` (admin seulement)

## 📊 Données de Démonstration

### Contenu Injecté

- **4 comptes administrateurs** (admin, hr, recruiter, manager)
- **6 candidats** avec profils complets
- **10 offres d'emploi** variées (aviation, sécurité, tech)
- **12 candidatures** avec différents statuts
- **2 employés actifs** avec contrats
- **4 fiches de paie** (exemples de calculs)
- **3 processus d'onboarding** avec étapes
- **6 achievements système**
- **Documents de test** (CVs, lettres de motivation)

### Vérification des Données

```sql
-- Vérifier les utilisateurs
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Vérifier les candidatures
SELECT status, COUNT(*) FROM applications GROUP BY status;

-- Vérifier les offres
SELECT contract_type, COUNT(*) FROM jobs GROUP BY contract_type;
```

## 🧪 Plan de Tests Manuels

### 1. Test Flow Candidat Complet
1. ✅ Aller sur `/`
2. ✅ Utiliser les filtres de recherche
3. ✅ Se connecter avec `jean.dupont@example.com` / `candidate123`
4. ✅ Compléter le profil si nécessaire
5. ✅ Postuler à une offre avec upload CV
6. ✅ Vérifier la candidature dans "Mes candidatures"
7. ✅ Consulter la timeline de candidature

### 2. Test Flow Admin Complet
1. ✅ Se connecter avec `mohamed.admin@aerorecrut.com` / `admin123`
2. ✅ Accéder au dashboard admin
3. ✅ Créer une nouvelle offre d'emploi
4. ✅ Consulter les candidatures reçues
5. ✅ Modifier le statut d'une candidature
6. ✅ Exporter les candidatures en CSV
7. ✅ Gérer les utilisateurs

### 3. Test Flow RH Complet
1. ✅ Se connecter avec `marie.rh@aerorecrut.com` / `admin123`
2. ✅ Accéder au dashboard RH
3. ✅ Créer une fiche de paie
4. ✅ Gérer les congés
5. ✅ Consulter les employés
6. ✅ Gérer l'onboarding

### 4. Test DevLogin
1. ✅ Aller sur `/dev-login` (dev seulement)
2. ✅ Tester chaque rôle
3. ✅ Vérifier l'audit via admin
4. ✅ Confirmer désactivation en production

## 🔄 Rollback et Maintenance

### Plan de Rollback

```bash
# 1. Sauvegarder la base actuelle
pg_dump -U aerorecrut_prod aerorecrut_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Revenir à la version précédente
cd /opt/aerorecrut
git checkout version-precedente
npm ci --production
npm run build

# 3. Restaurer la base si nécessaire
psql -U aerorecrut_prod -d aerorecrut_prod < backup_file.sql

# 4. Redémarrer l'application
sudo systemctl restart aerorecrut
```

### Maintenance

```bash
# Logs de l'application
sudo journalctl -u aerorecrut -f

# Logs Nginx
sudo tail -f /var/log/nginx/access.log

# Statut des services
sudo systemctl status aerorecrut nginx postgresql
```

## 📁 Structure du Projet

```
aerorecrut/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants UI
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks React
│   │   └── lib/           # Utilitaires
├── server/                # Backend Express
│   ├── auth.ts           # Service d'authentification
│   ├── routes.ts         # Routes API
│   ├── storage.ts        # Couche de données
│   └── index.ts          # Point d'entrée
├── shared/               # Schémas partagés
│   └── schema.ts         # Schémas Zod/Drizzle
├── database/             # Scripts de base de données
│   ├── seed-data.sql     # Données de test
│   └── test-files/       # Fichiers de test
├── uploads/              # Stockage des fichiers
└── docs/                 # Documentation
```

## 🛡️ Sécurité

### Mesures Implémentées
- ✅ Authentification par email/mot de passe avec hash bcrypt
- ✅ Sessions sécurisées stockées en PostgreSQL
- ✅ RBAC (Role-Based Access Control) complet
- ✅ Validation des données avec Zod
- ✅ Upload sécurisé avec ACL
- ✅ Audit DevLogin
- ✅ Protection CSRF
- ✅ Soft delete pour les données critiques

### Configuration Production
- ✅ `DEV_LOGIN_ENABLED=false`
- ✅ `NODE_ENV=production`
- ✅ Sessions sécurisées avec HTTPS
- ✅ Mots de passe forts
- ✅ Firewall configuré

## 📞 Support et Dépannage

### Problèmes Courants

#### Base de données inaccessible
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

#### Application ne démarre pas
```bash
# Vérifier les logs
sudo journalctl -u aerorecrut -n 50
```

#### DevLogin ne fonctionne pas
```bash
# Vérifier la configuration
grep DEV_LOGIN_ENABLED .env.development
```

### Contacts
- **Développeur Principal**: Mohamed
- **Documentation**: Ce README
- **Issues**: GitHub Issues du projet

## 📈 Roadmap

### Version Actuelle (v1.0)
- ✅ Gestion complète des candidatures
- ✅ Système RH de base
- ✅ Onboarding avec achievements
- ✅ Upload de documents
- ✅ Analytics de base

### Prochaines Versions
- 🔄 Intégration email automatique
- 🔄 Notifications push
- 🔄 API mobile
- 🔄 Intégration calendrier externe
- 🔄 Rapports avancés

---

**🎯 Application prête pour la présentation !**

*Dernière mise à jour: $(date)*