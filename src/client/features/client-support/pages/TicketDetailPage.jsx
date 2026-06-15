import React, { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTicket } from '../hooks/useTickets';
import { TicketStatusBadge } from '../components/TicketStatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { TicketTimeline } from '../components/TicketTimeline';
import { TicketComposer } from '../components/TicketComposer';
import { TICKET_META_FIELDS } from '../configs/ticketDetail.config';
import { PageShell } from '@/shared/components/layout/PageShell';
import { useUniversalDrawer } from '@/shared/components/overlays';
import { CreateTicketDrawer } from './CreateTicketDrawer';

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticket, messages, loading, error, sendMessage } = useTicket(id);
  const { openDrawer } = useUniversalDrawer();
  const bottomRef = useRef();

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <PageShell className="max-w-[1100px] mx-auto space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-muted-surface rounded-full" />
        <div className="h-10 w-56 bg-muted-surface rounded-[9px]" />
        <div className="h-[500px] bg-surface-elevated rounded-[16px]" />
      </PageShell>
    );
  }

  if (error || !ticket) {
    return (
      <PageShell className="max-w-[1100px] mx-auto text-center py-16">
        <p className="text-[14px] font-bold mb-2">Ticket not found</p>
        <p className="text-[12.5px] text-text-muted mb-5">This ticket does not exist or could not be loaded.</p>
        <button
          onClick={() => navigate('/client/support/tickets')}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Back to tickets
        </button>
      </PageShell>
    );
  }

  const metaValues = { id: ticket.id, category: ticket.category, priority: ticket.priority, status: ticket.status, created: ticket.created, updated: ticket.updated };

  return (
    <PageShell className="space-y-5 max-w-[1100px] w-full mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/client/support/tickets')}
        className="flex items-center gap-2 text-[11.5px] font-bold text-text-muted hover:text-text transition-colors self-start cursor-pointer"
      >
        <ArrowLeft size={13} /> All tickets
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="font-mono text-[11px] font-bold text-text-muted/60">{ticket.id}</span>
          <h1 className="font-heading font-semibold text-[22px] tracking-[-0.03em] text-text mt-1">
            {ticket.subject}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5 items-start">
        {/* Conversation thread */}
        <div className="rounded-[16px] border border-border/35 bg-surface-elevated overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-border/20 bg-muted-surface/10">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-text-muted">
              Messages ({messages.length})
            </p>
          </div>

          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            <TicketTimeline messages={messages} />
            <div ref={bottomRef} />
          </div>

          {ticket.status !== 'RESOLVED' && (
            <TicketComposer onSend={sendMessage} disabled={ticket.status === 'CLOSED'} />
          )}

          {ticket.status === 'RESOLVED' && (
            <div className="px-5 py-4 border-t border-border/20 bg-positive/[0.03] text-center animate-fade-in">
              <p className="text-[12.5px] text-positive font-bold">This ticket is closed.</p>
              <button
                onClick={() => openDrawer(CreateTicketDrawer)}
                className="mt-1.5 text-[12.5px] font-bold text-brand hover:opacity-75 transition-opacity cursor-pointer"
              >
                Create a new ticket →
              </button>
            </div>
          )}
        </div>

        {/* Meta sidebar */}
        <div className="rounded-[14px] border border-border/35 bg-surface-elevated p-5 space-y-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/65">Ticket info</p>
          {TICKET_META_FIELDS.map((f) => (
            <div key={f.key} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/50">{f.label}</p>
              {f.key === 'status' ? (
                <TicketStatusBadge status={metaValues.status} />
              ) : f.key === 'priority' ? (
                <PriorityBadge priority={metaValues.priority} />
              ) : (
                <p className={`text-[13px] font-bold ${f.key === 'id' ? 'font-mono text-brand' : 'text-text'}`}>
                  {metaValues[f.key] ?? '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default TicketDetailPage;

/* Router alias — keeps existing router import working */
export { TicketDetailPage as ClientTicketDetailPage };
