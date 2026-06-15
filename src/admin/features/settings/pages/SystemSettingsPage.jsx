import React, { useState, useEffect } from 'react';
import { Settings, Shield, HardDrive, Key, Database, RefreshCw, Sliders, Palette, Sun, Moon, Check, Code, Copy } from 'lucide-react';
import { useAdminUi } from '@/app/providers/AdminUiProvider';
import { AdminModal } from '@/components/overlays/AdminModal';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { SaveBar } from '../components/SaveBar';
import { SettingsTabs } from '../components/SettingsTabs';
import {
  FieldLabel,
  FGroup,
  TInput,
  TSelect,
  ToggleRow,
  Btn,
} from '../components/SettingsForm';
import {
  TIMEZONE_OPTIONS,
  LOCALE_OPTIONS,
  SYSTEM_CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  BACKUP_FREQUENCY_OPTIONS,
} from '../configs/system.config';

// 9 Premium Color Theme Presets (1 Default + 8 Premium)
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

const THEME_CSS_VARIABLES = {
  obsidian: {
    light: `  /* Digital Obsidian Light */
  --bg: #f8fafc;
  --white-dynamic: #0b1326;
  --surface: #ffffff;
  --surface-2: #f1f5f9;
  --muted-surface: #e2e8f0;
  --surface-bright: #cbd5e1;
  --text: #0b1326;
  --text-muted: #424754;
  --brand: #2a4a8a;
  --brand-strong: #1e3a8a;
  --accent: #2a4a8a;
  --border: rgba(66, 71, 84, 0.15);
  --glass: rgba(255, 255, 255, 0.1);
  --text-on-accent: #ffffff;
  --scrollbar-thumb: rgba(66, 71, 84, 0.1);
  --primary-rgb: 42, 74, 138;
  --shadow-dynamic: 0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03);`,
    dark: `  /* Digital Obsidian Dark */
  --bg: #0b1326;
  --white-dynamic: #ffffff;
  --surface: #060e20;
  --surface-2: #131b2e;
  --muted-surface: #1a2540;
  --surface-bright: #31394d;
  --text: #dae2fd;
  --text-muted: #c2c6d6;
  --brand: #adc6ff;
  --brand-strong: #2a4a8a;
  --accent: #adc6ff;
  --border: rgba(66, 71, 84, 0.15);
  --glass: rgba(34, 47, 74, 0.15);
  --text-on-accent: #0b1326;
  --scrollbar-thumb: rgba(173, 198, 255, 0.1);
  --primary-rgb: 173, 198, 255;
  --cyan: #22d3ee;
  --purple: #a78bfa;
  --positive: #4ae176;
  --shadow-dynamic: 0 4px 16px -2px rgba(0, 0, 0, 0.45), 0 3px 6px -2px rgba(0, 0, 0, 0.35);`
  },
  emerald: {
    light: `  /* Emerald Light Override */
  [data-theme="emerald"] {
    --bg: #f0fdf9;
    --white-dynamic: #021710;
    --surface: #ffffff;
    --surface-2: #dcfaf2;
    --muted-surface: #b4f2e2;
    --surface-bright: #86deca;
    --brand: #0a8c78;
    --brand-strong: #076d5c;
    --accent: #10b981;
    --text: #021710;
    --text-muted: #1c5848;
    --border: rgba(10, 140, 120, 0.15);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(10, 140, 120, 0.14);
    --primary-rgb: 10, 140, 120;
    --glass: rgba(10, 140, 120, 0.07);
    --shadow-dynamic: 0 4px 16px -2px rgba(10, 140, 120, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Emerald Dark Override */
  .dark[data-theme="emerald"] {
    --bg: #010d0a;
    --white-dynamic: #d4f8ef;
    --surface: #061412;
    --surface-2: #0c211a;
    --muted-surface: #112e25;
    --surface-bright: #183d30;
    --brand: #2dd4bf;
    --brand-strong: #0a8c78;
    --accent: #10b981;
    --text: #d4f8ef;
    --text-muted: #58c4ac;
    --border: rgba(45, 212, 191, 0.13);
    --text-on-accent: #010d0a;
    --scrollbar-thumb: rgba(45, 212, 191, 0.11);
    --primary-rgb: 45, 212, 191;
    --glass: rgba(45, 212, 191, 0.06);
    --shadow-dynamic: 0 6px 28px -2px rgba(0, 0, 0, 0.72), 0 2px 10px -2px rgba(45, 212, 191, 0.07);
  }`
  },
  'obsidian-luxe': {
    light: `  /* Obsidian Luxe Light Override */
  [data-theme="obsidian-luxe"] {
    --bg: #f3f7ff;
    --white-dynamic: #06101e;
    --surface: #ffffff;
    --surface-2: #e3edfb;
    --muted-surface: #cae0f8;
    --surface-bright: #aeccea;
    --brand: #163878;
    --brand-strong: #102c60;
    --accent: #0095cc;
    --text: #06101e;
    --text-muted: #2a4460;
    --border: rgba(22, 56, 120, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(22, 56, 120, 0.14);
    --primary-rgb: 22, 56, 120;
    --glass: rgba(22, 56, 120, 0.07);
    --shadow-dynamic: 0 4px 18px -2px rgba(22, 56, 120, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Obsidian Luxe Dark Override */
  .dark[data-theme="obsidian-luxe"] {
    --bg: #01060e;
    --white-dynamic: #ddeeff;
    --surface: #060d1e;
    --surface-2: #0c1830;
    --muted-surface: #142444;
    --surface-bright: #1c3058;
    --brand: #78b6f8;
    --brand-strong: #163878;
    --accent: #00ccf0;
    --text: #ddeeff;
    --text-muted: #6a94bc;
    --border: rgba(120, 182, 248, 0.12);
    --text-on-accent: #01060e;
    --scrollbar-thumb: rgba(120, 182, 248, 0.1);
    --primary-rgb: 120, 182, 248;
    --glass: rgba(120, 182, 248, 0.06);
    --shadow-dynamic: 0 6px 30px -2px rgba(0, 0, 0, 0.78), 0 2px 12px -2px rgba(120, 182, 248, 0.09);
  }`
  },
  indigo: {
    light: `  /* Indigo Light Override */
  [data-theme="indigo"] {
    --bg: #f7f6ff;
    --white-dynamic: #0c0a26;
    --surface: #ffffff;
    --surface-2: #edeafd;
    --muted-surface: #dad6fa;
    --surface-bright: #c2bcf5;
    --brand: #4f46e5;
    --brand-strong: #3c34ce;
    --accent: #7c3aed;
    --text: #0c0a26;
    --text-muted: #3e3c72;
    --border: rgba(79, 70, 229, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(79, 70, 229, 0.14);
    --primary-rgb: 79, 70, 229;
    --glass: rgba(79, 70, 229, 0.07);
    --shadow-dynamic: 0 4px 18px -2px rgba(79, 70, 229, 0.12), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Indigo Dark Override */
  .dark[data-theme="indigo"] {
    --bg: #030210;
    --white-dynamic: #e6e4ff;
    --surface: #09081f;
    --surface-2: #110f34;
    --muted-surface: #191748;
    --surface-bright: #21205e;
    --brand: #a5a3ff;
    --brand-strong: #4f46e5;
    --accent: #e879f9;
    --text: #e6e4ff;
    --text-muted: #908ec2;
    --border: rgba(165, 163, 255, 0.12);
    --text-on-accent: #030210;
    --scrollbar-thumb: rgba(165, 163, 255, 0.1);
    --primary-rgb: 165, 163, 255;
    --glass: rgba(165, 163, 255, 0.06);
    --shadow-dynamic: 0 6px 28px -2px rgba(0, 0, 0, 0.74), 0 2px 12px -2px rgba(165, 163, 255, 0.1);
  }`
  },
  slate: {
    light: `  /* Slate Light Override */
  [data-theme="slate"] {
    --bg: #f4f6fa;
    --white-dynamic: #0d1520;
    --surface: #ffffff;
    --surface-2: #eaecf2;
    --muted-surface: #d5dae6;
    --surface-bright: #bcc4d2;
    --brand: #2c3e5c;
    --brand-strong: #1e2e4a;
    --accent: #0284c7;
    --text: #0d1520;
    --text-muted: #364c62;
    --border: rgba(44, 62, 92, 0.13);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(44, 62, 92, 0.13);
    --primary-rgb: 44, 62, 92;
    --glass: rgba(44, 62, 92, 0.07);
    --shadow-dynamic: 0 4px 14px -2px rgba(44, 62, 92, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Slate Dark Override */
  .dark[data-theme="slate"] {
    --bg: #03080e;
    --white-dynamic: #eaf1f8;
    --surface: #0a1020;
    --surface-2: #12192e;
    --muted-surface: #1a2440;
    --surface-bright: #243252;
    --brand: #aec8e0;
    --brand-strong: #2c3e5c;
    --accent: #0ea5e9;
    --text: #eaf1f8;
    --text-muted: #7090aa;
    --border: rgba(174, 200, 224, 0.11);
    --text-on-accent: #03080e;
    --scrollbar-thumb: rgba(174, 200, 224, 0.1);
    --primary-rgb: 174, 200, 224;
    --glass: rgba(174, 200, 224, 0.06);
    --shadow-dynamic: 0 6px 24px -2px rgba(0, 0, 0, 0.66), 0 2px 10px -2px rgba(174, 200, 224, 0.06);
  }`
  },
  navy: {
    light: `  /* Navy Light Override */
  [data-theme="navy"] {
    --bg: #f2f7ff;
    --white-dynamic: #050f20;
    --surface: #ffffff;
    --surface-2: #e0ecff;
    --muted-surface: #c2d6f8;
    --surface-bright: #a2bcee;
    --brand: #153278;
    --brand-strong: #0e2660;
    --accent: #0ea5e9;
    --text: #050f20;
    --text-muted: #284068;
    --border: rgba(21, 50, 120, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(21, 50, 120, 0.14);
    --primary-rgb: 21, 50, 120;
    --glass: rgba(21, 50, 120, 0.07);
    --shadow-dynamic: 0 4px 18px -2px rgba(21, 50, 120, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Navy Dark Override */
  .dark[data-theme="navy"] {
    --bg: #01050e;
    --white-dynamic: #d8e8ff;
    --surface: #050c20;
    --surface-2: #0b1632;
    --muted-surface: #11224c;
    --surface-bright: #182e64;
    --brand: #66a8f8;
    --brand-strong: #153278;
    --accent: #38bdf8;
    --text: #d8e8ff;
    --text-muted: #5a82ba;
    --border: rgba(102, 168, 248, 0.12);
    --text-on-accent: #01050e;
    --scrollbar-thumb: rgba(102, 168, 248, 0.1);
    --primary-rgb: 102, 168, 248;
    --glass: rgba(102, 168, 248, 0.06);
    --shadow-dynamic: 0 6px 30px -2px rgba(0, 0, 0, 0.78), 0 2px 12px -2px rgba(102, 168, 248, 0.07);
  }`
  },
  aurora: {
    light: `  /* Aurora Light Override */
  [data-theme="aurora"] {
    --bg: #faf8ff;
    --white-dynamic: #100520;
    --surface: #ffffff;
    --surface-2: #f0e8ff;
    --muted-surface: #e0ceff;
    --surface-bright: #cab0ff;
    --brand: #7c3aed;
    --brand-strong: #6220d4;
    --accent: #0d9488;
    --text: #100520;
    --text-muted: #483070;
    --border: rgba(124, 58, 237, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(124, 58, 237, 0.13);
    --primary-rgb: 124, 58, 237;
    --glass: rgba(124, 58, 237, 0.07);
    --shadow-dynamic: 0 4px 18px -2px rgba(124, 58, 237, 0.11), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Aurora Dark Override */
  .dark[data-theme="aurora"] {
    --bg: #03010e;
    --white-dynamic: #ece2ff;
    --surface: #0a061e;
    --surface-2: #130d32;
    --muted-surface: #1c1548;
    --surface-bright: #241d5e;
    --brand: #b68efc;
    --brand-strong: #7c3aed;
    --accent: #2dd4bf;
    --text: #ece2ff;
    --text-muted: #9a80c8;
    --border: rgba(182, 142, 252, 0.12);
    --text-on-accent: #03010e;
    --scrollbar-thumb: rgba(182, 142, 252, 0.1);
    --primary-rgb: 182, 142, 252;
    --glass: rgba(182, 142, 252, 0.06);
    --shadow-dynamic: 0 6px 30px -2px rgba(0, 0, 0, 0.78), 0 2px 12px -2px rgba(182, 142, 252, 0.09);
  }`
  },
  amber: {
    light: `  /* Amber Light Override */
  [data-theme="amber"] {
    --bg: #fefcf3;
    --white-dynamic: #190d02;
    --surface: #fffdf7;
    --surface-2: #f8efcc;
    --muted-surface: #f0e0a0;
    --surface-bright: #e2ca74;
    --brand: #986010;
    --brand-strong: #7a4c0c;
    --accent: #d97706;
    --text: #190d02;
    --text-muted: #563a14;
    --border: rgba(15, 96, 16, 0.15);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(15, 96, 16, 0.14);
    --primary-rgb: 15, 96, 16;
    --glass: rgba(15, 96, 16, 0.07);
    --shadow-dynamic: 0 4px 18px -2px rgba(15, 96, 16, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Amber Dark Override */
  .dark[data-theme="amber"] {
    --bg: #090601;
    --white-dynamic: #fdf5e2;
    --surface: #120c04;
    --surface-2: #1d1408;
    --muted-surface: #291c0a;
    --surface-bright: #37240e;
    --brand: #f5b934;
    --brand-strong: #986010;
    --accent: #fbbf24;
    --text: #fdf5e2;
    --text-muted: #c0a268;
    --border: rgba(245, 185, 52, 0.14);
    --text-on-accent: #090601;
    --scrollbar-thumb: rgba(245, 185, 52, 0.11);
    --primary-rgb: 245, 185, 52;
    --glass: rgba(245, 185, 52, 0.07);
    --shadow-dynamic: 0 6px 26px -2px rgba(0, 0, 0, 0.72), 0 2px 10px -2px rgba(245, 185, 52, 0.09);
  }`
  },
  crimson: {
    light: `  /* Crimson Light Override */
  [data-theme="crimson"] {
    --bg: #fdf5f5;
    --white-dynamic: #1c0404;
    --surface: #ffffff;
    --surface-2: #fae9e8;
    --muted-surface: #f2d0cc;
    --surface-bright: #e4b0aa;
    --brand: #961616;
    --brand-strong: #780e0e;
    --accent: #c4891a;
    --text: #1c0404;
    --text-muted: #562a2a;
    --border: rgba(150, 22, 22, 0.14);
    --text-on-accent: #ffffff;
    --scrollbar-thumb: rgba(150, 22, 22, 0.13);
    --primary-rgb: 150, 22, 22;
    --glass: rgba(150, 22, 22, 0.07);
    --shadow-dynamic: 0 4px 16px -2px rgba(150, 22, 22, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
  }`,
    dark: `  /* Crimson Dark Override */
  .dark[data-theme="crimson"] {
    --bg: #090202;
    --white-dynamic: #ffeeec;
    --surface: #140505;
    --surface-2: #1e0c0c;
    --muted-surface: #2a1010;
    --surface-bright: #3a1818;
    --brand: #f87171;
    --brand-strong: #961616;
    --accent: #e6a020;
    --text: #ffeeec;
    --text-muted: #be8e8e;
    --border: rgba(248, 112, 112, 0.12);
    --text-on-accent: #090202;
    --scrollbar-thumb: rgba(248, 112, 112, 0.1);
    --primary-rgb: 248, 112, 112;
    --glass: rgba(248, 112, 112, 0.06);
    --shadow-dynamic: 0 6px 26px -2px rgba(0, 0, 0, 0.74), 0 2px 10px -2px rgba(248, 112, 112, 0.08);
  }`
  }
};

