import React, { useState } from 'react';
import { CheckCircle2, Clock3, CircleAlert, LoaderCircle, ChevronDown, RefreshCw, FileText } from 'lucide-react';

const STATUS = {
  verified: { label: 'Verified', cls: 'bg-positive/10 text-positive border-positive/20', Icon: CheckCircle2 },
  rejected: { label: 'Action req.', cls: 'bg-negative/10 text-negative border-negative/20', Icon: CircleAlert },
  pending: { label: 'Pending', cls: 'bg-warning/10 text-warning border-warning/20', Icon: Clock3 },
  'under-review': { label: 'Under review', cls: 'bg-brand/10 text-brand border-brand/20', Icon: LoaderCircle },
};

export function SubmissionTimeline({ items = [], onReupload }) {
  const [expanded, setExpanded] = useState(null);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-[12px] border border-dashed border-border/30 bg-muted-surface/10">
        <FileText size={28} className="text-text-muted/30 mb-3" />
        <p className="text-[13px] font-semibold text-text-muted">No uploads yet</p>
        <p className="text-[11.5px] text-text-muted/55 mt-1">Your upload history will appear here once you send documents.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      {/* Timeline connector line */}
      {items.length > 1 && (
        <div className="absolute left-[21px] top-11 bottom-11 w-px bg-border/20 z-0" />
      )}

      {items.map((item) => {
        const { label, cls, Icon } = STATUS[item.status] ?? STATUS.pending;
        const isOpen = expanded === item.id;

        return (
          <div key={item.id} className="relative z-10">
            <div className="rounded-[12px] bg-surface-elevated border border-border/35 overflow-hidden">

              {/* Header */}
              <button type="button"
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted-surface/30 transition-colors">
                <div className={`w-11 h-11 rounded-[10px] border flex items-center justify-center shrink-0 ${cls}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-text-muted">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9.5px] font-black uppercase tracking-[0.08em] ${cls}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-text-muted mt-0.5">Uploaded {item.submittedAt}</p>
                </div>
                <ChevronDown size={15} className={`text-text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-border/20 p-4 space-y-4">
                  {item.note && (
                    <div>
                      <p className="text-[9.5px] uppercase tracking-[0.12em] font-black text-text-muted mb-1.5">Review note</p>
                      <p className="text-[12.5px] leading-relaxed">{item.note}</p>
                    </div>
                  )}
                  {item.rejectionReason && (
                    <div className="rounded-[9px] bg-negative/[0.07] border border-negative/20 p-3.5">
                      <p className="text-[9.5px] uppercase tracking-[0.1em] font-black text-negative/60 mb-1.5">Reason</p>
                      <p className="text-[12px] text-negative leading-relaxed">{item.rejectionReason}</p>
                    </div>
                  )}
                  {item.status === 'rejected' && (
                    <button type="button" onClick={onReupload}
                      className="flex items-center gap-2 h-9 px-4 rounded-[8px] bg-brand text-text-on-accent text-[11.5px] font-bold hover:opacity-90 transition-opacity">
                      <RefreshCw size={12} /> Try again
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}