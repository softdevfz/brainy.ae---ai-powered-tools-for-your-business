import React from 'react';
import type { Feature, TechPillar, Product, PricingPlan } from './types';

// --- ICONS (Shared) ---
export const UploadCloudIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);
export const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.25 21.75l-.648-1.197a3.375 3.375 0 00-2.585-2.585L12 17.25l1.197-.648a3.375 3.375 0 002.585-2.585L16.25 13.5l.648 1.197a3.375 3.375 0 002.585 2.585L20.25 18l-1.197.648a3.375 3.375 0 00-2.585 2.585z" /></svg>
);
export const ChartPieIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);
export const ChatIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
export const LockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
export const ShieldIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 3 9-3a12.02 12.02 0 00-2.382-9.971z" />
    </svg>
);
export const CloudIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
);
export const ScaleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
export const TimeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const LightbulbIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.478 7.478 0 01-7.5 0C8.28 20.533 9.16 18 12 18c2.84 0 3.72 2.533 4.5 4.089zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
export const GlobeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-5.418A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m0 0a11.96 11.96 0 0017.432 0" />
    </svg>
);
const DocumentScanIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
    </svg>
);


// --- FEATURES ---

const BRAINY_STOOGE_FEATURES: Feature[] = [
  {
    icon: <TimeIcon className="h-8 w-8 text-sky-400" />,
    title: "Reclaim Your Time",
    description: "Stop wasting hours on manual data entry. Upload your documents in any format, and our AI organizes everything into a clear financial picture in seconds.",
  },
  {
    icon: <LightbulbIcon className="h-8 w-8 text-sky-400" />,
    title: "Instant Financial Clarity",
    description: "Go from a chaotic 'digital shoebox' of receipts and statements to a professional, easy-to-understand dashboard that shows you exactly where your money is going.",
  },
  {
    icon: <ChatIcon className="h-8 w-8 text-sky-400" />,
    title: "Your Finances, On Your Terms",
    description: "No more nagging emails. Ask questions and make changes when *you* want. 'Recategorize Amazon as Office Supplies' or 'Show me my profit for last month.' You're in control.",
  },
  {
    icon: <GlobeIcon className="h-8 w-8 text-sky-400" />,
    title: "Perfect for Global Business",
    description: "Automatic multi-currency handling makes it a breeze for freelancers and e-commerce stores dealing with clients and vendors from all over the world.",
  }
];

const BRAINY_POS_FEATURES: Feature[] = [
    {
        icon: <SparklesIcon className="h-8 w-8 text-sky-400" />,
        title: "Instant, AI-Powered Setup",
        description: "Provide basic context ('I'm a coffee shop'), upload a menu, or paste your website URL. Our AI analyzes everything and instantly designs a complete POS database."
    },
    {
        icon: <ChatIcon className="h-8 w-8 text-sky-400" />,
        title: "Natural Language Management",
        description: "Talk to your business in plain English. Update sales with 'Sold 2 lattes', check stock with 'How many croissants left?', or add items without touching a complex form."
    },
    {
        icon: <DocumentScanIcon className="h-8 w-8 text-sky-400" />,
        title: "Smart Invoice Processing",
        description: "Upload or scan a supplier invoice. The AI reads it, identifies items, and suggests inventory updates. Just review and approve with one click."
    },
    {
        icon: <UploadCloudIcon className="h-8 w-8 text-sky-400" />,
        title: "ChatGPT for Your Business Data",
        description: "Turn your scattered documents, notes, and lists into a dynamic, interactive assistant that helps you run your business more efficiently."
    }
];

// --- PRODUCTS ---

export const PRODUCTS: Product[] = [
    {
        id: 'pos',
        name: 'BrainyPOS',
        tagline: 'The AI Database & Point-of-Sale Generator',
        description: 'Instantly create a smart, interactive database and POS for any small business. Upload a menu, scan an invoice, or paste a website link, and our AI builds a custom system in seconds.',
        features: BRAINY_POS_FEATURES
    },
    {
        id: 'stooge',
        name: 'BrainyStooge',
        tagline: 'The silent financial partner that gets it done.',
        description: 'Turn a messy pile of financial documents—bank statements, receipts, and spreadsheets—into a clear, interactive, and intelligent income statement. All the clarity, none of the nagging.',
        features: BRAINY_STOOGE_FEATURES
    }
];


