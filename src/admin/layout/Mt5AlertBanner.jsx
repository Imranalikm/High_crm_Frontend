import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Volume2, VolumeX, Check } from 'lucide-react';
import { useMt5Health } from '@/shared/hooks/useMt5Health';
import { playAlarm, unlockAlarmSound } from '@/shared/utils/alarmSound';

const REPEAT_MS = 2 * 60 * 1000;
const MUTE_KEY = 'mt5AlarmMuted';
const ACK_KEY = 'mt5AlarmAcked';

const fmtTime = (t) => new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const COPY = {
  api: {
    title: 'MT5 gateway API is failing',
    impact: "The CRM can't log in to the gateway, so deposits, withdrawals, balance operations and new accounts will fail.",
  },
  manager: {
    title: 'MT5 manager login is failing',
    impact: "The gateway can't log in to MT5, so deposits, withdrawals, balance operations and new accounts will fail.",
  },
};

/**
 * Red bar across every admin page while the MT5 gateway API or manager login is down.
 * Plays an alarm when it starts and every 2 minutes until someone acknowledges it.
 */
export function Mt5AlertBanner() {
  const health = useMt5Health();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(() => localStorage.getItem(MUTE_KEY) === '1');
  const [acked, setAcked] = useState(() => sessionStorage.getItem(ACK_KEY) || '');

  useEffect(() => { unlockAlarmSound(); }, []);

  // The gateway being down hides the manager state, so it takes priority
  const comps = health?.components || {};
  const failing = ['api', 'manager'].find((c) => comps[c]?.status === 'down');
  const incident = failing ? `${health.server?.id ?? 'env'}:${failing}:${comps[failing].since}` : '';
  const isAcked = Boolean(incident) && acked === incident;

  useEffect(() => {
    if (!incident || isAcked || muted) return undefined;
    playAlarm();
    const t = setInterval(playAlarm, REPEAT_MS);
    return () => clearInterval(t);
  }, [incident, isAcked, muted]);

  if (!failing) return null;

  const c = comps[failing];
  const copy = COPY[failing];

  const acknowledge = () => {
    sessionStorage.setItem(ACK_KEY, incident);
    setAcked(incident);
  };
  const toggleMute = () => {
    const next = !muted;
    localStorage.setItem(MUTE_KEY, next ? '1' : '0');
    setMuted(next);
  };

  return (
    <div
      role="alert"
      className="sticky top-14 z-30 border-b px-4 py-2.5 md:px-8"
      style={{
        background: 'color-mix(in srgb, var(--negative) 13%, var(--surface-2))',
        borderColor: 'color-mix(in srgb, var(--negative) 40%, transparent)',
      }}
    >
      <div className="mx-auto flex max-w-[1720px] flex-wrap items-center gap-x-4 gap-y-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'color-mix(in srgb, var(--negative) 22%, transparent)', color: 'var(--negative)' }}
        >
          <AlertTriangle size={16} className={isAcked ? '' : 'animate-pulse motion-reduce:animate-none'} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-text font-heading">
            {copy.title}
            <span className="ml-2 font-normal text-text-muted">
              since {fmtTime(c.since)}{health.server?.label ? ` on ${health.server.label}` : ''}
            </span>
          </p>
          <p className="text-[12px] text-text-muted/80 font-heading">
            {copy.impact}
            {c.lastError && <span className="ml-1.5 font-mono text-[11.5px] text-text-muted/70">{c.lastError}</span>}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Turn alarm sound on' : 'Mute alarm sound'}
            title={muted ? 'Alarm sound is off in this browser' : 'Mute alarm sound in this browser'}
            className="cursor-pointer rounded-[8px] p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          {isAcked ? (
            <span className="flex items-center gap-1 px-2 text-[12px] text-text-muted font-heading">
              <Check size={13} /> Acknowledged
            </span>
          ) : (
            <button
              type="button"
              onClick={acknowledge}
              className="cursor-pointer rounded-[8px] px-3 py-1.5 text-[12.5px] font-medium text-text transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 font-heading"
            >
              Acknowledge
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin/settings/mt5-servers')}
            className="cursor-pointer rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-negative/60 font-heading"
            style={{ background: 'var(--negative)' }}
          >
            Open MT5 servers
          </button>
        </div>
      </div>
    </div>
  );
}

export default Mt5AlertBanner;
