import { Building2, Zap, Coins } from 'lucide-react';

export const TYPE_NAMES = { bank: 'Bank Account', upi: 'UPI', usdt: 'USDT Wallet' };
export const REGION_NAMES = { IN: 'India', INTL: 'International' };

// Colour = payment type, matching the client deposit page (bank cyan, UPI green, USDT amber)
export const TYPE_META = {
  bank: { tab: 'Bank transfer', offer: 'Offer bank transfer on the deposit page', color: 'var(--cyan)', Icon: Building2, noun: 'bank account' },
  upi: { tab: 'UPI', offer: 'Offer UPI on the deposit page', color: 'var(--positive)', Icon: Zap, noun: 'UPI ID' },
  usdt: { tab: 'USDT', offer: 'Offer USDT on the deposit page', color: 'var(--warning)', Icon: Coins, noun: 'USDT wallet' },
};

export const TYPE_ORDER = ['bank', 'upi', 'usdt'];

export const REGION_OPTIONS = [
  { value: 'IN', label: 'India', hint: 'Clients in India' },
  { value: 'INTL', label: 'International', hint: 'Everyone else' },
];

export const NETWORK_OPTIONS = [
  { value: 'TRC20', label: 'TRC20', hint: 'Tron' },
  { value: 'ERC20', label: 'ERC20', hint: 'Ethereum' },
  { value: 'BEP20', label: 'BEP20', hint: 'BNB Chain' },
];

export const NETWORK_NAMES = { TRC20: 'Tron (TRC20)', ERC20: 'Ethereum (ERC20)', BEP20: 'BNB Smart Chain (BEP20)' };

// Tinted helpers for a type colour
export const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
