import React from 'react';
import {
  Download, RefreshCw, PlayCircle, Copy, Trash2, FileText,
  Archive, Hash, Clock, CheckCircle2, XCircle,
  Timer, Send, User, Database, Calendar, Activity,
  ChevronDown, ChevronUp, Zap, Globe, BarChart2, X, Check,
} from 'lucide-react';
import {
  FORMAT_ICONS,
  FORMAT_CLR,
  STATUS_CLR,
  FormatBadge,
  StatusBadge,
} from './ReportsComponents';
import { MainDrawer } from '@/components/common/drawer';

/* ══════════════════════════════════════════════════════════════
   SHARED DRAWER PRIMITIVES
══════════════════════════════════════════════════════════════ */

function DrawerShell({ open, onClose, children }) {
  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[720px]">
      {children}
    </MainDrawer>
  );
}

function DHeader({ eyebrow, title, subtitle, onClose, accentColor = 'var(--brand)' }) {
  return (
    <div className="flex-shrink-0 border-b border-border/15">
      <div
        className="h-[2.5px] w-full"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor} 30%, transparent) 60%, transparent)`,
        }}
      />
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="text-[9.5px] font-black uppercase tracking-[0.22em] mb-2 leading-none"
            style={{ color: `color-mix(in srgb, ${accentColor} 65%, transparent)` }}
          >
            {eyebrow}
          </p>
          <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] font-mono text-text-muted/50 mt-1.5 truncate">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer mt-0.5"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function DBody({ children }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
      {children}
      <div className="h-2" />
    </div>
  );
}

function DFooter({ children }) {
  return (
    <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4">
      {children}
    </div>
  );
}

function DSection({ icon, title, children, accent = 'var(--brand)', collapsible = false }) {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20 overflow-hidden">
      <div
        className={`flex items-center gap-3 px-4 py-3 ${isOpen ? 'border-b border-border/10' : ''} ${collapsible ? 'cursor-pointer hover:bg-bg/30' : 'cursor-default'
          } transition-colors select-none`}
        onClick={() => collapsible && setIsOpen((v) => !v)}
      >
        <div
          className="w-6 h-6 rounded-[6px] flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${accent} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
          }}
        >
          <IconComponent size={12} style={{ color: accent }} />
        </div>
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          {title}
        </span>
        {collapsible && (
          isOpen
            ? <ChevronUp size={12} className="text-text-muted/30 flex-shrink-0" />
            : <ChevronDown size={12} className="text-text-muted/30 flex-shrink-0" />
        )}
      </div>
      {isOpen && <div className="px-4 py-4 space-y-3">{children}</div>}
    </div>
  );
}

function DField({ label, value, mono = false, accent, copyable = false, className = '' }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className={`space-y-1.5 ${className}`}>
      <span className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/42 select-none">
        {label}
      </span>
      <div
        className={`relative group flex h-9 items-center rounded-[8px] border border-border/12 bg-bg/50 px-3 text-[12.5px] ${mono ? 'font-mono' : 'font-medium'
          } ${copyable ? 'pr-9' : ''}`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        <span className="truncate">{value || <span className="opacity-20">—</span>}</span>
        {copyable && value && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(String(value));
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-[5px] opacity-0 group-hover:opacity-100 text-text-muted/25 hover:text-brand hover:bg-brand/10 transition-all cursor-pointer"
          >
            {copied ? <Check size={9} /> : <Copy size={9} />}
          </button>
        )}
      </div>
    </div>
  );
}

function DGrid({ children, className = '' }) {
  return <div className={`grid grid-cols-2 gap-3 ${className}`}>{children}</div>;
}

/* ── Stat card for key trading metrics ── */
function StatCard({ label, value, accent = 'var(--text)' }) {
  return (
    <div
      className="rounded-[10px] border px-3.5 py-3 space-y-1.5"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 18%, transparent)`,
        background: `color-mix(in srgb, ${accent} 5%, transparent)`,
      }}
    >
      <span className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/45 select-none">
        {label}
      </span>
      <span
        className="block text-[20px] font-mono font-black leading-none tabular-nums"
        style={{ color: accent }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

/* ── Action Button ── */
const BTN_VARIANTS = {
  success: { c: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 8%, transparent)', b: 'color-mix(in srgb, var(--positive) 22%, transparent)' },
  warning: { c: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 8%, transparent)', b: 'color-mix(in srgb, var(--warning) 22%, transparent)' },
  brand: { c: 'var(--brand)', bg: 'color-mix(in srgb, var(--brand) 8%, transparent)', b: 'color-mix(in srgb, var(--brand) 22%, transparent)' },
  danger: { c: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 5%, transparent)', b: 'color-mix(in srgb, var(--negative) 15%, transparent)' },
  default: { c: 'var(--text-muted)', bg: 'color-mix(in srgb, var(--bg) 30%, transparent)', b: 'color-mix(in srgb, var(--border) 60%, transparent)' },
};

function ActionButton({ label, Icon, variant = 'default', onClick, className = '' }) {
  const s = BTN_VARIANTS[variant] || BTN_VARIANTS.default;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-center gap-2 h-9 px-4 rounded-[9px] border text-[11.5px] font-bold transition-all active:scale-[0.97] cursor-pointer hover:brightness-110 ${className}`}
      style={{ color: s.c, background: s.bg, borderColor: s.b }}
    >
      {Icon && <Icon size={12} className="flex-shrink-0" />}
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUDIT TRAIL TIMELINE
══════════════════════════════════════════════════════════════ */
function AuditTrail({ entries, status }) {
  const trackColor =
    status === 'FAILED' ? 'var(--negative)' :
      status === 'READY' ? 'var(--positive)' :
        'var(--warning)';

  return (
    <div className="relative space-y-0">
      {entries.map((e, i) => {
        const isLast = i === entries.length - 1;
        const isError = e.action.toLowerCase().includes('error') || e.action.toLowerCase().includes('fail');
        const dotColor = isError ? 'var(--negative)' : isLast ? trackColor : 'var(--border)';

        return (
          <div key={i} className="relative flex gap-3.5 pb-4 last:pb-0">
            {/* Connector line */}
            {i < entries.length - 1 && (
              <div
                className="absolute left-[5px] top-[18px] bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, color-mix(in srgb, ${trackColor} 20%, transparent), transparent)`,
                }}
              />
            )}
            {/* Timeline node */}
            <div className="relative z-10 flex-shrink-0 mt-[5px]">
              <div
                className="w-[11px] h-[11px] rounded-full border flex items-center justify-center"
                style={{
                  borderColor: `color-mix(in srgb, ${dotColor} 45%, transparent)`,
                  background: `color-mix(in srgb, ${dotColor} 12%, var(--bg))`,
                  boxShadow: isLast ? `0 0 8px color-mix(in srgb, ${dotColor} 35%, transparent)` : 'none',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: dotColor, opacity: isLast ? 1 : 0.5 }}
                />
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[11.5px] font-semibold leading-tight"
                style={{ color: isError ? 'var(--negative)' : 'var(--text)' }}
              >
                {e.action}
              </p>
              <p className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-text-muted/50">{e.by}</span>
                <span className="text-text-muted/30 text-[9px]">·</span>
                <span className="text-[10px] font-mono text-text-muted/45">{e.ts}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STATUS HERO BANNER
