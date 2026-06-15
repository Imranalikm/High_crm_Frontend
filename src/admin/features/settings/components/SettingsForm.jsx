import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Copy, RefreshCw, AlertOctagon, Info, AlertTriangle } from 'lucide-react';

// ── 1. Field Label ───────────────────────────────────────────
export function FieldLabel({ children, required, hint }) {
  return (
    <div className="mb-2">
      <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 font-heading">
        {children}
        {required && <span className="text-negative ml-1 font-bold">*</span>}
      </label>
      {hint && (
        <p className="text-[10px] text-text-muted/30 font-heading mt-0.5 leading-snug">
          {hint}
        </p>
      )}
    </div>
  );
}

// ── 2. Animated Toggle Switch ─────────────────────────────────
export function Toggle({ val, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!val)}
      className={`relative w-10 h-[22px] rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 outline-none
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.95]'}
        ${val ? 'bg-positive/[0.15] border-positive/30' : 'bg-white/[0.04] border-white/[0.1]'}`}
    >
      <span
        className={`absolute top-[2px] left-0 w-[16px] h-[16px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${val ? 'translate-x-[20px] bg-positive' : 'translate-x-[2px] bg-white/[0.35]'}`}
      />
    </button>
  );
}

// ── 3. Toggle Row ─────────────────────────────────────────────
export function ToggleRow({ label, desc, val, onChange, disabled, badge }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-border/10 last:border-0 hover:bg-border/5 px-2 rounded-[6px] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-text/80 font-heading">{label}</span>
          {badge && (
            <span
              className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-[4px] font-heading border"
              style={{
                color: badge.color,
                background: `color-mix(in srgb, ${badge.color} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${badge.color} 20%, transparent)`,
              }}
            >
              {badge.label}
            </span>
          )}
        </div>
        {desc && <p className="text-[11px] text-text-muted/40 font-heading mt-0.5 leading-snug">{desc}</p>}
      </div>
      <Toggle val={val} onChange={onChange} disabled={disabled} />
    </div>
  );
}

// ── 4. Form Field Layout Group ─────────────────────────────────
export function FGroup({ children, cols = 1 }) {
  const getColClass = () => {
    if (cols === 2) return 'grid-cols-1 md:grid-cols-2';
    if (cols === 3) return 'grid-cols-1 md:grid-cols-3';
    if (cols === 4) return 'grid-cols-2 md:grid-cols-4';
    return 'grid-cols-1';
  };
  return (
    <div className={`grid gap-4.5 ${getColClass()}`}>
      {children}
    </div>
  );
}

// ── 5. Standard Text Input ─────────────────────────────────────
export function TInput({
  value,
  onChange,
  placeholder,
  mono,
  type = 'text',
  disabled,
  readOnly,
  suffix,
}) {
  return (
    <div className="relative group/input">
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full h-9 px-3 rounded-[8px] border border-border/30 bg-bg text-[12.5px] text-text outline-none placeholder:text-text-muted/30 focus:border-brand/40 focus:bg-surface-elevated transition-all disabled:opacity-40 disabled:cursor-not-allowed
          ${mono ? 'font-mono tracking-wider' : 'font-heading'}
          ${suffix ? 'pr-16' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] text-text-muted/40 font-heading pointer-events-none uppercase tracking-wider font-semibold">
          {suffix}
        </span>
      )}
    </div>
  );
}

