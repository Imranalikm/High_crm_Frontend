import React from 'react';
import { SEV_STYLES } from '../configs/announcements.config';

export function AnnouncementCard({ ann }) {
  const s = SEV_STYLES[ann.severity] ?? SEV_STYLES.info;
  return (
    <div className={`rounded-[12px] border ${s.border} ${s.bg} overflow-hidden`}>
      <div className="flex items-start gap-3 p-4">
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${s.bg} border ${s.border}`}>
          <ann.Icon size={15} className={s.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className={`text-[13px] font-bold leading-snug ${s.text}`}>{ann.title}</p>
            {ann.resolved && (
              <span className="text-[9.5px] font-black uppercase tracking-[0.1em] text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full shrink-0">
                Resolved
              </span>
            )}
          </div>
          <p className="text-[12px] text-text-muted mt-1.5 leading-relaxed">{ann.body}</p>
          <p className="text-[10.5px] text-text-muted/50 mt-2 font-mono">{ann.time}</p>
        </div>
      </div>
    </div>
  );
}
