import React from 'react';
import { Check, ChevronDown, Copy, Send } from 'lucide-react';
import { MainDrawer } from './MainDrawer';
import { DrawerHeader } from './DrawerHeader';
import { DrawerBody } from './DrawerBody';
import { DrawerFooter } from './DrawerFooter';
import { ActionBtn, StatusChip } from '../../ui';

export function DrawerSection({ title, children, className = '', collapsible = false, defaultOpen = true }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        type="button"
        disabled={!collapsible}
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`flex w-full items-center gap-3 group/section ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 transition-colors group-hover/section:text-text-muted/90">
          {title}
        </span>
        <div className="h-[1px] flex-1 bg-border/20 shadow-[0_1px_0_rgba(255,255,255,0.02)]" />
        {collapsible && (
          <ChevronDown
            size={12}
            className={`text-text-muted/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        )}
      </button>
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-500 fill-mode-both">
          {children}
        </div>
      )}
    </div>
  );
}

export function DrawerField({ label, value, mono = false, accent, className = '', copyable = false, wide = false }) {
  const [copied, setCopied] = React.useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';

  const handleCopy = () => {
    if (!hasValue) return;
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${wide ? 'col-span-2' : ''} ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">
        {label}
      </span>
      <div
        className={`group relative flex h-10 min-w-0 shrink-0 items-center rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text transition-all hover:border-border/40 ${copyable ? 'pr-9' : ''} ${mono ? 'font-mono' : ''}`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        <span className="min-w-0 truncate">
          {hasValue ? value : <span className="opacity-20">-</span>}
        </span>
        {copyable && hasValue && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[7px] text-text-muted/35 opacity-0 transition-all hover:bg-surface-bright/20 hover:text-text group-hover:opacity-100"
            aria-label={`Copy ${label}`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function DrawerFormGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder, type = 'text', mono = false, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-[10px] border border-border/25 bg-bg px-3 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 ${mono ? 'font-mono' : ''}`}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, placeholder, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">{label}</span>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-[10px] border border-border/25 bg-bg px-3 pr-8 text-[12px] text-text outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            typeof option === 'string'
              ? <option key={option} value={option}>{option}</option>
              : <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/45" />
      </div>
    </label>
  );
}

export function TextareaField({ label, value, onChange, placeholder, rows = 4, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="resize-none rounded-[10px] border border-border/25 bg-bg px-3 py-2.5 text-[12px] text-text outline-none transition-all placeholder:text-text-muted/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

export function ToggleField({ label, checked, onChange, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-border/20 bg-bg/50 px-3 py-3 shadow-card-subtle">
      <div>
        <div className="text-[12px] font-medium text-text">{label}</div>
        {description && <div className="mt-1 text-[11px] text-text-muted/60">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{ background: checked ? 'var(--brand)' : 'var(--border)' }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </button>
    </div>
  );
}


export function OperatorNoteSection({ value, onChange, onSave, placeholder = 'Add an internal note...', defaultOpen = false }) {
  return (
    <DrawerSection title="Operator Note" collapsible defaultOpen={defaultOpen}>
      <div className="mt-2 space-y-2">
        <TextareaField
          label="Audit Log Note"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
        />
        <div className="flex justify-end">
          <ActionBtn
            label="Save Note"
            Icon={Send}
            variant="brand"
            disabled={!String(value ?? '').trim()}
            onClick={onSave}
            small
          />
        </div>
      </div>
    </DrawerSection>
  );
}

