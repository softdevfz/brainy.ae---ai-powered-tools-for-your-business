import React from 'react';
import { PRICING_PLANS } from '../constants';
import PaymentOptions from './PaymentOptions';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
          <p className="max-w-md mx-auto mt-3 text-lg text-slate-400">
            Start for free, then get everything for one simple price per app.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_PLANS.map(plan => (
            <div key={plan.productId} className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 flex flex-col">
              <h3 className="text-2xl font-bold text-white">{plan.productName}</h3>
              <p className="text-slate-400 mb-6">{plan.productTagline}</p>
              
              <div className="my-4 text-left">
                <span className="text-5xl font-black text-white">${plan.price}</span>
                <span className="text-xl text-slate-400">/ month</span>
                <p className="mt-2 text-sky-400 font-semibold">Includes a {plan.trial_days}-day free trial</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon />
                    <span className="ml-3 text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <PaymentOptions plan={plan} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;