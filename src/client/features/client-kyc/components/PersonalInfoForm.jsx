import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, UserRound, Mail, MapPin, ChevronDown, Check } from 'lucide-react';

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

/* ─── CustomSelect ───────────────────────────────────────────────────────── */

export function CustomSelect({ value, onChange, options, placeholder, error, className = '' }) {
  const [open, setOpen] = useState(false);
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

  const selectedOption = options.find((opt) => opt.value === value);

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
        <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-[10px] border border-border/30 bg-surface-elevated/95 backdrop-blur-md shadow-lg shadow-black/20 z-[999] py-1">
          {options.length === 0 ? (
            <div className="px-3.5 py-2.5 text-[12px] text-text-muted/50 text-center">
              No options available
            </div>
          ) : (
            options.map((opt) => {
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
      )}
    </div>
  );
}

/* ─── PersonalInfoForm ───────────────────────────────────────────────────── */

export function PersonalInfoForm({ value, onChange, errors = {} }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  // Local state for temporary dropdown selection
  const [selectedDay, setSelectedDay] = useState(() => {
    if (value.dateOfBirth && value.dateOfBirth.includes('-')) {
      return value.dateOfBirth.split('-')[2] || '';
    }
    return '';
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (value.dateOfBirth && value.dateOfBirth.includes('-')) {
      return value.dateOfBirth.split('-')[1] || '';
    }
    return '';
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value.dateOfBirth && value.dateOfBirth.includes('-')) {
      return value.dateOfBirth.split('-')[0] || '';
    }
    return '';
  });

  // Sync state if dateOfBirth changes from parent (e.g. prefill)
  useEffect(() => {
    if (value.dateOfBirth && value.dateOfBirth.includes('-')) {
      const parts = value.dateOfBirth.split('-');
      if (parts.length === 3) {
        setSelectedYear(parts[0]);
        setSelectedMonth(parts[1]);
        setSelectedDay(parts[2]);
      }
    } else if (!value.dateOfBirth) {
      setSelectedYear('');
      setSelectedMonth('');
      setSelectedDay('');
    }
  }, [value.dateOfBirth]);

  // Suffix/update function
  const handleDateChange = (type, val) => {
    let y = selectedYear;
    let m = selectedMonth;
    let d = selectedDay;
    if (type === 'day') {
      d = val;
      setSelectedDay(val);
    }
    if (type === 'month') {
      m = val;
      setSelectedMonth(val);
    }
    if (type === 'year') {
      y = val;
      setSelectedYear(val);
    }

    if (y && m && d) {
      onChange({ ...value, dateOfBirth: `${y}-${m}-${d}` });
    } else {
      onChange({ ...value, dateOfBirth: '' });
    }
  };

  const getDaysInMonth = (month, year) => {
    if (!month) return 31;
    const m = parseInt(month, 10);
    if ([4, 6, 9, 11].includes(m)) return 30;
    if (m === 2) {
      const y = parseInt(year, 10);
      if (y && ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) return 29;
      return 28;
    }
    return 31;
  };
  
  const daysCount = getDaysInMonth(selectedMonth, selectedYear);
  const daysOptions = Array.from({ length: daysCount }, (_, i) => {
    return String(i + 1).padStart(2, '0');
  });

  const MONTHS = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 18; // 2008
  const minYear = currentYear - 100; // 1926
  const YEARS = [];
  for (let y = maxYear; y >= minYear; y--) {
    YEARS.push(String(y));
  }

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
            <div className="grid grid-cols-3 gap-2.5">
              <CustomSelect
                value={selectedDay}
                onChange={(val) => handleDateChange('day', val)}
                options={daysOptions.map((d) => ({ value: d, label: d }))}
                placeholder="Day"
                error={errors.dateOfBirth}
              />

              <CustomSelect
                value={selectedMonth}
                onChange={(val) => handleDateChange('month', val)}
                options={MONTHS}
                placeholder="Month"
                error={errors.dateOfBirth}
              />

              <CustomSelect
                value={selectedYear}
                onChange={(val) => handleDateChange('year', val)}
                options={YEARS.map((y) => ({ value: y, label: y }))}
                placeholder="Year"
                error={errors.dateOfBirth}
              />
            </div>
          </KycField>

          <KycField label="Country" required error={errors.country} className="md:col-span-2">
            <CustomSelect
              value={value.country ?? ''}
              onChange={(val) => onChange({ ...value, country: val })}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
              placeholder="Select a country…"
              error={errors.country}
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