import React, { useState, useEffect } from 'react';
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { PaymentRequest } from '@stripe/stripe-js';
import { PRICING_PLANS } from '../constants';

// Hardcoding to the first plan as this component is not fully integrated with props yet.
const PRICING_PLAN = PRICING_PLANS[0]; 

const PaymentButtons: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !elements || !PRICING_PLAN) {
        return;
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: `Brainy.ae (${PRICING_PLAN.trial_days} day free trial)`,
        amount: PRICING_PLAN.price * 100,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then(result => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      // This is where you would send `ev.paymentMethod.id` to your server.
      // Your server would then:
      // 1. Create a Stripe Customer.
      // 2. Attach the PaymentMethod to the Customer.
      // 3. Create a Subscription with a trial period for that Customer.
      // 4. Return a success response.
      
      console.log('Received PaymentMethod:', ev.paymentMethod);
      setStatus(`Processing... Payment Method ID: ${ev.paymentMethod.id}. In a real app, this is sent to a server. Check the console.`);

      // For this demo, we'll just complete the UI flow after a short delay.
      setTimeout(() => {
          ev.complete('success');
          setStatus(`Success! Your ${PRICING_PLAN.trial_days}-day trial has started. Your card will be charged $${PRICING_PLAN.price} after the trial ends.`);
      }, 2000);

    });
  }, [stripe, elements]);
  
  if (!PRICING_PLAN) {
      return <div className="text-center text-red-400">Pricing information not available.</div>;
  }

  if (status) {
      return <div className="text-center text-green-400 font-semibold bg-green-900/50 p-4 rounded-lg animate-pulse">{status}</div>;
  }

  return (
    <div className="text-center">
        {paymentRequest ? (
            <>
                <PaymentRequestButtonElement options={{ paymentRequest, theme: 'dark' }} className="w-full mb-4 h-[52px]" />
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-slate-800 px-2 text-sm text-slate-400">OR</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500">(Other payment options would be here)</p>
            </>
        ) : (
            <p className="text-slate-400">Loading payment options...</p>
        )}
    </div>
  );
};

export default PaymentButtons;
