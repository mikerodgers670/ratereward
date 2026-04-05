# RateReward

A reward app where users deposit KES 500 or 1,000, rate your app, share a referral code, and collect 2× back after 21 days.

## Tech Stack

- React 18 + Vite
- React Router v6
- Framer Motion
- Lucide React icons
- Google Fonts (Syne + DM Sans)

## Pages

- `/` — Landing page with hero, how it works, plans, testimonials
- `/register` — 5-step onboarding flow
- `/dashboard` — User reward dashboard

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Deploy to GitHub + Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ratereward.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — leave settings as default
5. Click **Deploy**

Your app will be live at `https://ratereward.vercel.app` (or your custom domain).

## Project Structure

```
ratereward/
├── index.html
├── vite.config.js
├── vercel.json          ← SPA routing fix
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── pages/
        ├── LandingPage.jsx + .css
        ├── RegisterPage.jsx + .css
        └── DashboardPage.jsx + .css
```
