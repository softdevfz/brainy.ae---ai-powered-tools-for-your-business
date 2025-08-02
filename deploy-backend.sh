#!/bin/bash

# Deploy backend to Google Cloud Run
# Make sure you have gcloud CLI installed and authenticated

set -e

echo "🚀 Deploying Brainy.ae Backend to Google Cloud Run..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ gcloud is not authenticated. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

# Set project ID
PROJECT_ID="brainy-ae-homepage"
gcloud config set project $PROJECT_ID

# Build and deploy
echo "🔨 Building Docker image..."
cd backend
gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/brainy-ae-backend

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy brainy-ae-backend \
    --image us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/brainy-ae-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3001 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production \
    --set-env-vars FRONTEND_URL=https://brainy.ae

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