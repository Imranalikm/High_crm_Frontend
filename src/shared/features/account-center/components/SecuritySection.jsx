import React, { useState } from 'react';
import { Lock, ShieldCheck, Smartphone, Monitor, Info, History, ShieldAlert, KeyRound, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import {
  FieldLabel,
  TInput,
  ToggleRow,
  Btn,
} from '@/features/settings/components/SettingsForm';
import { MainTable } from '@/components/common/table';

const INITIAL_SESSIONS = [
  { id: 's1', device: 'Chrome on Windows 11', location: 'Mumbai, India (103.45.19.12)', time: 'Active now', current: true },
  { id: 's2', device: 'Safari on iPhone 15', location: 'Dubai, UAE (94.200.12.8)', time: '2 hours ago', current: false },
  { id: 's3', device: 'Chrome on macOS', location: 'London, UK (185.120.3.54)', time: 'Yesterday, 4:20 PM', current: false },
  { id: 's4', device: 'Firefox on Linux', location: 'Frankfurt, Germany (46.12.98.22)', time: 'May 30, 2026', current: false },
];

const MOCK_LOGIN_HISTORY = [
  { id: 'h1', date: '2026-06-03 07:12:34', ip: '103.45.19.12', device: 'Chrome / Windows', status: 'success' },
  { id: 'h2', date: '2026-06-02 18:45:10', ip: '103.45.19.12', device: 'Chrome / Windows', status: 'success' },
  { id: 'h3', date: '2026-06-02 11:20:05', ip: '94.200.12.8', device: 'Safari / iPhone', status: 'success' },
  { id: 'h4', date: '2026-06-01 09:15:22', ip: '82.165.19.5', device: 'Unknown Browser / Linux', status: 'failed' },
  { id: 'h5', date: '2026-05-30 16:22:45', ip: '185.120.3.54', device: 'Chrome / macOS', status: 'success' },
];

export function SecuritySection() {
  const [currentPw, setCurrentPw] = useState('');
  const [nextPw, setNextPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const handlePwSave = (e) => {
    e.preventDefault();
    if (!currentPw || !nextPw || nextPw !== confirmPw) return;
    setPwLoading(true);

    setTimeout(() => {
      setPwSaved(true);
      setPwLoading(false);
      setCurrentPw('');
      setNextPw('');
      setConfirmPw('');
      setTimeout(() => setPwSaved(false), 3000);
    }, 1000);
  };

  const terminateSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const terminateAllOthers = () => {
    setSessions(prev => prev.filter(s => s.current));
  };

  // MainTable Columns for Login Attempts History
  const loginHistoryColumns = [
    { key: 'date', label: 'Attempt Timestamp', render: (val) => <span className="font-semibold text-text">{val}</span> },
    { key: 'ip', label: 'IP Address', render: (val) => <span className="font-mono text-text-muted/80">{val}</span> },
    { key: 'device', label: 'Browser / OS', render: (val) => <span className="text-text-muted/80">{val}</span> },
    {
      key: 'status',
      label: 'Result',
      align: 'right',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 font-bold text-[11.5px] ${val === 'success' ? 'text-positive' : 'text-negative'}`}>
          {val === 'success' ? <CheckCircle size={12} className="shrink-0" /> : <XCircle size={12} className="shrink-0" />}
          {val === 'success' ? 'Success' : 'Blocked'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Grid: 2FA & Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Change Password Card */}
        <form onSubmit={handlePwSave}>
          <SettingsCard
            title="Change Password"
            desc="Setup strength guidelines and boundaries for administrative credentials."
            Icon={Lock}
          >
            <div className="space-y-4">
              <div>
                <FieldLabel required>Current Password</FieldLabel>
                <TInput
                  type="password"
                  value={currentPw}
                  onChange={setCurrentPw}
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <FieldLabel required>New Password</FieldLabel>
                <TInput
                  type="password"
                  value={nextPw}
                  onChange={setNextPw}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <FieldLabel required>Confirm New Password</FieldLabel>
                <TInput
                  type="password"
                  value={confirmPw}
                  onChange={setConfirmPw}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/10 mt-4">
                <Btn
                  type="submit"
                  Icon={RefreshCw}
                  label={pwLoading ? 'Updating...' : 'Update Password'}
                  variant="brand"
                  loading={pwLoading}
                  disabled={!currentPw || !nextPw || nextPw !== confirmPw}
                />
                {pwSaved && <span className="text-[12.5px] font-semibold text-positive animate-fade-in">✓ Password updated</span>}
              </div>
            </div>
          </SettingsCard>
        </form>

        {/* Two-Factor Authentication Card */}
        <SettingsCard
          title="Two-Factor Auth (2FA)"
          desc="TOTP token protection (Google Authenticator / Authy) on logins."
          Icon={ShieldCheck}
          warning={!mfaEnabled}
        >
          <div className="space-y-4">
            <ToggleRow
              label="Enable Multi-Factor Token Required"
              desc="Prompt for 6-digit verification code upon logins."
              val={mfaEnabled}
              onChange={setMfaEnabled}
            />

            <p className="text-[12.5px] text-text-muted/65 leading-relaxed font-heading">
              Two-factor authentication adds an extra layer of security. In addition to your password, you will be prompted to enter a dynamic token generated by your mobile authenticator.
            </p>

            {mfaEnabled ? (
              <div
                className="p-4 rounded-[10px] space-y-3 animate-fade-in border"
                style={{
                  background: 'color-mix(in srgb, var(--positive) 6%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--positive) 15%, transparent)'
                }}
              >
                <div className="flex gap-3">
                  <Smartphone size={16} className="text-positive shrink-0 mt-0.5" strokeWidth={2} />
                  <div className="space-y-0.5">
                    <p className="text-[12.5px] font-bold text-text font-heading">MFA protection active</p>
                    <p className="text-[11.5px] text-text-muted/60 leading-normal font-heading">Your personal device is configured. You must supply codes from your authenticator app when signing in.</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-positive/10">
                  <button
                    type="button"
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                    className="text-[11.5px] font-bold text-brand hover:underline cursor-pointer flex items-center gap-1 font-heading"
                  >
                    <KeyRound size={12} /> {showBackupCodes ? 'Hide Backup Codes' : 'Show Backup Recovery Codes'}
                  </button>
                  {showBackupCodes && (
                    <div className="mt-2 p-2 bg-bg/50 border border-border/10 rounded font-mono text-[11px] grid grid-cols-2 gap-1 text-center select-all text-text">
                      <span>LT-8812-9844</span>
                      <span>LT-1294-0985</span>
                      <span>LT-5512-3392</span>
                      <span>LT-4019-7489</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="p-3.5 rounded-[10px] flex gap-2.5 border"
                style={{
                  background: 'color-mix(in srgb, var(--warning) 6%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--warning) 15%, transparent)'
                }}
              >
                <ShieldAlert size={16} className="text-warning shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[12px] font-semibold text-text font-heading">MFA configuration recommended</p>
                  <p className="text-[11px] text-text-muted/60 leading-normal font-heading">Toggle the switch above to link your authenticator app.</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border/10 flex items-center gap-1.5 text-[11px] text-text-muted/40 font-heading">
              <Info size={11} className="shrink-0" /> Backup methods include recovery codes verification fallback.
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Active Sessions Manager */}
      <SettingsCard
        title="Active Login Sessions"
        desc="Verify and log out devices currently accessing your account credentials."
        Icon={Monitor}
        action={
          sessions.length > 1 && (
            <Btn
              onClick={terminateAllOthers}
              label="Log Out All Others"
              variant="danger"
              small
            />
          )
        }
      >
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3.5 rounded-[10px] border border-border/20 transition-all hover:bg-muted-surface/10"
              style={{ background: 'var(--surface-2)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Monitor size={16} className="text-text-muted/40 shrink-0" strokeWidth={1.8} />
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[13px] font-bold text-text truncate font-heading">{session.device}</p>
                  <p className="text-[11.5px] text-text-muted/50 truncate font-heading">{session.location} · {session.time}</p>
                </div>
              </div>
              {session.current ? (
                <span
                  className="text-[9.5px] font-black uppercase tracking-[0.1em] px-2 py-0.8 rounded-[5px] border"
                  style={{
                    background: 'color-mix(in srgb, var(--positive) 10%, transparent)',
                    color: 'var(--positive)',
                    borderColor: 'color-mix(in srgb, var(--positive) 20%, transparent)',
                  }}
                >
                  Current Device
                </span>
              ) : (
                <Btn
                  onClick={() => terminateSession(session.id)}
                  label="Terminate"
                  variant="danger"
                  small
                />
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-center text-text-muted/45 text-[12.5px] py-4 font-heading">No active login sessions found.</p>
          )}
        </div>
      </SettingsCard>

      {/* Login History Log Table */}
      <SettingsCard
        title="Recent Login Attempts"
        desc="Audit log of your last few account login sessions."
        Icon={History}
      >
        <MainTable
          columns={loginHistoryColumns}
          data={MOCK_LOGIN_HISTORY}
          emptyTitle="No login history found"
        />
      </SettingsCard>
    </div>
  );
}
