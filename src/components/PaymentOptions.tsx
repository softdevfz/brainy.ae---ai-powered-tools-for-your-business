import React, { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import type { PricingPlan } from '../../types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Simple auth context (in a real app, you'd use proper auth context)
const getAuthToken = () => localStorage.getItem('authToken');
const isAuthenticated = () => !!getAuthToken();

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
      const client = new window.google.payments.api.PaymentsClient({ environment: 'PRODUCTION' });
      setGooglePayClient(client);

      client.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{ 
          type: 'CARD', 
          parameters: { 
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'], 
            allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER'] 
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'paypal',
              gatewayMerchantId: process.env.PAYPAL_CLIENT_ID || ''
            }
          }
        }],
              }).then((response: any) => {
        if(response.result) {
          setCanPay(true);
        }
        }).catch((err: any) => console.error("Error checking Google Pay readiness", err));

    }
  }, []);

  const handleGooglePayClick = async () => {
    if (!googlePayClient) {
      // Fallback: if Google Pay isn't available, process as regular payment
      try {
        const response = await fetch(`${BACKEND_URL}/api/googlepay/process-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: productName,
            productName: productName,
            price: price,
          }),
        });

        if (response.ok) {
          onPaymentSuccess();
        } else {
          throw new Error('Payment processing failed');
        }
      } catch (error) {
        console.error('Google Pay fallback error:', error);
      }
      return;
    }

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'paypal',
              gatewayMerchantId: process.env.PAYPAL_CLIENT_ID || '',
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: process.env.GOOGLE_PAY_MERCHANT_ID || 'BCR2DN4T39KV4I7S',
        merchantName: 'Brainy.ae',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: `${productName} - 30-day free trial`,
        totalPrice: price.toString(),
        currencyCode: 'USD',
        countryCode: 'US',
      },
    };

    try {
      const paymentData = await googlePayClient.loadPaymentData(paymentDataRequest);
      console.log('Google Pay payment completed successfully');
      
      // Send the payment data to your backend
      const response = await fetch(`${BACKEND_URL}/api/googlepay/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentToken: paymentData.paymentMethodData?.tokenizationData?.token || 'google_pay_token',
          productId: productName,
          productName: productName,
          price: price,
        }),
      });

      if (response.ok) {
      onPaymentSuccess();
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      if ((error as any).statusCode === 'CANCELED') {
        console.log('Google Pay was canceled by user');
        return;
      }
      console.error('Google Pay error:', error);
      
      // Fallback to regular payment processing
      try {
        const response = await fetch(`${BACKEND_URL}/api/googlepay/process-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: productName,
            productName: productName,
            price: price,
          }),
        });

        if (response.ok) {
          onPaymentSuccess();
        }
      } catch (fallbackError) {
        console.error('Payment fallback failed:', fallbackError);
      }
    }
  };

  // Always show Google Pay button - it will fallback gracefully if not supported

  return (
    <button onClick={handleGooglePayClick} aria-label="Google Pay" className="w-full bg-black text-white h-[48px] rounded-lg flex items-center justify-center font-semibold hover:bg-gray-800 transition-colors">
      <img src="https://pay.google.com/gp/p/img/gpay-logo-white.svg" alt="Google Pay" className="h-7"/>
    </button>
  );
};

// Login component
const LoginPrompt: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Redirect to stooge.brainy.ae for Google Sign-In
    window.location.href = 'https://stooge.brainy.ae'; // Assuming stooge.brainy.ae handles its own Google login
    // No need for setIsLoading(false) here as the page will redirect
  };

  return (
    <div className="text-center p-6 bg-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Sign in to start your free trial</h3>
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
};

const PaymentOptions: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getAuthToken());
  }, []);

  const handlePaymentSuccess = async (method: string, orderId?: string) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Create subscription record in our backend
      const response = await fetch(`${BACKEND_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          productId: plan.productId,
          productName: plan.productName,
          price: plan.price,
          paypalOrderId: orderId,
        }),
      });

      if (response.ok) {
    setStatus(`Success via ${method}! Your ${plan.trial_days}-day trial for ${plan.productName} has started.`);
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription creation error:', error);
      setStatus('Payment successful, but there was an error setting up your subscription. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="text-center text-blue-400 font-semibold bg-blue-900/50 p-4 rounded-lg">
        Setting up your subscription...
      </div>
    );
  }

  if (status) {
    return (
      <div className="text-center text-green-400 font-semibold bg-green-900/50 p-4 rounded-lg">
        {status}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="space-y-3">
      <GooglePayButton 
        price={plan.price} 
        productName={plan.productName} 
        onPaymentSuccess={() => handlePaymentSuccess('Google Pay')} 
      />
        <PayPalButtons
            style={{ layout: 'horizontal', color: 'white', shape: 'rect', label: 'paypal', height: 48, tagline: false }}
        createOrder={async (data, actions) => {
          try {
            // Create order via our backend
            const response = await fetch(`${BACKEND_URL}/api/paypal/create-order`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
              },
              body: JSON.stringify({
                productId: plan.productId,
                productName: plan.productName,
                price: plan.price,
              }),
            });

            if (response.ok) {
              const { orderId } = await response.json();
              return orderId;
            } else {
              throw new Error('Failed to create PayPal order');
            }
          } catch (error) {
            console.error('PayPal order creation error:', error);
            throw error;
          }
            }}
        onApprove={async (data, actions) => {
          try {
            // Capture payment via our backend
            const response = await fetch(`${BACKEND_URL}/api/paypal/capture-order`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
              },
              body: JSON.stringify({
                orderId: data.orderID,
              }),
            });

            if (response.ok) {
              const details = await response.json();
              await handlePaymentSuccess('PayPal', data.orderID);
                    console.log('PayPal payment successful', details);
            } else {
              throw new Error('Failed to capture PayPal payment');
            }
          } catch (error) {
            console.error('PayPal capture error:', error);
            setStatus('Payment failed. Please try again.');
          }
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