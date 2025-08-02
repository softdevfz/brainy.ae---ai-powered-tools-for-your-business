import express from 'express';
import { db } from '../database/connection';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth';
import { CustomError } from '../middleware/errorHandler';

const router = express.Router();

// Get user's subscriptions
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const subscriptions = await db('subscriptions')
      .where('user_id', userId)
      .select('*');

    res.json({ subscriptions });
  } catch (error) {
    logger.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Create a new subscription
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { productId, productName, price, paypalOrderId } = req.body;

    if (!productId || !productName || !price || !paypalOrderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already has an active subscription for this product
    const existingSubscription = await db('subscriptions')
      .where('user_id', userId)
      .where('product_id', productId)
      .whereIn('status', ['trial', 'active'])
      .first();

    if (existingSubscription) {
      return res.status(409).json({ error: 'User already has an active subscription for this product' });
    }

    // Create new subscription
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30-day trial

    const [subscription] = await db('subscriptions')
      .insert({
        user_id: userId,
        product_id: productId,
        product_name: productName,
        price: price,
        paypal_order_id: paypalOrderId,
        status: 'trial',
        trial_ends_at: trialEndDate,
        current_period_start: new Date(),
        current_period_end: trialEndDate,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    logger.info('Subscription created:', { userId, productId, subscriptionId: subscription.id });
    res.status(201).json({ subscription });
  } catch (error) {
    logger.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Get subscription by ID
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const subscriptionId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const subscription = await db('subscriptions')
      .where('id', subscriptionId)
      .where('user_id', userId)
      .first();

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    logger.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel subscription
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const subscriptionId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const subscription = await db('subscriptions')
      .where('id', subscriptionId)
      .where('user_id', userId)
      .first();

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (subscription.status === 'cancelled') {
      return res.status(400).json({ error: 'Subscription already cancelled' });
    }

    // Update subscription status
    await db('subscriptions')
      .where('id', subscriptionId)
      .update({
        status: 'cancelled',
        cancelled_at: new Date(),
        updated_at: new Date()
      });

    // TODO: Cancel PayPal subscription if exists
    if (subscription.paypal_subscription_id) {
      // You would call PayPal API to cancel the subscription here
      logger.info('Would cancel PayPal subscription:', subscription.paypal_subscription_id);
    }

    logger.info('Subscription cancelled:', { userId, subscriptionId });
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    logger.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Check subscription status
router.get('/:id/status', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const subscriptionId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const subscription = await db('subscriptions')
      .where('id', subscriptionId)
      .where('user_id', userId)
      .first();

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Check if trial has expired
    let status = subscription.status;
    const now = new Date();
    
    if (status === 'trial' && subscription.trial_ends_at && new Date(subscription.trial_ends_at) < now) {
      status = 'expired';
      // Update database
      await db('subscriptions')
        .where('id', subscriptionId)
        .update({
          status: 'expired',
          updated_at: new Date()
        });
    }

    res.json({ 
      status,
      trialEndsAt: subscription.trial_ends_at,
      currentPeriodEnd: subscription.current_period_end,
      isActive: ['trial', 'active'].includes(status)
    });
  } catch (error) {
    logger.error('Error checking subscription status:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
});

export default router; 