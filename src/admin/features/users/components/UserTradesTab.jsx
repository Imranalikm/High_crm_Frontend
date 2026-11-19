import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { apiClient } from '@/shared/api/client/apiClient';
import { useLiveMt5Positions } from '@/shared/hooks/useLiveMt5Positions';

const RANGES = [
  [7, '7D'],
  [30, '30D'],
  [90, '90D'],
  [365, '1Y'],
];

const ymd = (d) => d.toISOString().slice(0, 10);
const num = (v) => Number(v) || 0;
const money = (n) => {
  const v = num(n);
  return `${v < 0 ? '-' : ''}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const signed = (n) => `${num(n) > 0 ? '+' : ''}${money(n)}`;
const pnlColor = (n) => (num(n) > 0 ? 'var(--positive)' : num(n) < 0 ? 'var(--negative)' : 'var(--text-muted)');
const fmtTime = (t) => (t ? new Date(t).toLocaleString() : '—');
const fmtPrice = (p) => (p == null || p === '' ? '—' : String(Number(p)));

function Tile({ label, value, sub, color = 'var(--text)' }) {
  return (
    <div className="rounded-[9px] border border-border/15 bg-surface-elevated px-3.5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/75">{label}</p>
      <p className="font-mono text-[15px] font-bold mt-1" style={{ color }}>{value}</p>
      {sub && <p className="text-[10.5px] text-text-muted/60 mt-0.5">{sub}</p>}
    </div>
  );
}

function SideBadge({ side }) {
  const buy = side === 'BUY';
  return (
    <span className={`inline-flex h-6 w-11 items-center justify-center rounded-[5px] border text-[10.5px] font-bold uppercase
      ${buy ? 'border-positive/20 bg-positive/8 text-positive' : 'border-negative/20 bg-negative/8 text-negative'}`}>
      {side}
    </span>
  );
}

const th = 'px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted/70 whitespace-nowrap';
const td = 'px-3.5 py-2.5 whitespace-nowrap';

/**
 * Admin › User detail › Trades tab. Read-only MT5 data for one client:
 * live open positions (positions feed) and closed trades (gateway history).
 */
export function UserTradesTab({ user }) {
  const userId = user?.id || user?.uid;
  const { positions, feedConnected, ready } = useLiveMt5Positions();
  const [logins, setLogins] = useState(null);
  const [days, setDays] = useState(30);
  const [history, setHistory] = useState({ key: null, trades: [], error: '' });

  // The client's MT5 logins (to pick their positions from the live feed)
  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    apiClient.get(`/mt5-accounts?userId=${userId}`)
      .then((res) => {
        if (!active) return;
        const rows = (res?.data || []).filter((a) => String(a.userId) === String(userId) && a.accountid && !String(a.accountid).startsWith('PENDING-'));
        setLogins(new Set(rows.map((a) => String(a.accountid))));
      })
      .catch(() => { if (active) setLogins(new Set()); });
    return () => { active = false; };
  }, [userId]);

  // Closed trades for the selected range
  const historyKey = `${userId}:${days}`;
  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    apiClient.get(`/mt5-accounts/history/trades?userId=${userId}&from=${ymd(from)}&to=${ymd(to)}`)
      .then((res) => {
        if (!active) return;
        // Server filters by userId; filter again in case an older backend ignores it
        const trades = (res?.data || []).filter((t) => t.userId == null || String(t.userId) === String(userId));
        setHistory({ key: historyKey, trades, error: '' });
      })
      .catch((err) => { if (active) setHistory({ key: historyKey, trades: [], error: err?.message || 'Failed to load trade history from MT5.' }); });
    return () => { active = false; };
  }, [userId, days, historyKey]);

  const historyLoading = history.key !== historyKey;
  const trades = history.trades;

  const open = useMemo(() => (logins ? positions.filter((p) => logins.has(String(p.login))) : [])
    .sort((a, b) => new Date(b.time) - new Date(a.time)), [positions, logins]);

  const stats = useMemo(() => {
    const floating = open.reduce((s, p) => s + num(p.profit), 0);
    const usdTrades = trades.filter((t) => t.profitUsd != null);
    const realized = usdTrades.reduce((s, t) => s + num(t.profitUsd), 0);
    const wins = trades.filter((t) => num(t.profitUsd ?? t.profit) > 0).length;
    const lots = trades.reduce((s, t) => s + num(t.lots), 0);
    return {
      floating,
      realized,
      nonUsd: trades.length - usdTrades.length,
      winRate: trades.length ? Math.round((wins / trades.length) * 100) : null,
      lots,
    };
  }, [open, trades]);

  const positionsLoading = !logins || !ready;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
        <Tile label="Open Positions" value={positionsLoading ? '…' : open.length} sub={feedConnected === false ? 'feed offline' : 'live'} />
        <Tile label="Floating P&L" value={positionsLoading ? '…' : signed(stats.floating)} color={pnlColor(stats.floating)} sub="open positions" />
        <Tile label="Closed Trades" value={historyLoading ? '…' : trades.length} sub={`last ${RANGES.find(([d]) => d === days)?.[1]}`} />
        <Tile label="Realized P&L" value={historyLoading ? '…' : signed(stats.realized)} color={pnlColor(stats.realized)}
          sub={stats.nonUsd ? `USD only · ${stats.nonUsd} non-USD excluded` : 'USD'} />
        <Tile label="Win Rate" value={historyLoading || stats.winRate == null ? '—' : `${stats.winRate}%`} sub="closed trades" />
        <Tile label="Volume" value={historyLoading ? '…' : `${stats.lots.toFixed(2)} lots`} sub="closed trades" />
      </div>

      {/* Open positions */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted/75">Open Positions</p>
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted/70">
            <span className={`h-1.5 w-1.5 rounded-full ${feedConnected ? 'bg-positive animate-pulse' : 'bg-text-muted/40'}`} />
            {feedConnected ? 'Live from MT5' : feedConnected === false ? 'Feed offline' : 'Connecting…'}
          </span>
        </div>
        <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-x-auto">
          {positionsLoading ? (
            <div className="p-6 text-center text-[12px] text-text-muted/60">Loading positions…</div>
          ) : open.length === 0 ? (
            <div className="p-6 text-center text-[12px] text-text-muted/60 italic">No open positions.</div>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border/15 text-left">
                  <th className={th}>Position</th><th className={th}>Account</th><th className={th}>Side</th><th className={th}>Symbol</th>
                  <th className={`${th} text-right`}>Lots</th><th className={`${th} text-right`}>Open</th><th className={`${th} text-right`}>Current</th>
                  <th className={`${th} text-right`}>SL / TP</th><th className={`${th} text-right`}>P&L</th><th className={th}>Opened</th>
                </tr>
              </thead>
              <tbody>
                {open.map((p) => (
                  <tr key={p.positionId} className="border-b border-border/10 last:border-0 hover:bg-bg/30">
                    <td className={`${td} font-mono text-text-muted/80`}>#{p.positionId}</td>
                    <td className={`${td} font-mono text-text`}>#{p.login}</td>
                    <td className={td}><SideBadge side={p.side} /></td>
                    <td className={`${td} font-semibold text-text`}>{p.symbol}</td>
                    <td className={`${td} text-right font-mono`}>{num(p.lots).toFixed(2)}</td>
                    <td className={`${td} text-right font-mono text-text-muted/85`}>{fmtPrice(p.priceOpen)}</td>
                    <td className={`${td} text-right font-mono text-text`}>{fmtPrice(p.priceCurrent)}</td>
                    <td className={`${td} text-right font-mono text-text-muted/70`}>{num(p.stopLoss) ? fmtPrice(p.stopLoss) : '—'} / {num(p.takeProfit) ? fmtPrice(p.takeProfit) : '—'}</td>
                    <td className={`${td} text-right font-mono font-bold`} style={{ color: pnlColor(p.profit) }}>{signed(p.profit)}</td>
                    <td className={`${td} font-mono text-text-muted/70`}>{fmtTime(p.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Closed trades */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted/75">Closed Trades</p>
          <div className="flex gap-1.5">
            {RANGES.map(([d, label]) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border transition-all cursor-pointer ${
                  days === d ? 'bg-brand text-text-on-accent border-brand/30' : 'bg-surface-elevated border-border/20 text-text-muted/80 hover:text-text'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {history.error && (
          <div className="mb-2.5 flex items-center gap-2 p-3 rounded-[8px] bg-negative/10 border border-negative/20 text-negative text-[12px] font-semibold">
            <AlertTriangle size={14} /> {history.error}
          </div>
        )}

        <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-x-auto max-h-[520px] overflow-y-auto">
          {historyLoading ? (
            <div className="p-6 text-center text-[12px] text-text-muted/60">Loading trade history from MT5…</div>
          ) : trades.length === 0 ? (
            <div className="p-6 text-center text-[12px] text-text-muted/60 italic">No closed trades in this period.</div>
          ) : (
            <table className="w-full text-[12px]">
              <thead className="sticky top-0 bg-surface-elevated">
                <tr className="border-b border-border/15 text-left">
                  <th className={th}>Position</th><th className={th}>Account</th><th className={th}>Side</th><th className={th}>Symbol</th>
                  <th className={`${th} text-right`}>Lots</th><th className={`${th} text-right`}>Open → Close</th>
                  <th className={`${th} text-right`}>P&L</th><th className={th}>Opened</th><th className={th}>Closed</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => {
                  const usd = t.profitUsd != null;
                  const value = usd ? t.profitUsd : t.profit;
                  return (
                    <tr key={t.positionId} className="border-b border-border/10 last:border-0 hover:bg-bg/30">
                      <td className={`${td} font-mono text-text-muted/80`}>#{t.positionId}{t.partialClose && <span className="ml-1 text-[9.5px] text-warning font-bold">PARTIAL</span>}</td>
                      <td className={`${td} font-mono text-text`}>#{t.login}</td>
                      <td className={td}><SideBadge side={t.side} /></td>
                      <td className={`${td} font-semibold text-text`}>{t.symbol}</td>
                      <td className={`${td} text-right font-mono`}>{num(t.lots).toFixed(2)}</td>
                      <td className={`${td} text-right font-mono text-text-muted/80`}>{fmtPrice(t.openPrice)} → {fmtPrice(t.closePrice)}</td>
                      <td className={`${td} text-right font-mono font-bold`} style={{ color: pnlColor(value) }}>
                        {value == null ? '—' : usd ? signed(value) : `${num(value) > 0 ? '+' : ''}${num(value).toLocaleString()} ${t.profitCurrency || ''}`}
                      </td>
                      <td className={`${td} font-mono text-text-muted/70`}>{fmtTime(t.openTime)}</td>
                      <td className={`${td} font-mono text-text-muted/70`}>{fmtTime(t.closeTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-[10.5px] text-text-muted/55 mt-2">P&L is calculated from prices and contract size; commission and swap are not included.</p>
      </div>
    </div>
  );
}
