import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

/* ─── Static initial logs ────────────────────────────────────── */
const INITIAL_LOGS = [
  { id: 1, ts: '2026-05-26 09:42:01', level: 'INFO',  text: 'Account #88100249 synced with MT5 cluster. Handshake successful.' },
  { id: 2, ts: '2026-05-26 09:25:33', level: 'ERROR', text: 'Connection timeout on MT5-STND-04. Re-attempting handshake (1/5)…' },
  { id: 3, ts: '2026-05-26 09:18:12', level: 'INFO',  text: "Admin 'sys_arch_01' changed leverage for #88100918 from 1:100 → 1:500." },
  { id: 4, ts: '2026-05-26 08:55:45', level: 'WARN',  text: 'Trade order #772101 failed — invalid Stop Loss level for Account #88100249.' },
  { id: 5, ts: '2026-05-26 08:30:00', level: 'INFO',  text: 'Keep-alive ping received from MT5-PRIME-01. Latency stable at 12ms.' },
  { id: 6, ts: '2026-05-26 07:14:22', level: 'INFO',  text: 'Log cycle complete. All nodes reporting healthy status.' },
];

/* ─── Level badge ─────────────────────────────────────────────── */
const LEVEL_CONFIG = {
  INFO:  { color: 'var(--positive)', bg: 'bg-positive/10',  border: 'border-positive/20' },
  ERROR: { color: 'var(--negative)', bg: 'bg-negative/10',  border: 'border-negative/20' },
  WARN:  { color: 'var(--warning)',  bg: 'bg-warning/10',   border: 'border-warning/20'  },
  TRACE: { color: 'var(--brand)',    bg: 'bg-brand/10',     border: 'border-brand/20'    },
};

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.INFO;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[5px] text-[11px] font-semibold uppercase tracking-[0.05em] border ${cfg.bg} ${cfg.border} shrink-0`}
      style={{ color: cfg.color }}
    >
      {level}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export function TradingActivityLog({ extraLogs = [] }) {
  const [logs,        setLogs]       = useState([...INITIAL_LOGS, ...extraLogs]);
  const [levelFilter, setLevelFilter] = useState('ALL');

  const visible = levelFilter === 'ALL'
    ? logs
    : logs.filter((l) => l.level === levelFilter);

  const handleExport = () => {
    const csv = 'data:text/csv;charset=utf-8,Timestamp,Level,Message\n'
      + logs.map((l) => `"${l.ts}","${l.level}","${l.text.replace(/"/g, '""')}"`).join('\n');
    const link = document.createElement('a');
    link.href   = encodeURI(csv);
    link.download = 'trading-activity-log.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">

      {/* ── Header ── */}
      <div className="flex w-full items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-positive animate-pulse shrink-0" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 leading-none mb-1.5 select-none">
              Activity
            </p>
            <p className="text-[16px] font-semibold tracking-[-0.01em] text-text leading-none">
              System Logs
            </p>
          </div>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full bg-border/20 text-text-muted/80 text-[11px] font-semibold select-none">
            {logs.length} logs
          </span>
        </div>
      </div>

      {/* ── Body (always visible) ── */}
      <div className="border-t border-border/15">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/10 bg-bg/20">
            {/* Level filter */}
            <div className="flex items-center gap-1.5">
              {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`h-6 px-2.5 rounded-[6px] text-[11px] font-semibold uppercase tracking-[0.05em] transition-all cursor-pointer border ${
                    levelFilter === lvl
                      ? 'bg-brand text-text-on-accent border-brand/30'
                      : 'bg-bg border-border/20 text-text-muted/75 hover:text-text hover:border-border/40'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-[7px] border border-border/20 bg-bg text-text-muted/80 hover:text-text hover:border-border/40 text-[11.5px] font-semibold transition-all cursor-pointer"
              >
                <Download size={10} /> Export
              </button>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-[7px] border border-negative/20 bg-negative/5 hover:bg-negative/10 text-negative/85 hover:text-negative text-[11.5px] font-semibold transition-all cursor-pointer"
              >
                <Trash2 size={10} /> Clear
              </button>
            </div>
          </div>

          {/* Log table — no height cap, fully scrollable */}
          {visible.length === 0 ? (
            <div className="py-12 text-center text-[12px] text-text-muted/35 font-semibold">
              No logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg/30">
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 whitespace-nowrap w-[165px]">
                      Time
                    </th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 whitespace-nowrap w-[80px]">
                      Type
                    </th>
                    <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70">
                      Log
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((log, i) => (
                    <tr
                      key={log.id ?? i}
                      className="border-t border-border/8 hover:bg-surface-bright/20 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-[10.5px] text-text-muted/70 whitespace-nowrap align-top">
                        {log.ts}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <LevelBadge level={log.level} />
                      </td>
                      <td className="px-4 py-3 text-[11.5px] text-text/80 font-medium leading-snug">
                        {log.text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}
