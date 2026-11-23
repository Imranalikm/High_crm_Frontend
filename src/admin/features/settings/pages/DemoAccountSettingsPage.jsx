import React, { useEffect, useMemo, useState } from 'react';
import { FlaskConical, CheckCircle2, EyeOff, RotateCcw } from 'lucide-react';
import { TInput, TSelect, Toggle, WarnBanner } from '../components/SettingsForm';
import { LEVERAGE_OPTIONS } from '../configs/trading.config';
import { demoSettingsService } from '../services/demoSettingsService';
import { mt5ServersService } from '../services/mt5ServersService';

const EMPTY_CONFIG = {
  enabled: true,
  mt5GroupName: '',
  initialBalance: '0',
  leverage: '1:100',
  cooldownHours: '24',
};

const BALANCE_PRESETS = [1000, 10000, 50000, 100000];
const LIMIT_PRESETS = [
  { hours: 0, label: 'No limit' },
  { hours: 24, label: '24 hours' },
  { hours: 72, label: '3 days' },
  { hours: 168, label: '7 days' },
];

const panelBorder = { borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' };
const money = (v) => `$${(Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Normalize API record into editable form values
function toForm(data) {
  if (!data) return EMPTY_CONFIG;
  return {
    enabled: Boolean(data.enabled),
    mt5GroupName: data.mt5GroupName || '',
    initialBalance: String(parseFloat(data.initialBalance) || 0),
    leverage: data.leverage || '1:100',
    cooldownHours: String(data.cooldownHours ?? 24),
  };
}

function limitText(hours) {
  const h = Number(hours);
  if (!Number.isFinite(h) || h <= 0) return 'No limit per email';
  if (h % 24 === 0) return `One per email every ${h / 24 === 1 ? '24 hours' : `${h / 24} days`}`;
  return `One per email every ${h} hours`;
}

// Mirrors the server rules
function validate(config) {
  if (!config.mt5GroupName.trim()) return 'Choose the MT5 group demo accounts are created in.';
  const balance = Number(config.initialBalance);
  if (!Number.isFinite(balance) || balance < 0 || balance > 10000000) return 'Starting balance must be between 0 and 10,000,000.';
  const hours = Number(config.cooldownHours);
  if (!Number.isInteger(hours) || hours < 0 || hours > 720) return 'The repeat limit must be a whole number of hours from 0 to 720.';
  return '';
}

/* ── Small building blocks ── */
function Label({ children, hint }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-[12.5px] font-medium text-text/90 font-heading">{children}</span>
      {hint && <span className="truncate text-[11px] text-text-muted/50 font-heading">{hint}</span>}
    </div>
  );
}

function Chips({ options, value, onChange, label, className = 'grid-cols-4' }) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-1.5 ${className}`}>
      {options.map((o) => {
        const active = String(value) === String(o.value);
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(String(o.value))}
            className={`cursor-pointer rounded-[8px] border px-2 py-2 text-[12.5px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 ${
              active ? 'font-semibold text-text' : 'text-text-muted hover:text-text'
            } ${o.mono ? 'font-mono' : 'font-heading'}`}
            style={{
              borderColor: active ? 'color-mix(in srgb, var(--brand) 55%, transparent)' : 'color-mix(in srgb, var(--border) 60%, transparent)',
              background: active ? 'color-mix(in srgb, var(--brand) 10%, transparent)' : 'transparent',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <section className="px-5 py-5">
      <h2 className="text-[14px] font-semibold text-text font-heading">{title}</h2>
      {desc && <p className="mt-0.5 text-[12px] text-text-muted/60 font-heading">{desc}</p>}
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

/* ── Live preview of the account a visitor receives ── */
function DemoAccountPreview({ config, serverName }) {
  const off = !config.enabled;
  return (
    <div className="lg:sticky lg:top-4">
      <p className="mb-2 text-[12px] text-text-muted/60 font-heading">What a visitor gets</p>
      <div className="relative overflow-hidden rounded-[14px] border bg-surface-elevated" style={panelBorder}>
        <div className={`transition-opacity ${off ? 'opacity-35' : ''}`}>
          <div className="flex items-center justify-between px-5 pt-5">
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold font-heading"
              style={{ background: 'color-mix(in srgb, var(--cyan) 12%, transparent)', color: 'var(--cyan)' }}
            >
              <FlaskConical size={12} /> Demo account
            </span>
            <span className="truncate pl-3 text-[12px] text-text-muted/70 font-heading" title="MT5 server name">
              {serverName || 'MT5'}
            </span>
          </div>

          <div className="px-5 pt-6 pb-5">
            <p className="text-[12px] text-text-muted/60 font-heading">Starting balance</p>
            <p
              className="mt-1 truncate text-[34px] font-semibold leading-none tracking-[-0.03em] text-text font-heading"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {money(config.initialBalance)}
            </p>
          </div>

          <dl className="grid grid-cols-2 border-t" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
            <div className="border-r px-5 py-3.5" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
              <dt className="text-[11px] text-text-muted/55 font-heading">Leverage</dt>
              <dd className="mt-0.5 font-mono text-[15px] font-semibold text-text">{config.leverage}</dd>
            </div>
            <div className="min-w-0 px-5 py-3.5">
              <dt className="text-[11px] text-text-muted/55 font-heading">MT5 group</dt>
              <dd className="mt-0.5 truncate font-mono text-[12.5px] text-text" title={config.mt5GroupName}>
                {config.mt5GroupName || <span className="text-text-muted/40">Not set</span>}
              </dd>
            </div>
          </dl>

          <p className="border-t px-5 py-3.5 text-[12px] text-text-muted/70 font-heading" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
            {limitText(config.cooldownHours)}. Login details are emailed to the visitor.
          </p>
        </div>

        {off && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <EyeOff size={18} className="text-text-muted" />
            <p className="text-[13px] font-semibold text-text font-heading">Demo sign-up is off</p>
            <p className="text-[12px] text-text-muted/70 font-heading">Visitors don't see the option on the login page.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DemoAccountSettingsPage — Configures the MT5 group, starting balance and leverage
 * used for instant demo accounts created from the login page. Persisted via API.
 */
export function DemoAccountSettingsPage() {
  const [saved, setSaved] = useState(EMPTY_CONFIG);
  const [config, setConfig] = useState(EMPTY_CONFIG);
  const [mt5Groups, setMt5Groups] = useState([]);
  const [serverName, setServerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([demoSettingsService.get(), demoSettingsService.listMt5Groups()])
      .then(([data, groups]) => {
        if (cancelled) return;
        const form = toForm(data);
        setSaved(form);
        setConfig(form);
        setMt5Groups(groups);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load demo account settings.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    // Server name for the preview only; the page works without it
    mt5ServersService.list()
      .then((list) => { if (!cancelled) setServerName(list.servers?.find((s) => s.isActive)?.serverName || ''); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const updateField = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const isDirty = useMemo(
    () => Object.keys(config).some((key) => String(config[key]) !== String(saved[key])),
    [config, saved]
  );

  // Always include the current group even if it isn't in the synced list
  const groupOptions = useMemo(() => {
    const list = [...mt5Groups];
    if (config.mt5GroupName && !list.includes(config.mt5GroupName)) list.unshift(config.mt5GroupName);
    return list;
  }, [mt5Groups, config.mt5GroupName]);

  const leverageOptions = useMemo(() => {
    const list = LEVERAGE_OPTIONS.includes(config.leverage) ? LEVERAGE_OPTIONS : [config.leverage, ...LEVERAGE_OPTIONS];
    return list.map((l) => ({ value: l, label: l, mono: true }));
  }, [config.leverage]);

  // Saves `next`; returns the saved form, or null on failure
  const save = async (next) => {
    const problem = validate(next);
    if (problem) {
      setError(problem);
      return null;
    }
    setError('');
    setSaving(true);
    try {
      const data = await demoSettingsService.update({
        enabled: next.enabled,
        mt5GroupName: next.mt5GroupName.trim(),
        initialBalance: Number(next.initialBalance),
        leverage: next.leverage,
        cooldownHours: Number(next.cooldownHours),
      });
      const form = toForm(data);
      setSaved(form);
      return form;
    } catch (err) {
      setError(err.message || 'Failed to save demo account settings.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const form = await save(config);
    if (!form) return;
    setConfig(form);
    setToast({ id: Date.now(), text: 'Demo account settings saved.' });
  };

  // The on/off switch saves straight away (with the other saved values), and keeps any unsaved edits in the form
  const handleEnabled = async (value) => {
    const previous = config.enabled;
    updateField('enabled', value);
    const form = await save({ ...saved, enabled: value });
    if (form) {
      updateField('enabled', form.enabled);
      setToast({ id: Date.now(), text: value ? 'Visitors can now create demo accounts.' : 'Demo sign-up is turned off.' });
    } else {
      updateField('enabled', previous);
    }
  };

  const handleReset = () => {
    setError('');
    setConfig(saved);
  };

  return (
    <div className="space-y-5 pb-20">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-text font-heading">Demo accounts</h1>
        <p className="mt-1 max-w-[64ch] text-[13px] text-text-muted/65 font-heading">
          Visitors can open an instant MT5 demo account from the login page. These settings apply to every new one.
        </p>
      </header>

      {error && <WarnBanner title="Check this before saving" message={error} severity="danger" />}

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]" aria-busy="true">
          <div className="h-[460px] animate-pulse rounded-[14px] bg-muted-surface/55" />
          <div className="h-[300px] animate-pulse rounded-[14px] bg-muted-surface/45" />
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="divide-y divide-border/40 rounded-[14px] border bg-surface-elevated/40" style={panelBorder}>
            {/* Availability */}
            <div className="flex items-center gap-3.5 px-5 py-4">
              <Toggle val={config.enabled} onChange={handleEnabled} disabled={saving} />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-text font-heading">Offer demo accounts on the login page</p>
                <p className="text-[12px] text-text-muted/60 font-heading">
                  {config.enabled ? 'Visitors see a "Create demo account" option.' : 'The option is hidden from visitors.'} This switch saves straight away.
                </p>
              </div>
            </div>

            <Section title="Account setup" desc="What each new demo account starts with.">
              <div>
                <Label hint="Where new demo accounts are created">MT5 group</Label>
                {groupOptions.length > 0 ? (
                  <TSelect value={config.mt5GroupName} onChange={(v) => updateField('mt5GroupName', v)} options={groupOptions} />
                ) : (
                  <TInput value={config.mt5GroupName} onChange={(v) => updateField('mt5GroupName', v)} placeholder={'STL\\3492\\demo.grp1'} mono />
                )}
              </div>

              <div>
                <Label hint="0 means no starting funds">Starting balance</Label>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,180px)_1fr]">
                  <TInput type="number" value={config.initialBalance} onChange={(v) => updateField('initialBalance', v)} mono suffix="USD" />
                  <Chips
                    label="Starting balance presets"
                    value={config.initialBalance}
                    onChange={(v) => updateField('initialBalance', v)}
                    options={BALANCE_PRESETS.map((n) => ({ value: n, label: `$${n.toLocaleString()}` }))}
                  />
                </div>
              </div>

              <div>
                <Label>Leverage</Label>
                <Chips
                  label="Leverage"
                  className="grid-cols-4 sm:grid-cols-8"
                  value={config.leverage}
                  onChange={(v) => updateField('leverage', v)}
                  options={leverageOptions}
                />
              </div>
            </Section>

            <Section title="Repeat limit" desc="Stops the same email from opening demo accounts over and over.">
              <div className="grid gap-2 sm:grid-cols-[1fr_minmax(0,160px)]">
                <Chips
                  label="Repeat limit"
                  value={config.cooldownHours}
                  onChange={(v) => updateField('cooldownHours', v)}
                  options={LIMIT_PRESETS.map((p) => ({ value: p.hours, label: p.label }))}
                />
                <TInput type="number" value={config.cooldownHours} onChange={(v) => updateField('cooldownHours', v)} mono suffix="HOURS" />
              </div>
            </Section>
          </div>

          <DemoAccountPreview config={config} serverName={serverName} />
        </div>
      )}

      {/* Save bar: only while there are unsaved changes */}
      {isDirty && !loading && (
        <div className="sticky bottom-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none">
          <div
            className="flex flex-wrap items-center gap-3 rounded-[12px] border bg-surface-elevated px-4 py-3 shadow-lg"
            style={{ borderColor: 'color-mix(in srgb, var(--brand) 35%, transparent)' }}
          >
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            <p className="flex-1 text-[13px] font-medium text-text font-heading">You have unsaved changes</p>
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] px-3 py-2 text-[12.5px] font-medium text-text-muted transition-colors hover:bg-muted-surface hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 disabled:opacity-50 font-heading"
            >
              <RotateCcw size={13} /> Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer rounded-[8px] bg-brand px-4 py-2 text-[12.5px] font-semibold text-text-on-accent transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand/60 disabled:opacity-60 font-heading"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 right-6 z-[150] flex max-w-[360px] items-center gap-2.5 rounded-[10px] border bg-surface-elevated px-4 py-3 text-[12.5px] text-text shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none font-heading"
          style={{ borderColor: 'color-mix(in srgb, var(--positive) 30%, transparent)' }}
        >
          <CheckCircle2 size={15} className="shrink-0 text-positive" />
          {toast.text}
        </div>
      )}
    </div>
  );
}

export default DemoAccountSettingsPage;
