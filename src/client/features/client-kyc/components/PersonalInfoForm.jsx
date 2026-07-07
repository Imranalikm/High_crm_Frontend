import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, UserRound, Mail, MapPin, ChevronDown, Check, Calendar } from 'lucide-react';

/* ─── Data ───────────────────────────────────────────────────────────────── */

import { COUNTRIES as GLOBAL_COUNTRIES } from '@/shared/config/constants/COUNTRIES';

/* ─── KycField ───────────────────────────────────────────────────────────── */

const fieldBase = (err) =>
  `w-full h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] text-text outline-none transition-colors focus:border-brand/55 placeholder:text-text-muted/30 ${err ? 'border-negative/50 bg-negative/[0.03]' : 'border-border/40'}`;

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

/* ─── CustomSelect ───────────────────────────────────────────────────────── */

export function CustomSelect({ value, onChange, options, placeholder, error, className = '', searchable = false }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={[
          'w-full h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] outline-none flex items-center justify-between gap-2 transition-all duration-150 text-left select-none cursor-pointer',
          error ? 'border-negative/50 bg-negative/[0.03]' : 'border-border/40 hover:border-border/60 hover:bg-muted-surface/75',
          open ? 'ring-1 ring-brand/50 border-brand/50 bg-brand/[0.02]' : '',
        ].join(' ')}
      >
        <span className={selectedOption ? 'text-text truncate' : 'text-text-muted/40 truncate'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-text-muted/65 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-brand' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-[10px] border border-border/30 bg-surface-elevated/95 backdrop-blur-md shadow-lg shadow-black/20 z-[999] py-1 flex flex-col">
          {searchable && (
            <div className="px-2 py-1 border-b border-border/20 sticky top-0 bg-surface-elevated z-10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full h-8 px-2.5 rounded-[6px] bg-muted-surface border border-border/45 text-[12px] text-text outline-none focus:border-brand/60"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-2.5 text-[12px] text-text-muted/50 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const active = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={[
                      'w-full px-3.5 py-2.5 text-[12.5px] text-left flex items-center justify-between gap-2 transition-colors duration-100 outline-none cursor-pointer',
                      active ? 'bg-brand/[0.08] text-brand font-semibold' : 'text-text hover:bg-muted-surface/60 hover:text-text',
                    ].join(' ')}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && <Check size={12} className="text-brand shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PersonalInfoForm ───────────────────────────────────────────────────── */

export function PersonalInfoForm({ value, onChange, errors = {} }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  const handleCountryChange = (val) => {
    const found = GLOBAL_COUNTRIES.find((c) => c.name === val);
    onChange({ 
      ...value, 
      country: val,
      phoneCode: found ? found.dialCode : value.phoneCode 
    });
  };

  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    .toISOString()
    .split('T')[0];

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
            <div className="relative flex items-center">
              <input
                type="date"
                value={value.dateOfBirth ?? ''}
                onChange={(e) => onChange({ ...value, dateOfBirth: e.target.value })}
                max={maxDate}
                className={`${fieldBase(errors.dateOfBirth)} cursor-pointer pr-10`}
                style={{ colorScheme: 'dark' }}
              />
              <div className="absolute right-3.5 text-text-muted/40 pointer-events-none">
                <Calendar size={14} />
              </div>
            </div>
          </KycField>

          <KycField label="Country" required error={errors.country} className="md:col-span-2">
            <CustomSelect
              value={value.country ?? ''}
              onChange={handleCountryChange}
              options={GLOBAL_COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
              placeholder="Select a country…"
              error={errors.country}
              searchable
            />
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
              <CustomSelect
                value={value.phoneCode ?? ''}
                onChange={(val) => onChange({ ...value, phoneCode: val })}
                options={GLOBAL_COUNTRIES.map((c) => ({ value: c.dialCode, label: `${c.dialCode} (${c.iso})` }))}
                placeholder="+Code"
                className="w-32 shrink-0 z-[100]"
                error={errors.phone}
                searchable
              />
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