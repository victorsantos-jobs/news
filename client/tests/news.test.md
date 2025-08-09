Manual client checks (static site + serverless proxy):

- Home renders title "News" and calls `/api/news` by default.
- When Vercel env `NEWS_API_URL` is missing, `/api/news` returns 500 with JSON `{ error: 'Server not configured: NEWS_API_URL is missing' }`, and the client shows that message.
- When `PROXY_SHARED_SECRET` is configured on both Vercel and Heroku, `/api/news` succeeds and the grid shows cards.

If you want automated E2E later, we can add Playwright with a mock server.


