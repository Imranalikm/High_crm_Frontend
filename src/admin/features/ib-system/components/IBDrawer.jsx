import React, { useState } from 'react';
import {
  AlertOctagon, BarChart2, CheckCircle2, CircleDollarSign,
  Edit2, Flag, GitBranch, Link, Lock, PauseCircle,
  RefreshCw, User, UserCheck, Users, Wallet, XCircle, Copy, Send,
  ChevronDown, ChevronUp, FileText, X
} from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';
import { DrawerSection, DrawerField, DrawerFormGrid as DrawerFormGrid } from '@/components/common/drawer';
import { STATUS_CLR, TIER_CLR } from '@/config/constants/ib-system/workspaces/shared.workspace';
import { ActionBtn as IconBtn, StatusChip } from '@/components/ui';

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
          Operator Note
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
            className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/60 px-3 py-2.5 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

/* ─── Referral Drawer ────────────────────────────────────────── */
export function ReferralDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  const conv = row.active && row.referred ? ((row.active / row.referred) * 100).toFixed(1) : '—';
  return (
    <DrawerShell open={open} onClose={onClose} maxWidth="max-w-[720px]">
      <DHeader
        eyebrow="IB Partner"
        title={row.id}
        subtitle={`${row.name} · ${row.region}`}
        onClose={onClose}
        accentColor={TIER_CLR[row.tier] ?? 'var(--brand)'}
      />
      
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <DrawerSection title="Partner Identity">
          <DrawerFormGrid>
            <DrawerField label="Partner Name" value={row.name} className="sm:col-span-2" />
            <DrawerField label="Partner ID" value={row.id} mono />
            <DrawerField label="Referral Code" value={row.code} mono />
            <DrawerField label="Region" value={row.region} />
            <DrawerField label="Tier" value={row.tier} accent={TIER_CLR[row.tier]} />
            <DrawerField label="Revenue Share" value={row.share} mono accent="var(--brand)" />
            <DrawerField label="Last Activity" value={row.lastActivity} mono />
            <DrawerField label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Referral Stats">
          <DrawerFormGrid>
            <DrawerField label="Total Referred" value={row.referred?.toLocaleString()} mono />
            <DrawerField label="Active Users" value={row.active?.toLocaleString()} mono accent="var(--positive)" />
            <DrawerField label="Conversion Rate" value={`${conv}%`} mono accent="var(--cyan)" />
            <DrawerField label="Inactive" value={(row.referred - row.active)?.toLocaleString()} mono accent="var(--negative)" />
          </DrawerFormGrid>
        </DrawerSection>

        <DrawerSection title="Referral Link">
          <div className="flex items-center gap-2 rounded-[10px] border border-border/25 bg-bg/50 px-3 h-10">
            <code className="flex-1 text-[11px] font-mono text-cyan truncate">https://live-trader.com/ref/{row.code?.toLowerCase()}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://live-trader.com/ref/${row.code?.toLowerCase()}`);
                onAction('Link copied', row.id);
              }}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-text-muted/40 hover:text-text cursor-pointer outline-none"
            >
              <Copy size={11} />
            </button>
          </div>
        </DrawerSection>

        <OperatorNoteSection
          value={note}
          onChange={setNote}
          placeholder="Add relationship management notes..."
        />

        <DrawerSection title="Actions">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <IconBtn label="Edit Partner" Icon={Edit2} variant="default" onClick={() => { onAction('Edit opened', row.id); onClose(); }} />
            <IconBtn label="Suspend" Icon={Lock} variant="danger" onClick={() => { onAction('Suspended', row.id); onClose(); }} />
            <IconBtn label="View Tree" Icon={GitBranch} variant="cyan" onClick={() => { onAction('Tree opened', row.id); onClose(); }} />
            <IconBtn label="Commission Hist." Icon={BarChart2} variant="brand" onClick={() => { onAction('History', row.id); onClose(); }} />
          </div>
        </DrawerSection>
        
        <div className="h-2" />
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusChip value={row.status} colorMap={STATUS_CLR} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <IconBtn variant="default" onClick={onClose} label="Close" />
          <IconBtn variant="brand" label="View Profile" />
        </div>
      </div>
    </DrawerShell>
  );
}

