const request = require('supertest');
const app = require('../index');

describe('News API', () => {
  test('GET / responds with status and endpoints', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('endpoints');
  });

  test('GET /news returns demo articles without secret when PROXY_SHARED_SECRET is not set', async () => {
    delete process.env.PROXY_SHARED_SECRET;
    const res = await request(app).get('/news');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('articles');
    expect(Array.isArray(res.body.articles)).toBe(true);
  });

  test('GET /news requires secret when PROXY_SHARED_SECRET is set', async () => {
    process.env.PROXY_SHARED_SECRET = 'testsecret';
    const unauthorized = await request(app).get('/news');
    expect(unauthorized.status).toBe(401);

    const authorized = await request(app).get('/news').set('x-proxy-secret', 'testsecret');
    expect(authorized.status).toBe(200);
  });
});


