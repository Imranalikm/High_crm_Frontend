import React, { useEffect, useState } from 'react';
import { RefreshCw, Send, X, Mail, BellRing } from 'lucide-react';
import { Toggle } from './SettingsForm';
import { mt5ServersService } from '../services/mt5ServersService';
import { useMt5Health, setMt5Health } from '@/shared/hooks/useMt5Health';

const panelBorder = { borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' };
const innerBorder = { borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' };
const fmtTime = (t) => (t ? new Date(t).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROWS = [
  { key: 'api', name: 'Gateway API login', what: 'The CRM logging in to the gateway' },
  { key: 'manager', name: 'MT5 manager login', what: 'The gateway logging in to MT5' },
];

function StatusRow({ row, comp, blockedByApi }) {
  const status = blockedByApi ? 'blocked' : comp?.status || 'unknown';
  const color = { ok: 'var(--positive)', down: 'var(--negative)', blocked: 'var(--text-muted)', unknown: 'var(--text-muted)' }[status];
  const label = {
    ok: 'Working',
    down: `Failing since ${fmtTime(comp?.since)}`,
    blocked: "Can't check while the gateway is down",
    unknown: 'Not checked yet',
  }[status];
  const sub = status === 'down'
    ? comp?.lastError
    : comp?.lastOkAt ? `Last worked ${fmtTime(comp.lastOkAt)}` : row.what;

  return (
    <li className="flex items-start gap-3 px-5 py-3.5">
      <span className="relative mt-[5px] flex h-2.5 w-2.5 shrink-0">
        {status === 'down' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none" style={{ background: color }} />}
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: color, opacity: status === 'unknown' || status === 'blocked' ? 0.45 : 1 }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text font-heading">{row.name}</p>
        <p className={`truncate text-[12px] ${status === 'down' ? 'font-mono text-[11.5px]' : 'font-heading'} text-text-muted/65`} title={sub || ''}>{sub}</p>
      </div>
      <span className="shrink-0 text-[12px] font-medium font-heading" style={{ color }}>{label}</span>
    </li>
  );
}

/**
 * "Failure alerts": live health of the gateway API + manager login, and who gets emailed.
 * Admins also get an in-app notification, plus a red banner with an alarm sound on every page.
 */
export function Mt5AlertsPanel({ canEdit, onToast, onError }) {
  const live = useMt5Health();
  const [loaded, setLoaded] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState('');
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    mt5ServersService.health()
      .then((data) => {
        if (cancelled || !data) return;
        const { alerts: a, ...health } = data;
        setLoaded(health);
        setAlerts(a);
      })
      .catch((err) => { if (!cancelled) onError?.(err, 'Failed to load the connection status.'); });
    return () => { cancelled = true; };
  }, [onError]);

  const health = live || loaded;
  const comps = health?.components || {};
  const apiDown = comps.api?.status === 'down';

  const checkNow = async () => {
    setChecking(true);
    try {
      const data = await mt5ServersService.checkHealth();
      if (data) {
        const { alerts: a, ...h } = data;
        setLoaded(h);
        setMt5Health(h);
        setAlerts(a);
        const failing = ['api', 'manager'].filter((k) => h.components?.[k]?.status === 'down');
        onToast?.(failing.length ? 'Checked: the connection is still failing.' : 'Checked: gateway and manager login both work.');
      }
    } catch (err) {
      onError?.(err, 'The check could not run.');
    } finally {
      setChecking(false);
    }
  };

  const saveAlerts = async (payload, message) => {
    setSaving(true);
    try {
      setAlerts(await mt5ServersService.updateAlerts(payload));
      if (message) onToast?.(message);
      return true;
    } catch (err) {
      onError?.(err, 'Failed to save alert settings.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addEmail = async (e) => {
    e.preventDefault();
    const email = draft.trim().toLowerCase();
    if (!email) return;
    if (!EMAIL_RE.test(email)) {
      setDraftError('Enter a full email address, like ops@company.com.');
      return;
    }
    if (alerts.emails.includes(email)) {
      setDraftError('That address is already on the list.');
      return;
    }
    setDraftError('');
    if (await saveAlerts({ emails: [...alerts.emails, email] }, `${email} will get failure alerts.`)) setDraft('');
  };

  const removeEmail = (email) => saveAlerts({ emails: alerts.emails.filter((x) => x !== email) }, `${email} removed from failure alerts.`);

  const sendTest = async () => {
    setSending(true);
    try {
      const res = await mt5ServersService.testAlert();
      onToast?.(res?.message || 'Test alert sent.');
    } catch (err) {
      onError?.(err, 'The test email could not be sent.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-label="Failure alerts" className="rounded-[14px] border bg-surface-elevated/40" style={panelBorder}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <h2 className="text-[14px] font-semibold text-text font-heading">Failure alerts</h2>
          <p className="max-w-[70ch] text-[12px] text-text-muted/60 font-heading">
            The CRM checks both logins every 5 minutes, and straight away when an MT5 call fails.
            {health?.checkedAt ? ` Last check ${fmtTime(health.checkedAt)}.` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={checkNow}
          disabled={checking || health?.probing}
          className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border px-3 py-2 text-[12.5px] font-semibold text-text transition-colors hover:bg-muted-surface focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 disabled:opacity-50 font-heading"
          style={panelBorder}
        >
          <RefreshCw size={13} className={checking || health?.probing ? 'animate-spin motion-reduce:animate-none' : ''} />
          {checking || health?.probing ? 'Checking…' : 'Check now'}
        </button>
      </div>

      <ul className="divide-y divide-border/40 border-t" style={innerBorder}>
        {ROWS.map((row) => (
          <StatusRow key={row.key} row={row} comp={comps[row.key]} blockedByApi={row.key === 'manager' && apiDown} />
        ))}
      </ul>

      <div className="grid gap-5 border-t px-5 py-5 lg:grid-cols-2" style={innerBorder}>
        {/* Email */}
        <div>
          <div className="flex items-start gap-3">
            <Toggle
              val={Boolean(alerts?.emailEnabled)}
              onChange={(v) => saveAlerts({ emailEnabled: v }, v ? 'Failure emails turned on.' : 'Failure emails turned off.')}
              disabled={!canEdit || !alerts || saving}
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-text font-heading">
                <Mail size={13} className="text-text-muted" /> Email when a login fails
              </p>
              <p className="text-[12px] text-text-muted/60 font-heading">One email when it starts failing, another when it works again.</p>
            </div>
          </div>

          {alerts && (
            <div className="mt-4 pl-[52px]">
              {alerts.emails.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {alerts.emails.map((email) => (
                    <li
                      key={email}
                      className="flex items-center gap-1 rounded-full border py-1 pr-1 pl-2.5 font-mono text-[11.5px] text-text"
                      style={panelBorder}
                    >
                      {email}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => removeEmail(email)}
                          disabled={saving}
                          aria-label={`Remove ${email}`}
                          className="cursor-pointer rounded-full p-0.5 text-text-muted/60 hover:bg-negative/10 hover:text-negative focus-visible:outline focus-visible:outline-1 focus-visible:outline-negative/60"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-text-muted/70 font-heading">
                  No addresses added, so every Super Admin gets it
                  {alerts.recipients.length ? <>: <span className="font-mono text-[11.5px] text-text">{alerts.recipients.join(', ')}</span></> : '.'}
                </p>
              )}

              {canEdit && (
                <>
                  <form onSubmit={addEmail} className="mt-3 flex gap-2">
                    <input
                      type="email"
                      value={draft}
                      onChange={(e) => { setDraft(e.target.value); setDraftError(''); }}
                      placeholder="Add an email, e.g. ops@company.com"
                      aria-label="Alert email address"
                      className="h-9 min-w-0 flex-1 rounded-[8px] border border-border/30 bg-bg px-3 font-mono text-[12.5px] text-text outline-none placeholder:font-heading placeholder:text-text-muted/35 focus:border-brand/40"
                    />
                    <button
                      type="submit"
                      disabled={saving || !draft.trim()}
                      className="cursor-pointer rounded-[8px] border px-3 text-[12.5px] font-semibold text-text transition-colors hover:bg-muted-surface focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 disabled:opacity-40 font-heading"
                      style={panelBorder}
                    >
                      Add
                    </button>
                  </form>
                  {draftError && <p className="mt-1.5 text-[11.5px] text-negative font-heading">{draftError}</p>}
                  <button
                    type="button"
                    onClick={sendTest}
                    disabled={sending || !alerts.recipients.length}
                    className="mt-3 flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-brand hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 disabled:opacity-50 font-heading"
                  >
                    <Send size={12} /> {sending ? 'Sending…' : 'Send a test email'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* In-app */}
        <div className="flex items-start gap-3 rounded-[10px] border px-4 py-3.5 lg:self-start" style={innerBorder}>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in srgb, var(--negative) 14%, transparent)', color: 'var(--negative)' }}
          >
            <BellRing size={15} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-text font-heading">In-app alarm</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-text-muted/65 font-heading">
              While a login is failing, every admin sees a red bar at the top of each page with an alarm sound that repeats every
              2 minutes until someone acknowledges it. It also lands in the notification bell. Each admin can mute the sound
              in their own browser from the bar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mt5AlertsPanel;
