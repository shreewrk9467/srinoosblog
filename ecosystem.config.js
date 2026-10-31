// PM2 Configuration for Hostinger Cloud & VPS Hosting
module.exports = {
  apps: [
    {
      name: "sricospace-blog",
      script: "server.js",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
        NEXT_PUBLIC_SITE_URL: "https://sricospace.com"
      }
    }
  ]
};

