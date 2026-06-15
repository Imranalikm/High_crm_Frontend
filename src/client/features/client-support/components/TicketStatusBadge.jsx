import React from 'react';
import { STATUS_MAP } from '../configs/tickets.config';

export function TicketStatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.08em] ${s.cls}`}>
      {s.dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {s.label}
    </span>
  );
}
