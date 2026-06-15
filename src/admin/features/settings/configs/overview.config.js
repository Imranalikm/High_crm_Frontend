import {
  Activity, Network, Clock, WifiOff, CreditCard, ShieldCheck,
  BarChart2, Mail, Smartphone, Terminal, ArrowUpDown, Key, Bell, Settings
} from 'lucide-react';

export const OVERVIEW_KPIS = [
  { label: 'Platform Status', value: 'ONLINE', color: 'var(--positive)', Icon: Activity, sub: 'All systems working', status: 'OK' },
  { label: 'Active Integrations', value: '12', color: 'var(--cyan)', Icon: Network, sub: 'APIs and services', status: 'OK' },
  { label: 'Pending Changes', value: '3', color: 'var(--warning)', Icon: Clock, sub: 'Ready to publish', status: 'WARN' },
  { label: 'Failed Syncs', value: '1', color: 'var(--negative)', Icon: WifiOff, sub: 'Needs attention', status: 'ERROR' },
  { label: 'Enabled Gateways', value: '4 / 6', color: 'var(--brand)', Icon: CreditCard, sub: 'Payment services', status: 'OK' },
  { label: 'Settings Health', value: '94%', color: 'var(--positive)', Icon: ShieldCheck, sub: 'All checks passed', status: 'OK' },
];

export const INTEGRATIONS_LIST = [
  { name: 'MT5 Bridge', status: 'CONNECTED', uptime: '99.98%', latency: '4ms', icon: BarChart2 },
  { name: 'Stripe Gateway', status: 'CONNECTED', uptime: '99.99%', latency: '42ms', icon: CreditCard },
  { name: 'Fireblocks Crypto', status: 'CONNECTED', uptime: '99.95%', latency: '88ms', icon: CreditCard },
  { name: 'SendGrid Email', status: 'CONNECTED', uptime: '100%', latency: '120ms', icon: Mail },
  { name: 'Twilio SMS', status: 'CONNECTED', uptime: '99.9%', latency: '210ms', icon: Smartphone },
  { name: 'Sumsub KYC', status: 'DEGRADED', uptime: '98.2%', latency: '1,240ms', icon: ShieldCheck },
  { name: 'SWIFT Payouts', status: 'CONNECTED', uptime: '99.8%', latency: '—', icon: ArrowUpDown },
  { name: 'Internal API', status: 'HEALTHY', uptime: '100%', latency: '2ms', icon: Terminal },
];

export const QUICK_LINKS = [
  { id: 'api', label: 'API Settings', Icon: Key, desc: 'URLs, keys, and webhooks' },
  { id: 'gateways', label: 'Payment Gateways', Icon: CreditCard, desc: 'Methods, fees, and currencies' },
  { id: 'kyc', label: 'KYC Settings', Icon: ShieldCheck, desc: 'Documents, AML, and limits' },
  { id: 'trading', label: 'Trading Settings', Icon: BarChart2, desc: 'Leverage, limits, symbols' },
  { id: 'notifications', label: 'Notifications', Icon: Bell, desc: 'Email, SMS, webhooks' },
  { id: 'system', label: 'System Settings', Icon: Settings, desc: 'Brand, security, maintenance' },
];
