import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Bell } from 'lucide-react';
import { useSupport } from '../hooks/useSupport';
import { useTickets } from '../hooks/useTickets';
import { SupportStatsCards } from '../components/SupportStatsCards';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { QUICK_ACTIONS } from '../configs/overview.config';
import { ANNOUNCEMENTS } from '../configs/announcements.config';
import { PageShell } from '@/shared/components/layout/PageShell';
import { useUniversalDrawer } from '@/shared/components/overlays';
import { CreateTicketDrawer } from './CreateTicketDrawer';

export function SupportOverviewPage() {
  const navigate = useNavigate();
  const { stats, loading } = useSupport();
  const { tickets, loading: ticketsLoading } = useTickets();
  const { openDrawer } = useUniversalDrawer();

  const unreadCount = tickets.filter((t) => t.status === 'OPEN' && t.unread).length;

  return (
    <PageShell className="max-w-[1400px] w-full">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-section-eyebrow">Support</p>
          <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-1">Help &amp; Support</h1>
          <p className="text-[13px] text-text-muted mt-1">How can we help?</p>
        </div>
        <button
          onClick={() => openDrawer(CreateTicketDrawer)}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center gap-2 hover:opacity-90 transition-all duration-150 active:scale-95 shadow-sm"
        >
          <Plus size={14} /> New ticket
        </button>
      </div>

      {/* Unread alert */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-brand/[0.06] border border-brand/20 shadow-sm animate-fade-in">
          <Bell size={14} className="text-brand shrink-0" />
          <p className="text-[12.5px] text-text-muted flex-1">
            You have <strong className="text-text font-bold">{unreadCount} ticket{unreadCount !== 1 ? 's' : ''}</strong> with new replies.
          </p>
          <button
            onClick={() => navigate('/client/support/tickets')}
            className="text-[12.5px] font-bold text-brand hover:opacity-85 transition-opacity"
          >
            View tickets →
          </button>
        </div>
      )}

      {/* Stats */}
      <SupportStatsCards stats={stats} loading={loading} />

      {/* Quick actions */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted/60 mb-3.5">Quick actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {QUICK_ACTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => navigate(q.path)}
              className="flex flex-col gap-3.5 p-4.5 rounded-[14px] border border-border/35 bg-surface-elevated hover:border-brand/45 hover:bg-brand/[0.01] hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-250 text-left cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${q.bgCls}`}>
                <q.Icon size={16} className={q.colorCls} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-text group-hover:text-brand transition-colors duration-150">{q.label}</p>
                <p className="text-[11px] text-text-muted/75 mt-0.5 leading-normal">{q.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent tickets + announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Recent tickets */}
        <div className="rounded-[16px] border border-border/35 bg-surface-elevated overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/20 bg-muted-surface/10">
            <p className="text-[13px] font-bold text-text">Recent tickets</p>
            <button
              onClick={() => navigate('/client/support/tickets')}
              className="text-[11.5px] font-bold text-brand hover:opacity-80 transition-opacity"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-border/15">
            {ticketsLoading ? (
              <div className="p-5 text-center text-[12px] text-text-muted/50 animate-pulse">
                Loading recent tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-[12.5px] text-text-muted/40 font-medium leading-relaxed">
                No support tickets found. Click "New ticket" to get started.
              </div>
            ) : (
              tickets.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/client/support/tickets/${t.id}`)}
                  className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-brand/[0.01] hover:border-l-2 hover:border-l-brand/70 pl-[18px] transition-all text-left cursor-pointer border-l-2 border-transparent"
                >
                  {t.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] truncate ${t.unread ? 'font-bold text-text' : 'text-text-muted font-medium'}`}>
                      {t.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <TicketStatusBadge status={t.status} />
                      <span className="font-mono text-[11px] text-text-muted/50">{t.updated}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-text-muted/30 shrink-0 transition-transform duration-250 group-hover:translate-x-0.5" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Latest announcements */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-text">Latest updates</p>
            <button
              onClick={() => navigate('/client/support/announcements')}
              className="text-[11.5px] font-bold text-brand hover:opacity-80 transition-opacity"
            >
              See all
            </button>
          </div>
          <div className="space-y-3.5">
            {ANNOUNCEMENTS.slice(0, 2).map((a) => (
              <AnnouncementCard key={a.id} ann={a} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default SupportOverviewPage;
