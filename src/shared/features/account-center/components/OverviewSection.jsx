import React from 'react';
import { ShieldCheck, LogIn, Laptop, Globe, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';

export function OverviewSection({ user }) {
  // Derive role description
  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'super-admin':
        return 'bg-purple/10 text-purple border-purple/20';
      case 'operations':
        return 'bg-cyan/10 text-cyan border-cyan/20';
      case 'auditor':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'super-admin':
        return 'Super Admin';
      case 'operations':
        return 'Operations';
      case 'auditor':
        return 'Auditor';
      default:
        return 'Trader';
    }
  };

  // Mock security items status
  const securityItems = [
    { label: 'Strong password configured', met: true },
    { label: 'Two-factor authentication (2FA) active', met: false },
    { label: 'Security notifications enabled', met: true },
    { label: 'Verified email address linked', met: true },
  ];

  const score = Math.round((securityItems.filter(i => i.met).length / securityItems.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* 1. Account Summary Card */}
      <div className="lg:col-span-2">
        <SettingsCard
          title="Account Details"
          desc="Your personnel identity, status level, and primary locale configurations."
          Icon={Shield}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 rounded-[20px] flex items-center justify-center font-heading font-black text-[28px] tracking-tight border shadow-sm transition-all duration-300"
                style={{
                  background: 'color-mix(in srgb, var(--brand) 12%, var(--surface))',
                  color: 'var(--brand)',
                  borderColor: 'color-mix(in srgb, var(--brand) 25%, transparent)'
                }}
              >
                {user?.initials ?? 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-elevated" style={{ background: 'var(--positive)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute" />
                <span className="w-1.5 h-1.5 rounded-full bg-white relative" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading font-black text-[22px] tracking-[-0.04em] text-text">{user?.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-[6px] text-[10px] font-black uppercase tracking-[0.1em] border ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </span>
              </div>
              <p className="text-[14px] text-text-muted/65 font-medium">{user?.email}</p>
              <p className="text-[13px] text-text-muted/45 font-medium">ID: {user?.id ?? 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/40 font-heading">Account Status</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[13px] font-bold text-positive">
                <CheckCircle2 size={13} className="shrink-0" /> Active
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/40 font-heading">Registered Phone</p>
              <p className="text-[13.5px] font-semibold text-text mt-0.5 font-heading">+1 (555) 019-2834</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/40 font-heading">Preferred Language</p>
              <p className="text-[13.5px] font-semibold text-text mt-0.5 font-heading">English (US)</p>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* 2. Security Score Card */}
      <SettingsCard
        title="Security Health"
        desc="Audit your personal verification checklist and account protection score."
        Icon={ShieldCheck}
        warning={score < 75}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-[5px] border"
            style={{
              background: score >= 75 ? 'color-mix(in srgb, var(--positive) 10%, transparent)' : 'color-mix(in srgb, var(--warning) 10%, transparent)',
              color: score >= 75 ? 'var(--positive)' : 'var(--warning)',
              borderColor: score >= 75 ? 'color-mix(in srgb, var(--positive) 20%, transparent)' : 'color-mix(in srgb, var(--warning) 20%, transparent)',
            }}
          >
            {score >= 75 ? 'Good' : 'Moderate'}
          </span>
        </div>

        <div className="flex items-center gap-5 my-3">
          {/* Circular Progress Gauge */}
          <div className="relative shrink-0 w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-text-muted/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                style={{ stroke: score >= 75 ? 'var(--positive)' : 'var(--warning)', transition: 'stroke-dasharray 0.5s ease' }}
                strokeWidth="3.2"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[14px] font-heading font-black text-text">{score}%</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[13px] font-semibold text-text font-heading">Security Score</p>
            <p className="text-[11.5px] text-text-muted/60 leading-normal font-heading">Strengthen your account by enabling two-factor authentication.</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-border/10 pt-4">
          {securityItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] font-heading">
              {item.met ? (
                <CheckCircle2 size={13} className="text-positive shrink-0" />
              ) : (
                <AlertCircle size={13} className="text-warning shrink-0" />
              )}
              <span className={item.met ? 'text-text-muted/75' : 'text-text font-medium'}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* 3. Session & Linked Accounts Summary */}
      <div className="lg:col-span-3">
        <SettingsCard
          title="Login & Linkage Details"
          desc="Overview of your connected devices, geography coordinates, and active system bridges."
          Icon={LogIn}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[12px] flex items-start gap-3 border border-border/5" style={{ background: 'var(--muted-surface)' }}>
              <Laptop size={18} className="text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-[12.5px] font-semibold text-text font-heading">Active Devices</p>
                <p className="text-[14px] font-bold text-text mt-1 font-heading">3 Sessions Active</p>
                <p className="text-[11.5px] text-text-muted/50 mt-0.5 font-heading">Windows, iOS, macOS</p>
              </div>
            </div>

            <div className="p-4 rounded-[12px] flex items-start gap-3 border border-border/5" style={{ background: 'var(--muted-surface)' }}>
              <Globe size={18} className="text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-[12.5px] font-semibold text-text font-heading">Last Login Location</p>
                <p className="text-[14px] font-bold text-text mt-1 font-heading">Mumbai, India</p>
                <p className="text-[11.5px] text-text-muted/50 mt-0.5 font-heading">June 03, 2026 at 07:12 AM</p>
              </div>
            </div>

            <div className="p-4 rounded-[12px] flex items-start gap-3 border border-border/5" style={{ background: 'var(--muted-surface)' }}>
              <ShieldCheck size={18} className="text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-[12.5px] font-semibold text-text font-heading">Linked Gateways</p>
                <p className="text-[14px] font-bold text-text mt-1 font-heading">
                  {user?.role === 'client' ? 'MetaTrader 5 Link Active' : 'API Node Sync Direct'}
                </p>
                <p className="text-[11.5px] text-text-muted/50 mt-0.5 font-heading">Google OAuth Authenticated</p>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
