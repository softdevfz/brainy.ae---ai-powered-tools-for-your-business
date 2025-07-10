# Deployment Guide for brainy.ae

This guide will help you deploy the brainy.ae React application to DigitalOcean App Platform using doctl.

## Prerequisites

1. **DigitalOcean Account**: Sign up at [digitalocean.com](https://www.digitalocean.com/)
2. **doctl CLI**: Install the DigitalOcean command line tool
3. **GitHub Repository**: Your code should be in a GitHub repository

## Installation Steps

### 1. Install doctl

**On macOS (using Homebrew):**
```bash
brew install doctl
```

**On Linux/macOS (using curl):**
```bash
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
tar xf doctl-1.94.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

### 2. Authenticate doctl

```bash
doctl auth init
```

This will open a browser window where you can generate an API token.

### 3. Update Configuration

Edit `.do/app.yaml` and replace:
- `your-username` with your actual GitHub username
- Update the repository name if different

### 4. Push to GitHub

Make sure your code is pushed to your GitHub repository:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 5. Deploy

Run the deployment script:

```bash
./deploy.sh
```

Or manually deploy using doctl:

```bash
doctl apps create .do/app.yaml
```

### 6. Configure Environment Variables

After deployment, you need to set up environment variables in the DigitalOcean control panel:

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click on your app
3. Go to "Settings" → "Environment Variables"
4. Add these variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `PAYPAL_CLIENT_ID`: Your PayPal client ID
   - `STRIPE_PUBLIC_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key

## Environment Variables

The following environment variables are required:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `PAYPAL_CLIENT_ID` | PayPal client ID | [PayPal Developer](https://developer.paypal.com/apps/) |
| `STRIPE_PUBLIC_KEY` | Stripe publishable key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |

## Deployment Options

### Option 1: Using the deployment script
```bash
./deploy.sh
```

### Option 2: Manual deployment
```bash
# Create new app
doctl apps create .do/app.yaml

# Update existing app
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

### Option 3: Using Docker
```bash
# Build Docker image
docker build -t brainy-ae .

# Run locally to test
docker run -p 4173:4173 brainy-ae
```

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are in `package.json`
2. **App doesn't start**: Verify the `preview` command works locally
3. **Environment variables not working**: Make sure they're set in the DO control panel

### Useful Commands

```bash
# List all apps
doctl apps list

# Get app info
doctl apps get YOUR_APP_ID

# View app logs
doctl apps logs YOUR_APP_ID

# Delete app
doctl apps delete YOUR_APP_ID
```

## Cost Estimation

- **Basic XXS**: $5/month (512MB RAM, 1 vCPU)
- **Basic XS**: $12/month (1GB RAM, 1 vCPU)
- **Basic S**: $25/month (2GB RAM, 1 vCPU)

## Next Steps

1. Set up a custom domain
2. Configure SSL certificates (automatically handled by DO)
3. Set up monitoring and alerts
4. Consider setting up CI/CD with GitHub Actions

For more information, visit the [DigitalOcean App Platform documentation](https://docs.digitalocean.com/products/app-platform/). 