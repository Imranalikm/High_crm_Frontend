import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowDownRight, ArrowUpRight, LifeBuoy, Zap, ChevronRight } from 'lucide-react';
import { MainTable } from '@/components/common/table';
import { timeAgo } from '../hooks/useDashboardData';

const TYPE_CONFIG = {
  user: { icon: Users, color: 'var(--brand)' },
  deposit: { icon: ArrowDownRight, color: 'var(--positive)' },
  withdrawal: { icon: ArrowUpRight, color: 'var(--negative)' },
  ticket: { icon: LifeBuoy, color: 'var(--cyan)' },
};

const STATUS_STYLE = {
  approved: { color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 8%, transparent)' },
  completed: { color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 8%, transparent)' },
  pending: { color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 8%, transparent)' },
  rejected: { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 8%, transparent)' },
  flagged: { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 8%, transparent)' },
  open: { color: 'var(--cyan)', bg: 'color-mix(in srgb, var(--cyan) 8%, transparent)' },
  closed: { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)' },
};

function StreamRefCell({ item }) {
  const config = TYPE_CONFIG[item.type] || { icon: Zap, color: 'var(--text-muted)' };
  const Icon = config.icon;
  
  // Format long mongo ids or sequential ones to be smaller
  const shortId = typeof item.id === 'string' && item.id.includes('-')
    ? item.id.split('-')[1] || item.id
    : String(item.id).substring(0, 8);

  return (
    <div className="flex items-center gap-2.5 group/ref">
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] transition-transform duration-300 group-hover/ref:scale-110"
        style={{ 
          background: `color-mix(in srgb, ${config.color} 10%, transparent)`, 
          color: config.color,
          boxShadow: `0 0 4px color-mix(in srgb, ${config.color} 15%, transparent)`
        }}
      >
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {shortId}
      </span>
    </div>
  );
}

function StreamStatusCell({ item }) {
  if (!item.status) {
    return (
      <span
        className="rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
        style={{ 
          color: 'var(--brand)', 
          background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
          borderColor: 'color-mix(in srgb, var(--brand) 15%, transparent)'
        }}
      >
        New
      </span>
    );
  }

  const normalizedStatus = String(item.status).toLowerCase();
  const ss = STATUS_STYLE[normalizedStatus] ?? { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.04)' };

  return (
    <span
      className="rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
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

export function DashboardStream({ recentActivity, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="h-full rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col animate-pulse">
        <div className="px-5 py-4 border-b border-border/15 flex items-center justify-between">
          <div className="h-6 w-40 bg-surface-elevated/85 rounded" />
          <div className="h-5 w-24 bg-surface-elevated/65 rounded" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-surface-elevated/40 rounded" />
          ))}
        </div>
      </section>
    );
  }

  const streamColumns = [
    { 
      key: 'id', 
      label: 'Ref ID', 
      render: (_, row) => <StreamRefCell item={row} /> 
    },
    { 
      key: 'detail', 
      label: 'Activity Details', 
      render: (value) => <span className="text-[13px] font-semibold text-text">{value}</span> 
    },
    { 
      key: 'info', 
      label: 'Channel / Category', 
      render: (value) => <span className="whitespace-nowrap text-[13px] font-medium text-text-muted">{value}</span> 
    },
    { 
      key: 'status', 
      label: 'Status', 
      align: 'right', 
      render: (_, row) => <StreamStatusCell item={row} /> 
    },
    { 
      key: 'time', 
      label: 'Activity Time', 
      align: 'right', 
      render: (value) => <span className="font-mono text-[11px] font-medium text-text-muted">{timeAgo(value)}</span> 
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      width: '40px',
      render: (_, row) => (
        <span className="flex items-center justify-center h-5 w-5 rounded bg-bg/40 text-text-muted group-hover:text-text group-hover:bg-bg transition-colors border border-border/5 group-hover:border-border/20">
          <ChevronRight size={10} strokeWidth={2.5} />
        </span>
      )
    }
  ];

  return (
    <section className="h-full rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/15 flex items-center justify-between bg-surface-elevated/45">
        <div className="text-[15px] font-semibold text-text flex items-center gap-2 tracking-tight">
          <Zap size={14} className="text-cyan fill-cyan/20 animate-pulse" />
          Global Activity Ledger
        </div>
        <span className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-bg/50 text-[10.5px] font-bold uppercase tracking-wider text-text-muted border border-border/20">
          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
          Live Ledger
        </span>
      </div>

      <div className="flex-1 min-h-0 bg-surface/5">
        <MainTable 
          columns={streamColumns} 
          data={recentActivity || []} 
          rowClassName="hover:bg-brand/5 hover:border-l-brand cursor-pointer"
          onRowClick={(row) => navigate(row.path)}
          emptyTitle="No recent platform activity found"
        />
      </div>
    </section>
  );
}

export default DashboardStream;
