import React from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, FileCheck, ShieldAlert, Zap } from 'lucide-react';
import { MainTable } from '@/components/common/table';

const UNIFIED_STREAM = [
  { id: 'T-88421', type: 'trade', user: 'k.mueller', icon: Activity, detail: 'EUR/USD Buy 2.00 Lots', value: '+$342', status: 'open', time: 'Just now', color: 'var(--cyan)' },
  { id: 'D-44182', type: 'deposit', user: 'k.mueller', icon: ArrowDownRight, detail: 'Wire Transfer', value: '$10,000', status: 'confirmed', time: '1m ago', color: 'var(--positive)' },
  { id: 'A-1002', type: 'alert', user: 'System', icon: ShieldAlert, detail: 'Margin breach — Acc #8821', value: 'Critical', status: 'action req', time: '2m ago', color: 'var(--negative)' },
  { id: 'W-21034', type: 'withdraw', user: 'a.okonkwo', icon: ArrowUpRight, detail: 'Wire Transfer', value: '$47,500', status: 'pending', time: '11m ago', color: 'var(--warning)' },
  { id: 'T-88419', type: 'trade', user: 'p.sharma', icon: Activity, detail: 'XAU/USD Sell 0.50 Lots', value: '-$128', status: 'open', time: '14m ago', color: 'var(--cyan)' },
  { id: 'A-1003', type: 'alert', user: 'System', icon: FileCheck, detail: 'Mismatch User #10043', value: 'Warning', status: 'review req', time: '34m ago', color: 'var(--warning)' },
  { id: 'T-88418', type: 'trade', user: 'r.james', icon: Activity, detail: 'GBP/JPY Buy 1.20 Lots', value: '+$79', status: 'closed', time: '41m ago', color: 'var(--text-muted)' },
  { id: 'A-1004', type: 'alert', user: 'System', icon: Activity, detail: 'MT5 Bridge latency spike', value: 'Normal', status: 'resolved', time: '1h ago', color: 'var(--cyan)' },
];

const STATUS_STYLE = {
  open: { color: 'var(--cyan)', bg: 'color-mix(in srgb, var(--cyan) 8%, transparent)' },
  resolved: { color: 'var(--cyan)', bg: 'color-mix(in srgb, var(--cyan) 8%, transparent)' },
  pending: { color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 8%, transparent)' },
  'review req': { color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 8%, transparent)' },
  confirmed: { color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 8%, transparent)' },
  'action req': { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 8%, transparent)' },
  closed: { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)' },
};

function StreamRefCell({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-2.5 group/ref">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] transition-transform duration-300 group-hover/ref:scale-110"
        style={{ 
          background: `color-mix(in srgb, ${item.color} 10%, transparent)`, 
          color: item.color,
          boxShadow: `0 0 4px color-mix(in srgb, ${item.color} 15%, transparent)`
        }}
      >
        <Icon size={11} strokeWidth={2.5} />
      </div>
      <span className="font-mono text-[11.5px] font-medium tracking-wider text-text-muted">{item.id}</span>
    </div>
  );
}

function StreamValueCell({ item }) {
  const isGain = item.value.startsWith('+') || item.status === 'confirmed';
  const isLoss = item.value.startsWith('-') || item.status === 'action req';
  const valColor = isGain ? 'var(--positive)' : isLoss ? 'var(--negative)' : item.color;
  return (
    <span className="font-mono text-[13.5px] font-semibold" style={{ color: valColor }}>
      {item.value}
    </span>
  );
}

function StreamStatusCell({ item }) {
  const ss = STATUS_STYLE[item.status] ?? { color: 'var(--text-muted)', bg: 'transparent' };

  return (
    <span
      className="rounded-[4px] px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider border"
      style={{ 
        color: ss.color, 
        background: ss.bg,
        borderColor: `color-mix(in srgb, ${ss.color} 15%, transparent)`
      }}
    >
      {item.status}
    </span>
  );
}

const streamColumns = [
  { key: 'id', label: 'Ref ID', render: (_, row) => <StreamRefCell item={row} /> },
  { key: 'user', label: 'Operator', render: (value) => <span className="text-[13px] font-semibold text-text">{value}</span> },
  { key: 'detail', label: 'Transaction Details', render: (value) => <span className="whitespace-nowrap text-[13px] font-medium text-text-muted">{value}</span> },
  { key: 'value', label: 'Amount', align: 'right', render: (_, row) => <StreamValueCell item={row} /> },
  { key: 'status', label: 'Ledger Status', align: 'right', render: (_, row) => <StreamStatusCell item={row} /> },
  { key: 'time', label: 'Activity Time', align: 'right', render: (value) => <span className="font-mono text-[11.5px] font-medium text-text-muted">{value}</span> },
];

function DashboardStream() {
  return (
    <section className="h-full rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/15 flex items-center justify-between bg-surface-elevated/45">
        <div className="text-[15px] font-semibold text-text flex items-center gap-2 tracking-tight">
          <Zap size={14} className="text-cyan fill-cyan/20 animate-pulse" style={{ color: 'var(--cyan)' }} />
          Global Activity Ledger
        </div>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-bg/50 text-[10.5px] font-bold uppercase tracking-wider text-text-muted border border-border/20">
          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
          Live Stream
        </span>
      </div>

      <div className="flex-1 min-h-0 bg-surface/5">
        <MainTable 
          columns={streamColumns} 
          data={UNIFIED_STREAM} 
          rowClassName="hover:bg-cyan/5" 
        />
      </div>
    </section>
  );
}

export default DashboardStream;
