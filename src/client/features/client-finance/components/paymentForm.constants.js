import { Building2 } from 'lucide-react';

export const TYPES = [
  { id: 'bank',   label: 'Bank Account',       icon: Building2,  color: 'cyan'    }
];

export const FIELDS = {
  bank: [
    { key: 'bankName',      label: 'Bank Name',                  placeholder: 'e.g. HDFC Bank',           type: 'text' },
    { key: 'accountName',   label: 'Account Holder Name',        placeholder: 'Full name on account',    type: 'text' },
    { key: 'accountNumber', label: 'Account Number / IBAN',      placeholder: 'XX00 0000 0000 0000',      type: 'text', wide: true },
    { key: 'routing',       label: 'Routing / SWIFT / IFSC',     placeholder: 'e.g. HDFCINBB',            type: 'text' },
    { key: 'country',       label: 'Country',                    placeholder: 'e.g. India',               type: 'text' },
  ]
};
