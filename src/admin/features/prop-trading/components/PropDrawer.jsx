import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from 'lucide-react';
import { StatusChip } from '@/components/ui';
import { MainDrawer } from '@/components/common/drawer';
import { DrawerSection, DrawerField, DrawerFormGrid as DrawerFormGrid } from '@/components/common/drawer';
import { ActionBtn } from '@/components/ui';
import { STATUS_COLOR } from './PropComponents';

/* ══════════════════════════════════════════════════════════════
   SHARED DRAWER PRIMITIVES
══════════════════════════════════════════════════════════════ */

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

/* ── Operator note block (collapsible note card) ── */
function OperatorNoteSection({ value, onChange, placeholder, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

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
        <div className="px-4 py-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/60 px-3 py-2.5 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed animate-fade-in"
          />
        </div>
      )}
    </div>
  );
}

/* ─── Evaluation Drawer ──────────────────────────────────────── */
export function EvaluationDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  return (
    <DrawerShell open={open} onClose={onClose} maxWidth="max-w-[720px]">
      <DHeader
        eyebrow="Evaluation"
        title={row.id}
        subtitle={`${row.trader} · ${row.challenge}`}
        onClose={onClose}
        accentColor={STATUS_COLOR[row.risk] ?? 'var(--brand)'}
      />
      
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <DrawerSection title="Details">
          <DrawerFormGrid>
            <DrawerField label="Trader" value={row.trader} />
            <DrawerField label="UID" value={row.uid} mono />
            <DrawerField label="Challenge" value={row.challenge} />
            <DrawerField label="Phase" value={row.phase} />
            <DrawerField label="Applied" value={row.ts} mono />
            <DrawerField label="Days Active" value={`${row.days} days`} mono />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Performance">
          <DrawerFormGrid>
            <DrawerField label="Profit" value={row.profit} mono accent={row.profit?.startsWith('+') ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="Drawdown" value={row.drawdown} mono accent="var(--negative)" />
            <DrawerField label="Daily Limit" value={row.dailyLoss} accent={row.dailyLoss === 'OK' ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="Risk" value={row.risk} accent={STATUS_COLOR[row.risk] ?? 'var(--text-muted)'} />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="ID Check">
          <DrawerFormGrid>
            <DrawerField label="KYC Status" value={row.kyc} accent={STATUS_COLOR[row.kyc]} />
            <DrawerField label="Reviewed By" value={row.reviewedBy} />
            <DrawerField label="Status" value={row.status} accent={STATUS_COLOR[row.status]} className="sm:col-span-2" />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Trend" collapsible>
          <div className="rounded-[10px] border border-border/20 bg-bg/60 p-3 h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ d: 1, v: 0 }, { d: 2, v: 1.2 }, { d: 3, v: 0.8 }, { d: 4, v: 2.1 }, { d: 5, v: 1.9 }, { d: 6, v: 3.4 }, { d: 7, v: row.profit?.startsWith('+') ? parseFloat(row.profit) : -1 }]}>
                <defs>
                  <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="var(--brand)" strokeWidth={1.5} fill="url(#evGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DrawerSection>

        <OperatorNoteSection
          value={note}
          onChange={setNote}
          placeholder="Add note..."
        />
        
        <div className="h-2" />
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 space-y-3">
        <div className="flex flex-wrap gap-2 w-full">
          <ActionBtn
            variant="success"
            onClick={() => { onAction('Approved', row.id); onClose(); }}
            label="Approve"
          />
          <ActionBtn
            variant="danger"
            onClick={() => { onAction('Rejected', row.id); onClose(); }}
            label="Reject"
          />
          <ActionBtn
            variant="warning"
            onClick={() => { onAction('Flagged', row.id); onClose(); }}
            label="Flag"
          />
          <ActionBtn
            variant="default"
            onClick={() => { onAction('KYC Sent', row.id); onClose(); }}
            label="Request KYC"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusChip value={row.status} colorMap={STATUS_COLOR} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <ActionBtn variant="default" onClick={onClose} label="Close" />
          <ActionBtn variant="brand" onClick={() => { onAction('Review Complete', row.id); onClose(); }} label="Finish Review" />
        </div>
      </div>
    </DrawerShell>
  );
}

/* ─── Funded Account Drawer ──────────────────────────────────── */
export function FundedDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  const pnlPos = row.pnl?.startsWith('+');
  return (
    <DrawerShell open={open} onClose={onClose} maxWidth="max-w-[720px]">
      <DHeader
        eyebrow="Account"
        title={row.id}
        subtitle={`${row.trader} · ${row.uid}`}
        onClose={onClose}
        accentColor={STATUS_COLOR[row.risk] ?? 'var(--brand)'}
      />
      
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <DrawerSection title="Details">
          <DrawerFormGrid>
            <DrawerField label="Account ID" value={row.id} mono />
            <DrawerField label="Trader" value={row.trader} />
            <DrawerField label="UID" value={row.uid} mono />
            <DrawerField label="Started" value={row.since} mono />
            <DrawerField label="Balance" value={row.funded} mono accent="var(--brand)" />
            <DrawerField label="Max Loss Limit" value={row.maxDD} mono />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Performance">
          <DrawerFormGrid>
            <DrawerField label="Current Profit/Loss" value={row.pnl} mono accent={pnlPos ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="PnL %" value={row.pnlPct} mono accent={pnlPos ? 'var(--positive)' : 'var(--negative)'} />
            <DrawerField label="Drawdown" value={row.drawdown} mono accent="var(--negative)" />
            <DrawerField label="Risk Level" value={row.risk} accent={STATUS_COLOR[row.risk] ?? 'var(--text-muted)'} />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Payout">
          <DrawerFormGrid>
            <DrawerField label="Payout Amount" value={row.payout ?? 'N/A'} mono accent="var(--brand)" />
            <DrawerField label="Eligible" value={row.payoutReady ? 'YES' : 'NO'} accent={row.payoutReady ? 'var(--positive)' : 'var(--negative)'} />
          </DrawerFormGrid>
        </DrawerSection>

        <OperatorNoteSection
          value={note}
          onChange={setNote}
          placeholder="Add note..."
        />
        
        <div className="h-2" />
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 space-y-3">
        <div className="flex flex-wrap gap-2 w-full">
          {row.payoutReady && (
            <ActionBtn
              variant="success"
              onClick={() => { onAction('Payout Approved', row.id); onClose(); }}
              label="Pay Out"
            />
          )}
          <ActionBtn
            variant="warning"
            onClick={() => { onAction('Warning Sent', row.id); onClose(); }}
            label="Warn"
          />
          <ActionBtn
            variant="danger"
            onClick={() => { onAction('Account Suspended', row.id); onClose(); }}
            label="Suspend"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusChip value={row.risk} colorMap={STATUS_COLOR} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <ActionBtn variant="default" onClick={onClose} label="Close" />
          <ActionBtn variant="brand" label="Access" />
        </div>
      </div>
    </DrawerShell>
  );
}
