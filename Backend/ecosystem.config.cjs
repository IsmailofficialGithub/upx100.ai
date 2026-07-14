/** PM2 process file — used by CI/CD deploys */
module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || 'up100x-backend',
      script: './app/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
