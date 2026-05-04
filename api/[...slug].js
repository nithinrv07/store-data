export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { slug } = req.query;
    const path = slug ? `/${slug.join('/')}` : '/';
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const backendUrl = `${baseUrl}${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json().catch(() => null);
    res.status(response.status).json(data || {});
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: 'Backend unavailable' });
  }
}
