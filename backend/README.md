# Brainy.ae Backend Service

A complete backend service for handling PayPal payments, subscriptions, and user management for the Brainy.ae platform.

## Features

- ✅ **PayPal Integration**: Complete payment processing with webhooks
- ✅ **Subscription Management**: Trial periods, billing cycles, cancellations
- ✅ **Google OAuth**: Secure user authentication
- ✅ **Database**: PostgreSQL with migrations
- ✅ **RESTful API**: Well-structured endpoints
- ✅ **Webhook Handling**: PayPal payment notifications
- ✅ **Security**: JWT tokens, CORS, helmet
- ✅ **Logging**: Structured logging with Winston
- ✅ **Docker**: Containerized deployment
- ✅ **Cloud Run**: Production-ready deployment

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=brainy_ae_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_WEBHOOK_ID=your-paypal-webhook-id

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Database

```bash
# Create database
createdb brainy_ae_dev

# Run migrations
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/users/auth/google` - Google OAuth login
- `GET /api/users/profile` - Get user profile (requires auth)

### Subscriptions

- `GET /api/subscriptions` - Get user subscriptions (requires auth)
- `POST /api/subscriptions` - Create new subscription (requires auth)
- `GET /api/subscriptions/:id` - Get subscription details (requires auth)
- `DELETE /api/subscriptions/:id` - Cancel subscription (requires auth)
- `GET /api/subscriptions/:id/status` - Check subscription status (requires auth)

### PayPal

- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture PayPal payment
- `GET /api/paypal/order/:orderId` - Get PayPal order details

### Webhooks

- `POST /api/webhooks/paypal` - PayPal webhook handler

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    google_id VARCHAR UNIQUE NOT NULL,
    picture_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR NOT NULL,
    product_name VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    paypal_subscription_id VARCHAR UNIQUE,
    paypal_order_id VARCHAR UNIQUE,
    status VARCHAR DEFAULT 'trial',
    trial_ends_at TIMESTAMP,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancelled_at TIMESTAMP,
    paypal_data JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## PayPal Setup

### 1. Create PayPal App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/developer/applications/)
2. Create a new app
3. Copy your Client ID and Client Secret
4. Set up webhook endpoint: `https://your-backend-url/api/webhooks/paypal`

### 2. Configure Webhook Events

Subscribe to these PayPal webhook events:

- `PAYMENT.CAPTURE.COMPLETED`
- `BILLING.SUBSCRIPTION.CREATED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

### 3. Environment Variables

Add your PayPal credentials to your environment variables:

```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
```

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### 2. Configure OAuth Consent Screen

1. Set up OAuth consent screen
2. Add your domain to authorized domains
3. Configure scopes: `email`, `profile`

### 3. Environment Variables

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Deployment

### Option 1: Using Deploy Script

```bash
# From project root
./deploy-backend.sh
```

### Option 2: Manual Deployment

```bash
# Build and deploy to Google Cloud Run
cd backend
gcloud builds submit --tag gcr.io/brainy-ae-homepage/brainy-ae-backend
gcloud run deploy brainy-ae-backend \
    --image gcr.io/brainy-ae-homepage/brainy-ae-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3001
```

## Production Configuration

### Environment Variables

Set these in Google Cloud Console:

```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_CLIENT_SECRET=your_production_paypal_client_secret
GOOGLE_CLIENT_ID=your_production_google_client_id
FRONTEND_URL=https://brainy.ae
```

### Database Migration

```bash
# Run migrations on production database
NODE_ENV=production npm run migrate
```

## Monitoring

### Health Check

The service includes a health check endpoint:

```bash
curl https://your-backend-url/health
```

### Logging

All requests and errors are logged using Winston. In production, logs are written to files and can be viewed in Google Cloud Logging.

## Security

- JWT tokens for authentication
- CORS configured for frontend domain
- Helmet for security headers
- Input validation with Joi
- SQL injection prevention with parameterized queries
- PayPal webhook signature verification

## Development

### Running Tests

```bash
npm test
```

### Database Operations

```bash
# Run migrations
npm run migrate

# Rollback migration
npm run migrate:rollback

# Create new migration
npx knex migrate:make migration_name
```

### Debugging

```bash
# Start with debugging
npm run dev

# View logs
tail -f combined.log
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Ensure PostgreSQL is running
   - Verify database exists

2. **PayPal Webhook Verification Failed**
   - Check webhook ID in environment
   - Verify webhook URL is accessible
   - Check PayPal dashboard for webhook events

3. **Google OAuth Failed**
   - Verify client ID and secret
   - Check OAuth consent screen configuration
   - Ensure redirect URI is correct

### Support

For issues with the backend service:

1. Check the logs for error messages
2. Verify all environment variables are set
3. Test API endpoints with curl or Postman
4. Check database connectivity

## License

This project is proprietary software for Brainy.ae. 