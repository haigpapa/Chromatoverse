# Vercel Deployment Guide

This guide will help you deploy Codeverse Explorer to Vercel.

## Architecture

**On Vercel:**
- Frontend (React + Vite) → Static site
- Backend API → Serverless Functions in `/api` directory
- Both deployed as a single Vercel project

**API Routes:**
- `GET /api/health` - Health check endpoint
- `POST /api/analyze` - Analyze GitHub repository

## Prerequisites

1. GitHub account
2. Vercel account (free tier works great)
3. Git repository pushed to GitHub

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub

```bash
# If you haven't already
git add -A
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

### Step 3: Configure Build Settings

Vercel should automatically detect:
- **Framework Preset:** Vite
- **Build Command:** `cd client && npm install && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install --prefix api`

If not, set these manually.

### Step 4: Deploy

Click "Deploy" and wait 2-3 minutes!

Your app will be live at: `https://your-project-name.vercel.app`

### Step 5: Test

Test your deployment:
1. Visit your Vercel URL
2. Enter a GitHub repo URL (e.g., `https://github.com/facebook/react`)
3. Watch the 3D constellation appear!

Check the API:
- Health check: `https://your-project-name.vercel.app/api/health`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project root:

```bash
# Deploy to preview (test deployment)
vercel

# Deploy to production
vercel --prod
```

The CLI will:
1. Upload your code
2. Build the frontend
3. Deploy serverless functions
4. Give you a live URL

---

## Configuration Details

### vercel.json

```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install --prefix api",
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Key settings:**
- **buildCommand**: Builds the Vite frontend
- **outputDirectory**: Where Vite outputs the static files
- **installCommand**: Installs dependencies for API functions
- **maxDuration**: 30 seconds (Pro plan allows up to 60s)
- **rewrites**: SPA routing support

### Environment Variables

**For Local Development:**
Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

**For Vercel:**
No environment variables needed! The API is same-origin (`/api`).

---

## Project Structure for Vercel

```
/codeverse-explorer
├── vercel.json              # Vercel configuration
├── /api/                    # Serverless functions (auto-deployed)
│   ├── package.json        # API dependencies
│   ├── analyze.js          # POST /api/analyze
│   └── health.js           # GET /api/health
├── /client/                 # Frontend (static build)
│   ├── .env.example
│   ├── .env.local          # Local development
│   └── ...
└── /server/                 # Express server (for local dev only)
```

---

## Serverless Functions

### API Function: `/api/analyze.js`

**Features:**
- Clones GitHub repo to `/tmp` (Vercel's temp storage)
- Analyzes all files
- Returns visualization data
- Auto-cleanup after analysis

**Limits:**
- **Free tier**: 10 second timeout
- **Pro tier**: 60 second timeout (configured to 30s)
- **/tmp storage**: 512 MB
- **Memory**: 1024 MB default

**Note:** Large repositories (500+ files) may timeout on free tier. Upgrade to Pro if needed.

---

## Custom Domain (Optional)

### Step 1: Add Domain in Vercel Dashboard

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain

### Step 2: Configure DNS

Add these records to your DNS provider:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Monitoring & Logs

### View Logs

**Via Dashboard:**
1. Go to your project on Vercel
2. Click "Functions" tab
3. Select a function (e.g., `/api/analyze`)
4. View real-time logs

**Via CLI:**
```bash
vercel logs your-project-name.vercel.app
```

### Monitor Performance

Vercel automatically provides:
- Response times
- Error rates
- Function invocations
- Bandwidth usage

---

## Troubleshooting

### "Function Timeout"

**Problem:** Large repos take too long to analyze

**Solutions:**
1. Upgrade to Vercel Pro (60s timeout)
2. Use smaller repos for testing
3. Optimize analysis (Phase 2 improvements)

### "Cannot find module 'simple-git'"

**Problem:** Dependencies not installed

**Solution:** Ensure `api/package.json` exists with `simple-git` dependency

### "404 on /api/analyze"

**Problem:** API function not deployed

**Solution:**
1. Check `vercel.json` configuration
2. Ensure `/api` directory exists
3. Redeploy with `vercel --prod`

### CORS Errors

**Problem:** Frontend can't reach API

**Solution:** API functions include CORS headers. Check browser console for specific error.

---

## Local Development vs Production

### Local Development

**Terminal 1 - Backend:**
```bash
npm run server
# Express server on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run client
# Vite dev server on http://localhost:3000
# Uses VITE_API_URL=http://localhost:5000
```

### Production (Vercel)

**Single URL:**
```
https://your-app.vercel.app
├── / (frontend)
└── /api/* (serverless functions)
```

Frontend calls API at `/api/analyze` (same origin).

---

## Performance Tips

### 1. Enable Edge Caching

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/health",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### 2. Use Edge Network

Vercel automatically serves your frontend from the Edge Network (CDN).

### 3. Optimize Builds

Frontend is automatically minified and optimized by Vite.

---

## Cost Estimates

### Free Tier (Hobby)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 6000 build minutes/month
- ✅ 100 hours function execution/month
- ⚠️ 10 second function timeout
- **Cost:** $0

### Pro Tier
- ✅ Everything in Free
- ✅ 60 second function timeout
- ✅ 1TB bandwidth/month
- ✅ More compute resources
- **Cost:** $20/month

**For Codeverse Explorer:**
- Free tier works great for testing
- Upgrade to Pro if analyzing many large repos

---

## CI/CD (Automatic Deployments)

Vercel automatically deploys:

### On Push to Main
→ **Production** deployment at your main URL

### On Pull Request
→ **Preview** deployment with unique URL

### On Branch Push
→ **Preview** deployment

Every deployment gets:
- Unique URL
- Live logs
- Performance metrics

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test with various repos
3. ✅ Share your live URL
4. 🚧 Add custom domain (optional)
5. 🚧 Monitor usage and upgrade if needed
6. 🚧 Build Phase 2 features

---

## Support

**Vercel Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions)

**Project Issues:**
- Check the main README.md
- Open an issue on GitHub

---

**Congratulations! Your Codeverse Explorer is now live on Vercel! 🎉**
