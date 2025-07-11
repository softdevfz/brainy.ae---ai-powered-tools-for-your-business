#!/bin/bash

# Deploy brainy.ae to Google Cloud Platform
# This script builds and deploys the React app to Google Cloud Storage with CDN

set -e

echo "🚀 Deploying brainy.ae to Google Cloud Platform..."

# Check if gcloud is configured
if ! gcloud config get-value project &>/dev/null; then
    echo "❌ Please configure gcloud first:"
    echo "   gcloud config set project brainy-ae-homepage"
    exit 1
fi

# Build the React app
echo "🔨 Building React app..."
npm run build

# Upload to Google Cloud Storage
echo "📤 Uploading to Google Cloud Storage..."
gsutil -m rsync -r -d dist gs://brainy-ae-static-site

# Set proper cache headers for static assets
echo "⚙️  Setting cache headers..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://brainy-ae-static-site/assets/*
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://brainy-ae-static-site/index.html

echo "✅ Deployment completed successfully!"
echo "🌐 Your app is available at: https://brainy.ae"
echo "📊 Google Cloud Console: https://console.cloud.google.com/storage/browser/brainy-ae-static-site"
echo ""
echo "Note: If you just set up DNS, it may take up to 24 hours for changes to propagate." 