// ── 6. Textarea Component ─────────────────────────────────────
export function TArea({ value, onChange, placeholder, rows = 3, mono, disabled }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-3 py-2.5 rounded-[8px] border border-border/30 bg-bg text-[12.5px] text-text outline-none placeholder:text-text-muted/30 focus:border-brand/40 focus:bg-surface-elevated resize-none transition-all disabled:opacity-40 disabled:cursor-not-allowed
        ${mono ? 'font-mono tracking-wide' : 'font-heading'}`}
    />
  );
}

// ── 7. Customizable Select Dropdown ───────────────────────────
export function TSelect({ value, onChange, options, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full h-9 px-3 pr-8 rounded-[8px] border border-border/30 bg-bg text-[12.5px] text-text outline-none font-heading appearance-none cursor-pointer focus:border-brand/40 focus:bg-surface-elevated transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {options.map(o => {
          const val = typeof o === 'object' ? (o.value ?? o) : o;
          const lbl = typeof o === 'object' ? (o.label ?? o) : o;
          return (
            <option key={val} value={val} className="bg-[#121214] text-text">
              {lbl}
            </option>
          );
        })}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted/35 pointer-events-none"
      />
    </div>
  );
}

// ── 8. API Key Field with Show/Hide, Copy & Rotate ──────────────
export function ApiKeyField({ label, value, onRotate, hint }) {
  const [show, setShow] = useState(false);
  const masked = value ? '•'.repeat(28) : '';

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="group/keyfield">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={show ? value : masked}
            readOnly
            className="w-full h-9 px-3 pr-9 rounded-[8px] border border-border/30 bg-bg text-[12px] font-mono tracking-wider text-text outline-none focus:border-brand/40 focus:bg-surface-elevated"
          />
          <button
            type="button"
            onClick={() => setShow(p => !p)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted/30 hover:text-text-muted cursor-pointer transition-colors"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <div className="flex gap-2">
          <Btn Icon={Copy} label="Copy" variant="default" small onClick={handleCopy} disabled={!value} />
          {onRotate && <Btn Icon={RefreshCw} label="Rotate" variant="warning" small onClick={onRotate} />}
        </div>
      </div>
    </div>
  );
}

// ── 9. Interactive Button Component ───────────────────────────
export function Btn({
  Icon,
  label,
  variant = 'default',
  onClick,
  small,
  disabled,
  loading,
  full,
  type = 'button',
}) {
  const vs = {
    primary: { b: '1px solid rgba(74,225,118,0.3)', bg: 'rgba(74,225,118,0.1)', c: 'var(--positive)' },
    danger: { b: '1px solid rgba(239,68,68,0.25)', bg: 'rgba(239,68,68,0.08)', c: '#ef4444' },
    warning: { b: '1px solid rgba(217,119,6,0.25)', bg: 'rgba(217,119,6,0.08)', c: '#d97706' },
    brand: { b: '1px solid rgba(218,165,32,0.3)', bg: 'rgba(218,165,32,0.1)', c: 'var(--brand)' },
    cyan: { b: '1px solid rgba(6,182,212,0.25)', bg: 'rgba(6,182,212,0.08)', c: 'var(--cyan)' },
    purple: { b: '1px solid rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.08)', c: '#a78bfa' },
    default: { b: '1px solid var(--border)', bg: 'var(--surface-elevated)', c: 'var(--text-muted)' },
  };

  const s = vs[variant] ?? vs.default;
  const h = small ? 'h-7.5 px-3.5 text-[11px]' : 'h-9 px-4 text-[12px]';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${full ? 'w-full' : 'inline-flex'}
        flex items-center justify-center gap-2 ${h} rounded-[8px] font-semibold font-heading transition-all duration-200
        hover:brightness-110 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap
      `}
      style={{ border: s.b, background: s.bg, color: s.c }}
    >
      {loading ? (
        <RefreshCw size={small ? 10 : 12} className="animate-spin" />
      ) : (
        Icon && <Icon size={small ? 10 : 12} />
      )}
      {label}
    </button>
  );
}

// ── 10. Warning Alert Banner ──────────────────────────────────
export function WarnBanner({ title, message, severity = 'warning' }) {
  const c = severity === 'danger' ? 'var(--negative)' : severity === 'info' ? 'var(--cyan)' : 'var(--warning)';
  const Icon = severity === 'danger' ? AlertOctagon : severity === 'info' ? Info : AlertTriangle;
  return (
    <div
      className="flex items-start gap-3 rounded-[10px] border px-4 py-3 transition-all duration-300 hover:scale-[1.002]"
      style={{
        borderColor: `color-mix(in srgb, ${c} 22%, transparent)`,
        background: `color-mix(in srgb, ${c} 5%, transparent)`,
      }}
    >
      <Icon size={14} style={{ color: c }} className="flex-shrink-0 mt-0.5" />
      <div>
        <div className="text-[12px] font-bold font-heading" style={{ color: c }}>
          {title}
        </div>
        {message && (
          <div
            className="text-[11px] font-heading mt-0.5 leading-relaxed"
            style={{ color: `color-mix(in srgb, ${c} 80%, rgba(255,255,255,0.55))` }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