/* ─── Commission Drawer ──────────────────────────────────────── */
export function CommissionDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  return (
    <DrawerShell open={open} onClose={onClose} maxWidth="max-w-[720px]">
      <DHeader
        eyebrow="Commission Record"
        title={row.id}
        subtitle={`${row.partner} · ${row.source}`}
        onClose={onClose}
        accentColor={TIER_CLR[row.tier] ?? 'var(--brand)'}
      />
      
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <DrawerSection title="Commission Details">
          <DrawerFormGrid>
            <DrawerField label="Commission ID" value={row.id} mono />
            <DrawerField label="Partner" value={row.partner} />
            <DrawerField label="Referred User" value={row.user} />
            <DrawerField label="Source" value={row.source} />
            <DrawerField label="Amount" value={row.amount} mono accent="var(--brand)" />
            <DrawerField label="Tier" value={row.tier} accent={TIER_CLR[row.tier]} />
            <DrawerField label="Created" value={row.date} mono />
            <DrawerField label="Payout State" value={row.payout} accent={STATUS_CLR[row.payout]} />
            <DrawerField label="Approval" value={row.approval} accent={STATUS_CLR[row.approval]} className="sm:col-span-2" />
          </DrawerFormGrid>
        </DrawerSection>

        <OperatorNoteSection
          value={note}
          onChange={setNote}
          placeholder="Add audit or review notes for this commission..."
        />

        <DrawerSection title="Actions">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {row.approval === 'REVIEW' && (
              <>
                <IconBtn label="Approve" Icon={CheckCircle2} variant="success" onClick={() => { onAction('Approved', row.id); onClose(); }} />
                <IconBtn label="Reject" Icon={XCircle} variant="danger" onClick={() => { onAction('Rejected', row.id); onClose(); }} />
              </>
            )}
            <IconBtn label="Hold Payment" Icon={PauseCircle} variant="warning" onClick={() => { onAction('Held', row.id); onClose(); }} />
            <IconBtn label="View Partner" Icon={User} variant="default" onClick={onClose} />
          </div>
        </DrawerSection>
        
        <div className="h-2" />
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusChip value={row.approval} colorMap={STATUS_CLR} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <IconBtn variant="default" onClick={onClose} label="Close" />
          <IconBtn variant="brand" label="View Source" />
        </div>
      </div>
    </DrawerShell>
  );
}

/* ─── Payout Drawer ──────────────────────────────────────────── */
export function PayoutDrawer({ row, open, onClose, onAction }) {
  const [note, setNote] = useState('');

  if (!row) return null;
  const riskColor = row.risk === 'HIGH' ? 'var(--negative)' : row.risk === 'MEDIUM' ? 'var(--warning)' : 'var(--positive)';

  return (
    <DrawerShell open={open} onClose={onClose} maxWidth="max-w-[720px]">
      <DHeader
        eyebrow="IB Payout Request"
        title={row.id}
        subtitle={`${row.partner} · ${row.amount}`}
        onClose={onClose}
        accentColor={STATUS_CLR[row.status] ?? 'var(--brand)'}
      />
      
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <DrawerSection title="Payout Details">
          <DrawerFormGrid>
            <DrawerField label="Payout ID" value={row.id} mono />
            <DrawerField label="Partner" value={row.partner} />
            <DrawerField label="Amount" value={row.amount} mono accent="var(--brand)" />
            <DrawerField label="Method" value={row.method} />
            <DrawerField label="Status" value={row.status} accent={STATUS_CLR[row.status]} />
            <DrawerField label="Risk Check" value={row.risk} accent={riskColor} />
            <DrawerField label="Requested" value={row.requestedAt} mono className="sm:col-span-2" />
            <DrawerField label="Processed By" value={row.processedBy} />
          </DrawerFormGrid>
        </DrawerSection>

        {row.risk === 'HIGH' && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-negative/25 bg-negative/5 px-3.5 py-3 shadow-sm">
            <AlertOctagon size={13} className="text-negative flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[11.5px] font-bold text-negative">High Risk Detected</div>
              <div className="text-[11px] text-negative/70 mt-0.5">Flagged for manual review. Verify partner identity and source of funds before processing.</div>
            </div>
          </div>
        )}

        <OperatorNoteSection
          value={note}
          onChange={setNote}
          placeholder="Add payment processing or exception handling notes..."
        />

        <DrawerSection title="Actions">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(row.status === 'PENDING' || row.status === 'REVIEW') && (
              <>
                <IconBtn label="Approve Payout" Icon={CheckCircle2} variant="success" onClick={() => { onAction('Payout Approved', row.id); onClose(); }} />
                <IconBtn label="Reject" Icon={XCircle} variant="danger" onClick={() => { onAction('Payout Rejected', row.id); onClose(); }} />
              </>
            )}
            {row.status === 'FROZEN' && (
              <IconBtn label="Unfreeze" Icon={RefreshCw} variant="cyan" onClick={() => { onAction('Unfrozen', row.id); onClose(); }} />
            )}
            <IconBtn label="Flag for Review" Icon={Flag} variant="warning" onClick={() => { onAction('Flagged', row.id); onClose(); }} />
            <IconBtn label="View Partner" Icon={User} variant="default" onClick={onClose} />
          </div>
        </DrawerSection>
        
        <div className="h-2" />
      </div>

      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <StatusChip value={row.risk} colorMap={{ HIGH: 'var(--negative)', MEDIUM: 'var(--warning)', LOW: 'var(--positive)' }} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <IconBtn variant="default" onClick={onClose} label="Close" />
          <IconBtn variant="brand" label="Verify Payout" />
        </div>
      </div>
    </DrawerShell>
  );
}
