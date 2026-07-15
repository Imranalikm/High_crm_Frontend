import { Building2, Smartphone } from 'lucide-react';

export const TYPES = [
  { id: 'bank',   label: 'Bank Account',       icon: Building2,  color: 'cyan'    },
  { id: 'upi',    label: 'UPI',                icon: Smartphone, color: 'positive'},
];

export const FIELDS = {
  bank: [
    { key: 'bankName',      label: 'Bank Name',                  placeholder: 'e.g. HDFC Bank',           type: 'text' },
    { key: 'accountName',   label: 'Account Holder Name',        placeholder: 'Full name on account',    type: 'text' },
    { key: 'accountNumber', label: 'Account Number / IBAN',      placeholder: 'XX00 0000 0000 0000',      type: 'text', wide: true },
    { key: 'routing',       label: 'Routing / SWIFT / IFSC',     placeholder: 'e.g. HDFCINBB',            type: 'text' },
    { key: 'country',       label: 'Country',                    placeholder: 'e.g. India',               type: 'text' },
  ],
  upi: [
    { key: 'label',         label: 'Nickname (e.g. GPay)',       placeholder: 'e.g. My GPay',             type: 'text' },
    { key: 'upiId',         label: 'UPI ID',                     placeholder: 'e.g. username@upi',        type: 'text', wide: true },
  ],
};
