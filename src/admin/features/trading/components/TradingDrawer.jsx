import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Send,
  FileText,
} from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';

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

/* ══════════════════════════════════════════════════════════════
   OPERATOR NOTE SECTION — collapsible internal note block
══════════════════════════════════════════════════════════════ */
function OperatorNoteSection({ value, onChange, onSave, placeholder, defaultOpen = false }) {
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
        <div className="px-4 py-4 space-y-2.5">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/60 px-3 py-2.5 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!value?.trim()}
              onClick={onSave}
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

/* ══════════════════════════════════════════════════════════════
   TRADING DRAWER — generic wrapper for all trading drawers
══════════════════════════════════════════════════════════════ */
export function TradingDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  actionDone,
  width = 'max-w-[720px]',
  eyebrow = 'Trading',
  accentColor = 'var(--brand)',
}) {
  const [note, setNote] = useState('');

  return (
    <DrawerShell open={open} onClose={onClose} maxWidth={width}>

      {/* ── Header ── */}
      <DHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        accentColor={accentColor}
      />

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {/* Drawer content injected by callers */}
        {children}

        {/* Operator note — always at the bottom, collapsed by default */}
        <OperatorNoteSection
          value={note}
          onChange={setNote}
          placeholder="Add note..."
          onSave={() => setNote('')}
          defaultOpen={false}
        />

        {/* Bottom padding */}
        <div className="h-2" />
      </div>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated px-6 py-4 space-y-3">

        {/* Action-done confirmation banner */}
        {actionDone && (
          <div className="flex items-center gap-2.5 rounded-[9px] border border-positive/22 bg-positive/6 px-3.5 py-2.5 animate-fade-in">
            <div className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
            </div>
            <CheckCircle2 size={12} className="text-positive flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-positive select-none">
              System: {actionDone}
            </span>
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-text-muted/40 font-medium leading-snug max-w-[280px]">
            All actions are logged in history.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/28 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

    </DrawerShell>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRADING QUICK ACTIONS — dynamic-color action button grid
══════════════════════════════════════════════════════════════ */
export function TradingQuickActions({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map(({ label, color, icon: Icon, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="group relative flex items-center gap-2.5 h-9 px-4 rounded-[9px] border text-[11.5px] font-bold overflow-hidden transition-all active:scale-[0.97] cursor-pointer hover:brightness-110"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 8%, transparent)`,
            borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          {/* Hover shimmer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `color-mix(in srgb, ${color} 5%, transparent)` }}
          />
          {Icon && (
            <Icon
              size={12}
              className="flex-shrink-0 relative z-[1] transition-transform duration-200 group-hover:scale-110"
              style={{ color }}
            />
          )}
          <span className="relative z-[1] truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}