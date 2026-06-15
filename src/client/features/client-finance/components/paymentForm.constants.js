import { Building2, CreditCard, Bitcoin } from 'lucide-react';

export const TYPES = [
  { id: 'bank',   label: 'Bank Account',       icon: Building2,  color: 'cyan'    },
  { id: 'card',   label: 'Debit / Credit Card', icon: CreditCard, color: 'brand'   },
  { id: 'crypto', label: 'Crypto Wallet',       icon: Bitcoin,    color: 'warning'  },
];

export const FIELDS = {
  bank: [
    { key: 'bankName',      label: 'Bank Name',                  placeholder: 'e.g. HDFC Bank',           type: 'text' },
    { key: 'accountName',   label: 'Account Holder Name',        placeholder: 'Full name on account',    type: 'text' },
    { key: 'accountNumber', label: 'Account Number / IBAN',      placeholder: 'XX00 0000 0000 0000',      type: 'text', wide: true },
    { key: 'routing',       label: 'Routing / SWIFT / IFSC',     placeholder: 'e.g. HDFCINBB',            type: 'text' },
    { key: 'country',       label: 'Country',                    placeholder: 'e.g. India',               type: 'text' },
  ],
  card: [
    { key: 'cardName',      label: 'Cardholder Name',            placeholder: 'Name on card',             type: 'text' },
    { key: 'cardNumber',    label: 'Card Number',                placeholder: '•••• •••• •••• 4242',      type: 'text', wide: true },
    { key: 'expiry',        label: 'Expiry (MM/YY)',             placeholder: '08/27',                   type: 'text' },
  ],
  crypto: [
    { key: 'network',       label: 'Network',                    placeholder: 'e.g. USDT-TRC20, BTC',    type: 'text' },
    { key: 'address',       label: 'Wallet Address',             placeholder: 'Full wallet address',     type: 'text', wide: true },
    { key: 'label',         label: 'Label (Optional)',           placeholder: 'e.g. My USDT Wallet',     type: 'text' },
  ],
};
