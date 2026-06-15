export const INITIAL_API_CONFIG = {
  baseUrl: 'https://api.live-trader.com/v2',
  wsUrl: 'wss://ws.live-trader.com',
  webhookUrl: 'https://api.live-trader.com/webhooks',
  env: 'PRODUCTION',
  apiKey: 'lt_live_YOUR_API_KEY_HERE',
  secretKey: 'sk_live_YOUR_SECRET_KEY_HERE',
  rateLimit: '1000',
  burstLimit: '50',
  timeout: '30',
  retries: '3',
  webhookSecret: 'whsec_YOUR_WEBHOOK_SECRET_HERE',
  ipWhitelist: "103.82.14.0/24\n82.44.18.0/24",
  corsOrigins: "https://app.live-trader.com\nhttps://admin.live-trader.com",
};

export const API_ENV_OPTIONS = [
  { label: 'Production', value: 'PRODUCTION' },
  { label: 'Staging', value: 'STAGING' },
  { label: 'Development', value: 'DEVELOPMENT' },
];

export const THROTTLE_STRATEGIES = [
  { label: 'Sliding Window', value: 'SLIDING_WINDOW' },
  { label: 'Fixed Window', value: 'FIXED_WINDOW' },
  { label: 'Token Bucket', value: 'TOKEN_BUCKET' },
];

export const RATE_LIMIT_HEADERS = [
  { label: 'X-RateLimit-Remaining', value: 'X-RateLimit-Remaining' },
  { label: 'RateLimit-Remaining', value: 'RateLimit-Remaining' },
  { label: 'Retry-After', value: 'Retry-After' },
];

export const ROTATION_FREQUENCY_OPTIONS = [
  { label: 'Every 30 days', value: '30' },
  { label: 'Every 60 days', value: '60' },
  { label: 'Every 90 days', value: '90' },
  { label: 'Every 180 days', value: '180' },
  { label: 'Manual only', value: '0' },
];
