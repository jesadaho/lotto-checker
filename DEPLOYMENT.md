# Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it `lotto-checker` (or your preferred name)
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in your terminal:

```bash
cd /Users/jesadahongsi/Projects/lotto-checker
git remote add origin https://github.com/YOUR_USERNAME/lotto-checker.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub to sign in for easier integration)

2. Click "Add New..." → "Project"

3. Import your GitHub repository:
   - Find `lotto-checker` in the list
   - Click "Import"

4. Configure the project:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add a new variable:
     - **Name**: `MONGODB_URI`
     - **Value**: Your MongoDB connection string
     - **Environment**: Production, Preview, Development (select all)
   - Click "Save"

6. Click "Deploy"

7. Wait for deployment to complete (usually 1-2 minutes)

8. Your app will be live at a URL like: `https://lotto-checker.vercel.app`

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the application:
   - Add a purchase on the Input page
   - Check the Summary page
   - Set limits on the Admin page

## Environment Variables

Make sure to set `MONGODB_URI` in Vercel:
- Go to Project Settings → Environment Variables
- Add: `MONGODB_URI` = `your_mongodb_connection_string`
- Redeploy if you add it after initial deployment

## Automatic Deployments

Vercel will automatically deploy:
- Every push to the `main` branch → Production
- Every push to other branches → Preview deployments
- Pull requests → Preview deployments

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Database connection fails**: Verify `MONGODB_URI` is set correctly in Vercel
- **Environment variables not working**: Make sure to redeploy after adding variables

