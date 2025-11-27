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

## Deploy to Vercel (Recommended for China)

### Quick Deploy

1. Visit https://vercel.com and login with GitHub

2. Click "Add New..." → "Project"

3. Import `management-tendency-surveyor` repository

4. Configure (auto-detected):
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Important**: Add Environment Variable:
   - Key: `VITE_API_KEY`
   - Value: Your Gemini API Key
   - Environment: All (Production, Preview, Development)

6. Click "Deploy"

7. Your site will be available at: `https://your-project.vercel.app`

### Alternative: Deploy to GitHub Pages

1. Push code to GitHub repository

2. Go to Settings → Pages

3. Select Source: **GitHub Actions**

4. Site will be at: `https://[username].github.io/[repository-name]/`

Note: GitHub Pages may require VPN to access in China.
