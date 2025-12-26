module.exports = {
  apps: [{
    name: 'fox-reviews-front',
    script: 'npx',
    // `-c 0` avoids clients caching an old entry chunk that references
    // now-deleted hashed chunks after a redeploy.
    args: ['serve', 'dist', '-s', '-p', '3005', '-c', '0'],
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3005
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
