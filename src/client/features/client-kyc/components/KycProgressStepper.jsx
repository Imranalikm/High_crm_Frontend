import React from 'react';
import { Check, UserRound, Contact, ScanFace, MapPin, ClipboardCheck, Send } from 'lucide-react';

const STEPS = [
  { label: 'Personal info', sub: 'Name & birth', Icon: UserRound },
  { label: 'Identity ID', sub: 'Passport / ID card', Icon: Contact },
  { label: 'Selfie photo', sub: 'Verify face', Icon: ScanFace },
  { label: 'Address proof', sub: 'Utility bill / bank', Icon: MapPin },
  { label: 'Review details', sub: 'Check info', Icon: ClipboardCheck },
  { label: 'Finished', sub: 'Under review', Icon: Send },
];

export function KycProgressStepper({ current = 1, completed = [], onSelect }) {
  const doneCount = completed.slice(0, 5).filter(Boolean).length;
  const pct = Math.round((doneCount / 5) * 100);

  return (
    <div>
      {/* ── Progress track ── */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold text-text">
          Step <span className="text-brand">{current}</span> of {STEPS.length}
        </p>
        <p className="text-[11px] text-text-muted">
          {doneCount} of {STEPS.length - 1} steps completed
        </p>
      </div>
      <div className="h-1 rounded-full bg-muted-surface overflow-hidden mb-5">
        <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* ── Step cards ── */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STEPS.map((stepItem, i) => {
          const { label, sub, Icon } = stepItem;
          const num = i + 1;
          const done = completed[i];
          const active = num === current;

          return (
            <button key={label} type="button"
              onClick={() => onSelect?.(num)}
              className={[
                'relative p-3 rounded-[10px] border text-left transition-all cursor-pointer',
                active ? 'border-brand/50 bg-brand/[0.08]'
                  : done ? 'border-positive/30 bg-positive/[0.04] hover:border-positive/50'
                    : 'border-border/30 bg-surface hover:border-border/55 hover:bg-muted-surface/10',
              ].join(' ')}
            >
              <span className="absolute top-2.5 right-2.5 font-mono text-[8px] text-text-muted/25 font-bold">
                {String(num).padStart(2, '0')}
              </span>

              <div className={`w-7 h-7 rounded-[7px] flex items-center justify-center mb-2 transition-colors ${done ? 'bg-positive/15 text-positive'
                : active ? 'bg-brand text-text-on-accent'
                  : 'bg-muted-surface text-text-muted'
                }`}>
                {done ? <Check size={13} strokeWidth={3} /> : <Icon size={13} />}
              </div>

              <p className={`text-[10px] font-black uppercase tracking-[0.07em] leading-tight ${active ? 'text-brand' : done ? 'text-positive' : 'text-text-muted'
                }`}>
                {label}
              </p>
              <p className="text-[9.5px] text-text-muted/60 mt-0.5 leading-tight">{sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}