/**
 * SystemSettingsPage — Regulates general brand locale settings, session timeout levels, password policies, and database backup routines.
 */
export function SystemSettingsPage({
  systemConfig,
  updateSystemField,
  isDirty,
  saveCurrentSection,
  resetCurrentSection,
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [backingUp, setBackingUp] = useState(false);

  const { theme: currentTheme, setTheme, colorTheme: currentColorTheme, setColorTheme } = useAdminUi();
  const [localTheme, setLocalTheme] = useState(currentTheme);
  const [localColorTheme, setLocalColorTheme] = useState(currentColorTheme);

  const [prevTheme, setPrevTheme] = useState(currentTheme);
  const [prevColorTheme, setPrevColorTheme] = useState(currentColorTheme);

  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('css-vars'); // 'css-vars', 'presets-json', 'all-css'
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (currentTheme !== prevTheme) {
    setPrevTheme(currentTheme);
    setLocalTheme(currentTheme);
  }
  if (currentColorTheme !== prevColorTheme) {
    setPrevColorTheme(currentColorTheme);
    setLocalColorTheme(currentColorTheme);
  }

  const isAppearanceDirty = localTheme !== currentTheme || localColorTheme !== currentColorTheme;

  // Cleanup on unmount: if we have unsaved changes, revert them on the DOM
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

  const handleSaveAll = async () => {
    if (isAppearanceDirty) {
      setTheme(localTheme);
      setColorTheme(localColorTheme);
    }
    if (isDirty) {
      await saveCurrentSection();
    }
  };

  const handleResetAll = () => {
    if (isAppearanceDirty) {
      setLocalTheme(currentTheme);
      setLocalColorTheme(currentColorTheme);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);
      root.setAttribute('data-theme', currentColorTheme);
    }
    if (isDirty) {
      resetCurrentSection();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', Icon: Settings },
    { id: 'security', label: 'Security', Icon: Shield },
    { id: 'appearance', label: 'Appearance', Icon: Palette },
    { id: 'backup', label: 'Backups', Icon: HardDrive },
  ];

  const handleLaunchBackup = async () => {
    setBackingUp(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBackingUp(false);
    alert('System database backup snapshot created successfully ✓');
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="System Settings"
        desc="Set your brand info, locale, security rules, and backup settings."
      />

      <SettingsTabs tabs={tabs} active={activeTab} setActive={setActiveTab} />

      {activeTab === 'general' && (
        <div className="space-y-5">
          <SettingsCard
            title="Brand Info"
            desc="Set your brand name and support contact."
            Icon={Settings}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Shown across the platform">Brand Name</FieldLabel>
                <TInput
                  value={systemConfig.brandName}
                  onChange={(v) => updateSystemField('brandName', v)}
                  placeholder="Live-Trader"
                />
              </div>
              <div>
                <FieldLabel required hint="Your main website domain">Brand Domain</FieldLabel>
                <TInput
                  value={systemConfig.brandDomain}
                  onChange={(v) => updateSystemField('brandDomain', v)}
                  placeholder="live-trader.com"
                  mono
                />
              </div>
            </FGroup>
            <div className="mt-4">
              <FieldLabel required hint="Where support tickets are sent">Support Email</FieldLabel>
              <TInput
                value={systemConfig.supportEmail}
                onChange={(v) => updateSystemField('supportEmail', v)}
                placeholder="support@live-trader.com"
                mono
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Region & Locale"
            desc="Set date formats, language, and base currency."
            Icon={Sliders}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel hint="Platform timezone for all schedules">Timezone</FieldLabel>
                <TSelect
                  value={systemConfig.timezone}
                  onChange={(v) => updateSystemField('timezone', v)}
                  options={TIMEZONE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Default language for client portals">Language</FieldLabel>
                <TSelect
                  value={systemConfig.locale}
                  onChange={(v) => updateSystemField('locale', v)}
                  options={LOCALE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="Currency used for fee calculations">Base Currency</FieldLabel>
                <TSelect
                  value={systemConfig.currency}
                  onChange={(v) => updateSystemField('currency', v)}
                  options={SYSTEM_CURRENCY_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel hint="How dates are displayed in tables">Date Format</FieldLabel>
                <TSelect
                  value={systemConfig.dateFormat}
                  onChange={(v) => updateSystemField('dateFormat', v)}
                  options={DATE_FORMAT_OPTIONS}
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-5">
          <SettingsCard
            title="Session Controls"
            desc="Set idle timeout and max active sessions."
            Icon={Shield}
          >
            <FGroup cols={2}>
              <div>
                <FieldLabel required hint="Minutes of inactivity before auto-logout">Session Timeout</FieldLabel>
                <TInput
                  value={systemConfig.sessionTimeout}
                  onChange={(v) => updateSystemField('sessionTimeout', v)}
                  mono
                  suffix="MIN"
                />
              </div>
              <div>
                <FieldLabel required hint="Max simultaneous logins per admin">Max Sessions</FieldLabel>
                <TInput
                  value={systemConfig.maxSessions}
                  onChange={(v) => updateSystemField('maxSessions', v)}
                  mono
                />
              </div>
            </FGroup>

            <div className="mt-4">
              <ToggleRow
                label="Require MFA"
                desc="All admin accounts must use Google Authenticator or SMS for login"
                val={systemConfig.mfaRequired}
                onChange={(v) => updateSystemField('mfaRequired', v)}
              />
            </div>
          </SettingsCard>

          <SettingsCard
            title="Password Policy"
            desc="Set password strength and expiry rules."
            Icon={Key}
          >
            <FGroup cols={3}>
              <div>
                <FieldLabel hint="Minimum characters required">Min Password Length</FieldLabel>
                <TInput
                  value={systemConfig.passwordMinLength}
                  onChange={(v) => updateSystemField('passwordMinLength', v)}
                  mono
                />
              </div>
              <div>
                <FieldLabel hint="Days before password expires">Password Expiry</FieldLabel>
                <TInput
                  value={systemConfig.passwordExpiry}
                  onChange={(v) => updateSystemField('passwordExpiry', v)}
                  mono
                  suffix="DAYS"
                />
              </div>
              <div>
                <FieldLabel hint="Failed attempts before account is blocked">Max Login Attempts</FieldLabel>
                <TInput
                  value={systemConfig.loginAttempts}
                  onChange={(v) => updateSystemField('loginAttempts', v)}
                  mono
                />
              </div>
            </FGroup>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-5">
          <SettingsCard
            title="Backups & Maintenance"
            desc="Schedule database backups and manage data retention."
            Icon={HardDrive}
          >
            <div className="space-y-4">
              <ToggleRow
                label="Automatic Daily Backups"
                desc="Back up all system data automatically every day"
                val={systemConfig.backupEnabled}
                onChange={(v) => updateSystemField('backupEnabled', v)}
              />

              <FGroup cols={2}>
                <div>
                  <FieldLabel hint="How often backups run">Backup Frequency</FieldLabel>
                  <TSelect
                    value={systemConfig.backupFrequency}
                    onChange={(v) => updateSystemField('backupFrequency', v)}
                    options={BACKUP_FREQUENCY_OPTIONS}
                    disabled={!systemConfig.backupEnabled}
                  />
                </div>
                <div>
                  <FieldLabel hint="Days to keep backup snapshots">Backup Retention</FieldLabel>
                  <TInput
                    value={systemConfig.backupRetention}
                    onChange={(v) => updateSystemField('backupRetention', v)}
                    disabled={!systemConfig.backupEnabled}
                    mono
                    suffix="DAYS"
                  />
                </div>
              </FGroup>

              <div className="pt-2">
                <ToggleRow
                  label="Audit Logging"
                  desc="Log all admin actions, changes, and queries"
                  val={systemConfig.auditLogEnabled}
                  onChange={(v) => updateSystemField('auditLogEnabled', v)}
                />
                <FGroup cols={2}>
                  <div>
                    <FieldLabel hint="How long to keep audit logs">Audit Log Retention</FieldLabel>
                    <TInput
                      value={systemConfig.auditLogRetention}
                      onChange={(v) => updateSystemField('auditLogRetention', v)}
                      disabled={!systemConfig.auditLogEnabled}
                      mono
                      suffix="DAYS"
                    />
                  </div>
                  <div>
                    <FieldLabel hint="How long to keep transaction records">Transaction Log Retention</FieldLabel>
                    <TInput
                      value={systemConfig.dataRetention}
                      onChange={(v) => updateSystemField('dataRetention', v)}
                      mono
                      suffix="DAYS"
                    />
                  </div>
                </FGroup>
              </div>

              <div className="pt-4 border-t border-border/10">
                <Btn
                  Icon={Database}
                  label={backingUp ? 'Creating Backup...' : 'Create Backup Now'}
                  variant="cyan"
                  onClick={handleLaunchBackup}
                  loading={backingUp}
                />
              </div>
            </div>
          </SettingsCard>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-5 animate-fade-in">
          {/* Interface Mode Card */}
          <SettingsCard
            title="Interface Mode"
            desc="Switch between light and dark theme."
            Icon={localTheme === 'dark' ? Moon : Sun}
          >
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLocalTheme('light');
                  const root = window.document.documentElement;
                  root.classList.remove('dark');
                  root.classList.add('light');
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4.5 px-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  localTheme === 'light'
                    ? 'border-brand bg-brand-muted text-brand ring-2 ring-brand/10'
                    : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20 text-text-muted'
                }`}
              >
                <Sun size={18} className={localTheme === 'light' ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
                <div className="text-left">
                  <p className="text-[13px] font-bold leading-tight">Light Mode</p>
                  <p className="text-[10px] text-text-muted/60 mt-0.5 leading-none">Clean & bright</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocalTheme('dark');
                  const root = window.document.documentElement;
                  root.classList.remove('light');
                  root.classList.add('dark');
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4.5 px-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  localTheme === 'dark'
                    ? 'border-brand bg-brand-muted text-brand ring-2 ring-brand/10'
                    : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/20 text-text-muted'
                }`}
              >
                <Moon size={18} />
                <div className="text-left">
                  <p className="text-[13px] font-bold leading-tight">Dark Mode</p>
                  <p className="text-[10px] text-text-muted/60 mt-0.5 leading-none">Easy on the eyes</p>
                </div>
              </button>
            </div>
          </SettingsCard>

          {/* Preset Themes Card */}
          <SettingsCard
            title="Color Themes"
            desc="Choose a color preset for the platform."
            Icon={Palette}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {THEME_PRESETS.map((preset) => {
                const isActive = localColorTheme === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setLocalColorTheme(preset.id);
                      const root = window.document.documentElement;
                      root.setAttribute('data-theme', preset.id);
                    }}
                    className={`relative p-4.5 rounded-xl border text-left transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? 'border-brand bg-brand-muted ring-2 ring-brand/10'
                        : 'border-border/10 bg-surface hover:bg-surface-2 hover:border-border/25'
                    }`}
                  >
                    {/* Swatches rendering */}
                    <div className="flex gap-1.5 mb-3.5">
                      {preset.swatches.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <h4 className="text-[13px] font-bold text-text leading-tight flex items-center gap-1.5">
                      {preset.name}
                      {isActive && (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand text-text-on-accent">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </h4>
                    <p className="text-[11.5px] text-text-muted/80 mt-1">{preset.desc}</p>
                    <p className="text-[9.5px] font-bold uppercase tracking-wider text-brand/75 mt-3">{preset.mood}</p>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-border/10 mt-4">
              <button
                type="button"
                onClick={() => setIsDeveloperModalOpen(true)}
                className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-brand/80 hover:text-brand transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Code size={13} />
                Get Theme Codes (Copy-Paste)
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocalTheme('dark');
                  setLocalColorTheme('obsidian');
                  const root = window.document.documentElement;
                  root.classList.remove('light');
                  root.classList.add('dark');
                  root.setAttribute('data-theme', 'obsidian');
                }}
                className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-text-muted/65 hover:text-brand transition-colors flex items-center gap-1 cursor-pointer"
              >
                Reset to Default Preset
              </button>
            </div>
          </SettingsCard>
        </div>
      )}

      <SaveBar
        isDirty={isDirty || isAppearanceDirty}
        onSave={handleSaveAll}
        onReset={handleResetAll}
        label="Save System Settings"
      />

      {/* Developer Reference Copy-Paste Modal */}
      <AdminModal
        open={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
        title="Theme Code Reference"
        subtitle="Copy theme values to use across your platform."
        actionLabel="Developer Reference"
        maxWidth="max-w-[720px]"
      >
        <div className="space-y-4">
          {/* Modal Tabs */}
          <div className="flex border-b border-border/10">
            <button
              type="button"
              onClick={() => setModalTab('css-vars')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                modalTab === 'css-vars'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              Active Preset CSS
            </button>
            <button
              type="button"
              onClick={() => setModalTab('all-css')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                modalTab === 'all-css'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              Full CSS Bundle
            </button>
            <button
              type="button"
              onClick={() => setModalTab('presets-json')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                modalTab === 'presets-json'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              JS Config Array
            </button>
          </div>

          {/* Preset selector for CSS-vars */}
          {modalTab === 'css-vars' && (
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-xs text-text-muted/80 mr-1 font-semibold">Select Theme:</span>
              <select
                value={localColorTheme}
                onChange={(e) => {
                  setLocalColorTheme(e.target.value);
                  const root = window.document.documentElement;
                  root.setAttribute('data-theme', e.target.value);
                }}
                className="bg-surface-elevated text-text border border-border/30 rounded-lg px-2 py-1 text-xs font-semibold outline-none focus:border-brand/40"
              >
                {THEME_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Code Viewer Container */}
          <div className="relative group">
            <div className="absolute right-3 top-3 flex items-center gap-2">
              {copied && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  Copied!
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  let text = '';
                  if (modalTab === 'css-vars') {
                    const preset = THEME_CSS_VARIABLES[localColorTheme] || THEME_CSS_VARIABLES.obsidian;
                    text = `${preset.light}\n\n${preset.dark}`;
                  } else if (modalTab === 'all-css') {
                    text = Object.keys(THEME_CSS_VARIABLES)
                      .map((key) => {
                        const preset = THEME_CSS_VARIABLES[key];
                        return `/* === Theme: ${key} === */\n${preset.light}\n\n${preset.dark}`;
                      })
                      .join('\n\n');
                  } else if (modalTab === 'presets-json') {
                    text = `export const THEME_PRESETS = ${JSON.stringify(THEME_PRESETS, null, 2)};`;
                  }
                  handleCopyCode(text);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg border border-border/30 text-text-muted hover:text-text hover:bg-surface-elevated transition-colors text-xs font-semibold cursor-pointer shadow-sm"
              >
                <Copy size={12} />
                Copy Snippet
              </button>
            </div>

            <pre className="bg-[#0b1326] border border-border/20 text-slate-300 p-5 pt-12 rounded-xl font-mono text-[11px] leading-relaxed overflow-auto max-h-[380px] w-full select-all">
              {(() => {
                if (modalTab === 'css-vars') {
                  const preset = THEME_CSS_VARIABLES[localColorTheme] || THEME_CSS_VARIABLES.obsidian;
                  return `${preset.light}\n\n${preset.dark}`;
                } else if (modalTab === 'all-css') {
                  return Object.keys(THEME_CSS_VARIABLES)
                    .map((key) => {
                      const preset = THEME_CSS_VARIABLES[key];
                      return `/* === Theme: ${key} === */\n${preset.light}\n\n${preset.dark}`;
                    })
                    .join('\n\n');
                } else if (modalTab === 'presets-json') {
                  return `export const THEME_PRESETS = ${JSON.stringify(THEME_PRESETS, null, 2)};`;
                }
                return '';
              })()}
            </pre>
          </div>

          <p className="text-[10px] text-text-muted/60 leading-normal">
            * Note: Map these values to your CSS variables. For Tailwind CSS, add them to your color settings (for example, <code>--color-brand: var(--brand)</code>).
          </p>
        </div>
      </AdminModal>
    </div>
  );
}

export default SystemSettingsPage;
