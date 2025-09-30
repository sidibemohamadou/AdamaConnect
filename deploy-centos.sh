#!/bin/bash

echo "🚀 Déploiement Serveur avec PostgreSQL - ADAMAConnect (Sans Clonage Git)"
echo "======================================================================"
echo "📋 Système détecté: CentOS 10 Stream"
echo ""

# Variables de configuration ..
APP_NAME="ADAMAConnect"
APP_DIR="/var/www/$APP_NAME"
SERVICE_USER="nginx"
NGINX_CONF_DIR="/etc/nginx/conf.d"
DB_NAME="adama_connect"
DB_USER="adama_user"
DB_PASSWORD="adama_secure_password_2025"
PORT=5001

# Vérifier les privilèges root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

echo "🔄 Mise à jour du système..."
dnf update -y

echo "📦 Installation des dépendances système..."
# 'git' n'est plus requis ici
dnf install -y curl nginx postgresql postgresql-server postgresql-contrib

# Installer Node.js 18+
if ! command -v node &> /dev/null; then
    echo "📦 Installation de Node.js..."
    dnf module install -y nodejs:18/common
fi

echo "✅ Node.js $(node -v) installé"

# Installer PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation de PM2..."
    npm install -g pm2
fi

echo "🗄️ Configuration de PostgreSQL..."
# Initialiser PostgreSQL si nécessaire
if [ ! -f /var/lib/pgsql/data/postgresql.conf ]; then
    echo "🔧 Initialisation de PostgreSQL..."
    postgresql-setup --initdb
fi

# Démarrer et activer PostgreSQL
systemctl enable --now postgresql

echo "🗄️ Création de la base de données et de l'utilisateur..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "📁 Création du répertoire d'application..."
mkdir -p $APP_DIR
chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR

echo "⚠️ ATTENTION : Le code source DOIT être manuellement placé dans $APP_DIR"
cd $APP_DIR

echo "📦 Installation des dépendances de l'application..."
# Cette étape nécessite que le fichier package.json soit dans $APP_DIR
sudo -u $SERVICE_USER npm install

echo "🏗️ Build de l'application..."
sudo -u $SERVICE_USER npm run build

echo "⚙️ Configuration des variables d'environnement..."
cat > .env << EOF
NODE_ENV=production
PORT=$PORT
SESSION_SECRET=adama-connect-secret-key-2025
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
PGHOST=localhost
PGPORT=5432
PGUSER=$DB_USER
PGPASSWORD=$DB_PASSWORD
PGDATABASE=$DB_NAME
APP_NAME="ADAMAConnect"
EOF

chown $SERVICE_USER:$SERVICE_USER .env

echo "🔧 Configuration de Nginx..."
cat > $NGINX_CONF_DIR/$APP_NAME.conf << EOF
server {
    listen 80;
    server_name _;

    location /$APP_NAME/ {
        proxy_pass http://localhost:$PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Supprimer la conf par défaut
rm -f $NGINX_CONF_DIR/default.conf

# Tester et redémarrer Nginx
nginx -t && systemctl enable --now nginx

echo "🚀 Configuration PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'server/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

chown $SERVICE_USER:$SERVICE_USER ecosystem.config.js

echo "🚀 Démarrage de l'application avec PM2..."
sudo -u $SERVICE_USER pm2 stop $APP_NAME 2>/dev/null || true
sudo -u $SERVICE_USER pm2 delete $APP_NAME 2>/dev/null || true
sudo -u $SERVICE_USER pm2 start ecosystem.config.js
sudo -u $SERVICE_USER pm2 save

# Pare-feu
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
fi

# SELinux
if command -v setsebool &> /dev/null; then
    setsebool -P httpd_can_network_connect 1
fi

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo "🌐 Application accessible : http://$(hostname -I | awk '{print $1}')/$APP_NAME/"
echo "🗄️ Base de données PostgreSQL configurée : $DB_NAME"
echo "📊 Vérifications utiles :"
echo "   - Statut de l'app: sudo -u nginx pm2 status"
echo "   - Logs de l'app: sudo -u nginx pm2 logs"
echo "   - Statut PostgreSQL: systemctl status postgresql"
echo "   - Statut Nginx: systemctl status nginx"
