# 🔄 Keep Render Backend Awake (Prevent Cold Starts)

## Problem

Render free tier sleeps your backend after 15 minutes of inactivity, causing 30-60 second delays on first request.

## Solution 1: Use Cron-Job.org (Free & Easy)

### Step 1: Create a Cron Job

1. Go to: https://cron-job.org/en/
2. Sign up for free account
3. Click "Create Cronjob"

### Step 2: Configure the Job

- **Title:** Keep Resume Builder Awake
- **URL:** `https://resume-builder-ihaw.onrender.com/health`
- **Schedule:** Every 14 minutes
  - Pattern: `*/14 * * * *`
- **Request Method:** GET
- **Enabled:** Yes

### Step 3: Save

Click "Create" and your backend will be pinged every 14 minutes!

---

## Solution 2: Use UptimeRobot (Free)

1. Go to: https://uptimerobot.com/
2. Sign up for free
3. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: Resume Builder Backend
   - URL: `https://resume-builder-ihaw.onrender.com/health`
   - Monitoring Interval: 5 minutes (free tier)
4. Create Monitor

---

## Solution 3: Frontend Auto-Ping (Built-in)

Add a ping service in your frontend that runs when the app loads.

I can add this to your frontend code if you want!

---

## Solution 4: Upgrade Render (Paid)

- Render Starter Plan: $7/month
- No cold starts
- Always-on backend
- Better performance

---

## Recommended: Use Cron-Job.org

It's free, reliable, and takes 2 minutes to set up!

**Your backend will stay awake 24/7 with no cold starts!** 🚀
