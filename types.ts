import React from 'react';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface TechPillar {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: Feature[];
}

export interface PricingPlan {
    productId: string;
    productName: string;
    productTagline: string;
    price: number;
    trial_days: number;
    features: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}