export default async function handler(req, res) {
  try {
    const envApi = (process.env.NEWS_API_URL || '').trim();
    if (!envApi) {
      res.status(500).json({ error: 'Server not configured: NEWS_API_URL is missing' });
      return;
    }

    // Security: By default, do NOT allow query overrides in production
    const allowOverride = String(process.env.ALLOW_API_OVERRIDE || 'false').toLowerCase() === 'true';
    let targetUrl = envApi;

    if (allowOverride && typeof req.query?.api === 'string' && req.query.api.length > 0) {
      const candidate = new URL(req.query.api);
      if (candidate.protocol !== 'https:') {
        return res.status(400).json({ error: 'Only HTTPS upstream is allowed' });
      }
      const allowlist = (process.env.ALLOWED_UPSTREAM_HOSTS || '').split(',').map(s => s.trim()).filter(Boolean);
      if (allowlist.length > 0 && !allowlist.includes(candidate.host)) {
        return res.status(400).json({ error: 'Upstream host is not in allowlist' });
      }
      targetUrl = candidate.toString();
    }

    // Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const proxySecret = (process.env.PROXY_SHARED_SECRET || '').trim();

    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
        ...(proxySecret ? { 'x-proxy-secret': proxySecret } : {}),
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      res.status(response.status).json({ error: `Upstream responded with ${response.status}` });
      return;
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news', details: String(error && error.message ? error.message : error) });
  }
}


