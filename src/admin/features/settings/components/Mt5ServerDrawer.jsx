import React, { useState } from 'react';
import { PlugZap, Eye, EyeOff } from 'lucide-react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { TInput, TArea, WarnBanner, Btn } from './SettingsForm';
import { ConnectionPath } from './ConnectionPath';

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

function Label({ children, required, hint }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-[12.5px] font-medium text-text/90 font-heading">
        {children}
        {required && <span className="ml-0.5 text-negative" aria-hidden>*</span>}
      </span>
      {hint && <span className="truncate text-[11px] text-text-muted/50 font-heading">{hint}</span>}
    </div>
  );
}

function Group({ title, desc, children }) {
  return (
    <fieldset>
      <legend className="text-[13.5px] font-semibold text-text font-heading">{title}</legend>
      {desc && <p className="mt-0.5 text-[12px] text-text-muted/60 font-heading">{desc}</p>}
      <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      {/* suffix reserves right padding so the eye button never covers the text */}
      <TInput type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} mono suffix=" " />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-[6px] p-1.5 text-text-muted/50 hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60"
      >
        {show ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </div>
  );
}

/**
 * Add / edit an MT5 server profile. Passwords are never loaded back; leaving them blank keeps the saved ones.
 * `session` changes every time the drawer opens so the form starts fresh.
 */
export function Mt5ServerDrawer({ open, session, server, onClose, onSubmit, onTest }) {
  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[640px]">
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
    setTestResult(null); // a result only describes the values it was run with
  };

  const payload = () => ({ ...form, serverId: server?.id });

  const handleTest = async () => {
    setError('');
    setTesting(true);
    try {
      setTestResult(await onTest(payload()));
    } catch (err) {
      setTestResult(null);
      setError(err.message || 'The test could not run.');
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
      setError(err.message || 'Failed to save the server.');
      setSaving(false);
    }
  };

  const keepHint = isEdit ? 'Leave blank to keep the saved one' : undefined;
  const pathServer = {
    baseUrl: form.baseUrl,
    managerId: form.managerId,
    serverIp: form.serverIp,
  };

  return (
    <>
      <DrawerHeader
        title={isEdit ? 'Edit server' : 'Add server'}
        subtitle={isEdit
          ? server.label
          : 'Saving does not switch servers. Switch to it from the list when you are ready.'}
        onClose={onClose}
      />
      <DrawerBody>
        <div className="space-y-7">
          {isEdit && server.isActive && (
            <WarnBanner
              title="This is the active server"
              message="Deposits, withdrawals, new accounts and the live feed use these settings. Saved changes apply straight away, so test first."
            />
          )}
          {error && <WarnBanner title="Check this before saving" message={error} severity="danger" />}

          <div>
            <Label required hint="Only admins see this">Name</Label>
            <TInput value={form.label} onChange={(v) => set('label', v)} placeholder="e.g. FuryHolding live, Nov 2026" />
          </div>

          <Group title="Gateway API" desc="The REST gateway the CRM logs in to.">
            <div className="sm:col-span-2">
              <Label required>API URL</Label>
              <TInput value={form.baseUrl} onChange={(v) => set('baseUrl', v.trim())} placeholder="http://1.2.3.4:6969" mono />
            </div>
            <div>
              <Label required>Username</Label>
              <TInput value={form.apiUsername} onChange={(v) => set('apiUsername', v)} mono />
            </div>
            <div>
              <Label required={!isEdit} hint={keepHint}>Password</Label>
              <PasswordInput value={form.apiPassword} onChange={(v) => set('apiPassword', v)} placeholder={isEdit ? 'Saved' : ''} />
            </div>
          </Group>

          <Group title="MT5 manager" desc="The manager account the gateway uses on the MT5 server.">
            <div>
              <Label required>Manager ID</Label>
              <TInput value={form.managerId} onChange={(v) => set('managerId', v.replace(/\D/g, ''))} mono />
            </div>
            <div>
              <Label required={!isEdit} hint={keepHint}>Manager password</Label>
              <PasswordInput value={form.managerPassword} onChange={(v) => set('managerPassword', v)} placeholder={isEdit ? 'Saved' : ''} />
            </div>
            <div className="sm:col-span-2">
              <Label required>MT5 server address</Label>
              <TInput value={form.serverIp} onChange={(v) => set('serverIp', v.trim())} placeholder="1.2.3.4:443" mono />
            </div>
          </Group>

          <Group title="What clients see">
            <div className="sm:col-span-2">
              <Label required hint="Saved on new accounts and in credential emails">Server name</Label>
              <TInput value={form.serverName} onChange={(v) => set('serverName', v)} placeholder="e.g. FuryHolding-Trade" />
            </div>
          </Group>

          <Group title="Live feed" desc="Streams balances and positions to the CRM in real time.">
            <div className="sm:col-span-2">
              <Label hint="Blank uses the API URL with ws:// and /ws/accounts">Feed URL</Label>
              <TInput value={form.wsUrl} onChange={(v) => set('wsUrl', v.trim())} placeholder="ws://1.2.3.4:6969/ws/accounts" mono />
            </div>
          </Group>

          <div>
            <Label hint="Optional">Notes</Label>
            <TArea value={form.notes} onChange={(v) => set('notes', v)} rows={2} placeholder="e.g. Broker migration, ticket #1234" />
          </div>

          {(testing || testResult) && (
            <div className="rounded-[12px] border px-4 py-4" style={{ borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }}>
              <p className="mb-3.5 text-[13px] font-semibold text-text font-heading">Connection test</p>
              <ConnectionPath server={pathServer} result={testResult} testing={testing} showFeed={false} />
              {testResult && !testing && (
                <p className="mt-3.5 text-[12px] font-heading" style={{ color: testResult.ok ? 'var(--positive)' : 'var(--negative)' }}>
                  {testResult.message} <span className="text-text-muted/50">({testResult.ms} ms)</span>
                </p>
              )}
            </div>
          )}
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex items-center justify-between gap-2">
          <Btn Icon={PlugZap} label={testing ? 'Testing…' : 'Test connection'} variant="cyan" onClick={handleTest} disabled={testing} />
          <div className="flex gap-2">
            <Btn label="Cancel" onClick={onClose} />
            <Btn label={isEdit ? 'Save changes' : 'Add server'} variant="primary" onClick={handleSave} loading={saving} />
          </div>
        </div>
      </DrawerFooter>
    </>
  );
}

export default Mt5ServerDrawer;
