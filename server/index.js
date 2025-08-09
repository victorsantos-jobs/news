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

app.get('/news', (_req, res) => {
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


