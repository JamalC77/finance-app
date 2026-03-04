const https = require('https');

module.exports = {
  onSuccess: async () => {
    const siteId = process.env.SITE_ID || '0d825485-2279-4252-8962-d91ba1e2fc6f';
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_TOKEN;

    if (!token) {
      console.log('⚠️  NETLIFY_AUTH_TOKEN not set — skipping CDN cache purge');
      return;
    }

    console.log('🔄 Purging Netlify CDN cache...');

    const data = JSON.stringify({ site_id: siteId });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.netlify.com',
          path: '/api/v1/purge',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log('✅ CDN cache purged successfully');
            } else {
              console.log(`⚠️  Cache purge returned ${res.statusCode}: ${body}`);
            }
            resolve();
          });
        }
      );
      req.on('error', (err) => {
        console.log(`⚠️  Cache purge failed: ${err.message}`);
        resolve(); // Don't fail the deploy
      });
      req.write(data);
      req.end();
    });
  },
};
