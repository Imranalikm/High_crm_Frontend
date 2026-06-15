import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { LimitsFeeTable } from '../components/LimitsFeeTable';
import { useUniversalDrawer } from '@/shared/components/overlays';
import { CreateTicketDrawer } from '@/features/client-support/pages/CreateTicketDrawer';

const FAQS = [
  {
    q: "Why do my limits differ from what's shown?",
    a: 'Your effective limits depend on your KYC verification tier. Complete Level 2 verification to unlock the full limits shown in the table above.',
  },
  {
    q: 'Can I increase my daily withdrawal limit?',
    a: 'Yes. Contact support with your account ID and reason. Limit increases are reviewed within 24 hours for verified accounts.',
  },
  {
    q: 'Are fees charged on failed transactions?',
    a: 'No fees are charged on failed deposits or withdrawals. You are only charged when a transaction successfully completes.',
  },
  {
    q: 'How are crypto fees calculated?',
    a: 'We do not charge our own fees on crypto transfers. However, blockchain network (gas) fees apply and are deducted from the transfer amount at network level.',
  },
];

export function LimitsFeesPage() {
  const navigate = useNavigate();
  const { openDrawer } = useUniversalDrawer();

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-section-eyebrow">Financials</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">
            Limits &amp; Fees
          </h1>
          <p className="text-[13.5px] mt-0.5 text-text-muted">
            Understand our deposit and withdrawal limits, fees, and processing times.
          </p>
        </div>
        {/* KYC badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] shrink-0 border bg-positive/8 border-positive/20">
          <ShieldCheck size={14} className="text-positive" strokeWidth={2.5} />
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-text-muted leading-none">KYC Status</p>
            <p className="text-[12.5px] font-bold text-positive mt-1.5 leading-none">Level 2 Verified</p>
          </div>
        </div>
      </div>

      {/* Main table */}
      <LimitsFeeTable />

      {/* FAQ section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={15} className="text-brand" strokeWidth={2} />
          <p className="text-section-eyebrow" style={{ marginBottom: 0 }}>Common Questions</p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-[14px] p-5 transition-all duration-200 hover:scale-[1.005] bg-surface-elevated border border-border/40 shadow-card-subtle"
            >
              <p className="font-semibold text-[13.5px] tracking-[-0.01em] text-text">
                {faq.q}
              </p>
              <p className="text-[12.5px] mt-2 leading-relaxed text-text-muted">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <div className="rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-brand/20 bg-gradient-to-br from-brand/10 to-surface-elevated shadow-card-subtle">
        <div>
          <p className="font-heading font-bold text-[15px] tracking-[-0.03em] text-text">
            Ready to fund your account?
          </p>
          <p className="text-[12.5px] mt-1 text-text-muted">
            Deposit funds and start trading immediately.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="limits-deposit-cta"
            onClick={() => navigate('/client/finance/deposit')}
            className="h-10 px-4 rounded-[10px] font-bold text-[12.5px] transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 bg-brand text-text-on-accent"
          >
            Deposit Now
          </button>
          <button
            id="limits-support-cta"
            onClick={() => openDrawer(CreateTicketDrawer)}
            className="h-10 px-4 rounded-[10px] font-bold text-[12.5px] transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 bg-muted-surface border border-border/40 text-text hover:bg-white/[0.02]"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
