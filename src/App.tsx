import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import FeaturesSection from './components/FeaturesSection';
import TechReadySection from './components/TechReadySection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { PRODUCTS } from './constants';
import CommercialsSection from './components/CommercialsSection';

const App: React.FC = () => {
    const paypalOptions = {
        clientId: process.env.PAYPAL_CLIENT_ID || 'test',
        currency: 'USD',
        intent: 'capture',
    };

    const brainyPos = PRODUCTS.find(p => p.id === 'pos');
    const brainyStooge = PRODUCTS.find(p => p.id === 'stooge');

  return (
    <PayPalScriptProvider options={paypalOptions}>
        <div className="bg-slate-900 text-slate-200 min-h-screen overflow-x-hidden">
        <Header />
        <main>
            <HeroSection />
            <ProductsSection />
            <CommercialsSection />
            
            {brainyPos && (
                <FeaturesSection 
                    id="pos-features"
                    title={brainyPos.name}
                    subtitle={brainyPos.tagline}
                    features={brainyPos.features}
                />
            )}
            
            {brainyStooge && (
                <FeaturesSection 
                    id="stooge-features"
                    title={brainyStooge.name}
                    subtitle={brainyStooge.tagline}
                    features={brainyStooge.features}
                />
            )}

            <TechReadySection />
            <PricingSection />
        </main>
        <Footer />
        <Chatbot />
        </div>
    </PayPalScriptProvider>
  );
};

export default App;
