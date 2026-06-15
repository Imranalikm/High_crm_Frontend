import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <div
            key={faq.id}
            className={`rounded-[14px] border transition-all duration-200 ${
              isOpen
                ? 'border-brand/35 bg-brand/[0.015] shadow-sm'
                : 'border-border/35 bg-surface-elevated hover:border-border/60 hover:bg-brand/[0.005]'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className={`text-[13.5px] font-bold transition-colors duration-150 ${isOpen ? 'text-brand' : 'text-text'}`}>
                {faq.q}
              </span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-brand/10 text-brand' : 'text-text-muted/40 group-hover:text-text-muted'}`}>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
            
            {/* Smooth transition simulation */}
            {isOpen && (
              <div className="px-5 pb-5.5 text-[13px] text-text-muted/90 leading-relaxed border-t border-border/15 pt-3.5 animate-in fade-in zoom-in-98 duration-200">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
