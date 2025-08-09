'use strict';

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Demo news content. Replace or connect to a real data source as needed.
const newsArticles = [
  {
    id: 1,
    title: 'Welcome to your News API',
    description:
      'This is a sample news item served by your Heroku Node.js app.',
    url: 'https://example.com/welcome-news',
    imageUrl: 'https://picsum.photos/seed/news1/800/400',
    publishedAt: '2025-01-01T12:00:00Z',
    source: 'Demo Source',
  },
  {
    id: 2,
    title: 'Deploy the API to Heroku',
    description:
      "Push this 'server' folder to a Git repo and deploy to Heroku.",
    url: 'https://devcenter.heroku.com/',
    imageUrl: 'https://picsum.photos/seed/news2/800/400',
    publishedAt: '2025-01-02T08:00:00Z',
    source: 'Heroku Docs',
  },
];

app.get('/', (_req, res) => {
  res.json({ message: 'News API is running', endpoints: ['/news'] });
});

// Optional shared-secret protection for proxy-only access
const requiredSecret = process.env.PROXY_SHARED_SECRET || '';
function requireProxySecret(req, res, next) {
  if (!requiredSecret) return next();
  const provided = req.get('x-proxy-secret') || '';
  if (provided !== requiredSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/news', requireProxySecret, (_req, res) => {
  res.json({
    status: 'ok',
    totalResults: newsArticles.length,
    articles: newsArticles,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`News API listening on port ${port}`);
});


