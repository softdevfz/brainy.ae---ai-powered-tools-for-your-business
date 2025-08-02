import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, PricingPlan } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, PRICING_PLANS as DEFAULT_PRICING } from '../constants';

interface AdminContextType {
  products: Product[];
  pricingPlans: PricingPlan[];
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  updatePricing: (productId: string, updates: Partial<PricingPlan>) => void;
  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('customProducts');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('customPricingPlans');
    return saved ? JSON.parse(saved) : DEFAULT_PRICING;
  });

  useEffect(() => {
    localStorage.setItem('customProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('customPricingPlans', JSON.stringify(pricingPlans));
  }, [pricingPlans]);

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  const updatePricing = (productId: string, updates: Partial<PricingPlan>) => {
    setPricingPlans(prev =>
      prev.map(plan =>
        plan.productId === productId ? { ...plan, ...updates } : plan
      )
    );
  };

  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setPricingPlans(DEFAULT_PRICING);
    localStorage.removeItem('customProducts');
    localStorage.removeItem('customPricingPlans');
  };

  return (
    <AdminContext.Provider value={{
      products,
      pricingPlans,
      updateProduct,
      updatePricing,
      resetToDefaults
    }}>
      {children}
    </AdminContext.Provider>
  );
};