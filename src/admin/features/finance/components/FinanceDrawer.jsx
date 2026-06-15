/**
 * finance/components/FinanceDrawer.jsx
 * Drawer system, toolbar, UserCell, QuickActions for Finance feature.
 *
 * Table rendering is delegated to the canonical FeatureTable.
 * Pagination is delegated to the canonical Pagination.
 * All badges use the canonical StatusChip / RiskChip / PriorityChip.
 */
import React, { useState } from 'react';
import {
  AlertTriangle, ArrowUpRight, Check, CheckCircle2,
  ChevronDown, ChevronUp, Copy, Download, Eye, Flag, Lock,
  MessageSquare, Play, RefreshCw, Search, Send, ShieldAlert,
  User, X, XCircle, Clock, Activity, CreditCard,
  Building2, Bitcoin, CircleDollarSign, Database, FileText,
} from 'lucide-react';
import { STATUS_CLR, RISK_CLR, TXN_TYPE_CLR, METHOD_ICONS } from '@/config/constants/finance/mockData';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { DrawerField, DrawerFormGrid as DrawerFormGrid, DrawerSection } from '@/components/common/drawer';
import { ActionBtn as IconBtn } from '@/components/ui';
import { StatusChip, RiskChip, PriorityChip } from '@/components/ui';

// Re-export so existing page imports keep working
export { IconBtn };
export { DrawerSection };
export { DrawerField as DF };
export { DrawerFormGrid as DGrid };
export { StatusChip as StatusBadge };
export { RiskChip as RiskBadge };
// SectionHead for any page that imports it via FinanceDrawer
export { SectionHead } from '@/components/ui/SectionHead';


/* ── Pagination re-export (Finance pages import from here) ───── */
export { Pagination } from '@/components/common/table';

/* ── Base drawer shell components (Premium DrawerShell & DHeader) ── */
function DrawerShell({ open, onClose, maxWidth = 'max-w-[720px]', children }) {
  return (
    <MainDrawer open={open} onClose={onClose} width={maxWidth}>
      {children}
    </MainDrawer>
  );
}

