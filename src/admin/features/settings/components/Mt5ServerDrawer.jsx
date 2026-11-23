import React, { useState } from 'react';
import { CheckCircle2, XCircle, PlugZap } from 'lucide-react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { FieldLabel, FGroup, TInput, TArea, WarnBanner, Btn } from './SettingsForm';

const EMPTY = {
  label: '',
  baseUrl: '',
  apiUsername: '',
  apiPassword: '',
  managerId: '',
  managerPassword: '',
  serverIp: '',
  serverName: '',
  wsUrl: '',
  notes: '',
};

function fromServer(server) {
  if (!server) return EMPTY;
  return {
    label: server.label || '',
    baseUrl: server.baseUrl || '',
    apiUsername: server.apiUsername || '',
    apiPassword: '',
    managerId: server.managerId || '',
    managerPassword: '',
    serverIp: server.serverIp || '',
    serverName: server.serverName || '',
    wsUrl: server.wsUrl || '',
    notes: server.notes || '',
  };
}

function TestResult({ result }) {
  if (!result) return null;
  const Icon = result.ok ? CheckCircle2 : XCircle;
  const color = result.ok ? 'var(--positive)' : 'var(--negative)';
  return (
    <div
      className="rounded-[8px] border px-4 py-3 text-[12px] font-heading"
      style={{ borderColor: `color-mix(in srgb, ${color} 25%, transparent)`, background: `color-mix(in srgb, ${color} 6%, transparent)` }}
    >
      <div className="flex items-center gap-2 font-semibold" style={{ color }}>
        <Icon size={14} /> {result.ok ? 'Connection works' : 'Connection failed'}
        <span className="ml-auto font-mono text-[10.5px] text-text-muted/50">{result.ms} ms</span>
      </div>
      <p className="mt-1 text-text-muted/80">{result.message}</p>
      <div className="mt-2 flex gap-4 text-[11px] text-text-muted/60">
        <span>Gateway login: {result.tokenOk ? '✓' : '✕'}</span>
        <span>Manager login: {result.managerOk ? '✓' : result.tokenOk ? '✕' : '—'}</span>
      </div>
    </div>
  );
}

/**
 * Add / edit an MT5 server profile. Passwords are never loaded back; leaving them blank keeps the saved ones.
 * `session` changes every time the drawer opens so the form starts fresh.
 */
export function Mt5ServerDrawer({ open, session, server, onClose, onSubmit, onTest }) {
  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[600px]">
      <ServerForm key={session} server={server} onClose={onClose} onSubmit={onSubmit} onTest={onTest} />
    </MainDrawer>
  );
}

function ServerForm({ server, onClose, onSubmit, onTest }) {
  const [form, setForm] = useState(() => fromServer(server));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const isEdit = Boolean(server);
  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setTestResult(null);
  };

  const payload = () => ({ ...form, serverId: server?.id });

  const handleTest = async () => {
    setError('');
    setTesting(true);
    try {
      setTestResult(await onTest(payload()));
    } catch (err) {
      setTestResult(null);
      setError(err.message || 'Test failed.');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await onSubmit(payload());
    } catch (err) {
      setError(err.message || 'Failed to save MT5 server.');
      setSaving(false);
    }
  };

  const passwordHint = isEdit ? 'Leave blank to keep the saved password' : undefined;

  return (
    <>
      <DrawerHeader
        eyebrow="MT5 Servers"
        title={isEdit ? `Edit ${server.label}` : 'Add MT5 Server'}
        subtitle={isEdit && server.isActive
          ? 'This server is active. Saved changes take effect immediately.'
          : 'Saving does not switch servers. Activate it from the list when ready.'}
        onClose={onClose}
      />
      <DrawerBody>
        <div className="space-y-5">
          {error && <WarnBanner title="Can't save" message={error} severity="danger" />}
          {isEdit && server.isActive && (
            <WarnBanner
              title="Editing the active server"
              message="Deposits, withdrawals, account creation and the live feed all use these settings. Test before saving."
            />
          )}

          <div>
            <FieldLabel required hint="Your own name for this profile, e.g. 'FuryHolding live – Nov 2026'">Name</FieldLabel>
            <TInput value={form.label} onChange={(v) => set('label', v)} />
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading pt-1">Gateway API</p>
          <FGroup cols={2}>
            <div className="col-span-full">
              <FieldLabel required>API URL</FieldLabel>
              <TInput value={form.baseUrl} onChange={(v) => set('baseUrl', v.trim())} placeholder="http://1.2.3.4:6969" mono />
            </div>
            <div>
              <FieldLabel required>API Username</FieldLabel>
              <TInput value={form.apiUsername} onChange={(v) => set('apiUsername', v)} mono />
            </div>
            <div>
              <FieldLabel required={!isEdit} hint={passwordHint}>API Password</FieldLabel>
              <TInput type="password" value={form.apiPassword} onChange={(v) => set('apiPassword', v)} placeholder={isEdit ? '••••••••' : ''} mono />
            </div>
          </FGroup>

          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading pt-1">MT5 Manager</p>
          <FGroup cols={2}>
            <div>
              <FieldLabel required>Manager ID</FieldLabel>
              <TInput value={form.managerId} onChange={(v) => set('managerId', v.replace(/\D/g, ''))} mono />
            </div>
            <div>
              <FieldLabel required={!isEdit} hint={passwordHint}>Manager Password</FieldLabel>
              <TInput type="password" value={form.managerPassword} onChange={(v) => set('managerPassword', v)} placeholder={isEdit ? '••••••••' : ''} mono />
            </div>
            <div>
              <FieldLabel required hint="MT5 server address the manager logs in to">Server IP / Host</FieldLabel>
              <TInput value={form.serverIp} onChange={(v) => set('serverIp', v.trim())} placeholder="1.2.3.4:443" mono />
            </div>
            <div>
              <FieldLabel required hint="Saved on new accounts and shown to clients">Server Name</FieldLabel>
              <TInput value={form.serverName} onChange={(v) => set('serverName', v)} placeholder="e.g. FuryHolding-Trade" />
            </div>
          </FGroup>

          <div>
            <FieldLabel hint="Leave blank to use the API URL with ws:// and /ws/accounts">Live Feed URL</FieldLabel>
            <TInput value={form.wsUrl} onChange={(v) => set('wsUrl', v.trim())} placeholder="ws://1.2.3.4:6969/ws/accounts" mono />
          </div>

          <div>
            <FieldLabel>Notes</FieldLabel>
            <TArea value={form.notes} onChange={(v) => set('notes', v)} rows={2} placeholder="e.g. why this server was added" />
          </div>

          <TestResult result={testResult} />
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex items-center justify-between gap-2">
          <Btn Icon={PlugZap} label="Test Connection" variant="cyan" onClick={handleTest} loading={testing} />
          <div className="flex gap-2">
            <Btn label="Cancel" onClick={onClose} />
            <Btn label={isEdit ? 'Save Changes' : 'Save Server'} variant="primary" onClick={handleSave} loading={saving} />
          </div>
        </div>
      </DrawerFooter>
    </>
  );
}

export default Mt5ServerDrawer;
