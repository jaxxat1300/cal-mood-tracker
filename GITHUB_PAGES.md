# GitHub Pages Deployment

Your app is now configured to automatically deploy to GitHub Pages!

## How It Works

1. **Automatic Deployment**: Every time you push to the `main` branch, GitHub Actions will:
   - Build the web version of your Expo app
   - Deploy it to GitHub Pages

2. **Your Live Site**: Once deployed, your app will be available at:
   ```
   https://jaxxat1300.github.io/cal-mood-tracker/
   ```

## Setup Steps (One-Time)

1. **Enable GitHub Pages**:
   - Go to your repository: https://github.com/jaxxat1300/cal-mood-tracker
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

2. **Trigger First Deployment**:
   - The workflow will run automatically on the next push
   - Or go to **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

## Manual Deployment

If you want to deploy manually:

```bash
npm run build:web
# Then commit and push the web-build folder
```

## Viewing Your Site

After deployment completes (check the Actions tab), your site will be live at:
- **URL**: https://jaxxat1300.github.io/cal-mood-tracker/

## Troubleshooting

- **Build fails**: Check the Actions tab for error messages
- **Site not loading**: Make sure GitHub Pages is enabled in Settings
- **404 errors**: Wait a few minutes after deployment for DNS propagation

## Notes

- The web version uses React Native Web, so some mobile-specific features may behave differently
- The app works best on desktop browsers
- All data is still stored locally in the browser
