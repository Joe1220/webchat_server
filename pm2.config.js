module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      min_uptime: 5000,
      name: 'server',
      script: 'dist/bin/www.js',
      max_restarts: 5,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
