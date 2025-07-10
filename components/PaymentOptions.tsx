import React, { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import type { PricingPlan } from '../types';

declare global {
  interface Window {
    google?: any;
  }
}

// Define a simple Google Pay button component
const GooglePayButton: React.FC<{ price: number; productName: string; onPaymentSuccess: () => void; }> = ({ price, productName, onPaymentSuccess }) => {
  const [googlePayClient, setGooglePayClient] = useState<any>(null);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    if (window.google?.payments?.api) {
      const client = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
      setGooglePayClient(client);

      client.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{ type: 'CARD', parameters: { allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'], allowedCardNetworks: ['MASTERCARD', 'VISA'] }}],
      }).then(response => {
        if(response.result) {
          setCanPay(true);
        }
      }).catch(err => console.error("Error checking Google Pay readiness", err));

    }
  }, []);

  const handleGooglePayClick = async () => {
    if (!googlePayClient) return;

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId',
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Brainy.ae',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: price.toString(),
        currencyCode: 'USD',
        countryCode: 'US',
      },
    };

    try {
      const paymentData = await googlePayClient.loadPaymentData(paymentDataRequest);
      console.log('Google Pay success', paymentData);
      onPaymentSuccess();
    } catch (error) {
      console.error('Google Pay error:', error);
    }
  };

  if (!canPay) return null;

  return (
    <button onClick={handleGooglePayClick} aria-label="Google Pay" className="w-full bg-black text-white h-[48px] rounded-lg flex items-center justify-center font-semibold hover:bg-gray-800 transition-colors">
      <img src="https://pay.google.com/gp/p/img/gpay-logo-white.svg" alt="Google Pay" className="h-7"/>
    </button>
  );
};


const PaymentOptions: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const [status, setStatus] = useState<string | null>(null);

  const handlePaymentSuccess = (method: string) => {
    setStatus(`Success via ${method}! Your ${plan.trial_days}-day trial for ${plan.productName} has started.`);
  };

  if (status) {
    return <div className="text-center text-green-400 font-semibold bg-green-900/50 p-4 rounded-lg">{status}</div>;
  }

  return (
    <div className="space-y-3">
        <GooglePayButton price={plan.price} productName={plan.productName} onPaymentSuccess={() => handlePaymentSuccess('Google Pay')} />
        <PayPalButtons
            style={{ layout: 'horizontal', color: 'white', shape: 'rect', label: 'paypal', height: 48, tagline: false }}
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        description: `Brainy.ae ${plan.productName} Subscription`,
                        amount: {
                            value: plan.price.toString(),
                        },
                    }],
                });
            }}
            onApprove={(data, actions) => {
                return actions.order!.capture().then(details => {
                    handlePaymentSuccess('PayPal');
                    console.log('PayPal payment successful', details);
                });
            }}
            onError={(err) => {
                console.error('PayPal Error:', err);
                setStatus('An error occurred with PayPal. Please try again.');
            }}
        />
    </div>
  );
};

export default PaymentOptions;