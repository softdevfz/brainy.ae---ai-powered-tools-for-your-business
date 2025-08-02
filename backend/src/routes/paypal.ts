import express from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

// PayPal configuration
const getPayPalConfig = () => ({
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
});

// Get PayPal access token
async function getPayPalAccessToken() {
  const config = getPayPalConfig();
  const auth = Buffer.from(`${config.client_id}:${config.client_secret}`).toString('base64');
  
  const response = await fetch(`https://api.${config.mode}.paypal.com/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json() as any;
  return data.access_token;
}

// Create PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { productId, productName, price } = req.body;
    
    if (!productId || !productName || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accessToken = await getPayPalAccessToken();
    const config = getPayPalConfig();
    
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
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        brand_name: 'Brainy.ae',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const response = await fetch(`https://api.${config.mode}.paypal.com/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const order = await response.json() as any;
    
    if (!response.ok) {
      logger.error('PayPal order creation failed:', order);
      return res.status(400).json({ error: 'Failed to create PayPal order' });
    }

    logger.info('PayPal order created:', { orderId: order.id, productId });
    res.json({ orderId: order.id });
  } catch (error) {
    logger.error('PayPal order creation error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// Capture PayPal order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const accessToken = await getPayPalAccessToken();
    const config = getPayPalConfig();
    
    const response = await fetch(`https://api.${config.mode}.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const captureData = await response.json() as any;
    
    if (!response.ok) {
      logger.error('PayPal order capture failed:', captureData);
      return res.status(400).json({ error: 'Failed to capture PayPal order' });
    }

    logger.info('PayPal order captured:', { orderId, status: captureData.status });
    res.json({ 
      orderId: captureData.id,
      status: captureData.status,
      payerId: captureData.payer?.payer_id
    });
  } catch (error) {
    logger.error('PayPal order capture error:', error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

// Get PayPal order details
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const accessToken = await getPayPalAccessToken();
    const config = getPayPalConfig();
    
    const response = await fetch(`https://api.${config.mode}.paypal.com/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const orderData = await response.json();
    
    if (!response.ok) {
      logger.error('PayPal order fetch failed:', orderData);
      return res.status(400).json({ error: 'Failed to fetch PayPal order' });
    }

    res.json(orderData);
  } catch (error) {
    logger.error('PayPal order fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch PayPal order' });
  }
});

export default router; 