# Backend Deployment Guide

This guide covers deploying the CodeBid backend to production environments.

## Deployment Options

### Option 1: Heroku (Easiest - Free tier available)
### Option 2: Railway (Simple, modern)
### Option 3: AWS (Scalable, production-grade)
### Option 4: DigitalOcean (Affordable VPS)
### Option 5: Render (Free tier available)

---

## Option 1: Deploy to Heroku

### Prerequisites
- Heroku account (free at https://www.heroku.com)
- Heroku CLI installed
- Git repository pushed to GitHub

### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
cd codebid-1/backend
heroku create your-app-name
```

### Step 4: Add PostgreSQL Add-on
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### Step 5: Set Environment Variables
```bash
heroku config:set JWT_SECRET=your-secret-key-change-this
heroku config:set FRONTEND_ORIGIN=https://your-frontend-url.com
```

### Step 6: Deploy
```bash
git push heroku main
```

### Step 7: Run Database Setup
```bash
heroku run node setup-db.js
```

### Step 8: View Logs
```bash
heroku logs --tail
```

### Access Your Backend
```
https://your-app-name.herokuapp.com
```

---

## Option 2: Deploy to Railway

### Prerequisites
- Railway account (free at https://railway.app)
- GitHub repository

### Step 1: Connect GitHub
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize and select your repository

### Step 2: Configure Backend Service
1. Select the `codebid-1/backend` directory
2. Add environment variables:
   - `JWT_SECRET`: your-secret-key
   - `FRONTEND_ORIGIN`: https://your-frontend-url.com
   - `NODE_ENV`: production

### Step 3: Add PostgreSQL Database
1. Click "Add Service"
2. Select "PostgreSQL"
3. Railway will automatically set `DATABASE_URL`

### Step 4: Deploy
Railway automatically deploys on push to main branch

### Access Your Backend
```
https://your-app-name.up.railway.app
```

---

## Option 3: Deploy to AWS (EC2 + RDS)

### Prerequisites
- AWS account
- AWS CLI configured
- EC2 key pair created

### Step 1: Create EC2 Instance
```bash
# Launch Ubuntu 22.04 LTS instance
# Instance type: t3.micro (free tier eligible)
# Security group: Allow ports 22, 80, 443, 4000
```

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Clone Repository
```bash
git clone https://github.com/your-username/CODEBID.git
cd CODEBID/codebid-1/backend
npm install
```

### Step 5: Create RDS PostgreSQL Database
```bash
# Via AWS Console:
# - Engine: PostgreSQL 14
# - Instance class: db.t3.micro (free tier)
# - Storage: 20 GB
# - Public accessibility: Yes
# - Security group: Allow port 5432
```

### Step 6: Configure Environment
```bash
cat > .env << EOF
PORT=4000
FRONTEND_ORIGIN=https://your-frontend-url.com
JWT_SECRET=your-secret-key-change-this
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_NAME=codebid
DB_USER=postgres
DB_PASSWORD=your-secure-password
EOF
```

### Step 7: Setup Database
```bash
node setup-db.js
```

### Step 8: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start src/index.js --name "codebid-backend"
pm2 startup
pm2 save
```

### Step 9: Setup Nginx Reverse Proxy
```bash
sudo apt-get install -y nginx

sudo cat > /etc/nginx/sites-available/default << EOF
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo systemctl restart nginx
```

### Step 10: Setup SSL (Let's Encrypt)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Access Your Backend
```
https://your-domain.com
```

---

## Option 4: Deploy to DigitalOcean

### Prerequisites
- DigitalOcean account
- $5/month droplet

### Step 1: Create Droplet
1. Go to DigitalOcean console
2. Create new Droplet
3. Select Ubuntu 22.04 LTS
4. Choose $5/month plan
5. Add SSH key

### Step 2: Connect and Setup
```bash
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql
```

### Step 3: Setup PostgreSQL
```bash
sudo -u postgres psql << EOF
CREATE DATABASE codebid;
CREATE USER codebid_user WITH PASSWORD 'your-secure-password';
ALTER ROLE codebid_user SET client_encoding TO 'utf8';
ALTER ROLE codebid_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE codebid_user SET default_transaction_deferrable TO on;
ALTER ROLE codebid_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE codebid TO codebid_user;
EOF
```

### Step 4: Clone and Setup Backend
```bash
cd /var/www
git clone https://github.com/your-username/CODEBID.git
cd CODEBID/codebid-1/backend

# Create .env
cat > .env << EOF
PORT=4000
FRONTEND_ORIGIN=https://your-frontend-url.com
JWT_SECRET=your-secret-key-change-this
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codebid
DB_USER=codebid_user
DB_PASSWORD=your-secure-password
EOF

npm install
node setup-db.js
```

### Step 5: Setup PM2
```bash
npm install -g pm2
pm2 start src/index.js --name "codebid-backend"
pm2 startup
pm2 save
```

### Step 6: Setup Nginx
```bash
apt-get install -y nginx

cat > /etc/nginx/sites-available/codebid << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/codebid /etc/nginx/sites-enabled/
systemctl restart nginx
```

### Step 7: Setup SSL
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Option 5: Deploy to Render

### Prerequisites
- Render account (free at https://render.com)
- GitHub repository

### Step 1: Create Web Service
1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository

### Step 2: Configure Service
- **Name**: codebid-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Region**: Choose closest to you

### Step 3: Add Environment Variables
```
JWT_SECRET=your-secret-key-change-this
FRONTEND_ORIGIN=https://your-frontend-url.com
```

### Step 4: Add PostgreSQL Database
1. Click "New +"
2. Select "PostgreSQL"
3. Configure database
4. Render will set `DATABASE_URL` automatically

### Step 5: Deploy
Render automatically deploys on push to main

### Access Your Backend
```
https://your-app-name.onrender.com
```

---

## Post-Deployment Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `FRONTEND_ORIGIN` to your actual frontend URL
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` file

### Database
- [ ] Run `node setup-db.js` after deployment
- [ ] Verify database connection
- [ ] Setup database backups
- [ ] Monitor database performance

### Monitoring
- [ ] Setup error logging (Sentry, LogRocket)
- [ ] Monitor API response times
- [ ] Setup uptime monitoring
- [ ] Configure alerts for errors

### Performance
- [ ] Enable gzip compression
- [ ] Setup caching headers
- [ ] Monitor memory usage
- [ ] Setup auto-scaling if needed

---

## Environment Variables for Production

```env
# Server
PORT=4000
NODE_ENV=production

# Frontend
FRONTEND_ORIGIN=https://your-frontend-url.com

# JWT
JWT_SECRET=your-very-secure-random-string-here

# Database
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=codebid
DB_USER=postgres
DB_PASSWORD=your-secure-database-password

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

---

## Troubleshooting

### Database Connection Error
```bash
# Check database credentials
# Verify database is running
# Check firewall rules
# Verify DATABASE_URL is set correctly
```

### Port Already in Use
```bash
# Change PORT in .env
# Or kill process using port 4000
lsof -i :4000
kill -9 <PID>
```

### CORS Errors
```bash
# Update FRONTEND_ORIGIN in .env
# Restart backend service
```

### Socket.io Connection Issues
```bash
# Ensure WebSocket is enabled
# Check firewall allows WebSocket connections
# Verify FRONTEND_ORIGIN matches frontend URL
```

---

## Recommended: Railway or Render

For easiest deployment with free tier:
1. **Railway** - Best for quick setup, good free tier
2. **Render** - Good free tier, easy to use
3. **Heroku** - Classic choice, but paid now

For production with scaling:
1. **AWS** - Most scalable, pay-as-you-go
2. **DigitalOcean** - Affordable, good performance

---

## Quick Deploy Commands

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your-secret
git push heroku main
heroku run node setup-db.js
```

### Railway
```bash
# Just push to GitHub, Railway handles the rest
git push origin main
```

### DigitalOcean
```bash
# SSH into droplet
ssh root@your-ip

# Clone and setup
git clone https://github.com/your-username/CODEBID.git
cd CODEBID/codebid-1/backend
npm install
node setup-db.js
pm2 start src/index.js
```

---

## Support

For deployment issues:
- Check logs: `heroku logs --tail` or `pm2 logs`
- Verify environment variables are set
- Check database connection
- Verify CORS settings
- Check firewall rules

