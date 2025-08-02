#!/bin/bash

# Manual deployment script for brainy.ae
# This uploads files individually to avoid authentication issues

set -e

echo "🚀 Manual deployment to Google Cloud Storage..."

# Build the React app
echo "🔨 Building React app..."
npm run build

# Upload files manually
echo "📤 Uploading files to Google Cloud Storage..."

# Upload HTML file
gsutil cp dist/index.html gs://brainy-ae-static-site/

# Upload CSS files
gsutil cp dist/assets/*.css gs://brainy-ae-static-site/assets/

# Upload JS files
gsutil cp dist/assets/*.js gs://brainy-ae-static-site/assets/

# Set cache headers
echo "⚙️  Setting cache headers..."
gsutil setmeta -h "Cache-Control:public, max-age=31536000" gs://brainy-ae-static-site/assets/*
gsutil setmeta -h "Cache-Control:public, max-age=3600" gs://brainy-ae-static-site/index.html

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://brainy.ae"