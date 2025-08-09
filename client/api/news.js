export default async function handler(req, res) {
  try {
    const { api } = req.query || {};
    const envApi = process.env.NEWS_API_URL;
    const defaultApi = envApi && envApi.trim().length > 0
      ? envApi.trim()
      : 'https://news-server-123-516cfccc9db1.herokuapp.com/news';

    const targetUrl = typeof api === 'string' && api.length > 0 ? api : defaultApi;

    const response = await fetch(targetUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

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


