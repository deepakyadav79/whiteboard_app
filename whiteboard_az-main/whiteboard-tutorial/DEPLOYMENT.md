# Whiteboard Frontend Deployment Guide

## Deploy to Render

### Prerequisites
- GitHub repository with your code
- Render account

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Static Site"
   - Connect your GitHub repository
   - Configure the deployment:
     - **Name**: whiteboard-frontend
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`
     - **Environment Variables**:
       - `REACT_APP_API_URL`: `https://whiteboard5-5es6.onrender.com`

3. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your app
   - Your app will be available at: `https://your-app-name.onrender.com`

### Environment Variables
- `REACT_APP_API_URL`: Your backend server URL

### Notes
- The app uses React Router, so the `_redirects` file ensures proper routing
- The `homepage: "."` in package.json ensures assets are loaded correctly
- Your backend should already be deployed at `https://whiteboard5-5es6.onrender.com` 