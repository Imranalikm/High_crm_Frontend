import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { STATUS_FILTERS, CATEGORY_FILTERS, PRIORITY_FILTERS } from '../configs/tickets.config';

export function TicketFilters({
  search, onSearch,
  statusFilter, onStatus,
  categoryFilter, onCategory,
  priorityFilter, onPriority,
}) {
  return (
    <div className="p-4 flex flex-wrap gap-3 items-center border-b border-border/20">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-[280px]">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tickets…"
          className="w-full h-9 pl-9 pr-3 bg-surface border border-border/35 rounded-[9px] text-[12.5px] text-text placeholder:text-text-muted/50 outline-none focus:border-brand/40 transition-colors"
        />
      </div>

      {/* Status chips */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onStatus(f)}
            className={`h-8 px-3 rounded-[7px] border text-[11px] font-bold transition-all ${
              statusFilter === f
                ? 'bg-brand/10 border-brand/30 text-brand'
                : 'bg-surface border-border/30 text-text-muted hover:text-text hover:border-border/50'
            }`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Category select */}
      <div className="relative">
        <select
          value={categoryFilter}
          onChange={(e) => onCategory(e.target.value)}
          className="h-9 pl-3 pr-8 bg-surface border border-border/35 rounded-[9px] text-[12px] text-text outline-none focus:border-brand/40 appearance-none cursor-pointer transition-colors"
        >
          {CATEGORY_FILTERS.map((c) => (
            <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>

      {/* Priority select */}
      <div className="relative">
        <select
          value={priorityFilter}
          onChange={(e) => onPriority(e.target.value)}
          className="h-9 pl-3 pr-8 bg-surface border border-border/35 rounded-[9px] text-[12px] text-text outline-none focus:border-brand/40 appearance-none cursor-pointer transition-colors"
        >
          {PRIORITY_FILTERS.map((p) => (
            <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p.charAt(0) + p.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}
