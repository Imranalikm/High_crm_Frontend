import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function Toast({ msg }) {
  if (!msg) return null;

  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
      <CheckCircle2 size={13} />
      {msg}
    </div>
  );
}

export { Toast as ActionToast };
