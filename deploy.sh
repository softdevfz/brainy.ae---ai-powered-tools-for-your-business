#!/bin/bash

# Deploy to DigitalOcean App Platform using doctl
# Make sure you have doctl installed and authenticated

set -e

echo "🚀 Deploying brainy.ae to DigitalOcean App Platform..."

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed. Please install it first:"
    echo "   brew install doctl"
    echo "   or visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if doctl is authenticated
if ! doctl auth list | grep -q "current"; then
    echo "❌ doctl is not authenticated. Please run:"
    echo "   doctl auth init"
    exit 1
fi

# Update the app.yaml with your actual GitHub repo
echo "📝 Please update .do/app.yaml with your actual GitHub repository URL"
echo "   Change 'your-username' to your actual GitHub username"
echo ""

# Deploy the app
echo "🔧 Creating/updating the app..."
doctl apps create .do/app.yaml || doctl apps update $(doctl apps list --format ID --no-header | head -1) --spec .do/app.yaml

# Get the app ID
APP_ID=$(doctl apps list --format ID --no-header | head -1)

if [ -z "$APP_ID" ]; then
    echo "❌ Failed to get app ID"
    exit 1
fi

echo "✅ App deployed successfully!"
echo "📱 App ID: $APP_ID"
echo "🔗 You can view your app at: https://cloud.digitalocean.com/apps/$APP_ID"
echo ""
echo "⚠️  Don't forget to set up your environment variables in the DigitalOcean control panel:"
echo "   - GEMINI_API_KEY"
echo "   - PAYPAL_CLIENT_ID"
echo "   - STRIPE_PUBLIC_KEY"
echo "   - STRIPE_SECRET_KEY"
echo ""
echo "🎉 Deployment complete!" 