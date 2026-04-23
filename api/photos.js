const https = require('https');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { folder } = req.query;
  
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  
  const path = folder
    ? `/v1_1/${cloudName}/resources/image?prefix=${encodeURIComponent(folder)}&type=upload&max_results=500`
    : `/v1_1/${cloudName}/resources/image/tags?max_results=500`;
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.cloudinary.com',
      path,
      headers: { Authorization: `Basic ${auth}` }
    };
    
    https.get(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          const resources = json.resources || [];
          
          // Group by subfolder
          const folders = {};
          resources.forEach(r => {
            const parts = r.public_id.split('/');
            const subfolder = parts.length > 2 ? parts[parts.length - 2] : 'General';
            if (!folders[subfolder]) folders[subfolder] = [];
            folders[subfolder].push(r.public_id);
          });
          
          res.status(200).json({ folders });
          resolve();
        } catch(e) {
          res.status(500).json({ error: 'Parse error' });
          resolve();
        }
      });
    }).on('error', (e) => {
      res.status(500).json({ error: e.message });
      resolve();
    });
  });
}
