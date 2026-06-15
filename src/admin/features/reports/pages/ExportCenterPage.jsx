import React, { useState, useMemo } from 'react';
import { PageToolbar } from '@/components/layout/PageToolbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2, Plus, Pause, Play, PlayCircle, Trash2, Layers,
  AlertOctagon, AlarmClock, Mail, Clock, FileText, X, Zap,
  RefreshCw, ChevronDown, TrendingUp,
} from 'lucide-react';
import { exportTemplates, exportFailureLog } from '@/config/constants/reports/mockData';
import {
  FormatBadge, TYPE_CLR, FORMAT_ICONS, FORMAT_CLR,
  TypePill, IconBtn, STATUS_CLR, StatusBadge,
} from '../components/ReportsComponents';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { DrawerSection, DrawerFormGrid, DrawerField } from '@/components/common/drawer';
import { ActionBtn, Button } from '@/components/ui';
import { useDrawerState } from '@/hooks/useDrawerState';
import { KpiCard } from '@/components/cards';
import { PageShell } from '@/components/layout/PageShell';

/* ─────────────────────────────────────────────────────────
   LOCAL PRIMITIVES
───────────────────────────────────────────────────────── */

function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-[10px] border border-border/28 bg-surface-elevated overflow-hidden transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}

function PanelHead({ icon, title, sub, right }) {
  const IconComponent = icon;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/12 bg-bg/5">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-[6px] bg-brand/10 flex items-center justify-center shrink-0">
          <IconComponent size={10} className="text-brand" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">
            {title}
          </p>
          {sub && (
            <p className="text-[11px] text-text-muted/50 mt-0.5 leading-none">{sub}</p>
          )}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function PrimaryBtn({ icon: Icon, label, onClick, variant = 'brand', small = false }) {
  const map = {
    brand: 'bg-brand border-brand/35 text-text-on-accent hover:bg-brand-hover',
    ghost: 'bg-bg/22 border-border/20 text-text-muted/60 hover:text-text hover:border-border/38 hover:bg-bg/38',
    success: 'bg-positive/8 border-positive/22 text-positive hover:bg-positive/16',
    warning: 'bg-warning/8 border-warning/22 text-warning hover:bg-warning/16',
    danger: 'bg-negative/8 border-negative/22 text-negative hover:bg-negative/16',
    cyan: 'bg-cyan/8 border-cyan/22 text-cyan hover:bg-cyan/16',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-[7px] border font-bold uppercase tracking-wider active:scale-[0.97] transition-all cursor-pointer shrink-0
        ${small ? 'h-7 px-2.5 text-[10px]' : 'h-8 px-3.5 text-[11px]'}
        ${map[variant]}`}
    >
      {Icon && <Icon size={small ? 9 : 10} className="shrink-0" />}
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   TEMPLATE DETAIL DRAWER (unchanged logic, same design)
───────────────────────────────────────────────────────── */

function TemplateDetailDrawer({ open, tpl, onClose, onAction }) {
  if (!tpl) return null;

  const FmtIc = FORMAT_ICONS[tpl.format] || FileText;
  const fmtColor = FORMAT_CLR[tpl.format] || 'var(--text-muted)';
  const typeColor = TYPE_CLR[tpl.type] || 'rgba(255,255,255,0.35)';
  const isPaused = tpl.status === 'PAUSED';
  const statusColor = isPaused ? 'var(--warning)' : 'var(--positive)';

  const freqColorMap = {
    Hourly: 'var(--negative)', Daily: 'var(--cyan)',
    Weekly: 'var(--brand)', Monthly: 'var(--text-muted)',
  };
  const freqColor = freqColorMap[tpl.freq] || 'var(--text-muted)';

  return (
    <MainDrawer open={open} width="max-w-[720px]" onClose={onClose}>
      <DrawerHeader title={tpl.name} subtitle={tpl.id} eyebrow="Export Template" onClose={onClose} />
      <DrawerBody>
        <div className="space-y-6">
          {/* Hero Banner */}
          <div
            className="rounded-[14px] border p-5 relative overflow-hidden"
            style={{
              borderColor: `color-mix(in srgb, ${statusColor} 20%, var(--border))`,
              background: `color-mix(in srgb, ${statusColor} 4%, var(--bg))`,
            }}
          >
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] pointer-events-none" style={{ background: statusColor }} />
            <div className="flex items-start justify-between gap-4 relative z-[1]">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-[11px] border flex items-center justify-center shrink-0"
                  style={{ background: `color-mix(in srgb, ${fmtColor} 12%, transparent)`, borderColor: `color-mix(in srgb, ${fmtColor} 22%, transparent)` }}
                >
                  <FmtIc size={20} style={{ color: fmtColor }} />
                </div>
                <div>
                  <div className="text-[13px] font-black font-heading text-text tracking-tight">{tpl.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <TypePill value={tpl.type} />
                    <FormatBadge value={tpl.format} />
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 h-7 px-3 rounded-full border text-[10px] font-black uppercase tracking-[0.1em] shrink-0"
                style={{ color: statusColor, background: `color-mix(in srgb, ${statusColor} 10%, transparent)`, borderColor: `color-mix(in srgb, ${statusColor} 25%, transparent)` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                {tpl.status}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3.5 border-t" style={{ borderColor: `color-mix(in srgb, ${statusColor} 12%, var(--border))` }}>
              {[
                { Icon: AlarmClock, val: tpl.freq, label: 'Frequency', color: freqColor },
                { Icon: Clock, val: tpl.lastRun || '—', label: 'Last Run', color: 'var(--text-muted)' },
                { Icon: Zap, val: !isPaused && tpl.nextRun !== '—' ? tpl.nextRun : 'Paused', label: 'Next Run', color: 'var(--text-muted)' },
              ].map((item) => {
                const IconComponent = item.Icon;
                return (
                  <div key={item.label} className="flex flex-col gap-1 items-center text-center">
                    <IconComponent size={12} style={{ color: item.color }} />
                    <div className="font-mono text-[11.5px] font-bold" style={{ color: item.color }}>{item.val}</div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <DrawerSection title="Details">
            <DrawerFormGrid>
              <DrawerField label="Type" value={tpl.type} accent={typeColor} />
              <DrawerField label="Format" value={tpl.format} accent={fmtColor} />
              <DrawerField label="Frequency" value={tpl.freq} accent={freqColor} />
              <DrawerField label="Last Run" value={tpl.lastRun} mono />
              <DrawerField label="Next Run" value={!isPaused && tpl.nextRun !== '—' ? tpl.nextRun : 'Paused'} mono wide />
            </DrawerFormGrid>
          </DrawerSection>

          <DrawerSection title="Recipients">
            <div className="rounded-[12px] border border-border/15 bg-bg/20 p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {tpl.recipients.map(r => (
                  <div
                    key={r}
                    className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-[8px] border"
                    style={{ borderColor: 'color-mix(in srgb, var(--brand) 20%, var(--border))', background: 'color-mix(in srgb, var(--brand) 5%, transparent)', color: 'var(--text-muted)' }}
                  >
                    <Mail size={10} style={{ color: 'var(--brand)', opacity: 0.6 }} />
                    {r}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-text-muted/40 font-heading">
                {tpl.recipients.length} recipient{tpl.recipients.length !== 1 ? 's' : ''} · Delivery via Email + Export Queue
              </div>
            </div>
          </DrawerSection>

          <DrawerSection title="Template Controls">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Run Now', Icon: PlayCircle, style: { color: 'var(--brand)', bg: 'color-mix(in srgb, var(--brand) 8%, transparent)', border: 'color-mix(in srgb, var(--brand) 22%, transparent)' }, cb: () => { onAction('Triggered', tpl.id); onClose(); } },
                { label: isPaused ? 'Resume Schedule' : 'Pause Schedule', Icon: isPaused ? Play : Pause, style: { color: 'var(--warning)', bg: 'color-mix(in srgb, var(--warning) 8%, transparent)', border: 'color-mix(in srgb, var(--warning) 22%, transparent)' }, cb: () => { onAction(isPaused ? 'Resumed' : 'Paused', tpl.id); onClose(); } },
                { label: 'Edit Template', Icon: RefreshCw, style: null, cb: () => { onAction('Edit opened', tpl.id); onClose(); } },
                { label: 'Delete Template', Icon: Trash2, style: { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 5%, transparent)', border: 'color-mix(in srgb, var(--negative) 15%, transparent)' }, cb: () => { onAction('Deleted', tpl.id); onClose(); } },
              ].map((item) => {
                const IconComponent = item.Icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.cb}
                    className="flex items-center gap-2 h-10 px-4 rounded-[10px] border font-bold font-heading text-[11px] transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer"
                    style={item.style
                      ? { color: item.style.color, background: item.style.bg, borderColor: item.style.border }
                      : { color: 'var(--text-muted)', background: 'color-mix(in srgb, var(--bg) 30%, transparent)', borderColor: 'var(--border)' }}
                  >
                    <IconComponent size={12} /> {item.label}
                  </button>
                );
              })}
            </div>
          </DrawerSection>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge value={tpl.status} />
            <TypePill value={tpl.type} />
            <FormatBadge value={tpl.format} />
          </div>
          <ActionBtn variant="default" onClick={onClose} label="Close" />
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}

/* ─────────────────────────────────────────────────────────
   TEMPLATE CARD
───────────────────────────────────────────────────────── */

function TemplateCard({ tpl, onOpen, onAct }) {
  const FmtIc = FORMAT_ICONS[tpl.format] || FileText;
  const fmtColor = FORMAT_CLR[tpl.format] || 'var(--text-muted)';
  const isPaused = tpl.status === 'PAUSED';

  const freqColorMap = {
    Hourly: 'var(--negative)', Daily: 'var(--cyan)',
    Weekly: 'var(--brand)', Monthly: 'var(--text-muted)',
  };
  const fqColor = freqColorMap[tpl.freq] || 'var(--text-muted)';
  const typeColor = TYPE_CLR[tpl.type] || 'var(--text-muted)';

  return (
    <div
      onClick={() => onOpen(tpl)}
      className={`group relative rounded-[10px] border px-4 py-3.5 cursor-pointer transition-all duration-300 overflow-visible
        ${isPaused ? 'opacity-65 hover:opacity-100' : ''}`}
      style={{
        backgroundColor: isPaused ? 'color-mix(in srgb, var(--bg) 60%, transparent)' : 'color-mix(in srgb, var(--bg) 75%, transparent)',
        borderColor: isPaused ? 'color-mix(in srgb, var(--border) 45%, transparent)' : 'color-mix(in srgb, var(--border) 75%, transparent)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `color-mix(in srgb, ${typeColor} 45%, transparent)`;
        e.currentTarget.style.backgroundColor = `color-mix(in srgb, ${typeColor} 3.5%, var(--surface-elevated))`;
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.18), 0 0 15px color-mix(in srgb, ${typeColor} 10%, transparent)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isPaused ? 'color-mix(in srgb, var(--border) 45%, transparent)' : 'color-mix(in srgb, var(--border) 75%, transparent)';
        e.currentTarget.style.backgroundColor = isPaused ? 'color-mix(in srgb, var(--bg) 60%, transparent)' : 'color-mix(in srgb, var(--bg) 75%, transparent)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Active indicator dot */}
      {!isPaused && (
        <span
          className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--positive)', boxShadow: '0 0 4px var(--positive)' }}
        />
      )}

      {/* Row 1: Icon + name + badges */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-[9px] border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            background: `color-mix(in srgb, ${fmtColor} 10%, transparent)`,
            borderColor: `color-mix(in srgb, ${fmtColor} 18%, transparent)`,
          }}
        >
          <FmtIc size={15} style={{ color: fmtColor }} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <p className="text-[12.5px] font-bold text-text/90 truncate group-hover:text-text transition-colors">
            {tpl.name}
          </p>
          <p className="text-[11px] font-mono text-text-muted/60 mt-0.5">{tpl.id}</p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge value={tpl.status} />
          <TypePill value={tpl.type} />
        </div>
      </div>

      {/* Row 2: Metrics strip */}
      <div className="flex items-center gap-0 border-t border-border/8 pt-3 flex-wrap">
        {[
          { Icon: AlarmClock, val: tpl.freq, color: fqColor },
          { Icon: Mail, val: `${tpl.recipients.length} recipients`, color: 'var(--text-muted)' },
          { Icon: Clock, val: `Last: ${tpl.lastRun || '—'}`, color: 'var(--text-muted)' },
          { Icon: Zap, val: isPaused ? 'Paused' : `Next: ${tpl.nextRun !== '—' ? tpl.nextRun : '—'}`, color: isPaused ? 'var(--warning)' : 'var(--text-muted)' },
        ].map((item, i) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 first:pl-0 border-r border-border/8 last:border-0 py-0 text-text-muted/70"
              style={{ color: item.color, opacity: item.color === 'var(--text-muted)' ? 0.6 : 1 }}
            >
              <IconComponent size={10} className="shrink-0" />
              {item.val}
            </div>
          );
        })}
      </div>

      {/* Floating Action Popup on Hover */}
      <div
        className="absolute right-4 bottom-2.5 flex items-center gap-1.5 bg-surface-elevated/95 backdrop-blur-md border rounded-[8px] p-1.5 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-30"
        style={{
          borderColor: `color-mix(in srgb, ${typeColor} 30%, var(--border))`,
          boxShadow: `0 8px 24px rgba(0,0,0,0.35), 0 0 12px color-mix(in srgb, ${typeColor} 12%, transparent)`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <PrimaryBtn
          icon={isPaused ? Play : Pause}
          label={isPaused ? 'Resume' : 'Pause'}
          variant={isPaused ? 'success' : 'warning'}
          small
          onClick={e => { e.stopPropagation(); onAct(isPaused ? 'Resumed' : 'Paused', tpl.id); }}
        />
        <PrimaryBtn
          icon={PlayCircle}
          label="Run Now"
          variant="brand"
          small
          onClick={e => { e.stopPropagation(); onAct('Triggered', tpl.id); }}
        />
        <div className="w-px h-5 bg-border/20 mx-0.5" />
        <button
          onClick={e => { e.stopPropagation(); onAct('Deleted', tpl.id); }}
          className="flex items-center justify-center w-7 h-7 rounded-[6px] border border-negative/15 bg-negative/5 text-negative/55 hover:text-negative hover:bg-negative/10 cursor-pointer transition-all shrink-0 active:scale-[0.92]"
          title="Delete Template"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FAILURE LOG ITEM
───────────────────────────────────────────────────────── */

function FailureItem({ f, onAct }) {
  return (
    <div className="border-b border-border/8 last:border-0 px-4 py-3">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-[12px] font-semibold text-text/90 leading-tight">{f.template}</p>
        <span className="text-[11px] font-mono text-text-muted/65 shrink-0">{f.ts?.split(' ')[0] || '—'}</span>
      </div>
      <p className="text-[11.5px] text-negative/85 leading-snug mb-2.5">{f.reason}</p>
      <div className="flex gap-1.5">
        <PrimaryBtn
          icon={RefreshCw}
          label="Retry"
          variant="warning"
          small
          onClick={() => onAct('Retried', f.id)}
        />
        <PrimaryBtn
          icon={X}
          label="Dismiss"
          variant="ghost"
          small
          onClick={() => onAct('Dismissed', f.id)}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ADD TEMPLATE DRAWER (unchanged)
───────────────────────────────────────────────────────── */

function AddTemplateDrawer({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', type: 'Finance', format: 'PDF', freq: 'Daily', recipients: '',
  });

  const freqColorMap = {
    Hourly: 'var(--negative)', Daily: 'var(--cyan)',
    Weekly: 'var(--brand)', Monthly: 'var(--text-muted)',
  };

  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[720px]">
      <DrawerHeader title="Create Template" eyebrow="New Automation" onClose={onClose} />
      <DrawerBody>
        <div className="space-y-6">
          {/* Hint */}
          <div className="flex items-start gap-3 rounded-[12px] border border-brand/15 bg-brand/[0.04] px-4 py-3.5">
            <Zap size={14} className="text-brand shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-text-muted/70 font-heading leading-relaxed">
              Templates run on a schedule and send reports to the listed recipients when done.
            </p>
          </div>

          <DrawerSection title="Details">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">Template Name</span>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Finance Weekly PDF"
                  className="h-10 rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
                />
              </div>

              <DrawerFormGrid>
                {[
                  { label: 'Report Type', key: 'type', opts: ['Finance', 'Trading', 'User', 'System'] },
                  { label: 'Export Format', key: 'format', opts: ['PDF', 'XLSX', 'CSV', 'JSON'] },
                ].map(({ label, key, opts }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">{label}</span>
                    <div className="relative">
                      <select
                        value={form[key]}
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="h-10 w-full appearance-none rounded-[10px] border border-border/25 bg-bg px-3 pr-8 text-[12px] text-text outline-none transition-all focus:border-brand/40 focus:ring-2 focus:ring-brand/10 cursor-pointer"
                      >
                        {opts.map(o => <option key={o} className="bg-bg text-text">{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/45" />
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">Run Frequency</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['Hourly', 'Daily', 'Weekly', 'Monthly'].map(f => {
                      const fc = freqColorMap[f];
                      const active = form.freq === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setForm(p => ({ ...p, freq: f }))}
                          className="h-10 rounded-[10px] border font-bold font-heading text-[11px] transition-all cursor-pointer"
                          style={{
                            color: active ? fc : 'var(--text-muted)',
                            background: active ? `color-mix(in srgb, ${fc} 10%, transparent)` : 'transparent',
                            borderColor: active ? `color-mix(in srgb, ${fc} 30%, transparent)` : 'var(--border)',
                            opacity: active ? 1 : 0.45,
                          }}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </DrawerFormGrid>
            </div>
          </DrawerSection>

          <DrawerSection title="Recipients & Delivery">
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">
                  Email Recipients (comma separated)
                </span>
                <div className="relative group/ipt">
                  <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/30 group-focus-within/ipt:text-brand/50 transition-colors" />
                  <input
                    value={form.recipients}
                    onChange={e => setForm(p => ({ ...p, recipients: e.target.value }))}
                    placeholder="ops@firm.com, manager@firm.com"
                    className="h-10 w-full rounded-[10px] border border-border/25 bg-bg pl-10 pr-3 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-brand/40 focus:ring-2 focus:ring-brand/10 font-mono"
                  />
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[12px] border border-warning/15 bg-warning/[0.04] px-4 py-3">
                <AlertOctagon size={13} className="text-warning shrink-0 mt-0.5" />
                <p className="text-[11px] text-warning/72 font-heading leading-relaxed">
                  Templates start right away. Make sure your recipients are correct.
                </p>
              </div>
            </div>
          </DrawerSection>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex items-center justify-between gap-4 w-full">
          <span className="text-[10px] text-text-muted/38 leading-snug max-w-[240px] font-heading">
            Template starts immediately and runs on the set schedule.
          </span>
          <div className="flex items-center gap-2">
            <ActionBtn variant="default" label="Cancel" onClick={onClose} />
            <ActionBtn
              variant="brand"
              label="Create Template"
              onClick={() => { onClose(); onSave(form.name || 'New'); }}
            />
          </div>
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}

/* ─────────────────────────────────────────────────────────
   EXPORT CENTER PAGE
───────────────────────────────────────────────────────── */

export function ExportCenterPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const exportDrawer = useDrawerState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [toast, setToast] = useState(null);

  const act = (msg, id = '') => {
    const msgs = {
      'All active templates triggered': 'All active templates triggered.',
      'Triggered': `Job run started for template: ${id}`,
      'Paused': `Schedule paused: ${id}`,
      'Resumed': `Schedule resumed: ${id}`,
      'Deleted': `Template deleted: ${id}`,
      'Edit opened': `Editing template: ${id}`,
      'Retried': 'Retrying failed job.',
      'Dismissed': 'Alert dismissed.',
    };
    setToast(msgs[msg] ?? (msg.startsWith('Template') ? msg : `${msg}: ${id}`));
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    let rows = exportTemplates;
    if (filter !== 'all') {
      if (['ACTIVE', 'PAUSED'].includes(filter)) rows = rows.filter(r => r.status === filter);
      else rows = rows.filter(r => r.type === filter);
    }
    if (search) rows = rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search)
    );
    return rows;
  }, [search, filter]);

  const activeCount = exportTemplates.filter(t => t.status === 'ACTIVE').length;
  const pausedCount = exportTemplates.filter(t => t.status === 'PAUSED').length;

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── TOAST ── */}
        {toast && (
          <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 rounded-[12px] border border-positive/28 bg-surface/88 backdrop-blur-md px-4 py-3 text-[12px] font-semibold text-positive font-heading shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={13} className="text-positive shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* ─────────────────────────────────────────────────
            HEADER
        ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              Reports Module
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
              Export Center
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
              Set up automated report delivery on a schedule. Manage templates and track any failures.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <PrimaryBtn
              icon={PlayCircle}
              label="Run All"
              variant="cyan"
              onClick={() => act('All active templates triggered')}
            />
            <PrimaryBtn
              icon={Plus}
              label="New Template"
              variant="brand"
              onClick={() => setShowAddDrawer(true)}
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            KPI STRIP
        ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Active', val: activeCount, color: 'var(--positive)', Icon: Layers },
            { label: 'Paused', val: pausedCount, color: 'var(--warning)', Icon: Pause },
            { label: 'Failures', val: exportFailureLog.length, color: 'var(--negative)', Icon: AlertOctagon },
            { label: 'Next Run', val: '< 1 hour', color: 'var(--cyan)', Icon: AlarmClock },
          ].map(s => (
            <KpiCard key={s.label} label={s.label} value={s.val} Icon={s.Icon} accent={s.color} />
          ))}
        </div>

        {/* ─────────────────────────────────────────────────
            MAIN GRID: Templates list | Sidebar
        ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">

          {/* ── LEFT: Toolbar + Template Cards ── */}
          <div className="space-y-3">
            <PageToolbar
              search={search}
              onSearchChange={setSearch}
              placeholder="Search templates…"
              filterSets={[{
                label: 'Filter',
                get: filter,
                set: setFilter,
                opts: ['all', 'ACTIVE', 'PAUSED', 'Finance', 'Trading', 'User', 'System']
                  .map(f => ({ value: f, label: f === 'all' ? 'All' : f })),
              }]}
              actions={[
                { label: 'Run All', icon: PlayCircle, variant: 'secondary', onClick: () => act('All active templates triggered') },
                { label: 'New Template', icon: Plus, variant: 'primary', onClick: () => setShowAddDrawer(true) },
              ]}
            />

            {/* Template cards */}
            {filtered.length > 0 ? (
              <div className="space-y-2">
                {filtered.map(tpl => (
                  <TemplateCard
                    key={tpl.id}
                    tpl={tpl}
                    onOpen={t => exportDrawer.open(t)}
                    onAct={act}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-[10px] border border-dashed border-border/30 bg-bg/8">
                <Layers size={28} className="text-text-muted/15 mb-3" />
                <p className="text-[13px] font-bold text-text-muted/35 font-heading">No templates found</p>
                <p className="text-[11px] text-text-muted/22 font-heading mt-1 mb-5">
                  Try adjusting your filters or create a new one
                </p>
                <PrimaryBtn
                  icon={Plus}
                  label="Create Template"
                  variant="brand"
                  onClick={() => setShowAddDrawer(true)}
                />
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-4 xl:sticky xl:top-[136px]">

            {/* Export Insights */}
            <Panel>
              <PanelHead icon={TrendingUp} title="Export Insights" sub="System performance" />

              {/* Automation status banner */}
              <div className="px-4 pt-3.5 pb-2">
                <div
                  className="flex items-center gap-3 rounded-[8px] border border-positive/18 bg-positive/5 px-3.5 py-2.5"
                >
                  <div
                    className="w-6 h-6 rounded-[6px] bg-positive/12 border border-positive/20 flex items-center justify-center shrink-0"
                  >
                    <Zap size={11} className="text-positive" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text/78 font-heading leading-none">Automation Running</p>
                    <p className="text-[9.5px] text-text-muted/42 font-heading mt-0.5">All scheduled jobs are on track.</p>
                  </div>
                </div>
              </div>

              {/* Performance metrics */}
              <div className="px-4 pb-4 space-y-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 mb-2 mt-2">
                  Performance
                </p>
                {[
                  { label: 'Success Rate', val: '99.2%', trend: '+0.4%' },
                  { label: 'Avg Latency', val: '1.2s', trend: '−0.1s' },
                  { label: 'Total Volume', val: '4.8 GB', trend: '+12%' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border/8 last:border-0">
                    <span className="text-[11px] text-text-muted/52 font-heading">{stat.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-black text-text/72">{stat.val}</span>
                      <span className="text-[9px] font-mono text-positive">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="border-t border-border/10 p-3">
                <button
                  onClick={() => setShowAddDrawer(true)}
                  className="w-full h-8 flex items-center justify-center gap-1.5 rounded-[7px] border border-brand/22 bg-brand/8 text-brand text-[10.5px] font-black uppercase tracking-wider font-heading hover:bg-brand/15 transition-all cursor-pointer"
                >
                  <Plus size={10} />
                  New Template
                </button>
              </div>
            </Panel>

            {/* Failure History */}
            <Panel>
              <PanelHead
                icon={AlertOctagon}
                title="Failed Jobs"
                sub="Recent errors"
                right={
                  <span
                    className="text-[9.5px] font-black font-heading uppercase tracking-wider px-2 py-0.5 rounded-[5px]"
                    style={{ color: 'var(--negative)', background: 'color-mix(in srgb, var(--negative) 10%, transparent)' }}
                  >
                    {exportFailureLog.length} errors
                  </span>
                }
              />

              <div>
                {exportFailureLog.length > 0
                  ? exportFailureLog.map(f => (
                    <FailureItem key={f.id} f={f} onAct={act} />
                  ))
                  : (
                    <div className="flex flex-col items-center py-8 px-4">
                      <CheckCircle2 size={22} className="text-positive/40 mb-2" />
                      <p className="text-[11px] font-bold text-text-muted/35 font-heading">No failures</p>
                      <p className="text-[10px] text-text-muted/22 font-heading mt-0.5">Everything is running fine.</p>
                    </div>
                  )}
              </div>
            </Panel>

          </div>
        </div>

        {/* ── DRAWERS ── */}
        <TemplateDetailDrawer
          open={exportDrawer.isOpen}
          tpl={exportDrawer.value}
          onClose={exportDrawer.close}
          onAction={act}
        />
        <AddTemplateDrawer
          open={showAddDrawer}
          onClose={() => setShowAddDrawer(false)}
          onSave={name => act(`Template "${name}" created`)}
        />
      </div>
    </PageShell>
  );
}