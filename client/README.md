# MedAImart Client Portal

This is the React + Vite frontend for **MedAImart**, a secure peer-to-peer marketplace for buying, selling, and redistributing verified surplus medicines.

## Google Search Console Site Verification

To verify ownership of the home page URL (`https://medicine-resale-platform.vercel.app`) in Google Search Console, you can use either of the following two options:

### Option A: Via Meta Tag (Recommended)

1. Log in to your [Google Search Console](https://search.google.com/search-console).
2. Add your website property: `https://medicine-resale-platform.vercel.app`.
3. Choose the **HTML tag** verification method.
4. Copy the unique verification string from the `content="..."` attribute of the provided meta tag.
   - *Example:* If Google gives you `<meta name="google-site-verification" content="ABC_123_xyz..." />`, your token is `ABC_123_xyz...`.
5. Go to your hosting dashboard (e.g., Vercel / Netlify / AWS).
6. Under **Environment Variables**, add:
   ```env
   VITE_GOOGLE_SITE_VERIFICATION=your_token_here
   ```
7. Re-deploy the application. The build system will automatically inject this token into the home page's `<meta name="google-site-verification" content="..." />` tag.
8. Click **Verify** in the Google Search Console dashboard.

### Option B: Via HTML File Upload

1. Log in to [Google Search Console](https://search.google.com/search-console).
2. Choose the **HTML file** verification method and download the verification file (e.g., `googlee0b7a8d5b8830113.html`).
3. Place this downloaded file directly into the `client/public/` folder of this repository:
   ```bash
   client/public/googlee0b7a8d5b8830113.html
   ```
4. Commit and push the file to redeploy. Because the `public` directory is served at the root in Vite, Vercel will host this file directly at:
   `https://medicine-resale-platform.vercel.app/googlee0b7a8d5b8830113.html`
5. Click **Verify** in the Google Search Console dashboard.

---

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run local development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
