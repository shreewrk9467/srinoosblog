# Hostinger Setup Guide for sricospace.com

This guide provides step-by-step instructions to run your **Srinoos Blogging & Advertising Platform** on your **Hostinger hosting plan** using your domain **`https://sricospace.com/`**.

---

## 📁 Pre-Configured Hostinger Files in This Project

Your project now includes all essential Hostinger configuration files:

1. **`server.js`**: Official Hostinger Node.js application startup file.
2. **`.htaccess`**: Reverse proxy rule file for Hostinger LiteSpeed/Apache servers. Automatically routes incoming visitor traffic from `https://sricospace.com` to your Node.js application on port 3000.
3. **`ecosystem.config.js`**: PM2 process manager config for 24/7 background uptime and auto-restart on Hostinger Cloud/VPS.
4. **`hostinger-deploy.sh`**: One-click terminal script to install, build, and launch on Hostinger.

---

## 🛠️ Deployment Methods on Hostinger

### Method A: Hostinger hPanel "Node.js" Feature (Cloud & Web Hosting)

1. Log into your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Go to **Websites** and select **`sricospace.com`**.
3. In the left sidebar, navigate to **Advanced → Node.js** (or search "Node.js").
4. Click **Create Application** and enter:
   * **Node.js version**: `20.x` or `22.x`
   * **Application mode**: `Production`
   * **Application root**: `/` (or your chosen subfolder e.g. `/blog`)
   * **Application startup file**: `server.js`
5. Upload your project files (via **File Manager** or **Git**).
6. Under the Node.js application panel, click **Run NPM Install** and then **Run NPM Build** (or run `npm run build` in SSH).
7. Click **Start Application** or **Restart Application**.
8. Your Next.js blog is live at `https://sricospace.com/`!

---

### Method B: Hostinger VPS or SSH Terminal (Recommended for PM2)

If you have SSH access on your Hostinger plan:

1. Connect to your Hostinger server via SSH:
   ```bash
   ssh u123456789@sricospace.com -p 65002
   ```
2. Navigate to your website directory:
   ```bash
   cd ~/public_html
   ```
3. Clone or upload your project files here.
4. Run the automated Hostinger deploy script:
   ```bash
   bash hostinger-deploy.sh
   ```
5. Check that PM2 is running your app:
   ```bash
   pm2 status
   ```

---

### Method C: Subdomain Setup (e.g. `blog.sricospace.com`)

If you want to keep your current WordPress site at `sricospace.com` (which you accessed at `wp-admin/admin.php?page=hostinger`), you can run this blog on **`blog.sricospace.com`**:

1. In Hostinger hPanel, go to **Domains → Subdomains** and create `blog.sricospace.com`.
2. In Hostinger **DNS Zone Editor**, point `blog.sricospace.com` to your Node.js app or Vercel CNAME (`cname.vercel-dns.com`).
3. Open [`/admin/settings`](http://localhost:3000/admin/settings) and set domain to `blog.sricospace.com`.

---

## 🔒 Verification Checklist

* [x] **Domain configured**: `https://sricospace.com`
* [x] **Robots.txt verified**: `https://sricospace.com/robots.txt`
* [x] **AdSense ads.txt live**: `https://sricospace.com/ads.txt`
* [x] **Dynamic Sitemap generated**: `https://sricospace.com/sitemap.xml`
* [x] **Admin Suite active**: `https://sricospace.com/admin` (or `http://localhost:3000/admin`)

