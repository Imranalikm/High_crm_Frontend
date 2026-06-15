import React from 'react';
import { AlertCircle, UserRound, Mail, MapPin } from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Brunei',
  'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana',
  'Greece', 'Guatemala', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon',
  'Libya', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta', 'Mexico', 'Moldova', 'Morocco', 'Myanmar',
  'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'North Korea', 'Norway', 'Oman', 'Pakistan', 'Panama',
  'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea',
  'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Thailand', 'Tunisia', 'Turkey',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
].sort();

const PHONE_CODES = [
  { code: '+1', label: 'US / CA' },
  { code: '+44', label: 'UK' },
  { code: '+91', label: 'IN' },
  { code: '+971', label: 'UAE' },
  { code: '+61', label: 'AU' },
  { code: '+49', label: 'DE' },
  { code: '+33', label: 'FR' },
  { code: '+65', label: 'SG' },
  { code: '+81', label: 'JP' },
  { code: '+55', label: 'BR' },
  { code: '+7', label: 'RU' },
  { code: '+86', label: 'CN' },
  { code: '+52', label: 'MX' },
  { code: '+82', label: 'KR' },
  { code: '+966', label: 'SA' },
  { code: '+234', label: 'NG' },
  { code: '+27', label: 'ZA' },
];

/* ─── KycField ───────────────────────────────────────────────────────────── */

const fieldBase = (err) =>
  `w-full h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] text-text outline-none transition-colors focus:border-brand/55 placeholder:text-text-muted/30 ${err ? 'border-negative/50 bg-negative/[0.03]' : 'border-border/40'}`;

const selectBase = (err) =>
  `w-full h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] text-text outline-none transition-colors focus:border-brand/55 ${err ? 'border-negative/50 bg-negative/[0.03]' : 'border-border/40'}`;

export function KycField({ label, error, required, className = '', children, ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">
        {label}{required && <span className="text-negative ml-1">*</span>}
      </span>
      {children ?? (
        <input {...props} className={fieldBase(error)} />
      )}
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-negative mt-1.5">
          <AlertCircle size={10} className="shrink-0" /> {error}
        </span>
      )}
    </label>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

function Section({ icon, title, children }) {
  const Icon = icon;
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-[8px] bg-brand/12 flex items-center justify-center shrink-0">
          <Icon size={14} className="text-brand" />
        </div>
        <p className="text-[13px] font-bold">{title}</p>
        <div className="flex-1 h-px bg-border/25" />
      </div>
      {children}
    </div>
  );
}

/* ─── PersonalInfoForm ───────────────────────────────────────────────────── */

export function PersonalInfoForm({ value, onChange, errors = {} }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  return (
    <div className="space-y-8">

      {/* ── Identity ── */}
      <Section icon={UserRound} title="Personal details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KycField label="Full name" required error={errors.fullName}>
            <input type="text" value={value.fullName ?? ''} placeholder="As shown on your ID"
              onChange={set('fullName')} className={fieldBase(errors.fullName)} />
          </KycField>

          <KycField label="Date of birth" required error={errors.dateOfBirth}>
            <input type="date" value={value.dateOfBirth ?? ''} onChange={set('dateOfBirth')}
              className={fieldBase(errors.dateOfBirth)} />
          </KycField>

          <KycField label="Country" required error={errors.country} className="md:col-span-2">
            <select value={value.country ?? ''} onChange={set('country')} className={selectBase(errors.country)}>
              <option value="">Select a country…</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </KycField>
        </div>
      </Section>

      {/* ── Contact ── */}
      <Section icon={Mail} title="Contact info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KycField label="Email address" required error={errors.email}>
            <input type="email" value={value.email ?? ''} placeholder="you@example.com"
              onChange={set('email')} className={fieldBase(errors.email)} />
          </KycField>

          <KycField label="Phone number" required error={errors.phone}>
            <div className="flex gap-2">
              {/* <select value={value.phoneCode ?? ''} onChange={set('phoneCode')}
                className="h-11 rounded-[9px] bg-muted-surface border border-border/40 text-[12px] text-text outline-none focus:border-brand/55 px-2.5 shrink-0 min-w-[105px]">
                <option value="">+ Code</option>
                {PHONE_CODES.map(({ code, label: l }) => (
                  <option key={code} value={code}>{code} ({l})</option>
                ))}
              </select> */}
              <input type="tel" value={value.phone ?? ''} placeholder="000 000 0000"
                onChange={set('phone')}
                className={`flex-1 h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] text-text outline-none focus:border-brand/55 placeholder:text-text-muted/30 ${errors.phone ? 'border-negative/50' : 'border-border/40'}`}
              />
            </div>
          </KycField>
        </div>
      </Section>

      {/* ── Address ── */}
      <Section icon={MapPin} title="Address">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KycField label="Street address" required error={errors.address} className="md:col-span-2">
            <input type="text" value={value.address ?? ''} placeholder="e.g. 123 Main Street"
              onChange={set('address')} className={fieldBase(errors.address)} />
          </KycField>

          <KycField label="City" required error={errors.city}>
            <input type="text" value={value.city ?? ''} placeholder="e.g. London"
              onChange={set('city')} className={fieldBase(errors.city)} />
          </KycField>

          <KycField label="Postal / ZIP code" required error={errors.postalCode}>
            <input type="text" value={value.postalCode ?? ''} placeholder="e.g. SW1A 1AA"
              onChange={set('postalCode')} className={fieldBase(errors.postalCode)} />
          </KycField>
        </div>
      </Section>
    </div>
  );
}