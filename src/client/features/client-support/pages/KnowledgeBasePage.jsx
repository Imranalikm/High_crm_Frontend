import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { KnowledgeSearch } from '../components/KnowledgeSearch';
import { ArticleCard } from '../components/ArticleCard';
import { FaqAccordion } from '../components/FaqAccordion';
import { PageShell } from '@/shared/components/layout/PageShell';
import { BookOpen, HelpCircle } from 'lucide-react';
import { useUniversalDrawer } from '@/shared/components/overlays';
import { CreateTicketDrawer } from './CreateTicketDrawer';

export function KnowledgeBasePage() {
  const navigate = useNavigate();
  const { openDrawer } = useUniversalDrawer();
  const { articles, categories, faqs, loading, search, setSearch, activeCategory, setActiveCategory } = useKnowledgeBase();

  return (
    <PageShell className="max-w-[1400px] w-full">
      {/* Search Hero Section */}
      <div className="relative rounded-[20px] overflow-hidden border border-border/35 bg-surface-elevated p-6 md:p-8 flex flex-col items-center text-center shadow-sm">
        {/* Decorative backdrop gradients */}
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-40 select-none">
          <div className="absolute top-0 left-1/4 w-[350px] h-[350px] rounded-full bg-brand/10 blur-[90px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-purple/10 blur-[80px] translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-[620px] w-full flex flex-col items-center">
          <span className="text-section-eyebrow">Help Center</span>
          <h1 className="font-heading font-semibold text-[28px] tracking-[-0.04em] text-text mt-1.5 mb-2">
            How can we help?
          </h1>
          <p className="text-[13px] text-text-muted/80 mb-6.5 leading-relaxed">
            Search guides and FAQs, or select a category below.
          </p>
          <KnowledgeSearch value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Categories */}
      {!search && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted/65 mb-3.5">Topics</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* All Topic Card */}
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`flex flex-col text-left p-5 rounded-[16px] border transition-all duration-250 cursor-pointer group relative overflow-hidden ${
                activeCategory === 'ALL'
                  ? 'border-brand/45 bg-brand/[0.015] shadow-sm'
                  : 'border-border/35 bg-surface-elevated hover:border-brand/35 hover:bg-brand/[0.005]'
              }`}
            >
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-[8px] bg-muted-surface border border-border/25 flex items-center justify-center">
                  <BookOpen size={14} className="text-text-muted" />
                </div>
                <p className="text-[13.5px] font-bold text-text group-hover:text-brand transition-colors duration-150">All guides</p>
              </div>
              <p className="text-[11px] text-text-muted/70 leading-normal flex-1 relative z-10">
                View all platform setup and help guides.
              </p>
              <p className="text-[10.5px] font-semibold text-brand/75 mt-3 relative z-10">View all →</p>
            </button>

            {/* Configured Categories */}
            {categories.map((c) => {
              const isActive = activeCategory === c.label;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.label)}
                  className={`flex flex-col text-left p-5 rounded-[16px] border transition-all duration-250 cursor-pointer group relative overflow-hidden ${
                    isActive
                      ? 'border-brand/45 bg-brand/[0.015] shadow-sm'
                      : 'border-border/35 bg-surface-elevated hover:border-brand/35 hover:bg-brand/[0.005]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${c.bgCls}`}>
                      <c.Icon size={14} className={c.colorCls} />
                    </div>
                    <p className="text-[13.5px] font-bold text-text group-hover:text-brand transition-colors duration-150 leading-snug">
                      {c.label}
                    </p>
                  </div>
                  <p className="text-[11px] text-text-muted/70 leading-normal flex-1 relative z-10">
                    {c.desc || 'Explore details, setup resources, and general questions.'}
                  </p>
                  <div className="flex items-center justify-between mt-3 relative z-10">
                    <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-wider">{c.count} articles</p>
                    <p className="text-[10.5px] font-bold text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Browse →
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Articles */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted/65">
            {search ? `Results for "${search}"` : activeCategory === 'ALL' ? 'Popular articles' : activeCategory}
          </p>
          <span className="text-[11px] font-semibold text-text-muted/60 bg-muted-surface/30 border border-border/20 px-2 py-0.5 rounded-md">
            {articles.length} articles
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-[14px] bg-surface-elevated border border-border/30 animate-pulse" />
            ))}
          </div>
        ) : articles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-[16px] border border-dashed border-border/30 bg-muted-surface/10">
            <BookOpen size={28} className="text-text-muted/30 mb-3" />
            <p className="text-[13.5px] font-bold text-text-muted">No articles found</p>
            <p className="text-[11.5px] text-text-muted/50 mt-1">Try a different search term.</p>
          </div>
        )}
      </div>

      {/* FAQ Accordion */}
      {!search && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted/65 mb-3.5">Frequently asked questions</p>
          <FaqAccordion faqs={faqs} />
        </div>
      )}

      {/* CTA Help Banner */}
      <div className="relative overflow-hidden rounded-[16px] border border-border/35 bg-gradient-to-r from-brand/6 via-surface-elevated to-purple/6 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 hidden sm:flex">
            <HelpCircle size={18} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-text">Need more help?</p>
            <p className="text-[12.5px] text-text-muted/80 mt-0.5">If you cannot find the answer, open a support ticket.</p>
          </div>
        </div>
        <button
          onClick={() => openDrawer(CreateTicketDrawer)}
          className="h-10 px-5 rounded-[9px] bg-brand text-text-on-accent text-[12.5px] font-bold hover:opacity-90 active:scale-95 transition-all duration-150 shrink-0 shadow-sm"
        >
          Open a ticket
        </button>
      </div>
    </PageShell>
  );
}

export default KnowledgeBasePage;
