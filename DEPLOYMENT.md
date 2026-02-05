# Deployment Guide for Apex Skills Technologies

This guide outlines the steps to deploy the application on a Hostinger VPS (Ubuntu/Linux).

## 1. Prerequisites

- **Hostinger VPS** with Ubuntu 20.04 or later.
- **Node.js 18+** installed on the VPS.
- **Nginx** installed for reverse proxy.
- **PM2** installed globally (`npm install -g pm2`).
- **Domain Name** pointed to your VPS IP.

## 2. Project Structure

The project currently consists of:
- **Root**: Frontend (React + Vite).
- **Backend**: Node.js + Express API (`/backend` folder).

## 3. Database Setup (MySQL)

1.  **Install MySQL Server:**
    ```bash
    sudo apt update
    sudo apt install mysql-server
    ```

2.  **Secure Installation:**
    ```bash
    sudo mysql_secure_installation
    ```
    - Follow the prompts (Select 'Y' for VALIDATE PASSWORD depending on strictness you want).
    - Remove anonymous users.
    - Disallow root login remotely.
    - Remove test database.
    - Reload privilege tables.

3.  **Create User & Database:**
    Log in to MySQL as root:
    ```bash
    sudo mysql
    ```

    Run the following SQL commands (Replace `your_secure_password` with a strong password):
    ```sql
    -- Create the database
    CREATE DATABASE apex_skills_db;

    -- Create a dedicated user (Avoid using root for the app)
    CREATE USER 'apex_user'@'localhost' IDENTIFIED BY 'your_secure_password';

    -- Grant privileges
    GRANT ALL PRIVILEGES ON apex_skills_db.* TO 'apex_user'@'localhost';

    -- Apply changes
    FLUSH PRIVILEGES;
    EXIT;
    ```

    *Note: You will use `apex_user` and `your_secure_password` in the backend `.env` file.*

## 4. Backend Deployment

1.  **Navigate to Backend:**
    ```bash
    cd /path/to/project/backend
    ```

2.  **Install Production Dependencies:**
    ```bash
    npm install --omit=dev
    ```

3.  **Environment Configuration:**
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Edit `.env` with your production secrets (Database, Google Sheets, etc.):
      ```bash
      nano .env
      ```

4.  **Database Migration:**
    ```bash
    npm run migrate
    ```

5.  **Start with PM2:**
    ```bash
    pm2 start src/server.js --name "apex-backend"
    pm2 save
    pm2 startup
    ```

## 5. Frontend Deployment

1.  **Navigate to Root:**
    ```bash
    cd /path/to/project
    ```

2.  **Environment Configuration:**
    - Create a `.env` file for the frontend build:
      ```bash
      nano .env
      ```
    - Add your API URL:
      ```
      VITE_API_URL=https://api.yourdomain.com
      ```

3.  **Install & Build:**
    ```bash
    npm install
    npm run build
    ```
    - This will create a `dist` folder containing the static assets.

## 6. Nginx Configuration

Create a new Nginx server block: `sudo nano /etc/nginx/sites-available/apex-app`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Serve Static Files)
    location / {
        root /path/to/project/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/apex-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Security Steps

1.  **SSL Certificate (HTTPS):**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

2.  **Firewall (UFW):**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

## 8. Important Notes

- **Google Sheets:** Ensure the `googleSheets` config in `backend/.env` is correct. The service account JSON private key must be correctly formatted with newlines.
- **TailwindCSS:** The current frontend uses the Tailwind CDN for styling. Ensure the deployed server has internet access to load the CDN.
- **Logs:** Check backend logs via `pm2 logs apex-backend`.
