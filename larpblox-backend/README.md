# LarpBlox Backend

Vercel serverless backend that syncs LarpBlox loadouts between users.

## Deploy in 3 steps

### 1. Push to GitHub
Create a new GitHub repo and push this folder to it.

### 2. Deploy to Vercel
- Go to https://vercel.com → New Project → Import your repo
- Click Deploy (no extra config needed)

### 3. Add KV Storage
- In your Vercel project → Storage tab → Create Database → KV
- Click "Connect to Project" — Vercel auto-injects the env vars

That's it! Your backend URL will be:
  https://your-project-name.vercel.app

### 4. Update the Tampermonkey script
In larpblox.user.js, update this line near the top:

  const BACKEND = "https://larpblox.vercel.app";

Replace with your actual Vercel URL:

  const BACKEND = "https://your-project-name.vercel.app";

## API Endpoints

POST /api/user/save
  Body: { userId, displayTag, equippedItems, fakeInventory, fakeStats }
  Saves a user's public LarpBlox loadout (30 day TTL)

GET /api/user/:userId
  Returns a user's public loadout so other LarpBlox users can see their outfit