function DHeader({ eyebrow, title, subtitle, onClose, accentColor = 'var(--brand)' }) {
  return (
    <div className="flex-shrink-0 border-b border-border/15">
      {/* Color accent bar */}
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

function FinanceDrawer({ open, onClose, title, subtitle, children, footer, eyebrow = "Record Review", accentColor = 'var(--brand)' }) {
  return (
    <DrawerShell open={open} onClose={onClose} maxWidth="max-w-[720px]">
      <DHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        accentColor={accentColor}
      />
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {children}
        <div className="h-2" />
      </div>
      {footer && (
        <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4">
          {footer}
        </div>
      )}
    </DrawerShell>
  );
}

/* ── Audit trail ─────────────────────────────────────────────── */
function DrawerAuditTrail({ entries, statusColor }) {
  const nodeColor = statusColor || 'var(--warning)';
  const lastIdx = entries.length - 1;

  return (
    <div className="relative space-y-0">
      {/* Connector line */}
      <div
        className="absolute left-[9px] top-3 w-px"
        style={{
          bottom: '12px',
          background: `linear-gradient(to bottom, color-mix(in srgb, ${nodeColor} 25%, transparent), transparent)`,
        }}
      />
      {entries.map((e, i) => {
        const isLast = i === lastIdx;
        const isError = e.action.toLowerCase().includes('error') || e.action.toLowerCase().includes('fail') || e.action.toLowerCase().includes('reject');
        const dotColor = isError ? 'var(--negative)' : isLast ? nodeColor : 'var(--border)';
        return (
          <div key={i} className="flex gap-3.5 pb-4">
            {/* Node */}
            <div
              className="relative mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center z-10 border"
              style={{
                borderColor: `color-mix(in srgb, ${dotColor} 40%, transparent)`,
                background: `color-mix(in srgb, ${dotColor} 10%, var(--bg))`,
                boxShadow: isLast ? `0 0 8px color-mix(in srgb, ${dotColor} 30%, transparent)` : 'none',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: dotColor, opacity: isLast ? 1 : 0.55 }}
              />
            </div>
            {/* Content */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div
                className="text-[11.5px] font-semibold font-heading"
                style={{ color: isError ? 'var(--negative)' : 'var(--text)' }}
              >
                {e.action}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9.5px] font-mono text-text-muted/70">{e.by}</span>
                <span className="text-text-muted/40 text-[9px]">·</span>
                <span className="text-[9.5px] font-mono text-text-muted/65">{e.ts}</span>
              </div>
              {e.note && <div className="text-[10px] text-text-muted/75 font-heading mt-1">{e.note}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Note editor (Collapsible Premium Operator Note Box) ─────── */
function DrawerNoteEditor({ onSave, placeholder = "Add review notes...", defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [text, setText] = useState('');

  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20 overflow-hidden">
      {/* Toggle header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg/30 transition-colors select-none ${isOpen ? 'border-b border-border/10' : ''
          }`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="w-6 h-6 rounded-[6px] bg-brand/8 border border-brand/15 flex items-center justify-center flex-shrink-0">
          <FileText size={12} className="text-brand" />
        </div>
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          Add Note
        </span>
        {isOpen
          ? <ChevronUp size={12} className="text-text-muted/30 flex-shrink-0" />
          : <ChevronDown size={12} className="text-text-muted/30 flex-shrink-0" />
        }
      </div>

      {/* Note body */}
      {isOpen && (
        <div className="px-4 py-4 space-y-2.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/60 px-3 py-2.5 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!text?.trim()}
              onClick={() => {
                if (text.trim()) {
                  onSave(text);
                  setText('');
                }
              }}
              className="flex items-center gap-1.5 h-8 px-4 rounded-[7px] text-[10.5px] font-black uppercase tracking-wider border border-brand/22 bg-brand/6 text-brand hover:bg-brand/12 disabled:opacity-25 transition-all cursor-pointer"
            >
              <Send size={10} /> Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Risk panel ──────────────────────────────────────────────── */
function RiskPanel({ risk, flags = [] }) {
  const color = RISK_CLR[risk] || 'var(--text-muted)';
  const defaultFlags = {
    LOW:    ['Standard transaction velocity', 'No sanctions match', 'Verified KYC'],
    MEDIUM: ['Unusual transaction size', 'KYC review recommended'],
    HIGH:   ['AML threshold triggered', 'OFAC screening match', 'Source of funds unverified'],
    CRITICAL: ['Sanction list hit', 'IP address mismatch', 'Potential account takeover'],
  };
  const allFlags = flags.length > 0 ? flags : (defaultFlags[risk] || []);

  return (
    <div
      className="rounded-[12px] border p-4 relative overflow-hidden"
      style={{
        borderColor: `color-mix(in srgb, ${color} 20%, var(--border))`,
        background: `color-mix(in srgb, ${color} 4%, var(--bg))`
      }}
    >
      {/* Glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: color }}
      />

      <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b" style={{ borderColor: `color-mix(in srgb, ${color} 10%, var(--border))` }}>
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} style={{ color }} />
          <span className="text-[12.5px] font-bold font-heading tracking-tight" style={{ color }}>
            Compliance Risk
          </span>
        </div>
        <RiskChip value={risk} />
      </div>

      <div className="space-y-2">
        {allFlags.map((f, i) => {
          const flagColor = ['HIGH', 'CRITICAL'].includes(risk)
            ? 'var(--negative)'
            : risk === 'MEDIUM' && i === 0
            ? 'var(--warning)'
            : 'var(--positive)';
          return (
            <div key={i} className="flex items-start gap-2 text-[11px] font-heading font-semibold">
              {['HIGH', 'CRITICAL'].includes(risk) || (risk === 'MEDIUM' && i === 0)
                ? <AlertTriangle size={11.5} style={{ color: flagColor }} className="flex-shrink-0 mt-0.5" />
                : <Check size={11.5} style={{ color: flagColor }} className="flex-shrink-0 mt-0.5" />
              }
              <span className="leading-normal" style={{ color: flagColor }}>{f}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Status hero banner ───────────────────────────────────────── */
function StatusHeroBanner({ status, amount, id, created, method, rail }) {
  const statusColor = STATUS_CLR[status] || 'var(--text-muted)';

  let StatusIcon = Clock;
  let labelText = 'Pending';

  if (['APPROVED', 'PAID', 'SETTLED', 'RESOLVED'].includes(status)) {
    StatusIcon = CheckCircle2;
    labelText = status === 'SETTLED' ? 'Completed' : 'Approved';
  } else if (['FAILED', 'REJECTED', 'UNRESOLVED'].includes(status)) {
    StatusIcon = XCircle;
    labelText = status === 'FAILED' ? 'Failed' : 'Rejected';
  } else if (['FLAGGED', 'FROZEN', 'LOCKED'].includes(status)) {
    StatusIcon = ShieldAlert;
    labelText = status === 'FLAGGED' ? 'Flagged' : 'Locked';
  } else if (['PROCESSING', 'RETRY'].includes(status)) {
    StatusIcon = Activity;
    labelText = 'Processing';
  }

  const MethodIc = METHOD_ICONS[method] || CreditCard;

  return (
    <div
      className="rounded-[14px] border p-5 relative overflow-hidden"
      style={{
        borderColor: `color-mix(in srgb, ${statusColor} 20%, var(--border))`,
        background: `color-mix(in srgb, ${statusColor} 4%, var(--bg))`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: statusColor }}
      />

      <div className="flex items-start justify-between gap-4 relative z-[1]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-[11px] flex items-center justify-center border flex-shrink-0"
            style={{
              background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${statusColor} 22%, transparent)`,
            }}
          >
            <MethodIc size={20} style={{ color: statusColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <StatusIcon size={12} style={{ color: statusColor }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: statusColor }}
              >
                {labelText}
              </span>
            </div>
            <div className="text-[20px] font-bold tracking-tight text-text font-mono leading-none mt-1">
              {amount}
            </div>
            <div className="text-[10.5px] font-mono text-text-muted/70 mt-1">
              {id} · {created}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusChip value={status} size="lg" />
          {method && (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.09em] rounded-[5px] px-2 py-[3px] border border-border/25 text-text-muted/75 bg-bg/40 font-heading">
              {method} {rail ? `· ${rail}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Generic record drawer (Deposits + Withdrawals + Transactions) ─────────── */
function FinanceRecordDrawer({ row, open, onClose, type, onAction }) {
  const [localNote, setLocalNote] = useState('');
  if (!row) return null;

  const u = row.user;
  const isTxn = type === 'Transaction';
  const rowTs = row.created || row.ts;

  const auditBase = [
    { action: 'Record created',                  by: 'System',     ts: rowTs, note: `Source: ${row.method || row.type}` },
  ];
  if (row.risk) {
    auditBase.push({ action: 'Auto-risk check completed',  by: 'RiskEngine', ts: rowTs, note: `Risk level: ${row.risk}` });
  }
  if (row.reviewedBy && row.reviewedBy !== '—' && row.reviewedBy !== 'Auto')
    auditBase.push({ action: 'Review started', by: row.reviewedBy, ts: rowTs, note: null });
  if (['APPROVED', 'PAID', 'SETTLED'].includes(row.status))
    auditBase.push({ action: 'Approved', by: row.reviewedBy || 'System', ts: rowTs, note: null });
  if (['FLAGGED', 'FROZEN'].includes(row.status))
    auditBase.push({ action: 'Flagged for review', by: row.reviewedBy || 'System', ts: rowTs, note: 'Awaiting compliance action' });

  const statusColor = STATUS_CLR[row.status] || 'var(--text-muted)';

  return (
    <FinanceDrawer open={open} onClose={onClose} eyebrow={`${type} Details`} title={`${type} — ${row.id}`} subtitle="Review transaction details, user information, and logs." footer={
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        {/* Left side: Utilities */}
        <div className="flex flex-wrap gap-1.5">
          <IconBtn label="Copy ID" Icon={Copy} variant="default" small onClick={() => { navigator.clipboard.writeText(row.id); onAction('ID copied', row.id); }} />
          <IconBtn label="Export" Icon={Download} variant="default" small onClick={() => onAction('Exported', row.id)} />
          <IconBtn label="View User" Icon={User} variant="cyan" small onClick={() => onAction('User profile opened', row.id)} />
          {!isTxn && row.status !== 'REJECTED' && row.status !== 'PAID' && row.status !== 'SETTLED' && (
            <IconBtn label="Lock" Icon={Lock} variant="danger" small onClick={() => { onAction('Locked', row.id); onClose(); }} />
          )}
        </div>
        
        {/* Right side: Primary actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isTxn ? (
            row.status === 'FLAGGED' && (
              <IconBtn label="Reviewed" Icon={Eye} variant="warning" onClick={() => { onAction('Reviewed', row.id); onClose(); }} />
            )
          ) : (
            <>
              {row.status === 'PENDING' && (
                <>
                  <IconBtn label="Approve" Icon={CheckCircle2} variant="success" onClick={() => { onAction('Approved', row.id); onClose(); }} />
                  <IconBtn label="Reject" Icon={XCircle} variant="danger" onClick={() => { onAction('Rejected', row.id); onClose(); }} />
                </>
              )}
              {(row.status === 'FLAGGED' || row.status === 'FROZEN') && (
                <>
                  <IconBtn label="Release" Icon={Play} variant="warning" onClick={() => { onAction('Hold released', row.id); onClose(); }} />
                  <IconBtn label="Escalate" Icon={ArrowUpRight} variant="orange" onClick={() => { onAction('Escalated', row.id); onClose(); }} />
                </>
              )}
              {row.status === 'FAILED' && (
                <IconBtn label="Retry" Icon={RefreshCw} variant="warning" onClick={() => { onAction('Retried', row.id); onClose(); }} />
              )}
            </>
          )}
          <IconBtn label="Close" onClick={onClose} variant="default" />
        </div>
      </div>
    }>
      {/* Dynamic Status Hero Banner */}
      <StatusHeroBanner
        status={row.status}
        amount={row.amount}
        id={row.id}
        created={rowTs}
        method={row.method}
        rail={row.rail}
        type={type}
      />

      {/* Transaction Summary */}
      <DrawerSection title="Details">
        <DrawerFormGrid>
          <DrawerField label="ID"     value={row.id}      mono copyable />
          <DrawerField label="Status"        value={row.status}  accent={statusColor} />
          <DrawerField label="Amount"        value={row.amount}  mono accent={row.amtRaw > 0 ? 'var(--positive)' : 'var(--negative)'} />
          <DrawerField label="Method"        value={row.method} />
          {row.type && <DrawerField label="Type" value={row.type} accent={TXN_TYPE_CLR[row.type]} />}
          {row.rail        && <DrawerField label="Provider"    value={row.rail}        mono />}
          {row.reference   && <DrawerField label="Reference"        value={row.reference}   mono copyable />}
          {row.destination && <DrawerField label="Destination"      value={row.destination} mono copyable wide />}
          {row.hash        && <DrawerField label="Tx Hash"          value={row.hash}        mono copyable wide />}
          {row.compliance  && <DrawerField label="Compliance" value={row.compliance}  accent={row.compliance === 'PASS' ? 'var(--positive)' : 'var(--negative)'} />}
          {row.aml         && <DrawerField label="AML Status"       value={row.aml}         accent={row.aml === 'CLEAR' ? 'var(--positive)' : row.aml === 'REVIEW' ? 'var(--warning)' : 'var(--negative)'} />}
          <DrawerField label="Time"       value={rowTs} mono />
          {row.reviewedBy && <DrawerField label="Reviewer"   value={row.reviewedBy || 'Unassigned'} />}
        </DrawerFormGrid>
      </DrawerSection>

      {/* User Context */}
      <DrawerSection title="User">
        <div 
          className="rounded-[12px] border bg-bg/20 p-4 space-y-4"
          style={{ borderColor: 'color-mix(in srgb, var(--brand) 12%, var(--border))' }}
        >
          <div className="flex items-center gap-3.5 pb-3 border-b border-border/10">
            <div 
              className="w-10 h-10 rounded-[11px] border flex items-center justify-center text-[13px] font-bold text-brand font-heading flex-shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--brand) 20%, transparent)',
              }}
            >
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-bold font-heading text-text tracking-tight truncate">{u.name}</div>
              <div className="text-[10.5px] font-mono text-text-muted/70 mt-0.5 truncate">{u.uid} · {u.email}</div>
            </div>
            <div 
              className="px-2 py-0.5 rounded-[5px] border border-border/25 text-[9.5px] font-mono text-text-muted/70 bg-bg/40 flex-shrink-0"
            >
              {u.region || 'GLOBAL'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'KYC', val: 'VERIFIED', color: 'var(--positive)' },
              { label: 'Wallet', val: 'ACTIVE', color: 'var(--positive)' },
              { label: 'Trading', val: 'ACTIVE', color: 'var(--positive)' },
            ].map(m => (
              <div 
                key={m.label} 
                className="flex flex-col gap-1 items-center text-center p-2 rounded-[8px] border border-border/10 bg-bg/10"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted/70 leading-none">{m.label}</span>
                <span className="text-[11px] font-bold font-heading mt-1" style={{ color: m.color }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </DrawerSection>

      {/* Risk Analysis */}
      {row.risk && (
        <DrawerSection title="Risk">
          <RiskPanel risk={row.risk} flags={row.note && row.risk === 'HIGH' ? [row.note.split('.')[0]] : undefined} />
        </DrawerSection>
      )}

      {/* Ledger Mapping specific to Transactions */}
      {isTxn && (
        <DrawerSection title="Ledger Info">
          <div className="rounded-[12px] border border-border/15 bg-bg/25 p-4 space-y-3">
            {[
              { label: 'From', val: row.amtRaw > 0 ? 'External Gateway' : 'User Wallet' },
              { label: 'To', val: row.amtRaw > 0 ? 'User Wallet' : 'External Gateway' },
              { label: 'Entry', val: `${row.reference} · ${rowTs}` },
              { label: 'Settled', val: row.status === 'SETTLED' ? 'Yes' : 'No' },
            ].map(l => (
              <div key={l.label} className="flex justify-between items-center text-[11px] font-heading pb-2 border-b border-border/5 last:border-0 last:pb-0">
                <span className="text-text-muted/45 font-semibold">{l.label}</span>
                <span className="font-bold text-text/80 font-mono">{l.val}</span>
              </div>
            ))}
          </div>
        </DrawerSection>
      )}

      {/* Internal Notes */}
      <DrawerSection title="Notes" collapsible>
        <div className="space-y-3">
          {row.note && (
            <div className="rounded-[10px] border border-border/20 bg-bg/40 px-3.5 py-2.5 text-[11.5px] text-text-muted/70 font-heading leading-relaxed">
              {row.note}
            </div>
          )}
          
          <DrawerNoteEditor onSave={n => { setLocalNote(n); onAction('Note saved', row.id); }} />
          
          {localNote && (
            <div 
              className="rounded-[10px] border px-3.5 py-2.5 text-[11.5px] font-heading leading-relaxed"
              style={{
                borderColor: 'color-mix(in srgb, var(--brand) 20%, var(--border))',
                background: 'color-mix(in srgb, var(--brand) 5%, transparent)',
                color: 'var(--text-muted)',
              }}
            >
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-brand mb-1">
                <MessageSquare size={10} /> Note Added
              </div>
              {localNote}
            </div>
          )}
        </div>
      </DrawerSection>

      {/* Audit Trail */}
      <DrawerSection title="History" collapsible>
        <DrawerAuditTrail entries={auditBase} statusColor={statusColor} />
      </DrawerSection>
    </FinanceDrawer>
  );
}

/* ── Search + filter toolbar ─────────────────────────────────── */
function FinanceToolbar({ search, setSearch, filters, activeFilter, setFilter, actions, extra }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full h-9 pl-8 pr-3 rounded-[9px] border border-border/25 bg-bg text-[12px] text-text placeholder:text-text-muted/30 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-heading" />
        </div>
        {filters && (
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 h-8 rounded-[7px] text-[10.5px] font-bold font-heading uppercase tracking-wide cursor-pointer transition-all border
                  ${activeFilter === f ? 'bg-primary/[0.12] text-primary border-primary/25' : 'border-border/25 text-text-muted/50 hover:text-text-muted hover:border-border/40 hover:bg-surface-bright/20 bg-transparent'}`}>
                {f}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 ml-auto">
          {actions?.map((a, i) => (
            <button key={i} onClick={a.onClick}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[11px] font-semibold font-heading border transition-all duration-200 cursor-pointer
                ${a.primary ? 'bg-brand text-text-on-accent border-brand/80 hover:brightness-110' : 'border-border/25 bg-surface-bright/10 text-text-muted/70 hover:text-text hover:border-border/40'}`}>
              {a.Icon && <a.Icon size={12} />}{a.label}
            </button>
          ))}
        </div>
      </div>
      {extra}
    </div>
  );
}

/* ── Secondary filter row ────────────────────────────────────── */
function FilterRow({ filters }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {filters.map(grp => (
        <div key={grp.label} className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 font-heading">{grp.label}:</span>
          <div className="flex gap-1">
            {grp.options.map(o => (
              <button key={o} onClick={() => grp.set(o)}
                className={`px-2.5 h-7 rounded-[6px] text-[10.5px] font-bold uppercase tracking-wider font-heading cursor-pointer transition-all border
                  ${grp.value === o ? 'bg-primary/[0.1] text-primary border-primary/25' : 'border-border/20 text-text-muted/45 hover:text-text-muted hover:border-border/40 hover:bg-surface-bright/10 bg-transparent'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── User cell ───────────────────────────────────────────────── */
function UserCell({ u }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-[6px] bg-primary/[0.1] border border-primary/[0.16] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
        {u.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <div className="text-[13px] font-semibold font-heading tracking-[-0.01em] text-text/85">{u.name}</div>
        <div className="text-[10px] font-mono font-semibold text-text-muted/45 mt-0.5">{u.uid}</div>
      </div>
    </div>
  );
}

/* ── Method badge (Finance-specific) ─────────────────────────── */
function MethodBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-heading font-semibold text-text-muted/55">
      {value}
    </span>
  );
}

/* ── Row quick-action buttons ────────────────────────────────── */
function QuickActions({ row, onApprove, onReject, onFlag, onRetry }) {
  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onApprove && row.status === 'PENDING' &&
        <button onClick={e => { e.stopPropagation(); onApprove(row); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110" title="Approve"><Check size={10} /></button>}
      {onReject && (row.status === 'PENDING' || row.status === 'FLAGGED') &&
        <button onClick={e => { e.stopPropagation(); onReject(row); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110" title="Reject"><X size={10} /></button>}
      {onFlag && row.status !== 'FLAGGED' &&
        <button onClick={e => { e.stopPropagation(); onFlag(row); }} className="w-6 h-6 rounded-[5px] border border-warning/20 flex items-center justify-center text-warning/60 hover:text-warning cursor-pointer" title="Flag"><Flag size={10} /></button>}
      {onRetry && row.status === 'FAILED' &&
        <button onClick={e => { e.stopPropagation(); onRetry(row); }} className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/[0.07] text-cyan flex items-center justify-center cursor-pointer hover:brightness-110" title="Retry"><RefreshCw size={10} /></button>}
    </div>
  );
}

export {
  FinanceDrawer, DrawerAuditTrail, DrawerNoteEditor,
  RiskPanel, FinanceRecordDrawer,
  FinanceToolbar, FilterRow, UserCell, QuickActions, MethodBadge,
  PriorityChip as PriorityBadge,
};