// --- TECH PILLARS (Shared) ---

export const TECH_PILLARS: TechPillar[] = [
    {
        icon: <LockIcon className="h-8 w-8 text-violet-400" />,
        title: "Secure Google Login",
        description: "Your account is protected with secure sign-in via Google. No need to manage another password."
    },
    {
        icon: <ShieldIcon className="h-8 w-8 text-violet-400" />,
        title: "Total Data Privacy",
        description: "Your data is yours alone. Each account is stored in a secure, isolated container. We never see or share your information."
    },
    {
        icon: <CloudIcon className="h-8 w-8 text-violet-400" />,
        title: "Access Anywhere, Anytime",
        description: "Your data is cloud-based, always live, and accessible from your laptop, phone, or tablet, wherever you are."
    },
    {
        icon: <ScaleIcon className="h-8 w-8 text-violet-400" />,
        title: "Built to Scale",
        description: "Our Google Cloud foundation means our system is fast and reliable, whether you have ten customers or ten thousand."
    }
];

// --- PRICING ---

export const PRICING_PLANS: PricingPlan[] = [
    {
        productId: 'pos',
        productName: 'BrainyPOS',
        productTagline: 'AI Database & POS Generator',
        price: 20,
        trial_days: 30,
        features: [
            "Instant AI database generation",
            "Natural language management",
            "Point-of-Sale interface",
            "Smart invoice scanning",
            "Unlimited products & sales",
            "Secure Google Cloud storage",
        ]
    },
    {
        productId: 'stooge',
        productName: 'BrainyStooge',
        productTagline: 'All the clarity, none of the nagging.',
        price: 20,
        trial_days: 30,
        features: [
            "Unlimited document uploads",
            "Automatic expense categorization",
            "Multi-currency support",
            "Interactive dashboard & charts",
            "Your finances, on your terms",
            "Secure Google Cloud storage",
        ]
    }
];


// --- CHATBOT ---

export const CHATBOT_SYSTEM_INSTRUCTION = {
  role: "model",
  parts: [{ text: `You are a friendly and helpful sales assistant for Brainy.ae. Your goal is to explain our two main products and convince users to sign up for a free trial.

Our Products:
1. BrainyStooge (The Smart Income Statement Generator):
- What it is: A silent financial partner. It's an AI that turns financial documents (PDFs, receipts, spreadsheets) into a clear, interactive income statement without nagging you.
- How it works: Users upload documents whenever they want. The AI reads and categorizes transactions, handles multiple currencies, and creates an interactive dashboard. The user is in full control and is never bothered.
- Key Features: Saves huge amounts of time, provides instant financial clarity, lets you interact with your data on your own terms. It's designed to give you your life back.
- Target Audience: Small business owners, freelancers, and startups who are tired of being hassled for paperwork.

2. BrainyPOS (The AI Database Generator):
- What it is: An AI assistant that instantly creates a smart, interactive database and Point-of-Sale (POS) system for any small business.
- How it works: A user uploads a menu, invoice, or website link. The AI analyzes it and builds a custom database for products, inventory, etc., in seconds.
- Key Features: Instant setup, manage the business by chatting in plain English (e.g., "We just sold 2 lattes," "How many croissants left?"), smart invoice processing.
- Target Audience: Cafes, small restaurants, local retail shops.

General Info:
- You can watch our funny commercials for both BrainyPOS and BrainyStooge right on this page to see them in action! They are a great way to understand how the products work.
- Pricing: Both apps have a 30-day free trial, then it's $20/month per app.
- Sign-up: Users can start their free trial by clicking the buttons in the pricing section.

Your personality:
- Be enthusiastic, positive, and a little bit fun.
- Keep answers concise and easy to understand.
- If a user asks about BrainyStooge, emphasize the "no nagging" and "freedom" aspects.
- Gently guide users towards the free trial.
- If you don't know an answer, say that you're a specialized AI for Brainy.ae products and can't answer that, but you can explain more about our POS or Stooge tools.
- Do not make up features or pricing details.`}]
};