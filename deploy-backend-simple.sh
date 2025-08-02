#!/bin/bash

# Deploy backend to Google Cloud Run
# Make sure you have gcloud CLI installed and authenticated

set -e

echo "🚀 Deploying Brainy.ae Backend to Google Cloud Run..."

# Set project ID
PROJECT_ID="brainy-ae-homepage"
gcloud config set project $PROJECT_ID

# Deploy directly from source
echo "🚀 Deploying to Cloud Run from source..."
cd backend
gcloud run deploy brainy-ae-backend \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3001 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production \
    --set-env-vars FRONTEND_URL=https://brainy.ae \
    --project $PROJECT_ID

# Get the service URL
SERVICE_URL=$(gcloud run services describe brainy-ae-backend --region us-central1 --format="value(status.url)")

echo "✅ Backend deployed successfully!"
echo "🔗 Backend URL: $SERVICE_URL"
echo ""

# Automatically set up PayPal webhook
echo "🔗 Setting up PayPal webhook..."
cd ..
node setup-paypal-webhook.cjs "$SERVICE_URL/api/webhooks/paypal"

echo ""
echo "⚠️  Don't forget to:"
echo "   1. Set up your environment variables in Google Cloud Console"
echo "   2. Set up your PostgreSQL database"
echo "   3. Run database migrations"
echo ""
echo "🎉 Deployment complete!"