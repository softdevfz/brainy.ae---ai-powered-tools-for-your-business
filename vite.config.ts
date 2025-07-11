import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }: { mode: string }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.PAYPAL_CLIENT_ID': JSON.stringify(env.PAYPAL_CLIENT_ID || ''),
        'process.env.PAYPAL_CLIENT_SECRET': JSON.stringify(env.PAYPAL_CLIENT_SECRET || '')
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
