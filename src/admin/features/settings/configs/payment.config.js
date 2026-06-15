export const INITIAL_GATEWAYS = [
  { id: 'stripe', name: 'Stripe', enabled: true, testMode: false, rails: ['VISA', 'Mastercard', 'AMEX'], fee: '2.9% + $0.30', currencies: ['USD', 'EUR', 'GBP'], priority: 1 },
  { id: 'fireblocks', name: 'Fireblocks', enabled: true, testMode: false, rails: ['BTC', 'ETH', 'USDT', 'USDC'], fee: '0.1%', currencies: ['USD'], priority: 2 },
  { id: 'swift', name: 'SWIFT Wire', enabled: true, testMode: false, rails: ['SWIFT', 'SEPA'], fee: '$15–$25 flat', currencies: ['USD', 'EUR', 'GBP', 'JPY'], priority: 3 },
  { id: 'skrill', name: 'Skrill', enabled: true, testMode: true, rails: ['SKRILL'], fee: '1.9%', currencies: ['USD', 'EUR'], priority: 4 },
  { id: 'adyen', name: 'Adyen', enabled: false, testMode: false, rails: ['VISA', 'Mastercard'], fee: '0.3% + €0.10', currencies: ['EUR', 'USD'], priority: 5 },
  { id: 'neteller', name: 'Neteller', enabled: false, testMode: false, rails: ['NETELLER'], fee: '3.9%', currencies: ['USD', 'EUR'], priority: 6 },
];

export const INITIAL_GLOBAL_FEES = {
  depositFee: '0',
  withdrawalFee: '0',
  minWithdrawal: '10',
  maxWithdrawal: '50000',
  processingDelay: '1',
  currency: 'USD',
};

export const PROCESSING_DELAY_OPTIONS = [
  { label: 'Instant', value: '0' },
  { label: '1 business day', value: '1' },
  { label: '2 business days', value: '2' },
  { label: '3 business days', value: '3' },
];

export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP'];
