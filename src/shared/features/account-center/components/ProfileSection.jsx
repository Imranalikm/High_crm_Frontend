import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Save, Home, Landmark, CheckCircle, AlertTriangle, AlertOctagon, Sun, Moon, Palette, Check } from 'lucide-react';
import { useAdminUi } from '@/app/providers/AdminUiProvider';

const THEME_PRESETS = [
  {
    id: 'obsidian',
    name: 'Digital Obsidian',
    desc: 'Original system base. Institutional blue & deep void charcoal.',
    mood: 'Professional & Trusted',
    swatches: ['#2a4a8a', '#adc6ff', '#0b1326'],
  },
  {
    id: 'emerald',
    name: 'Emerald',
    desc: 'Growth / Revenue / Finance CRM. Deep teal palette. Communicates prosperity, trust, momentum.',
    mood: 'Growth & Finance',
    swatches: ['#0a8c78', '#10b981', '#010d0a'],
  },
  {
    id: 'obsidian-luxe',
    name: 'Obsidian Luxe',
    desc: 'Enterprise / B2B / Deal-room CRM. Navy-deep with electric cyan. Precision, authority, luxury.',
    mood: 'Enterprise & B2B',
    swatches: ['#163878', '#00ccf0', '#01060e'],
  },
  {
    id: 'indigo',
    name: 'Indigo',
    desc: 'SaaS / Tech / Product-led CRM. Rich indigo + electric violet. Modern, innovative, confident.',
    mood: 'SaaS & Tech',
    swatches: ['#4f46e5', '#e879f9', '#030210'],
  },
  {
    id: 'slate',
    name: 'Slate',
    desc: 'Corporate / Legal / Ops CRM. Steel-blue gray + sky blue. Clean, trust-inducing, executive.',
    mood: 'Corporate & Ops',
    swatches: ['#2c3e5c', '#0ea5e9', '#03080e'],
  },
  {
    id: 'navy',
    name: 'Navy',
    desc: 'Classic Enterprise / Financial / Banking CRM. Midnight navy + cerulean. Trustworthy, established, powerful.',
    mood: 'Banking & Finance',
    swatches: ['#153278', '#38bdf8', '#01050e'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    desc: 'Creative / Marketing / Agency CRM. Deep violet + teal. Visionary, differentiated, premium.',
    mood: 'Creative & Agency',
    swatches: ['#7c3aed', '#2dd4bf', '#03010e'],
  },
  {
    id: 'amber',
    name: 'Amber',
    desc: 'Luxury / Premium / High-ticket CRM. Burnished gold + warm amber. Prestigious, refined, exclusive.',
    mood: 'Luxury & Premium',
    swatches: ['#986010', '#fbbf24', '#090601'],
  },
  {
    id: 'crimson',
    name: 'Crimson',
    desc: 'Bold / Executive / High-stakes CRM. Rich crimson + burnished amber. Authority, urgency, prestige.',
    mood: 'Executive & Bold',
    swatches: ['#961616', '#e6a020', '#090202'],
  },
];

import { SettingsCard } from '@/features/settings/components/SettingsCard';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  ToggleRow,
  Btn,
} from '@/features/settings/components/SettingsForm';

