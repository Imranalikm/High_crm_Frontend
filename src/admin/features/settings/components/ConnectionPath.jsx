import React from 'react';
import { Globe, KeyRound, Radio, Check, X, Loader2 } from 'lucide-react';

const COLORS = {
  idle: 'var(--text-muted)',
  pending: 'var(--cyan)',
  ok: 'var(--positive)',
  fail: 'var(--negative)',
  skipped: 'var(--text-muted)',
};

function Node({ icon, title, address, state, text }) {
  const Icon = icon;
  const color = COLORS[state];
  const StateIcon = state === 'ok' ? Check : state === 'fail' ? X : state === 'pending' ? Loader2 : null;
  return (
    <div className="relative z-[1] min-w-0 flex-1">
      <div className="flex items-center gap-2.5">
        <span
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-surface-elevated"
          style={{ borderColor: `color-mix(in srgb, ${color} ${state === 'idle' || state === 'skipped' ? 30 : 55}%, transparent)`, color }}
        >
          <Icon size={15} />
          {StateIcon && (
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white"
              style={{ background: color }}
            >
              <StateIcon size={10} strokeWidth={3} className={state === 'pending' ? 'animate-spin motion-reduce:animate-none' : ''} />
            </span>
          )}
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-text font-heading">{title}</p>
          <p className="text-[11.5px] font-heading" style={{ color: state === 'idle' || state === 'skipped' ? 'var(--text-muted)' : color }}>
            {text}
          </p>
        </div>
      </div>
      <p className="mt-2 truncate pl-[46px] font-mono text-[11.5px] text-text-muted/70" title={address}>{address || '—'}</p>
    </div>
  );
}

/**
 * The route every MT5 call takes: gateway API login → MT5 manager login, plus the live feed.
 * `result` is a connection test result ({ tokenOk, managerOk }); `testing` shows progress;
 * `feedConnected` (true/false/null) is the live feed status, only meaningful for the active server.
 */
export function ConnectionPath({ server, result, testing, feedConnected, showFeed = true }) {
  const gateway = testing ? 'pending' : result ? (result.tokenOk ? 'ok' : 'fail') : 'idle';
  const manager = testing ? 'pending' : result ? (result.tokenOk ? (result.managerOk ? 'ok' : 'fail') : 'skipped') : 'idle';
  const feed = feedConnected === true ? 'ok' : feedConnected === false ? 'fail' : 'idle';

  const text = {
    idle: 'Not tested yet',
    pending: 'Testing…',
    ok: 'Login works',
    fail: 'Login failed',
    skipped: 'Not reached',
  };

  const connector = (state) => (
    <span
      aria-hidden
      className="mx-1 mt-[18px] hidden h-px flex-[0_0_32px] sm:block"
      style={{
        background: state === 'ok' ? 'var(--positive)' : state === 'fail' ? 'var(--negative)' : 'color-mix(in srgb, var(--border) 90%, transparent)',
      }}
    />
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Node icon={Globe} title="Gateway API" address={server.baseUrl} state={gateway} text={text[gateway]} />
      {connector(gateway)}
      <Node
        icon={KeyRound}
        title={`Manager ${server.managerId || ''}`.trim()}
        address={server.serverIp}
        state={manager}
        text={text[manager]}
      />
      {showFeed && (
        <>
          {connector(feed)}
          <Node
            icon={Radio}
            title="Live feed"
            address={server.effectiveWsUrl || server.wsUrl}
            state={feed}
            text={feedConnected === true ? 'Streaming' : feedConnected === false ? 'Disconnected' : 'Waiting for status'}
          />
        </>
      )}
    </div>
  );
}

export default ConnectionPath;
