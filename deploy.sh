#!/bin/bash

# Script de déploiement automatique pour FOX-REVIEWS Front
# Usage: ./deploy.sh

set -e

echo "🚀 Démarrage du déploiement FOX-REVIEWS Front..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PORT=3005
APP_NAME="fox-reviews-front"

echo ""
echo "📦 Étape 1/4 : Installation des dépendances..."
npm install --legacy-peer-deps

echo ""
echo "🔨 Étape 2/4 : Build de l'application..."
npm run build

echo ""
echo "📁 Création du dossier logs..."
mkdir -p logs

echo ""
echo "🔄 Étape 3/4 : Configuration PM2..."

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null
then
    echo -e "${RED}❌ PM2 n'est pas installé. Installation...${NC}"
    npm install -g pm2
fi

# Arrêter l'application si elle existe déjà
if pm2 list | grep -q "$APP_NAME"; then
    echo "Arrêt de l'ancienne instance..."
    pm2 delete $APP_NAME
fi

# Démarrer avec PM2
echo "Démarrage de l'application sur le port $PORT..."
pm2 start ecosystem.config.cjs

# Sauvegarder la configuration PM2
pm2 save

echo ""
echo "🔥 Étape 4/4 : Configuration du Firewall (UFW)..."
echo -e "${YELLOW}⚠️  Commandes à exécuter avec sudo si UFW est actif :${NC}"
echo "sudo ufw allow $PORT/tcp"
echo "sudo ufw reload"

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo "📊 Status de l'application :"
pm2 status

echo ""
echo "🌐 L'application devrait être accessible sur :"
echo "   - Local: http://localhost:$PORT"
echo "   - Externe: http://VOTRE_IP_SERVEUR:$PORT"
echo ""
echo "📝 Commandes utiles :"
echo "   - Voir les logs: pm2 logs $APP_NAME"
echo "   - Redémarrer: pm2 restart $APP_NAME"
echo "   - Arrêter: pm2 stop $APP_NAME"
echo "   - Monitorer: pm2 monit"
echo ""
echo "📖 Pour plus d'informations, consultez DEPLOY_INSTRUCTIONS.md"
