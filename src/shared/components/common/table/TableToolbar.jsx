import React from 'react';
import { Search } from 'lucide-react';

/**
 * TableToolbar - Unified header panel for MainTable
 * 
 * Props:
 * - title: string (e.g. 'User Registry')
 * - count: number (e.g. filteredUsers.length)
 * - accentColor: string (e.g. 'var(--brand)')
 * - search: string
 * - onSearchChange: function(string)
 * - searchPlaceholder: string
 * - filters: ReactNode (slot for custom filter selects)
 */
export function TableToolbar({
  title,
  count,
  accentColor = 'var(--brand)',
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
}) {
  return (
    <div className="px-5 py-3.5 border-b border-border/12 flex items-center justify-between gap-3 bg-surface-elevated flex-wrap">
      {/* Title & Count */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: accentColor }}
        />
        {title && (
          <h3 className="font-black text-[12px] tracking-widest uppercase text-text/80">
            {title}
          </h3>
        )}
        {count !== undefined && (
          <span
            className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-black border font-mono animate-fade-in"
            style={{
              color: accentColor,
              background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${accentColor} 22%, transparent)`,
            }}
          >
            {count}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3.5 flex-wrap">
        {/* Search */}
        {onSearchChange && (
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
            <input
              type="text"
              value={search || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-7 pl-7 pr-3 w-40 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/35 outline-none focus:border-brand/40 focus:w-48 transition-all"
            />
          </div>
        )}

        {/* Custom Filters Slot */}
        {filters}
      </div>
    </div>
  );
}
