<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1-xyKyTPtyPOCXgqGglRvF3DINDb8zw35

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `VITE_API_KEY` in [.env.local](.env.local) to your Gemini API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

1. Push your code to GitHub repository

2. Go to your repository Settings → Pages

3. Under "Build and deployment", select:
   - Source: **GitHub Actions**

4. The workflow will automatically deploy on every push to `main` branch

5. Your site will be available at: `https://[username].github.io/[repository-name]/`

### Method 2: Manual Deployment

If you prefer manual deployment, add this script to `package.json`:

```json
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}
```

Then install `gh-pages`:
```bash
npm install -D gh-pages
```

Deploy manually:
```bash
npm run deploy
```

### Important Notes

- The app uses relative paths (`base: './'` in vite.config.ts) which works for GitHub Pages
- Make sure to set your `VITE_API_KEY` environment variable in GitHub repository secrets if you want to use Gemini AI features in production
- The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`
