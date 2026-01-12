#!/bin/bash

# CodeBid Backend Deployment Script
# Supports: Heroku, Railway, DigitalOcean, AWS

set -e

echo "🚀 CodeBid Backend Deployment"
echo "=============================="
echo ""
echo "Select deployment platform:"
echo "1) Heroku"
echo "2) Railway"
echo "3) DigitalOcean"
echo "4) AWS EC2"
echo "5) Manual (VPS/Server)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo "📦 Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
      echo "❌ Heroku CLI not found. Install from https://devcenter.heroku.com/articles/heroku-cli"
      exit 1
    fi
    
    # Login to Heroku
    heroku login
    
    # Get app name
    read -p "Enter Heroku app name: " app_name
    
    # Create app if it doesn't exist
    heroku create $app_name 2>/dev/null || true
    
    # Add PostgreSQL
    echo "📦 Adding PostgreSQL database..."
    heroku addons:create heroku-postgresql:hobby-dev --app=$app_name 2>/dev/null || true
    
    # Set environment variables
    echo "🔐 Setting environment variables..."
    read -p "Enter JWT_SECRET: " jwt_secret
    read -p "Enter FRONTEND_ORIGIN (e.g., https://your-frontend.com): " frontend_origin
    
    heroku config:set JWT_SECRET=$jwt_secret --app=$app_name
    heroku config:set FRONTEND_ORIGIN=$frontend_origin --app=$app_name
    heroku config:set NODE_ENV=production --app=$app_name
    
    # Deploy
    echo "🚀 Deploying to Heroku..."
    git push heroku main
    
    # Setup database
    echo "📊 Setting up database..."
    heroku run node setup-db.js --app=$app_name
    
    echo "✅ Deployment complete!"
    echo "🌐 Your backend is live at: https://$app_name.herokuapp.com"
    ;;
    
  2)
    echo "📦 Deploying to Railway..."
    echo ""
    echo "1. Go to https://railway.app"
    echo "2. Click 'New Project'"
    echo "3. Select 'Deploy from GitHub repo'"
    echo "4. Select your CODEBID repository"
    echo "5. Configure the backend service:"
    echo "   - Root Directory: codebid-1/backend"
    echo "   - Build Command: npm install"
    echo "   - Start Command: node src/index.js"
    echo "6. Add PostgreSQL database"
    echo "7. Set environment variables:"
    echo "   - JWT_SECRET"
    echo "   - FRONTEND_ORIGIN"
    echo "   - NODE_ENV=production"
    echo ""
    echo "Railway will automatically deploy on push to main!"
    ;;
    
  3)
    echo "📦 Deploying to DigitalOcean..."
    echo ""
    echo "1. Create a new Droplet (Ubuntu 22.04 LTS, $5/month)"
    echo "2. SSH into your droplet:"
    echo "   ssh root@your-droplet-ip"
    echo ""
    echo "3. Run these commands:"
    echo ""
    cat << 'EOF'
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Setup PostgreSQL
sudo -u postgres psql << 'PSQL'
CREATE DATABASE codebid;
CREATE USER codebid_user WITH PASSWORD 'your-secure-password';
ALTER ROLE codebid_user SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE codebid TO codebid_user;
PSQL

# Clone repository
cd /var/www
git clone https://github.com/your-username/CODEBID.git
cd CODEBID/codebid-1/backend

# Create .env file
cat > .env << 'ENV'
PORT=4000
NODE_ENV=production
FRONTEND_ORIGIN=https://your-frontend-url.com
JWT_SECRET=your-secret-key-change-this
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codebid
DB_USER=codebid_user
DB_PASSWORD=your-secure-password
ENV

# Install dependencies
npm install

# Setup database
node setup-db.js

# Install PM2
npm install -g pm2
pm2 start src/index.js --name "codebid-backend"
pm2 startup
pm2 save

# Install and configure Nginx
apt-get install -y nginx
cat > /etc/nginx/sites-available/codebid << 'NGINX'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -s /etc/nginx/sites-available/codebid /etc/nginx/sites-enabled/
systemctl restart nginx

# Setup SSL with Let's Encrypt
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
EOF
    ;;
    
  4)
    echo "📦 Deploying to AWS EC2..."
    echo ""
    echo "1. Create EC2 instance (Ubuntu 22.04 LTS, t3.micro)"
    echo "2. Create RDS PostgreSQL database (db.t3.micro)"
    echo "3. SSH into your instance:"
    echo "   ssh -i your-key.pem ubuntu@your-instance-ip"
    echo ""
    echo "4. Run the DigitalOcean setup above (same process)"
    echo "5. Update DB_HOST to your RDS endpoint"
    echo ""
    echo "See DEPLOYMENT_GUIDE.md for detailed AWS instructions"
    ;;
    
  5)
    echo "📦 Manual Deployment to VPS/Server..."
    echo ""
    echo "1. SSH into your server"
    echo "2. Install Node.js 18+"
    echo "3. Install PostgreSQL"
    echo "4. Clone repository:"
    echo "   git clone https://github.com/your-username/CODEBID.git"
    echo "5. Navigate to backend:"
    echo "   cd CODEBID/codebid-1/backend"
    echo "6. Create .env file with your configuration"
    echo "7. Install dependencies:"
    echo "   npm install"
    echo "8. Setup database:"
    echo "   node setup-db.js"
    echo "9. Start with PM2:"
    echo "   npm install -g pm2"
    echo "   pm2 start src/index.js --name 'codebid-backend'"
    echo "10. Setup Nginx as reverse proxy"
    echo "11. Setup SSL with Let's Encrypt"
    echo ""
    echo "See DEPLOYMENT_GUIDE.md for detailed instructions"
    ;;
    
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "📚 For more details, see DEPLOYMENT_GUIDE.md"
