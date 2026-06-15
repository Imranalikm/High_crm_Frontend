import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { Button } from '../ui/Button';

/* ─── ToolbarFilterDropdown ───────────────────────────────────
   Generic dropdown — options accept either:
     • array of { value, label }   (structured)
     • plain string array          (value === label)
─────────────────────────────────────────────────────────────── */
export function ToolbarFilterDropdown({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Normalise options so we always work with { value, label }
  const normalised = options.map((o) =>
    typeof o === 'object' ? o : { value: o, label: o }
  );
  const selected = normalised.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-[9px] border border-border/30 bg-bg/70 px-3 text-[12px] font-semibold text-text-muted transition-all hover:border-border/55 hover:text-text"
      >
        {label}
        {value !== 'all' && (
          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            {selected?.label}
          </span>
        )}
        <ChevronDown size={12} className="text-text-muted/50" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[170px] rounded-[10px] border border-border/40 bg-surface p-1 shadow-[0_16px_40px_rgba(2,6,23,0.2)]">
          <button
            type="button"
            onClick={() => { onChange('all'); setOpen(false); }}
            className="flex w-full items-center rounded-[8px] px-3 py-2 text-left text-[12px] text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
          >
            All
          </button>
          {normalised.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setOpen(false); }}
              className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-[12px] text-text transition-colors hover:bg-surface-elevated"
            >
              {option.label}
              {value === option.value && (
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">On</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PageToolbar ─────────────────────────────────────────────
   Unified toolbar used across ALL feature pages (Users, Finance,
   Trading, Prop Trading, IB System, Copy Trading).

   Props:
     search         – string
     onSearchChange – (val: string) => void
     placeholder    – string
     filterSets     – { label, get, set, opts }[]
                       get/set = current value / setter
                       opts    = { value, label }[] or string[]
     actions        – { label, icon, onClick, variant? }[]
                       rendered right of the search input
     showFilters    – boolean (default true) — hide filter row entirely
     className      – extra class for the outer <section>
─────────────────────────────────────────────────────────────── */
export function PageToolbar({
  search,
  onSearchChange,
  placeholder = 'Search…',
  filterSets = [],
  actions = [],
  showFilters = true,
  className = '',
}) {
  const activeFilters = filterSets.filter((fs) => fs.get !== 'all');

  const clearAll = () => filterSets.forEach((fs) => fs.set('all'));

  return (
    <section
      className={`rounded-[14px] border border-border/35 bg-surface-elevated p-4 shadow-card-subtle ${className}`}
    >
      <div className="flex flex-col gap-4">

        {/* ── Row 1: Search + Action Buttons ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search input */}
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40"
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="h-10 w-full rounded-[10px] border border-border/30 bg-bg/70 pl-10 pr-8 text-[13px] text-text outline-none transition-all placeholder:text-text-muted/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/40 transition-colors hover:text-text"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? 'secondary'}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* ── Row 2: Filter Dropdowns ── */}
        {showFilters && filterSets.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/50">
              <Filter size={11} />
              Filters
            </span>

            {filterSets.map((fs) => (
              <ToolbarFilterDropdown
                key={fs.label}
                label={fs.label}
                value={fs.get}
                onChange={fs.set}
                options={fs.opts}
              />
            ))}

            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 text-[11px] font-semibold text-text-muted transition-colors hover:text-text"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* ── Row 3: Active Filter Chips ── */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((fs) => {
              const normalised = fs.opts.map((o) =>
                typeof o === 'object' ? o : { value: o, label: o }
              );
              const selected = normalised.find((o) => o.value === fs.get);
              return (
                <button
                  key={fs.label}
                  type="button"
                  onClick={() => fs.set('all')}
                  className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-semibold text-primary transition-opacity hover:opacity-80"
                >
                  {fs.label}: {selected?.label ?? fs.get}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