══════════════════════════════════════════════════════════════ */
const STATUS_CFG = {
  READY: { color: 'var(--positive)', Icon: CheckCircle2, label: 'Ready to Download' },
  FAILED: { color: 'var(--negative)', Icon: XCircle, label: 'Failed' },
  SCHEDULED: { color: 'var(--warning)', Icon: Timer, label: 'Scheduled' },
  PROCESSING: { color: 'var(--cyan,#06b6d4)', Icon: Activity, label: 'Processing' },
  QUEUED: { color: 'var(--warning)', Icon: Timer, label: 'Queued' },
};

function StatusHeroBanner({ status, format, size, rows, generated }) {
  const FormatIc = FORMAT_ICONS?.[format] || FileText;
  const fmtColor = FORMAT_CLR?.[format] || 'var(--text-muted)';
  const cfg = STATUS_CFG[status] || STATUS_CFG.SCHEDULED;
  const { color, Icon: StatusIcon, label } = cfg;

  const hasMetrics = (size && size !== '—') || rows > 0 || (generated && generated !== '—');

  return (
    <div
      className="rounded-[13px] border relative overflow-hidden"
      style={{
        borderColor: `color-mix(in srgb, ${color} 20%, var(--border))`,
        background: `color-mix(in srgb, ${color} 5%, var(--bg))`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: color, opacity: 0.06 }}
      />

      <div className="relative z-[1] p-5">
        {/* Top row: Format icon + status text */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Format icon box */}
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center border flex-shrink-0"
              style={{
                background: `color-mix(in srgb, ${fmtColor} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${fmtColor} 22%, transparent)`,
              }}
            >
              <FormatIc size={22} style={{ color: fmtColor }} />
            </div>

            <div>
              {/* Status label */}
              <div className="flex items-center gap-1.5 mb-1">
                <StatusIcon size={12} style={{ color }} />
                <span
                  className="text-[11.5px] font-black uppercase tracking-[0.1em]"
                  style={{ color }}
                >
                  {label}
                </span>
              </div>
              <p className="text-[11.5px] font-medium text-text-muted/60">
                {format} Format{size && size !== '—' ? ` · ${size}` : ''}
              </p>
            </div>
          </div>

          {/* Format badge top-right */}
          <FormatBadge value={format} />
        </div>

        {/* Metrics strip */}
        {hasMetrics && (
          <div
            className="grid grid-cols-3 gap-0 mt-4 pt-4 border-t"
            style={{ borderColor: `color-mix(in srgb, ${color} 14%, var(--border))` }}
          >
            {size && size !== '—' && (
              <div className="flex flex-col items-center gap-1.5 text-center px-3 first:pl-0 border-r border-border/10 last:border-r-0">
                <Archive size={12} className="text-text-muted/45" />
                <span className="font-mono text-[14px] font-black text-text leading-none tabular-nums">{size}</span>
                <span className="text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/45">File Size</span>
              </div>
            )}
            {rows > 0 && (
              <div className="flex flex-col items-center gap-1.5 text-center px-3 border-r border-border/10 last:border-r-0">
                <Database size={12} className="text-text-muted/45" />
                <span className="font-mono text-[14px] font-black text-text leading-none tabular-nums">{rows.toLocaleString()}</span>
                <span className="text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/45">Records</span>
              </div>
            )}
            {generated && generated !== '—' && (
              <div className="flex flex-col items-center gap-1.5 text-center px-3 last:pr-0">
                <Clock size={12} className="text-text-muted/45" />
                <span className="font-mono text-[11.5px] font-black text-text/80 leading-tight text-center">{generated}</span>
                <span className="text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted/45">Generated</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   REPORT DETAIL DRAWER
══════════════════════════════════════════════════════════════ */
export function ReportDetailDrawer({ open, row, onClose, onAction }) {
  if (!row) return null;

  const statusOk = ['READY', 'SUCCESS'].includes(row.status);
  const statusFailed = row.status === 'FAILED';

  /* Status → accent color for header */
  const accentColor = {
    READY: 'var(--positive)',
    FAILED: 'var(--negative)',
    SCHEDULED: 'var(--warning)',
    PROCESSING: 'var(--cyan,#06b6d4)',
    QUEUED: 'var(--warning)',
  }[row.status] || 'var(--brand)';

  /* Audit trail entries */
  const audit = statusFailed
    ? [
      { action: 'Report triggered by scheduler', by: row.owner || 'System', ts: row.generated || '—' },
      { action: 'Data extraction started', by: 'System', ts: row.generated || '—' },
      { action: 'Error: Job failed', by: 'System', ts: row.generated || '—' },
    ]
    : [
      { action: 'Report triggered', by: row.owner || 'System', ts: row.generated || '—' },
      { action: 'Data extraction done', by: 'System', ts: row.generated || '—' },
      { action: 'File created', by: 'System', ts: row.generated || '—' },
      { action: 'Sent to export queue', by: 'System', ts: row.generated || '—' },
    ];

  /* Delivery rows */
  const deliveryRows = [
    { label: 'Channel', value: 'Email + Export Queue' },
    { label: 'Recipients', value: 'ops@firm.com, risk@firm.com' },
    {
      label: 'Status',
      value: statusOk ? 'Delivered' : statusFailed ? 'Failed' : 'Pending',
      accent: statusOk ? 'var(--positive)' : statusFailed ? 'var(--negative)' : 'var(--warning)',
    },
    { label: 'Kept for', value: '90 days' },
  ];

  return (
    <DrawerShell open={open} onClose={onClose}>
      <DHeader
        eyebrow="Report Details"
        title={row.name || row.title || row.id}
        subtitle={row.id}
        onClose={onClose}
        accentColor={accentColor}
      />

      <DBody>
        {/* ── Status Hero Banner ── */}
        <StatusHeroBanner
          status={row.status}
          format={row.format}
          size={row.size}
          rows={row.rows}
          generated={row.generated}
        />

        {/* ── Report Information ── */}
        <DSection icon={Hash} title="Report Info">
          <DGrid>
            {row.period && <DField label="Period" value={row.period} />}
            {row.owner && <DField label="Owner" value={row.owner} />}
            {row.source && <DField label="Source" value={row.source} />}
            {row.scope && <DField label="Scope" value={row.scope} />}
            {row.symbols && <DField label="Symbols" value={row.symbols} mono />}
            {row.service && <DField label="Service" value={row.service} mono />}
            {row.segment && <DField label="Segment" value={row.segment} />}
            {row.kyc && (
              <DField
                label="KYC"
                value={row.kyc}
                accent={STATUS_CLR?.[row.kyc]?.c ?? 'var(--text-muted)'}
              />
            )}
            {row.risk && (
              <DField
                label="Risk"
                value={row.risk}
                accent={
                  row.risk === 'HIGH' ? 'var(--negative)' :
                    row.risk === 'LOW' ? 'var(--positive)' :
                      'var(--warning)'
                }
              />
            )}
          </DGrid>
        </DSection>

        {/* ── Key Metrics (trading-specific) ── */}
        {(row.pnl || row.winRate || row.drawdown || row.retries !== undefined) && (
          <DSection icon={BarChart2} title="Stats" accent="var(--cyan,#06b6d4)">
            <DGrid>
              {row.pnl && (
                <StatCard
                  label="Profit/Loss"
                  value={row.pnl}
                  accent={row.pnl?.startsWith('+') ? 'var(--positive)' : 'var(--negative)'}
                />
              )}
              {row.winRate && (
                <StatCard label="Win Rate" value={row.winRate} accent="var(--cyan,#06b6d4)" />
              )}
              {row.drawdown && (
                <StatCard label="Max Loss" value={row.drawdown} accent="var(--negative)" />
              )}
              {row.retries !== undefined && (
                <StatCard
                  label="Retries"
                  value={row.retries > 0 ? `${row.retries}×` : '0×'}
                  accent={row.retries > 0 ? 'var(--warning)' : 'var(--positive)'}
                />
              )}
            </DGrid>
          </DSection>
        )}

        {/* ── Delivery & Distribution ── */}
        <DSection icon={Globe} title="Delivery Info">
          <div className="rounded-[10px] border border-border/12 bg-bg/30 overflow-hidden">
            {deliveryRows.map((d, i) => (
              <div
                key={d.label}
                className={`flex items-center justify-between px-4 py-3 ${i !== deliveryRows.length - 1 ? 'border-b border-border/8' : ''
                  }`}
              >
                <span className="text-[10.5px] font-black uppercase tracking-[0.12em] text-text-muted/45 select-none">
                  {d.label}
                </span>
                <span
                  className="text-[12px] font-semibold text-right font-mono truncate max-w-[60%]"
                  style={{ color: d.accent ?? 'var(--text)' }}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </DSection>

        {/* ── Audit Trail ── */}
        <DSection icon={Clock} title="History">
          <AuditTrail entries={audit} status={row.status} />
        </DSection>

        {/* ── Actions ── */}
        <DSection icon={Zap} title="Actions">
          <div className="grid grid-cols-2 gap-2">
            {statusOk && (
              <ActionButton
                label="Download" Icon={Download} variant="success"
                onClick={() => { onAction('Downloaded', row.id); onClose(); }}
              />
            )}
            {statusFailed && (
              <ActionButton
                label="Retry" Icon={RefreshCw} variant="warning"
                onClick={() => { onAction('Retried', row.id); onClose(); }}
              />
            )}
            {row.status === 'SCHEDULED' && (
              <ActionButton
                label="Run Now" Icon={PlayCircle} variant="brand"
                onClick={() => { onAction('Triggered', row.id); onClose(); }}
              />
            )}
            <ActionButton
              label="Copy Link" Icon={Copy} variant="default"
              onClick={() => onAction('Link copied', row.id)}
            />
            <ActionButton
              label="Resend" Icon={Send} variant="default"
              onClick={() => onAction('Export', row.id)}
            />
            <ActionButton
              label="Delete" Icon={Trash2} variant="danger"
              className={statusOk || statusFailed || row.status === 'SCHEDULED' ? '' : 'col-span-2'}
              onClick={() => { onAction('Deleted', row.id); onClose(); }}
            />
          </div>
        </DSection>
      </DBody>

      {/* ── Footer ── */}
      <DFooter>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={row.status} />
            <FormatBadge value={row.format} />
            {row.generated && row.generated !== '—' && (
              <span className="flex items-center gap-1.5 text-[10.5px] font-mono text-text-muted/50">
                <Calendar size={10} />
                {row.generated}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/28 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </DFooter>
    </DrawerShell>
  );
}