# Render Deployment Guide for 21-Online

This guide explains how to deploy the 21-Online backend to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your code pushed to a GitHub repository
3. Node.js 18+ for local development

## Deployment Steps

### 1. Connect Repository to Render

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select the 21-online repository
4. Choose the `backend` directory as the root directory

### 2. Configure Service Settings

- **Name**: `21-online-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start-prod`

### 3. Environment Variables

Set the following environment variables in Render:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will automatically set this)

### 4. Advanced Settings

- **Auto-Deploy**: Enable for automatic deployments on git push
- **Health Check Path**: Leave empty (Colyseus handles this)

## Configuration Files

The following files have been configured for Render deployment:

- `render.yaml`: Render service configuration
- `Dockerfile`: Optimized for Render deployment
- `.dockerignore`: Excludes unnecessary files from Docker build

## Frontend Configuration

After deploying the backend, update your frontend configuration to point to the new Render URL:

1. In your Angular frontend, update the WebSocket connection URL
2. Replace the Fly.io URL with your new Render service URL
3. The URL format will be: `wss://your-service-name.onrender.com`

## Local Development

To run locally:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Start production server
npm run start-prod
```

## Monitoring

- Monitor your service in the Render dashboard
- Check logs for any deployment issues
- Use the built-in metrics for performance monitoring

## Notes

- Render automatically handles SSL certificates
- WebSocket connections are supported
- The service will auto-scale based on traffic
- Free tier has some limitations (sleeps after 15 minutes of inactivity)
