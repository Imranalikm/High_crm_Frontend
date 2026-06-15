import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PRIORITY_MAP } from '../configs/tickets.config';

export function PriorityBadge({ priority }) {
  const p = PRIORITY_MAP[priority] ?? PRIORITY_MAP.LOW;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] border text-[9.5px] font-black uppercase tracking-[0.1em] ${p.cls}`}>
      {priority === 'HIGH' && <AlertCircle size={9} />}
      {p.label}
    </span>
  );
}