export function ProfileSection({ user }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile Form States
  const [name, setName] = useState(user?.name ?? '');
  const [displayName, setDisplayName] = useState(user?.name?.split(' ')[0] ?? '');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [secondaryEmail, setSecondaryEmail] = useState('recovery.contact@email.com');
  
  // Address States
  const [street, setStreet] = useState('123 Financial District');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [country, setCountry] = useState('United States');
  const [zipCode, setZipCode] = useState('10005');

  // Preferences States
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [platformUpdates, setPlatformUpdates] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Regional States
  const [timezone, setTimezone] = useState('UTC+5:30');
  const [language, setLanguage] = useState('en');

  // Mock KYC details
  const kycStatus = user?.role === 'client' ? 'verified' : 'verified'; // All admin personnel are verified by default
  const kycLevel = 'Level 2 - Institutional Access';

  const { theme: currentTheme, setTheme, colorTheme: currentColorTheme, setColorTheme } = useAdminUi();
  const [localTheme, setLocalTheme] = useState(currentTheme);
  const [localColorTheme, setLocalColorTheme] = useState(currentColorTheme);

  // Sync if changed externally (e.g. from topbar toggle)
  useEffect(() => {
    setLocalTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    setLocalColorTheme(currentColorTheme);
  }, [currentColorTheme]);

  // Revert preview on unmount if not saved
  useEffect(() => {
    return () => {
      const root = window.document.documentElement;
      const savedTheme = localStorage.getItem('app-theme') || 'dark';
      const savedColorTheme = localStorage.getItem('app-color-theme') || 'obsidian';
      root.classList.remove('light', 'dark');
      root.classList.add(savedTheme);
      root.setAttribute('data-theme', savedColorTheme);
    };
  }, []);

  const handleThemeChange = (newTheme) => {
    setLocalTheme(newTheme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  const handleColorThemeChange = (newColorTheme) => {
    setLocalColorTheme(newColorTheme);
    const root = window.document.documentElement;
    root.setAttribute('data-theme', newColorTheme);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    // Commit theme changes
    setTheme(localTheme);
    setColorTheme(localColorTheme);

    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const getKycDetails = () => {
    switch (kycStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'var(--positive)',
          title: 'Identity Fully Verified',
          desc: 'Your profile has completed Level 2 verification. Full trading and withdrawal facilities are unlocked.',
        };
      case 'pending':
        return {
          icon: AlertTriangle,
          color: 'var(--warning)',
          title: 'Verification Pending Review',
          desc: 'Compliance operators are auditing your uploaded document scans. Review takes up to 24 hours.',
        };
      default:
        return {
          icon: AlertOctagon,
          color: 'var(--negative)',
          title: 'KYC Verification Required',
          desc: 'Please submit your proof of address and identity scan to unlock all financial trading features.',
        };
    }
  };

  const kyc = getKycDetails();
  const KycIcon = kyc.icon;

  const timezoneOptions = [
    { value: 'UTC+5:30', label: 'UTC +5:30 (Mumbai, IST)' },
    { value: 'UTC+0', label: 'UTC +0:00 (London, GMT)' },
    { value: 'UTC-5', label: 'UTC -5:00 (New York, EST)' },
    { value: 'UTC+1', label: 'UTC +1:00 (Berlin, CET)' },
    { value: 'UTC+8', label: 'UTC +8:00 (Singapore, SGT)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English (US)' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'zh', label: '中文' },
  ];

  const countryOptions = [
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'India', label: 'India' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Canada', label: 'Canada' },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      
      {/* 1. KYC Onboarding Status Card */}
      <SettingsCard
        title="Compliance & KYC Verification"
        desc="Check your current personnel account onboarding verification clearance level."
        Icon={Landmark}
      >
        <div
          className="flex items-start gap-4 rounded-[10px] border px-4 py-3.5 transition-all duration-300"
          style={{
            borderColor: `color-mix(in srgb, ${kyc.color} 22%, transparent)`,
            background: `color-mix(in srgb, ${kyc.color} 5%, transparent)`,
          }}
        >
          <KycIcon size={18} style={{ color: kyc.color }} className="flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold" style={{ color: kyc.color }}>
                {kyc.title}
              </span>
              <span
                className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] border"
                style={{
                  color: kyc.color,
                  background: `color-mix(in srgb, ${kyc.color} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${kyc.color} 20%, transparent)`,
                }}
              >
                {kycLevel}
              </span>
            </div>
            <p className="text-[11.5px] text-text-muted/65 leading-relaxed">
              {kyc.desc}
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* 2. Personal Information */}
      <SettingsCard
        title="Personal Information"
        desc="Configure your identity labels, contact coordinate points, and recovery emails."
        Icon={User}
      >
        <FGroup cols={2}>
          <div>
            <FieldLabel required hint="Your official registration full name">Full Name</FieldLabel>
            <TInput
              value={name}
              onChange={setName}
              placeholder="e.g. Arjun Sathia"
            />
          </div>

          <div>
            <FieldLabel required hint="Friendly username for UI navigation greetings">Display Name</FieldLabel>
            <TInput
              value={displayName}
              onChange={setDisplayName}
              placeholder="e.g. Arjun"
            />
          </div>

          <div>
            <FieldLabel hint="Primary credential log in address (Immutable)">Email Address (Read-only)</FieldLabel>
            <TInput
              value={user?.email}
              readOnly
              disabled
              mono
            />
          </div>

          <div>
            <FieldLabel hint="Secondary contact for security alerts & recoveries">Backup Recovery Email</FieldLabel>
            <TInput
              value={secondaryEmail}
              onChange={setSecondaryEmail}
              placeholder="e.g. backup@email.com"
              mono
            />
          </div>

          <div>
            <FieldLabel required hint="Phone coordinate with country prefix code">Phone Number</FieldLabel>
            <TInput
              value={phone}
              onChange={setPhone}
              placeholder="e.g. +1 (555) 019-2834"
              mono
            />
          </div>
        </FGroup>
      </SettingsCard>

      {/* 3. Residential Address */}
      <SettingsCard
        title="Residential Address"
        desc="Your billing and geographical physical location details matching your KYC documentations."
        Icon={Home}
      >
        <div className="space-y-4">
          <div>
            <FieldLabel required hint="Street location details (Apartment, Suite, Unit)">Street Address</FieldLabel>
            <TInput
              value={street}
              onChange={setStreet}
              placeholder="e.g. 123 Financial District Rd"
            />
          </div>

          <FGroup cols={4}>
            <div className="col-span-2">
              <FieldLabel required>City</FieldLabel>
              <TInput
                value={city}
                onChange={setCity}
                placeholder="e.g. New York"
              />
            </div>
            <div>
              <FieldLabel required>State / Province</FieldLabel>
              <TInput
                value={state}
                onChange={setState}
                placeholder="e.g. NY"
              />
            </div>
            <div>
              <FieldLabel required>Postal / ZIP Code</FieldLabel>
              <TInput
                value={zipCode}
                onChange={setZipCode}
                placeholder="e.g. 10001"
                mono
              />
            </div>
          </FGroup>

          <div className="w-full md:w-1/2">
            <FieldLabel required hint="Your primary state jurisdiction">Country / Region</FieldLabel>
            <TSelect
              value={country}
              onChange={setCountry}
              options={countryOptions}
            />
          </div>
        </div>
      </SettingsCard>

      {/* 4. Regional Coordinate Preferences */}
      <SettingsCard
        title="Regional Locale Settings"
        desc="Select timezone coordinates and interface languages used across transaction panels."
        Icon={Globe}
      >
        <FGroup cols={2}>
          <div>
            <FieldLabel hint="Primary timezone coordinates governing chronological indexes">Preferred Timezone</FieldLabel>
            <TSelect
              value={timezone}
              onChange={setTimezone}
              options={timezoneOptions}
            />
          </div>
          <div>
            <FieldLabel hint="Language used in headers and tooltips">Preferred Language</FieldLabel>
            <TSelect
              value={language}
              onChange={setLanguage}
              options={languageOptions}
            />
          </div>
        </FGroup>
      </SettingsCard>

      {/* 4.5 Appearance & Themes */}
      <SettingsCard
        title="Appearance & Themes"
        desc="Customize your interface mode and select custom visual color presets."
        Icon={Palette}
      >
        <div className="space-y-5">
          {/* Mode selector */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                localTheme === 'light'
                  ? 'border-brand bg-brand/10 text-brand ring-2 ring-brand/10'
                  : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20 text-text-muted/60'
              }`}
            >
              <Sun size={16} />
              <div className="text-left">
                <p className="text-[12.5px] font-bold leading-tight">Light Mode</p>
                <p className="text-[9.5px] text-text-muted/40 mt-0.5 leading-none">Clean & bright</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                localTheme === 'dark'
                  ? 'border-brand bg-brand/10 text-brand ring-2 ring-brand/10'
                  : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20 text-text-muted/60'
              }`}
            >
              <Moon size={16} />
              <div className="text-left">
                <p className="text-[12.5px] font-bold leading-tight">Dark Mode</p>
                <p className="text-[9.5px] text-text-muted/40 mt-0.5 leading-none">Low eye-strain</p>
              </div>
            </button>
          </div>

          {/* Preset list */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 mb-3">Color Presets</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isActive = localColorTheme === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleColorThemeChange(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer group flex flex-col gap-2 ${
                      isActive
                        ? 'border-brand bg-brand/10 text-brand ring-2 ring-brand/10'
                        : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20'
                    }`}
                  >
                    <div className="flex gap-1">
                      {preset.swatches.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-[11.5px] font-bold text-text leading-tight flex items-center gap-1">
                        {preset.name}
                        {isActive && <Check size={10} strokeWidth={3} className="text-brand" />}
                      </p>
                      <p className="text-[9px] text-text-muted/40 mt-0.5 leading-tight">{preset.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* 5. Communication Preferences */}
      <SettingsCard
        title="Communication Preferences"
        desc="Control the distribution parameters of platform news and newsletters."
        Icon={Mail}
      >
        <div className="space-y-1">
          <ToggleRow
            label="Marketing Newsletters"
            desc="Receive weekly digests, platform summaries, promotional opportunities, and custom loyalty programs."
            val={marketingEmails}
            onChange={setMarketingEmails}
          />
          <ToggleRow
            label="Platform Infrastructure Updates"
            desc="Receive updates on critical system enhancements and scheduled downtime alerts."
            val={platformUpdates}
            onChange={setPlatformUpdates}
          />
          <ToggleRow
            label="Daily Activity Summaries"
            desc="Commit summaries of your recent personal transactions and logins to daily recap emails."
            val={dailyDigest}
            onChange={setDailyDigest}
          />
        </div>
      </SettingsCard>

      {/* Save Action Bar */}
      <div className="flex items-center gap-4 pt-2">
        <Btn
          type="submit"
          Icon={Save}
          label={loading ? 'Saving Changes...' : 'Save Profile Details'}
          variant="brand"
          loading={loading}
        />
        {saved && (
          <span className="text-[12.5px] font-semibold text-positive animate-fade-in">
            ✓ Personal profile preferences updated successfully
          </span>
        )}
      </div>

    </form>
  );
}
