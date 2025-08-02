#!/usr/bin/env node

const https = require('https');
const querystring = require('querystring');

// Your PayPal credentials
const PAYPAL_CLIENT_ID = 'AXN6VKH5xZskWPuRPSt1aohzCHCcNfRoAVeWZtGoz7Pk5vJJhYjy5BqVHVSBtQv2EIjSX687e3-REyzj';
const PAYPAL_CLIENT_SECRET = 'EKfArGnRGXpb9LqG6bgN2Ps95xNB4dtIPPzpS0KU_IqS9jbSiOgilwiGxzJF8uR7rmcVER8PxgaxTufb';

// Set this to your backend URL (will be your Cloud Run URL after deployment)
const WEBHOOK_URL = process.argv[2] || 'https://brainy-ae-backend-[random].a.run.app/api/webhooks/paypal';

// PayPal environment (sandbox for testing, live for production)
const PAYPAL_ENV = 'live'; // Using live environment for production credentials
const PAYPAL_BASE_URL = PAYPAL_ENV === 'sandbox' 
  ? 'api.sandbox.paypal.com' 
  : 'api.paypal.com';

// Webhook events we want to subscribe to
const WEBHOOK_EVENTS = [
  { name: 'PAYMENT.CAPTURE.COMPLETED' },
  { name: 'BILLING.SUBSCRIPTION.CREATED' },
  { name: 'BILLING.SUBSCRIPTION.ACTIVATED' },
  { name: 'BILLING.SUBSCRIPTION.CANCELLED' },
  { name: 'BILLING.SUBSCRIPTION.SUSPENDED' },
  { name: 'BILLING.SUBSCRIPTION.PAYMENT.FAILED' }
];

// Helper function to make HTTPS requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
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
async function getAccessToken() {
  console.log('🔑 Getting PayPal access token...');
  
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const data = querystring.stringify({ grant_type: 'client_credentials' });
  
  const options = {
    hostname: PAYPAL_BASE_URL,
    path: '/v1/oauth2/token',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  try {
    const response = await makeRequest(options, data);
    console.log('✅ Access token obtained');
    return response.access_token;
  } catch (error) {
    console.error('❌ Failed to get access token:', error.message);
    throw error;
  }
}

// List existing webhooks
async function listWebhooks(accessToken) {
  console.log('📋 Checking existing webhooks...');
  
  const options = {
    hostname: PAYPAL_BASE_URL,
    path: '/v1/notifications/webhooks',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options);
    return response.webhooks || [];
  } catch (error) {
    console.error('❌ Failed to list webhooks:', error.message);
    return [];
  }
}

// Create webhook
async function createWebhook(accessToken, webhookUrl) {
  console.log(`🔗 Creating webhook for: ${webhookUrl}`);
  
  const webhookData = {
    url: webhookUrl,
    event_types: WEBHOOK_EVENTS
  };

  const data = JSON.stringify(webhookData);
  
  const options = {
    hostname: PAYPAL_BASE_URL,
    path: '/v1/notifications/webhooks',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  try {
    const response = await makeRequest(options, data);
    console.log('✅ Webhook created successfully!');
    console.log(`📍 Webhook ID: ${response.id}`);
    console.log(`🔗 Webhook URL: ${response.url}`);
    return response;
  } catch (error) {
    console.error('❌ Failed to create webhook:', error.message);
    throw error;
  }
}

// Delete webhook (helper function)
async function deleteWebhook(accessToken, webhookId) {
  console.log(`🗑️ Deleting webhook: ${webhookId}`);
  
  const options = {
    hostname: PAYPAL_BASE_URL,
    path: `/v1/notifications/webhooks/${webhookId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    await makeRequest(options);
    console.log('✅ Webhook deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete webhook:', error.message);
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 PayPal Webhook Setup Script');
    console.log(`🌍 Environment: ${PAYPAL_ENV}`);
    console.log(`🔗 Webhook URL: ${WEBHOOK_URL}`);
    console.log('');

    // Get access token
    const accessToken = await getAccessToken();

    // List existing webhooks
    const existingWebhooks = await listWebhooks(accessToken);
    console.log(`📊 Found ${existingWebhooks.length} existing webhooks`);

    // Check if webhook already exists for this URL
    const existingWebhook = existingWebhooks.find(webhook => webhook.url === WEBHOOK_URL);
    
    if (existingWebhook) {
      console.log('⚠️ Webhook already exists for this URL');
      console.log(`📍 Existing Webhook ID: ${existingWebhook.id}`);
      
      // Optionally delete and recreate
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Do you want to delete and recreate it? (y/n): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() === 'y') {
        await deleteWebhook(accessToken, existingWebhook.id);
        await createWebhook(accessToken, WEBHOOK_URL);
      }
    } else {
      // Create new webhook
      const webhook = await createWebhook(accessToken, WEBHOOK_URL);
      
      console.log('');
      console.log('🎉 Webhook setup complete!');
      console.log('');
      console.log('📋 Important: Save these details for your environment variables:');
      console.log(`PAYPAL_WEBHOOK_ID=${webhook.id}`);
      console.log('');
      console.log('📝 Events subscribed to:');
      WEBHOOK_EVENTS.forEach(event => {
        console.log(`   - ${event.name}`);
      });
    }

  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// Usage information
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('PayPal Webhook Setup Script');
  console.log('');
  console.log('Usage:');
  console.log('  node setup-paypal-webhook.js [webhook-url]');
  console.log('');
  console.log('Examples:');
  console.log('  node setup-paypal-webhook.js');
  console.log('  node setup-paypal-webhook.js https://my-backend.run.app/api/webhooks/paypal');
  console.log('');
  process.exit(0);
}

// Run the script
main(); 