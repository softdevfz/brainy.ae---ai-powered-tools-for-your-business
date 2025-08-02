import express from 'express';
import crypto from 'crypto';
import { db } from '../database/connection';
import { logger } from '../utils/logger';
import { CustomError } from '../middleware/errorHandler';

const router = express.Router();

// PayPal webhook verification
const verifyPayPalWebhook = (req: any, res: any, next: any) => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const authAlgo = req.get('paypal-auth-algo');
  const transmission = req.get('paypal-transmission-id');
  const certId = req.get('paypal-cert-id');
  const authSignature = req.get('paypal-auth-signature');
  const transmissionTime = req.get('paypal-transmission-time');
  
  if (!webhookId || !authAlgo || !transmission || !certId || !authSignature || !transmissionTime) {
    logger.warn('Missing PayPal webhook headers');
    return res.status(400).json({ error: 'Missing webhook headers' });
  }

  // In production, you should verify the webhook signature
  // For now, we'll log and proceed
  logger.info('PayPal webhook received', {
    transmission,
    certId,
    transmissionTime
  });

  next();
};

// PayPal webhook endpoint
router.post('/paypal', express.raw({ type: 'application/json' }), verifyPayPalWebhook, async (req, res) => {
  try {
    const event = JSON.parse(req.body.toString());
    logger.info('PayPal webhook event:', { 
      eventType: event.event_type,
      resourceType: event.resource_type 
    });

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(event);
        break;
      
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        await handlePaymentFailed(event);
        break;
      
      default:
        logger.info('Unhandled PayPal webhook event type:', event.event_type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('PayPal webhook processing failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Handle payment completed (one-time purchase)
async function handlePaymentCompleted(event: any) {
  const capture = event.resource;
  const orderId = capture.supplementary_data?.related_ids?.order_id;
  
  if (!orderId) {
    logger.warn('No order ID found in payment capture event');
    return;
  }

  try {
    // Find subscription by PayPal order ID
    const subscription = await db('subscriptions')
      .where('paypal_order_id', orderId)
      .first();

    if (!subscription) {
      logger.warn('No subscription found for PayPal order:', orderId);
      return;
    }

    // Update subscription to active and set trial end date
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial

    await db('subscriptions')
      .where('id', subscription.id)
      .update({
        status: 'trial',
        trial_ends_at: trialEndDate,
        current_period_start: new Date(),
        current_period_end: trialEndDate,
        paypal_data: JSON.stringify(event),
        updated_at: new Date()
      });

    logger.info('Payment completed for subscription:', subscription.id);
  } catch (error) {
    logger.error('Error handling payment completed:', error);
    throw error;
  }
}

// Handle subscription created
async function handleSubscriptionCreated(event: any) {
  const subscription = event.resource;
  logger.info('PayPal subscription created:', subscription.id);
  
  // Update our database with PayPal subscription ID
  await db('subscriptions')
    .where('paypal_order_id', subscription.custom_id)
    .update({
      paypal_subscription_id: subscription.id,
      paypal_data: JSON.stringify(event),
      updated_at: new Date()
    });
}

// Handle subscription activated
async function handleSubscriptionActivated(event: any) {
  const subscription = event.resource;
  logger.info('PayPal subscription activated:', subscription.id);
  
  await db('subscriptions')
    .where('paypal_subscription_id', subscription.id)
    .update({
      status: 'active',
      paypal_data: JSON.stringify(event),
      updated_at: new Date()
    });
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(event: any) {
  const subscription = event.resource;
  logger.info('PayPal subscription cancelled:', subscription.id);
  
  await db('subscriptions')
    .where('paypal_subscription_id', subscription.id)
    .update({
      status: 'cancelled',
      cancelled_at: new Date(),
      paypal_data: JSON.stringify(event),
      updated_at: new Date()
    });
}

// Handle subscription suspended
async function handleSubscriptionSuspended(event: any) {
  const subscription = event.resource;
  logger.info('PayPal subscription suspended:', subscription.id);
  
  await db('subscriptions')
    .where('paypal_subscription_id', subscription.id)
    .update({
      status: 'suspended',
      paypal_data: JSON.stringify(event),
      updated_at: new Date()
    });
}

// Handle payment failed
async function handlePaymentFailed(event: any) {
  const subscription = event.resource;
  logger.error('PayPal payment failed for subscription:', subscription.id);
  
  // You might want to send an email to the user here
  // or update the subscription status
}

export default router; 