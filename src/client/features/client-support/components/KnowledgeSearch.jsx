import React from 'react';
import { Search } from 'lucide-react';

export function KnowledgeSearch({ value, onChange, placeholder = 'Search articles, guides, FAQs…' }) {
  return (
    <div className="relative group w-full">
      <Search
        size={18}
        className="absolute left-4.5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-brand transition-colors duration-250 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-13 pl-12.5 pr-5 bg-surface-elevated border border-border/35 rounded-[14px] text-[14px] text-text placeholder:text-text-muted/40 outline-none hover:border-border/60 focus:border-brand/60 focus:bg-surface focus:ring-4 focus:ring-brand/8 transition-all duration-250"
      />
    </div>
  );
}
