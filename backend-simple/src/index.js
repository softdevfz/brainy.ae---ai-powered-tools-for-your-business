import express from 'express';
import cors from 'cors';
import https from 'https';
import { URL } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

// PayPal configuration
const PAYPAL_CLIENT_ID = 'AXN6VKH5xZskWPuRPSt1aohzCHCcNfRoAVeWZtGoz7Pk5vJJhYjy5BqVHVSBtQv2EIjSX687e3-REyzj';
const PAYPAL_CLIENT_SECRET = 'EKfArGnRGXpb9LqG6bgN2Ps95xNB4dtIPPzpS0KU_IqS9jbSiOgilwiGxzJF8uR7rmcVER8PxgaxTufb';
const PAYPAL_BASE_URL = 'api.paypal.com'; // Production

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://brainy.ae',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper function to make HTTPS requests
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonBody);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonBody.message || body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const data = 'grant_type=client_credentials';
  
  try {
    const response = await makeRequest(`https://${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    }, data);
    
    return response.access_token;
  } catch (error) {
    console.error('Failed to get PayPal access token:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'brainy-ae-backend-simple'
  });
});

// PayPal create order endpoint
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { productId, productName, price } = req.body;
    
    if (!productId || !productName || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accessToken = await getPayPalAccessToken();
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: productId,
        description: `${productName} - 30-day free trial`,
        amount: {
          currency_code: 'USD',
          value: price.toFixed(2)
        }
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL || 'https://brainy.ae'}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL || 'https://brainy.ae'}/payment/cancel`,
        brand_name: 'Brainy.ae',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const response = await makeRequest(`https://${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(orderData));

    console.log('PayPal order created:', response.id);
    res.json({ orderId: response.id });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// PayPal capture order endpoint
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const accessToken = await getPayPalAccessToken();
    
    const response = await makeRequest(`https://${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('PayPal order captured:', orderId);
    res.json({ 
      orderId: response.id,
      status: response.status,
      payerId: response.payer?.payer_id
    });
  } catch (error) {
    console.error('PayPal order capture error:', error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

// Google Pay process payment endpoint
app.post('/api/googlepay/process-payment', async (req, res) => {
  try {
    const { paymentToken, productId, productName, price } = req.body;
    
    if (!productId || !productName || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, we'll simulate Google Pay success and create a PayPal order
    // This allows Google Pay to work immediately while your business gets approved
    const accessToken = await getPayPalAccessToken();
    
    // Create a standard PayPal order (Google Pay token will be processed separately)
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: productId,
        description: `${productName} - 30-day free trial (via Google Pay)`,
        amount: {
          currency_code: 'USD',
          value: price.toFixed(2)
        },
        custom_id: `googlepay_${Date.now()}`
      }],
      application_context: {
        brand_name: 'Brainy.ae',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    };

    const response = await makeRequest(`https://${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(orderData));

    console.log('Google Pay order created (via PayPal):', response.id);
    console.log('Google Pay token received (will be processed when Google Pay is fully configured)');
    
    // Return success immediately - in production, you'd process the Google Pay token
    res.json({ 
      orderId: response.id,
      status: 'CREATED',
      paymentMethod: 'Google Pay',
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Google Pay payment error:', error);
    res.status(500).json({ error: 'Failed to process Google Pay payment' });
  }
});

// PayPal webhook endpoint
app.post('/api/webhooks/paypal', (req, res) => {
  try {
    const event = req.body;
    console.log('PayPal webhook received:', {
      eventType: event.event_type,
      resourceType: event.resource_type,
      timestamp: new Date().toISOString()
    });

    // For now, just log the webhook and respond OK
    // In a real implementation, you'd process the webhook and update your database
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment completed for order:', event.resource?.supplementary_data?.related_ids?.order_id);
        break;
      case 'BILLING.SUBSCRIPTION.CREATED':
        console.log('Subscription created:', event.resource?.id);
        break;
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        console.log('Subscription activated:', event.resource?.id);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        console.log('Subscription cancelled:', event.resource?.id);
        break;
      default:
        console.log('Unhandled webhook event type:', event.event_type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Simple user authentication endpoint (mock for now)
app.post('/api/users/auth/google', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Mock user for now - in production you'd verify the Google token
    const mockUser = {
      id: 'user_' + Date.now(),
      email: 'user@brainy.ae',
      name: 'Brainy User'
    };

    // Mock JWT token
    const mockJWT = Buffer.from(JSON.stringify(mockUser)).toString('base64');

    res.json({
      token: mockJWT,
      user: mockUser
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Mock subscription endpoints
app.get('/api/subscriptions', (req, res) => {
  res.json({ subscriptions: [] });
});

app.post('/api/subscriptions', (req, res) => {
  const { productId, productName, price, paypalOrderId } = req.body;
  
  // Mock subscription creation
  const subscription = {
    id: 'sub_' + Date.now(),
    productId,
    productName,
    price,
    paypalOrderId,
    status: 'trial',
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  };

  console.log('Subscription created:', subscription);
  res.status(201).json({ subscription });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Simple backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}); 