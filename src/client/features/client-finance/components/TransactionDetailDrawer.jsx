import React from 'react';
import { FileText, Info, ArrowLeftRight, Download, Copy, X, Clock, CheckCircle2, XCircle, ShieldAlert, Activity, CreditCard, Building2, Bitcoin, CircleDollarSign } from 'lucide-react';
import { StatusBadge } from '@/components/ui';
import { MainDrawer } from '@/components/common/drawer';
import { DrawerSection, DrawerField, DrawerFormGrid, DrawerFooter } from '@/components/common/drawer';

/* ─────────────────────────────────────────────────────────
   Helper for Currency Formatting
───────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

/* ── Dropdown indicator mappings matching Finance Drawer ── */
const STATUS_CLR = {
  COMPLETED: 'var(--positive)',
  PENDING: 'var(--warning)',
  FAILED: 'var(--negative)',
  CANCELED: 'var(--text-muted)'
};

const METHOD_ICONS = {
  'stripe card': CreditCard,
  'usdt (trc20)': Bitcoin,
  'btc wallet': Bitcoin,
  'bank wire': Building2,
  'system wallet': CircleDollarSign
};

/* ── DHeader: Accent bar, eyebrow, title, close ── */
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

/* ── StatusHeroBanner: Renders top status panel ── */
function StatusHeroBanner({ status, amount, id, created, method }) {
  const statusColor = STATUS_CLR[status] || 'var(--text-muted)';

  let StatusIcon = Clock;
  let labelText = 'Awaiting Processing';

  if (status === 'COMPLETED') {
    StatusIcon = CheckCircle2;
    labelText = 'Settled & Completed';
  } else if (status === 'FAILED' || status === 'CANCELED') {
    StatusIcon = XCircle;
    labelText = status === 'FAILED' ? 'Transaction Failed' : 'Transaction Canceled';
  }

  const lookupKey = String(method).toLowerCase();
  const MethodIc = METHOD_ICONS[lookupKey] || CreditCard;

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
              {amount > 0 ? '+' : ''}
              {fmt(amount)}
            </div>
            <div className="text-[10.5px] font-mono text-text-muted/70 mt-1">
              {id} · {created}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusBadge status={status} size="lg" />
          {method && (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.09em] rounded-[5px] px-2 py-[3px] border border-border/25 text-text-muted/75 bg-bg/40 font-heading">
              {method}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Audit Trail Component ── */
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * TransactionDetailDrawer Component
 *
 * Replicates the admin-side details panel (FinanceRecordDrawer) styling exactly.
 */
export function TransactionDetailDrawer({ transaction, open, onClose, triggerToast }) {
  if (!transaction) return null;

  const copyToClipboard = (text, typeName) => {
    navigator.clipboard.writeText(text);
    triggerToast?.(`${typeName} copied to clipboard`);
  };

  const statusColor = STATUS_CLR[transaction.status] || 'var(--text-muted)';
  const rowTs = new Date(transaction.date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const auditEntries = transaction.statusHistory?.map((step) => ({
    action: step.status,
    by: 'System',
    ts: step.date
  })) || [];

  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[720px]">
      <DHeader
        eyebrow="Transaction Record Review"
        title={`Transaction — ${transaction.id}`}
        subtitle="Inspect transaction ledger values, payment details, and audit flow."
        onClose={onClose}
        accentColor="var(--brand)"
      />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Dynamic Status Hero Banner */}
        <StatusHeroBanner
          status={transaction.status}
          amount={transaction.amount}
          id={transaction.id}
          created={rowTs}
          method={transaction.method}
        />

        {/* Transaction Summary */}
        <DrawerSection title="Transaction Summary">
          <DrawerFormGrid>
            <DrawerField label="Transaction ID" value={transaction.id} mono copyable />
            <DrawerField label="Status" value={transaction.status} accent={statusColor} />
            <DrawerField
              label="Amount"
              value={(transaction.amount > 0 ? '+' : '') + fmt(transaction.amount)}
              mono
              accent={transaction.amount > 0 ? 'var(--positive)' : 'var(--text)'}
            />
            <DrawerField label="Method" value={transaction.method} />
            <DrawerField label="Gross Amount" value={fmt(Math.abs(transaction.amount))} mono />
            <DrawerField label="Processing Fee" value={fmt(transaction.fee || 0)} mono accent="var(--negative)" />
            <DrawerField label="Net Charged / Credited" value={fmt(Math.abs(transaction.netAmount))} mono accent="var(--brand)" wide />
            <DrawerField label="Reference ID" value={transaction.referenceId || '—'} mono copyable wide={!!transaction.referenceId} />
            <DrawerField label="Timestamp" value={rowTs} mono />
          </DrawerFormGrid>
        </DrawerSection>

        {/* Money Flow */}
        <DrawerSection title="Money Flow">
          <div className="flex items-center gap-3 justify-between p-3.5 rounded-[9px] bg-bg border border-border/10">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted/40 mb-0.5">Source</p>
              <p className="text-[12.5px] font-bold text-text truncate">{transaction.source || 'N/A'}</p>
            </div>
            <div className="shrink-0 flex items-center justify-center text-text-muted/30">
              <ArrowLeftRight size={13} />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.06em] text-text-muted/40 mb-0.5">Destination</p>
              <p className="text-[12.5px] font-bold text-text truncate">{transaction.destination || 'N/A'}</p>
            </div>
          </div>
        </DrawerSection>

        {/* Status History / Audit Trail */}
        <DrawerSection title="Audit Trail" collapsible>
          <DrawerAuditTrail entries={auditEntries} statusColor={statusColor} />
        </DrawerSection>

        {/* Notes */}
        {transaction.notes && (
          <DrawerSection title="Internal Notes">
            <div className="rounded-[10px] border border-border/20 bg-bg/40 px-3.5 py-2.5 text-[11.5px] text-text-muted/70 font-heading leading-relaxed">
              {transaction.notes}
            </div>
          </DrawerSection>
        )}

        {/* Proof of Payment */}
        <DrawerSection title="Proof of Payment">
          <div className="flex items-center justify-between p-3 rounded-[9px] border border-border/15 bg-surface-2/30 hover:border-border/30 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-[7px] bg-surface-2 border border-border/20 flex items-center justify-center text-text-muted/40 shrink-0">
                <FileText size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-text truncate">receipt_{transaction.id.toLowerCase()}.pdf</p>
                <p className="text-[10px] text-text-muted/40 font-semibold">142 KB · PDF Document</p>
              </div>
            </div>
            <button
              onClick={() => triggerToast?.('Receipt download started...')}
              className="flex items-center justify-center w-8 h-8 rounded-[7px] bg-muted-surface border border-border text-text hover:bg-surface-bright cursor-pointer transition-all"
              title="Download Receipt"
            >
              <Download size={13} />
            </button>
          </div>
        </DrawerSection>
      </div>

      {/* Footer controls matched to FinanceRecordDrawer */}
      <DrawerFooter>
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex gap-1.5">
            <button
              onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
              className="h-8 px-3 text-[11px] rounded-[7px] border border-border/20 bg-transparent text-text-muted font-bold cursor-pointer hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Copy size={11} /> Copy ID
            </button>
            <button
              onClick={() => triggerToast?.('Receipt download started...')}
              className="h-8 px-3 text-[11px] rounded-[7px] border border-border/20 bg-transparent text-text-muted font-bold cursor-pointer hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Download size={11} /> Download PDF
            </button>
          </div>
          <button
            onClick={onClose}
            className="h-8 px-4 text-[11px] rounded-[7px] border border-border/20 bg-muted-surface text-text font-bold cursor-pointer hover:bg-surface-bright transition-all"
          >
            Close
          </button>
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}

export default TransactionDetailDrawer;
