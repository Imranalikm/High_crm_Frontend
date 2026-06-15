import React from 'react';
import { Clock, Eye, ArrowRight, ThumbsUp } from 'lucide-react';

// Style mapping for Knowledge Base categories
const KB_BADGE_MAP = {
  Finance:  'bg-brand/10 text-brand border-brand/20',
  KYC:      'bg-positive/10 text-positive border-positive/20',
  Trading:  'bg-warning/10 text-warning border-warning/20',
  Copy:     'bg-purple/10 text-purple border-purple/20',
  Account:  'bg-cyan/10 text-cyan border-cyan/20',
  Payments: 'bg-negative/10 text-negative border-negative/20',
};

export function ArticleCard({ article, onClick }) {
  const badgeCls = KB_BADGE_MAP[article.category] ?? 'bg-muted-surface text-text-muted border-border/30';

  return (
    <button
      type="button"
      onClick={() => onClick?.(article)}
      className="w-full text-left p-4.5 rounded-[14px] border border-border/35 bg-surface-elevated hover:border-brand/40 hover:bg-brand/[0.015] hover:shadow-sm transition-all duration-200 group relative"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-[13.5px] font-bold text-text leading-snug group-hover:text-brand transition-colors duration-150 flex-1">
          {article.title}
        </p>
        <div className="w-7 h-7 rounded-[8px] border border-border/35 bg-surface flex items-center justify-center text-text-muted/40 group-hover:text-brand group-hover:border-brand/30 group-hover:bg-brand/5 transition-all duration-200 shrink-0">
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
      
      <div className="flex items-center gap-3.5 mt-4 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted/60">
          <Clock size={11} strokeWidth={2} /> {article.readTime} read
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted/60">
          <Eye size={11} strokeWidth={2} /> {article.views} views
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] bg-positive/10 text-positive border border-positive/15 font-semibold">
          <ThumbsUp size={10} strokeWidth={2.5} /> {article.helpful}% helpful
        </span>
        <span className={`ml-auto px-2 py-0.5 rounded-full border text-[9.5px] font-black uppercase tracking-[0.08em] ${badgeCls}`}>
          {article.category}
        </span>
      </div>
    </button>
  );
}
