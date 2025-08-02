import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      build: {
        rollupOptions: {
          external: [],
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.PAYPAL_CLIENT_ID': JSON.stringify(env.PAYPAL_CLIENT_ID || 'AXN6VKH5xZskWPuRPSt1aohzCHCcNfRoAVeWZtGoz7Pk5vJJhYjy5BqVHVSBtQv2EIjSX687e3-REyzj'),
        'process.env.PAYPAL_CLIENT_SECRET': JSON.stringify(env.PAYPAL_CLIENT_SECRET || ''),
        'process.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID || ''),
        'process.env.GOOGLE_PAY_MERCHANT_ID': JSON.stringify(env.GOOGLE_PAY_MERCHANT_ID || 'BCR2DN4T39KV4I7S'),
        'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || 'https://brainy-ae-backend-1027111749488.us-central1.run.app')
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('.', import.meta.url)),
        }
      },
      server: {
        host: true,
        port: 4173
      },
      preview: {
        host: '0.0.0.0',
        port: 4173
      }
    };
});
