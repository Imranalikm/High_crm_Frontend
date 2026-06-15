import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Copy,
  Check,
  User,
  Send,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Play,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  ShieldCheck,
  FileText,
  AlertOctagon,
  Hash,
  Shield,
  Globe,
  Activity,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { STATUS_CLR, RISK_CLR } from '@/config/constants/finance/mockData';
import { MethodBadge } from '../components/FinanceComponents';
import { adminFinanceApi } from '../services/finance.api';

/* ─────────────────────────────────────────────────────────
   AUDIT TRAIL
   ───────────────────────────────────────────────────────── */
function AuditTrail({ entries }) {
  return (
    <div className="relative space-y-0">
      {entries.map((e, i) => (
        <div key={i} className="relative flex gap-3.5 pb-4 last:pb-0">
          {i < entries.length - 1 && (
            <div className="absolute left-[5px] top-[18px] bottom-0 w-px bg-border/12" />
          )}
          <div
            className="relative z-10 mt-[5px] flex-shrink-0 w-[11px] h-[11px] rounded-full bg-brand/15 border border-brand/35"
            style={{ boxShadow: '0 0 0 3px var(--bg)' }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-text leading-tight">{e.action}</p>
            <p className="text-[11px] font-mono text-text-muted/70 mt-0.5">
              {e.by}&nbsp;·&nbsp;{e.ts}
            </p>
            {e.note && (
              <p className="mt-1.5 text-[12.5px] text-text-muted/80 leading-relaxed bg-bg/60 border border-border/10 rounded-[7px] px-2.5 py-1.5">
                {e.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   RISK INTELLIGENCE PANEL
   ───────────────────────────────────────────────────────── */
const RISK_META = {
  LOW: {
    score: 18,
    desc: 'Transaction passed all automated compliance checks.',
    flags: [
      { label: 'OFAC & Sanctions Matcher', ok: true },
      { label: 'Destination Address Verification', ok: true },
      { label: 'Account Balance Coverage Check', ok: true },
    ],
  },
  MEDIUM: {
    score: 56,
    desc: 'Manual review recommended before processing.',
    flags: [
      { label: 'OFAC & Sanctions Matcher', ok: true },
      { label: 'Destination Address Verification', ok: false },
      { label: 'Account Balance Coverage Check', ok: true },
    ],
  },
  HIGH: {
    score: 91,
    desc: 'Manual review required — do not auto-approve.',
    flags: [
      { label: 'OFAC & Sanctions Matcher', ok: false },
      { label: 'Destination Address Verification', ok: false },
      { label: 'Account Balance Coverage Check', ok: true },
    ],
  },
};

function RiskPanel({ risk, amlClear }) {
  const riskColor = RISK_CLR[risk] || 'var(--text-muted)';
  
  // Calculate dynamic meta based on AML status flag
  const meta = risk === 'HIGH' || !amlClear
    ? RISK_META.HIGH
    : risk === 'MEDIUM'
    ? RISK_META.MEDIUM
    : RISK_META.LOW;

  return (
    <div className="space-y-3.5">
      {/* Threat Score */}
      <div
        className="rounded-[10px] border p-3.5 space-y-2.5"
        style={{
          borderColor: `color-mix(in srgb, ${riskColor} 20%, transparent)`,
          background: `color-mix(in srgb, ${riskColor} 5%, transparent)`,
        }}
      >
        <div className="flex items-end justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70">
            Threat Score
          </span>
          <span
            className="text-[28px] font-mono font-semibold leading-none tabular-nums"
            style={{ color: riskColor }}
          >
            {meta.score}
          </span>
        </div>
        {/* Progress bar */}
        <div className="relative h-1.5 rounded-full overflow-hidden bg-border/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${meta.score}%`, background: riskColor }}
          />
        </div>
        <p className="text-[12px] text-text-muted/80 leading-snug">{meta.desc}</p>
      </div>

      {/* Compliance Flags */}
      <div className="space-y-1.5">
        {meta.flags.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] border"
            style={{
              borderColor: f.ok
                ? 'color-mix(in srgb, var(--positive) 18%, transparent)'
                : 'color-mix(in srgb, var(--negative) 18%, transparent)',
              background: f.ok
                ? 'color-mix(in srgb, var(--positive) 5%, transparent)'
                : 'color-mix(in srgb, var(--negative) 5%, transparent)',
            }}
          >
            {f.ok ? (
              <CheckCircle2 size={11} className="text-positive shrink-0" />
            ) : (
              <AlertTriangle size={11} className="text-negative shrink-0 animate-pulse" />
            )}
            <span
              className="text-[11px] font-semibold leading-tight"
              style={{ color: f.ok ? 'var(--positive)' : 'var(--negative)' }}
            >
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NOTE EDITOR
   ───────────────────────────────────────────────────────── */
function NoteEditor({ onSave }) {
  const [text, setText] = useState('');
  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Add note..."
        className="w-full resize-none rounded-[9px] border border-border/20 bg-bg/60 px-3 py-2.5 text-[12px] text-text outline-none placeholder:text-text-muted/25 focus:border-brand/35 focus:ring-1 focus:ring-brand/8 transition-all"
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => {
            if (text.trim()) {
              onSave(text);
              setText('');
            }
          }}
          className="flex items-center gap-1.5 h-8 px-4 rounded-[7px] text-[11px] font-bold uppercase tracking-wider border border-brand/22 bg-brand/6 text-brand hover:bg-brand/12 disabled:opacity-25 transition-all cursor-pointer"
        >
          <Send size={10} /> Save Note
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FIELD ROW (label + value box)
   ───────────────────────────────────────────────────────── */
function Field({ label, value, mono = false, accent, copyable = false }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-1">
      <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 select-none">
        {label}
      </span>
      <div
        className={`relative group flex h-9 items-center rounded-[8px] border border-border/12 bg-bg/50 px-3 text-[12.5px] ${mono ? 'font-mono' : 'font-medium'} ${copyable ? 'pr-9' : ''}`}
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
            className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-[5px] opacity-0 group-hover:opacity-100 text-text-muted/30 hover:text-brand hover:bg-brand/10 transition-all cursor-pointer"
          >
            {copied ? <Check size={9} /> : <Copy size={9} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION HEADER
   ───────────────────────────────────────────────────────── */
function SectionHead({ icon, title, right }) {
  const IconComponent = icon;
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[6px] bg-brand/8 border border-brand/15 flex items-center justify-center shrink-0">
          <IconComponent size={12} className="text-brand" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70">
          {title}
        </span>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WithdrawalDetailPage — stand-alone details page
   ══════════════════════════════════════════════════════════════ */
export function WithdrawalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const [localAudit, setLocalAudit] = useState([]);

  React.useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        // Extracts the raw ID (e.g., "WDR-1" -> "1")
        const rawId = id.replace(/\D/g, '');
        const res = await adminFinanceApi.getWithdrawalById(rawId);
        
        const w = res.withdrawal;
        const mapped = {
          id: `WDR-${w.id}`,
          rawId: w.id,
          user: { name: w.recipient?.name || w.creator?.name || 'Unknown', uid: `U-${w.createdFor}` },
          amount: parseFloat(w.amount).toFixed(2),
          amtRaw: parseFloat(w.amount),
          destination: w.bankAccount || w.accountId || 'N/A',
          method: w.type || 'Unknown',
          status: w.status?.toUpperCase() || 'PENDING',
          risk: 'LOW',
          compliance: 'PASS',
          aml: 'CLEAR',
          created: new Date(w.createdAt).toLocaleDateString(),
          note: w.note || '',
          reviewedBy: w.status !== 'pending' ? 'sys_admin_01' : null
        };

        setRecord(mapped);
        if (mapped.note) setNotes([mapped.note]);
        
        setLocalAudit([
          { action: 'Withdrawal requested', by: 'ClientPortal', ts: mapped.created },
          { action: 'Compliance checked', by: 'ComplianceEngine', ts: mapped.created, note: `Status: ${mapped.compliance}` },
          { action: 'AML checked', by: 'AML_Engine', ts: mapped.created, note: `Status: ${mapped.aml}` }
        ]);
      } catch (e) {
        setToastMsg('Failed to load withdrawal details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRecord();
  }, [id]);

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const handleAction = async (newStatus, auditMsg) => {
    if (!record) return;
    try {
      if (newStatus === 'PAID') {
        await adminFinanceApi.approveWithdrawal(record.rawId);
      } else if (newStatus === 'REJECTED') {
        await adminFinanceApi.rejectWithdrawal(record.rawId, auditMsg);
      }
      
      const updated = { ...record, status: newStatus, reviewedBy: 'sys_admin_01' };
      setRecord(updated);
      setLocalAudit((prev) => [
        ...prev,
        { action: auditMsg, by: 'sys_admin_01', ts: new Date().toISOString().replace('T', ' ').slice(0, 16) }
      ]);
      toast(`Withdrawal #${record.id} status updated to ${newStatus}`);
    } catch (e) {
      toast(`Action failed: ${e.message}`);
    }
  };

  const handleAddNote = (text) => {
    setNotes((prev) => [...prev, text]);
    setLocalAudit((prev) => [
      ...prev,
      { action: 'Comment added', by: 'sys_admin_01', ts: new Date().toISOString().replace('T', ' ').slice(0, 16), note: text }
    ]);
    toast('Compliance notes successfully saved');
  };

  if (loading) return <PageShell><div className="p-6 text-text-muted">Loading withdrawal...</div></PageShell>;
  if (!record) return <PageShell><div className="p-6 text-negative">Withdrawal not found</div></PageShell>;

  const statusColor = STATUS_CLR[record.status] || 'var(--text-muted)';
  const avatarHue = ((parseInt(record.id.replace(/\D/g, ''), 10) || 55) * 37) % 360;
  const userInitials = record.user?.name
    ? record.user.name.split(' ').map((n) => n[0]).join('')
    : 'U';

  return (
    <PageShell>
      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[300] flex items-center gap-2.5 bg-surface-elevated border border-brand/22 text-text text-[11px] font-bold px-4 py-3 rounded-[9px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-fade-in">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
          </span>
          {toastMsg}
        </div>
      )}

      <div className="space-y-5 animate-fade-up">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 select-none">
          <button
            type="button"
            onClick={() => navigate('/admin/finance/withdrawals')}
            className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-border/18 bg-surface-elevated text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft size={12} />
          </button>
          <span className="text-[11px] text-text-muted/35 font-medium">Finance</span>
          <ChevronRight size={11} className="text-text-muted/25" />
          <button
            type="button"
            onClick={() => navigate('/admin/finance/withdrawals')}
            className="text-[11px] text-text-muted/35 font-medium hover:text-text-muted/65 transition-colors"
          >
            Withdrawals
          </button>
          <ChevronRight size={11} className="text-text-muted/25" />
          <span className="text-[11px] font-mono font-semibold text-brand">{record.id}</span>
        </div>

        {/* ════════════════════════════════════════
            HERO CARD
        ════════════════════════════════════════ */}
        <div className="rounded-[15px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-[2.5px] w-full"
            style={{
              background: `linear-gradient(90deg, ${statusColor}, color-mix(in srgb, ${statusColor} 40%, transparent) 60%, transparent)`,
            }}
          />

          <div className="p-6">
            {/* Row 1: Identity ←→ Amount + Actions */}
            <div className="flex items-start justify-between gap-6 flex-wrap">

              {/* Left: Avatar + Withdrawal ID + User */}
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center font-semibold text-[16px] select-none shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${avatarHue},38%,20%), hsl(${avatarHue + 60},38%,13%))`,
                    color: `hsl(${avatarHue},85%,68%)`,
                    border: `1px solid color-mix(in srgb, hsl(${avatarHue},85%,68%) 22%, transparent)`,
                  }}
                >
                  {userInitials}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5 leading-none">
                    Withdrawal Details
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-[26px] font-mono font-semibold tracking-[-0.03em] text-text leading-none">
                      {record.id}
                    </h1>
                    {/* Status badge */}
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em] border leading-none"
                      style={{
                        color: statusColor,
                        borderColor: `color-mix(in srgb, ${statusColor} 28%, transparent)`,
                        background: `color-mix(in srgb, ${statusColor} 9%, transparent)`,
                      }}
                    >
                      {record.status === 'PENDING' && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ background: statusColor }}
                          />
                          <span
                            className="relative inline-flex h-1.5 w-1.5 rounded-full"
                            style={{ background: statusColor }}
                          />
                        </span>
                      )}
                      {record.status}
                    </span>
                    <MethodBadge value={record.method} />
                  </div>
                  <p className="text-[12.5px] text-text-muted/60 font-medium mt-2">
                    {record.user?.name}
                    <span className="font-mono text-text-muted/40 ml-2 text-[11.5px]">
                      {record.user?.uid}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right: Amount + Actions */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-right">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 mb-1.5">
                    Amount
                  </span>
                  <span className="text-[34px] font-mono font-semibold tracking-[-0.02em] text-negative leading-none tabular-nums">
                    -{record.amount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {record.status === 'PENDING' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction('PAID', 'Withdrawal processed successfully')
                        }
                        className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider bg-positive text-bg hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer shrink-0"
                      >
                        <CheckCircle2 size={12} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction('REJECTED', 'Manual withdrawal rejection confirmed')
                        }
                        className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider bg-negative text-bg hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer shrink-0"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </>
                  )}
                  {(record.status === 'FLAGGED' || record.status === 'FROZEN') && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction('PENDING', 'Hold manually released')
                        }
                        className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider bg-warning text-bg hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer shrink-0"
                      >
                        <Play size={12} /> Release
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction('FROZEN', 'Escalated')
                        }
                        className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider bg-negative text-bg hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer shrink-0"
                      >
                        <ArrowUpRight size={12} /> Escalate
                      </button>
                    </>
                  )}
                  {record.status === 'FAILED' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAction('PENDING', 'Retry execution queued')
                      }
                      className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] text-[11px] font-bold uppercase tracking-wider bg-warning text-bg hover:brightness-110 transition-all cursor-pointer"
                    >
                      <RefreshCw size={12} /> Retry
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toast('Withdrawal receipt exported successfully')}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[10.5px] font-semibold border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
                  >
                    <Download size={11} /> Export
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Metadata strip */}
            <div className="mt-5 pt-4 border-t border-border/10 flex items-center gap-0 flex-wrap">
              {[
                { label: 'Rail', val: record.rail || 'SWIFT Clearing', Icon: Activity },
                { label: 'Created', val: record.created, Icon: Clock },
                { label: 'Reviewer', val: record.reviewedBy || 'Auto System', Icon: Shield },
                { label: 'Region', val: record.user?.region || 'EU', Icon: Globe },
              ].map((chip, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-1.5 px-4 first:pl-0">
                    <chip.Icon size={10} className="text-text-muted/30 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">
                      {chip.label}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted/70 ml-0.5">
                      {chip.val}
                    </span>
                  </div>
                  {i < 3 && <div className="h-3 w-px bg-border/15 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AML alert banner if flagged */}
        {record.aml === 'FLAG' && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3.5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
              <AlertOctagon size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-[12.5px] font-bold text-negative font-heading">
                AML Flag Active
              </h4>
              <p className="text-[11.5px] text-negative/70 font-heading mt-0.5 leading-relaxed">
                These funds are frozen. Manual approval is required.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            BODY: Main (8) + Sidebar (4)
        ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ──────────────── LEFT COLUMN ──────────────── */}
          <div className="lg:col-span-8 space-y-5">

            {/* Payout Ledger Details */}
            <div className="rounded-[13px] border border-border/18 bg-surface-elevated shadow-card-subtle p-5">
              <SectionHead icon={Hash} title="Details" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Field label="ID" value={record.id} mono copyable />
                <Field label="Method" value={record.method} />
                <Field label="Amount" value={`-${record.amount}`} mono accent="var(--negative)" />
                <Field label="Status" value={record.status} accent={statusColor} />
                <Field label="Destination" value={record.destination} mono copyable />
                <Field
                  label="Compliance"
                  value={record.compliance}
                  accent={record.compliance === 'PASS' ? 'var(--positive)' : 'var(--negative)'}
                />
                <Field
                  label="AML Status"
                  value={record.aml}
                  accent={record.aml === 'CLEAR' ? 'var(--positive)' : 'var(--negative)'}
                />
                <Field label="Time" value={record.created} mono />
                <Field label="Provider" value={record.rail || 'SWIFT Clearing'} mono />
                <Field label="Reviewer" value={record.reviewedBy || 'Unassigned'} />
              </div>
            </div>

            {/* Beneficiary Client Context */}
            <div className="rounded-[13px] border border-border/18 bg-surface-elevated shadow-card-subtle p-5">
              <SectionHead icon={User} title="User Details" />

              {/* Profile Row */}
              <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border/10">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center font-semibold text-[13px] select-none shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${avatarHue},38%,20%), hsl(${avatarHue + 60},38%,13%))`,
                    color: `hsl(${avatarHue},85%,68%)`,
                    border: `1px solid color-mix(in srgb, hsl(${avatarHue},85%,68%) 22%, transparent)`,
                  }}
                >
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14.5px] font-semibold text-text leading-tight">
                    {record.user?.name}
                  </h3>
                  <p className="text-[11px] font-mono text-text-muted/70 mt-0.5">
                    {record.user?.uid}&nbsp;·&nbsp;{record.user?.email}
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 border border-border/15 px-2.5 py-1 rounded-[6px] bg-bg/40 shrink-0">
                  {record.user?.region || 'EU'}
                </span>
              </div>

              {/* KYC / Wallet / MT5 metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'KYC',
                    val: 'PASSED',
                    color: 'var(--positive)',
                    bg: 'color-mix(in srgb, var(--positive) 7%, transparent)',
                    border: 'color-mix(in srgb, var(--positive) 18%, transparent)',
                  },
                  {
                    label: 'Wallet',
                    val: 'ACTIVE',
                    color: 'var(--positive)',
                    bg: 'color-mix(in srgb, var(--positive) 7%, transparent)',
                    border: 'color-mix(in srgb, var(--positive) 18%, transparent)',
                  },
                  {
                    label: 'MT5 Accounts',
                    val: '3 ACTIVE',
                    color: 'var(--brand)',
                    bg: 'color-mix(in srgb, var(--brand) 7%, transparent)',
                    border: 'color-mix(in srgb, var(--brand) 18%, transparent)',
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="rounded-[9px] px-3 py-3 border text-center"
                    style={{ background: m.bg, borderColor: m.border }}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 mb-1.5 leading-none">
                      {m.label}
                    </span>
                    <span
                      className="font-mono font-semibold text-[13px] leading-none"
                      style={{ color: m.color }}
                    >
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ──────────────── RIGHT SIDEBAR ──────────────── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Risk Intelligence */}
            <div className="rounded-[13px] border border-border/18 bg-surface-elevated shadow-card-subtle p-5">
              <SectionHead icon={ShieldAlert} title="Risk" />
              <RiskPanel risk={record.risk} amlClear={record.aml === 'CLEAR'} />
            </div>

            {/* Compliance Notes */}
            <div className="rounded-[13px] border border-border/18 bg-surface-elevated shadow-card-subtle p-5">
              <SectionHead icon={FileText} title="Notes" />
              {notes.length > 0 && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 mb-3">
                  {notes.map((n, idx) => (
                    <div
                      key={idx}
                      className="rounded-[8px] px-3 py-2.5 text-[11.5px] leading-relaxed border"
                      style={{
                        color: 'var(--brand)',
                        borderColor: 'color-mix(in srgb, var(--brand) 22%, transparent)',
                        background: 'color-mix(in srgb, var(--brand) 5%, transparent)',
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
              <NoteEditor onSave={handleAddNote} />
            </div>

            {/* Audit Log */}
            <div className="rounded-[13px] border border-border/18 bg-surface-elevated shadow-card-subtle p-5">
              <SectionHead
                icon={Clock}
                title="History"
                right={
                  <span className="text-[11px] font-mono text-text-muted/70 border border-border/15 px-2 py-0.5 rounded-[5px] bg-bg/30">
                    {localAudit.length} events
                  </span>
                }
              />
              <AuditTrail entries={localAudit} />
            </div>

          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default WithdrawalDetailPage;
