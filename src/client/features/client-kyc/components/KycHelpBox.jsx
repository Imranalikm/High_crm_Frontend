import React, { useState } from 'react';
import {
  FileImage, LockKeyhole, LifeBuoy, CheckCircle2,
  XCircle, ChevronDown, Info, HelpCircle,
} from 'lucide-react';
import { useUniversalDrawer } from '@/shared/components/overlays';
import { CreateTicketDrawer } from '@/features/client-support/pages/CreateTicketDrawer';

const FAQS = [
  {
    q: 'Why do I need to verify my identity?',
    a: 'Verification helps protect your account from theft, keeps your funds safe, and follows standard financial rules. It unlocks higher trading limits and withdrawals.',
  },
  {
    q: 'How long does review take?',
    a: 'Most accounts are checked automatically in a few minutes. If a manual review is needed, it takes 1 to 3 business days. We will email you when it is ready.',
  },
  {
    q: 'What address documents are accepted?',
    a: 'We accept utility bills (electricity, gas, water) or bank statements. They must be less than 90 days old and match the name and address you entered in Step 1.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Yes. Your data is encrypted and stored securely. Only authorized support agents can view your documents to verify them.',
  },
];

const DOs = ['Use original documents', 'Show all four corners', 'Make sure lighting is clear'];
const DONTs = ['No expired or blurry images', 'No screenshots or cropped photos', 'No edited or watermarked files'];

export function KycHelpBox() {
  const [openIdx, setOpenIdx] = useState(null);
  const { openDrawer } = useUniversalDrawer();

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="rounded-[12px] border border-border/35 bg-surface-elevated overflow-hidden text-left">
      
      {/* Title */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/25">
        <div className="w-7 h-7 rounded-[8px] bg-brand/12 flex items-center justify-center shrink-0">
          <Info size={13} className="text-brand" />
        </div>
        <p className="text-[12.5px] font-bold">Verification Help</p>
      </div>

      <div className="p-5 space-y-6">

        {/* ── FAQ Accordion Section ── */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted mb-2 flex items-center gap-1.5">
            <HelpCircle size={10} /> Help Topics
          </p>
          
          <div className="space-y-2">
            {FAQS.map(({ q, a }, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-[9px] border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-brand/30 bg-brand/[0.02]' : 'border-border/25 bg-surface/30 hover:border-border/45'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left outline-none cursor-pointer select-none"
                  >
                    <span className="text-[11.5px] font-bold text-text leading-snug">{q}</span>
                    <ChevronDown
                      size={12}
                      className={`text-text-muted/40 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-brand' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {/* Slide Transition content container */}
                  <div
                    className="grid"
                    style={{
                      transition: 'grid-template-rows 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div className="px-3.5 pb-3.5 text-[11px] text-text-muted/80 leading-relaxed border-t border-border/10 pt-2.5">
                        {a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Guidelines (Accepted files / safety note) ── */}
        <div className="grid grid-cols-2 gap-3.5 p-3.5 rounded-[10px] bg-muted-surface/40 border border-border/20">
          <div className="space-y-1">
            <p className="text-[9.5px] font-bold flex items-center gap-1 text-text-muted">
              <FileImage size={11} className="text-brand" /> Formats
            </p>
            <p className="text-[10px] text-text-muted/65 leading-tight">PNG, JPG, or PDF (up to 10 MB). Make sure details are clear.</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9.5px] font-bold flex items-center gap-1 text-text-muted">
              <LockKeyhole size={11} className="text-brand" /> Security
            </p>
            <p className="text-[10px] text-text-muted/65 leading-tight">Your details are encrypted and kept safe under data privacy laws.</p>
          </div>
        </div>

        {/* Do's & Don'ts Checklist */}
        <div className="rounded-[10px] bg-muted-surface/60 border border-border/25 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted mb-3">Photo Tips</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dos */}
            <div className="space-y-2">
              {DOs.map((d) => (
                <div key={d} className="flex items-start gap-2">
                  <CheckCircle2 size={11} className="text-positive shrink-0 mt-0.5" />
                  <span className="text-[10.5px] text-text-muted leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
            {/* Donts */}
            <div className="space-y-2">
              {DONTs.map((d) => (
                <div key={d} className="flex items-start gap-2">
                  <XCircle size={11} className="text-negative shrink-0 mt-0.5" />
                  <span className="text-[10.5px] text-text-muted leading-relaxed">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support link */}
        <button
          onClick={() => openDrawer(CreateTicketDrawer)}
          className="w-full flex items-center gap-2.5 pt-4 border-t border-border/25 text-[11.5px] font-bold text-brand hover:opacity-75 transition-opacity text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-[8px] bg-brand/12 flex items-center justify-center shrink-0">
            <LifeBuoy size={13} />
          </div>
          Need help? Contact support
        </button>

      </div>
    </div>
  );
}