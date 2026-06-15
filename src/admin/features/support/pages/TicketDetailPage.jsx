import React, { useRef, useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Hash,
  Link,
  Lock,
  MapPin,
  MessageCircle,
  Paperclip,
  RefreshCw,
  Send,
  ShieldAlert,
  User,
  UserPlus,
  XCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { relatedTickets } from '@/config/constants/support/mockData';
import { adminSupportApi } from '../services/support.api';
import {
  KYC_CLR,
  WALL_CLR,
  TRADE_CLR,
  PriorityBadge,
  SupportStatusBadge,
  CatTag,
  SlaBar,
  SupportToast,
  SlaCheckRow,
} from '@/features/support/components/SupportComponents';

const AGENTS = ['Marcus Webb', 'Priya Sharma', 'Lena Fischer', 'Dev Kapoor', 'Keiran Lynch'];

function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-[10px] border border-border/30 bg-surface-elevated overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function PanelHead({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/12 bg-bg/5">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="w-5 h-5 rounded-[6px] bg-brand/10 flex items-center justify-center shrink-0">
            <Icon size={10} className="text-brand" />
          </span>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading">
          {title}
        </span>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function MetaRow({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/8 last:border-0">
      <span className="text-[11px] text-text-muted/70 font-heading font-semibold uppercase tracking-[0.05em] shrink-0">
        {label}
      </span>
      <span
        className="text-[13px] font-semibold font-heading truncate text-right text-text/85"
        style={{ color: accent }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function ActionBtn({ onClick, icon: Icon, label, variant = 'ghost', full = false, small = false }) {
  const styles = {
    success: 'border-positive/22 bg-positive/7 text-positive hover:bg-positive/14 hover:border-positive/35',
    danger: 'border-negative/22 bg-negative/7 text-negative hover:bg-negative/14 hover:border-negative/35',
    warning: 'border-warning/22 bg-warning/7 text-warning hover:bg-warning/14 hover:border-warning/35',
    brand: 'border-brand/30 bg-brand text-text-on-accent hover:bg-brand-hover',
    orange: 'border-orange-400/22 bg-orange-400/7 text-orange-400 hover:bg-orange-400/14',
    ghost: 'border-border/20 bg-transparent text-text-muted/75 hover:text-text hover:border-border/38 hover:bg-bg/40',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-[7px] border font-semibold uppercase tracking-[0.05em] font-heading active:scale-[0.97] transition-all cursor-pointer
        ${small ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[11.5px]'}
        ${styles[variant] || styles.ghost}
        ${full ? 'w-full justify-start' : ''}`}
    >
      {Icon && <Icon size={small ? 10 : 12} className="shrink-0" />}
      <span>{label}</span>
    </button>
  );
}

function ThreadMessage({ msg }) {
  if (msg.type === 'system') {
    return (
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1 h-px bg-border/8" />
        <span className="text-[10px] font-mono italic text-text-muted/28 shrink-0 px-1">
          {msg.body}
        </span>
        <div className="flex-1 h-px bg-border/8" />
      </div>
    );
  }

  const isUser = msg.type === 'user';
  const isAgent = msg.type === 'agent';
  const isInternal = msg.type === 'internal';

  const accent = isInternal ? '#a78bfa' : isAgent ? 'var(--brand)' : 'var(--text-muted)';

  const initials = msg.author
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`group relative flex gap-3 px-5 py-4 border-b border-border/8 last:border-0 transition-colors hover:bg-bg/5 ${isInternal ? 'bg-purple-500/[0.02]' : ''
        }`}
    >
      {!isUser && (
        <span
          className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full"
          style={{ background: accent, opacity: 0.45 }}
        />
      )}

      <div
        className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 text-[10px] font-semibold font-heading border mt-[1px]"
        style={{
          background: `color-mix(in srgb, ${accent} 11%, transparent)`,
          borderColor: `color-mix(in srgb, ${accent} 20%, transparent)`,
          color: accent,
        }}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-[13px] font-semibold font-heading leading-none"
            style={{ color: isUser ? 'var(--text)' : accent }}
          >
            {msg.author}
          </span>

          {msg.role && (
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.05em] font-heading px-2 py-0.5 rounded-[4px] leading-none"
              style={{
                background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                color: accent,
              }}
            >
              {msg.role}
            </span>
          )}

          {isInternal && (
            <span
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.05em] font-heading px-2 py-0.5 rounded-[4px] leading-none border"
              style={{
                background: 'color-mix(in srgb, #a78bfa 12%, transparent)',
                borderColor: 'color-mix(in srgb, #a78bfa 22%, transparent)',
                color: '#a78bfa',
              }}
            >
              <Lock size={9} />
              Private
            </span>
          )}

          <span className="text-[11px] font-mono text-text-muted/70 ml-auto leading-none">
            {msg.ts}
          </span>
        </div>

        <div
          className="rounded-[10px] border px-4 py-3 text-[13.5px] font-medium text-text/85 leading-relaxed"
          style={{
            background: isInternal
              ? 'color-mix(in srgb, #a78bfa 4%, transparent)'
              : isAgent
                ? 'color-mix(in srgb, var(--brand) 3.5%, transparent)'
                : 'color-mix(in srgb, var(--bg) 38%, transparent)',
            borderColor: isInternal
              ? 'color-mix(in srgb, #a78bfa 14%, transparent)'
              : isAgent
                ? 'color-mix(in srgb, var(--brand) 11%, transparent)'
                : 'color-mix(in srgb, var(--border) 22%, transparent)',
          }}
        >
          <p className="whitespace-pre-wrap">{msg.body}</p>
        </div>
      </div>
    </div>
  );
}

function ReplyComposer({ noteType, setNoteType, replyText, setReplyText, onSend, onDraft }) {
  const activeColor = noteType === 'REPLY' ? 'var(--brand)' : '#a78bfa';

  return (
    <div className="border-t border-border/12 bg-bg/4">
      <div className="flex items-end px-5 pt-3.5 gap-0 border-b border-border/10">
        {[
          ['REPLY', 'Reply', Send],
          ['INTERNAL', 'Note', Lock],
        ].map((item) => {
          const IconComponent = item[2];
          const type = item[0];
          const label = item[1];
          const active = noteType === type;
          const col = type === 'REPLY' ? 'var(--brand)' : '#a78bfa';

          return (
            <button
              key={type}
              type="button"
              onClick={() => setNoteType(type)}
              className="flex items-center gap-1.5 px-3.5 pb-2.5 text-[11.5px] font-semibold font-heading cursor-pointer transition-all border-b-[2px] -mb-px"
              style={
                active
                  ? { color: col, borderColor: col }
                  : { color: 'var(--text-muted)', opacity: 0.7, borderColor: 'transparent' }
              }
            >
              <IconComponent size={9} />
              {label}
            </button>
          );
        })}
        <div className="flex-1 border-b border-border/10 pb-0" />
      </div>

      <div className="px-5 py-3.5 space-y-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={
            noteType === 'REPLY'
              ? 'Write your reply...'
              : 'Write a private note...'
          }
          rows={4}
          className="w-full resize-none rounded-[8px] border border-border/20 bg-bg/18 px-3.5 py-3 text-[12.5px] text-text font-heading font-medium outline-none placeholder:text-text-muted/22 transition-all leading-relaxed"
          style={{ '--tw-ring-color': 'transparent' }}
          onFocus={(e) => {
            e.target.style.borderColor = `color-mix(in srgb, ${activeColor} 38%, transparent)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '';
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" className="flex items-center gap-1.5 text-[11px] text-text-muted/70 hover:text-text cursor-pointer transition-colors">
              <Paperclip size={11} />
              Attach
            </button>
            <button type="button" className="flex items-center gap-1.5 text-[11px] text-text-muted/70 hover:text-text cursor-pointer transition-colors">
              <FileText size={11} />
              Templates
            </button>
            <button type="button" className="flex items-center gap-1.5 text-[11px] text-text-muted/70 hover:text-text cursor-pointer transition-colors">
              <Bookmark size={11} />
              Shortcuts
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ActionBtn onClick={onDraft} icon={FileText} label="Draft" variant="ghost" small />
            <button
              type="button"
              onClick={onSend}
              disabled={!replyText.trim()}
              className="flex items-center gap-1.5 h-8 px-4 rounded-[7px] text-[11.5px] font-semibold font-heading border cursor-pointer transition-all active:scale-[0.97] disabled:opacity-25 disabled:cursor-not-allowed uppercase tracking-wider"
              style={
                noteType === 'REPLY'
                  ? {
                    background: 'var(--brand)',
                    color: 'var(--text-on-accent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 35%, transparent)',
                  }
                  : {
                    background: 'color-mix(in srgb, #a78bfa 11%, transparent)',
                    color: '#a78bfa',
                    borderColor: 'color-mix(in srgb, #a78bfa 24%, transparent)',
                  }
              }
            >
              <Send size={10} />
              {noteType === 'REPLY' ? 'Send' : 'Save note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignDropdown({ owner, onAssign, open, setOpen }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-[7px] text-[11px] font-semibold font-heading border border-border/20 bg-bg/22 text-text-muted/70 hover:text-text hover:border-border/38 transition-all cursor-pointer uppercase tracking-wider"
      >
        <UserPlus size={10} />
        {owner?.name || 'Assign'}
        <ChevronDown size={9} className="opacity-40" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 rounded-[10px] border border-border/20 py-1.5 min-w-[184px] overflow-hidden"
          style={{
            background: 'var(--surface-elevated)',
            boxShadow: '0 14px 44px rgba(0,0,0,0.42)',
          }}
        >
          {AGENTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onAssign(a)}
              className="w-full text-left px-3.5 py-2.5 text-[11.5px] font-heading font-semibold hover:bg-bg/45 cursor-pointer transition-colors flex items-center gap-2.5"
              style={{ color: owner?.name === a ? 'var(--brand)' : 'var(--text-muted)' }}
            >
              <div
                className="w-5 h-5 rounded-full text-[8px] font-black flex items-center justify-center shrink-0"
                style={{
                  background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                  color: 'var(--brand)',
                }}
              >
                {a.split(' ').map((w) => w[0]).join('')}
              </div>
              {a}
              {owner?.name === a && <Check size={10} className="ml-auto" style={{ color: 'var(--brand)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromEscalated = location.state?.fromEscalated;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminSupportApi.getTicket(ticketId).then(data => {
      setTicket(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [ticketId]);

  if (loading) return <div className="p-8 text-center text-text-muted">Loading ticket details...</div>;
  if (!ticket) return <Navigate to="/admin/support/tickets" replace />;

  return (
    <TicketDetail
      ticket={ticket}
      onBack={() => navigate(fromEscalated ? '/admin/support/escalated' : '/admin/support/tickets')}
      navigate={navigate}
    />
  );
}

function TicketDetail({ ticket: t, onBack, navigate }) {
  const [messages, setMessages] = useState(t.conversation || []);
  const [replyText, setReplyText] = useState('');
  const [noteType, setNoteType] = useState('REPLY');
  const [status, setStatus] = useState(t.status);
  const [owner, setOwner] = useState(() => {
    if (typeof t.owner === 'object' && t.owner !== null) return t.owner;
    return { name: t.owner || 'Unassigned', photo: '' };
  });
  const [showAssign, setShowAssign] = useState(false);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `MSG-${Date.now()}`,
        type: noteType === 'REPLY' ? 'agent' : 'internal',
        author: 'Arjun Ravi',
        role: 'Admin',
        ts: new Date().toLocaleString('en-GB').replace(',', ''),
        body: replyText.trim(),
      },
    ]);

    setReplyText('');
    notify(noteType === 'REPLY' ? 'Reply sent' : 'Note saved');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const assignAgent = (name) => {
    setOwner({ name, photo: '' });
    setShowAssign(false);
    notify(`Assigned to ${name}`);
  };

  const msgCount = messages.filter((m) => m.type !== 'system').length;
  const isOverdue = t.slaMins != null && t.slaMins < 0;

  const slaColor =
    t.slaMins == null
      ? 'var(--positive)'
      : t.slaMins < 30
        ? 'var(--negative)'
        : t.slaMins < 120
          ? 'var(--warning)'
          : 'var(--positive)';

  return (
    <PageShell className="!pt-0">
      <SupportToast msg={toast} onDone={() => setToast(null)} />

      <div className="flex items-center gap-2 mb-4 animate-fade-up">
        <button
          type="button"
          onClick={onBack}
          className="group w-7 h-7 flex items-center justify-center rounded-[7px] border border-border/18 bg-bg/28 text-text-muted/48 hover:text-text hover:border-border/35 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] text-text-muted/70 font-semibold uppercase tracking-[0.05em] font-heading hover:text-text transition-colors cursor-pointer"
        >
          Tickets
        </button>
        <ChevronRight size={10} className="text-text-muted/20" />
        <span className="text-[11px] font-mono font-semibold text-brand/75">{t.id}</span>
      </div>

      <Panel className="mb-4 animate-fade-up">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className="text-[10.5px] font-mono font-semibold text-text-muted/32">{t.id}</span>
                <PriorityBadge value={t.priority} />
                <SupportStatusBadge value={status} />
                <CatTag value={t.category} />
                {isOverdue && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[5px] text-[9px] font-black uppercase tracking-[0.1em]"
                    style={{
                      color: 'var(--negative)',
                      background: 'color-mix(in srgb,var(--negative) 10%,transparent)',
                      border: '1px solid color-mix(in srgb,var(--negative) 20%,transparent)',
                    }}
                  >
                    <AlertTriangle size={8} className="animate-pulse" />
                    Overdue
                  </span>
                )}
              </div>
              <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-text font-heading leading-tight max-w-[660px]">
                {t.subject}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <AssignDropdown
                owner={owner}
                onAssign={assignAgent}
                open={showAssign}
                setOpen={setShowAssign}
              />

              <ActionBtn
                onClick={() => notify('Ticket escalated')}
                icon={ArrowUp}
                label="Escalate"
                variant="orange"
              />

              {status === 'OPEN' || status === 'PENDING' ? (
                <ActionBtn
                  onClick={() => {
                    setStatus('RESOLVED');
                    notify('Ticket resolved');
                  }}
                  icon={CheckCircle2}
                  label="Resolve"
                  variant="success"
                />
              ) : (
                <ActionBtn
                  onClick={() => {
                    setStatus('OPEN');
                    notify('Ticket reopened');
                  }}
                  icon={RefreshCw}
                  label="Reopen"
                  variant="warning"
                />
              )}

              <ActionBtn
                onClick={() => {
                  setStatus('CLOSED');
                  notify('Ticket closed');
                }}
                icon={XCircle}
                label="Close"
                variant="danger"
              />
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-0 border-t border-border/8 pt-3">
            {[
              { Icon: User, val: t.user },
              { Icon: Hash, val: t.uid },
              { Icon: MapPin, val: t.region },
              { Icon: CalendarDays, val: `Opened ${t.created}` },
              { Icon: Clock, val: `Updated ${t.updated || '—'}` },
              { Icon: MessageCircle, val: `${msgCount} messages` },
            ].map((item, i) => {
              const IconComponent = item.Icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[11.5px] text-text-muted/75 font-heading font-semibold px-3.5 first:pl-0 border-r border-border/8 last:border-0"
                >
                  <IconComponent size={11} className="shrink-0 text-text-muted/60" />
                  <span>{item.val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_276px] gap-4 items-start animate-fade-up">
        <div className="space-y-4">
          <Panel>
            <PanelHead
              icon={MessageCircle}
              title="Messages"
              right={
                <div className="flex items-center gap-3.5 text-[9.5px] font-heading font-semibold text-text-muted/30">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-muted)', opacity: 0.35 }} />
                    Client
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)', opacity: 0.6 }} />
                    Agent
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa', opacity: 0.6 }} />
                    Private
                  </span>
                </div>
              }
            />

            <div className="max-h-[520px] overflow-y-auto scroll-smooth">
              {messages.map((msg) => (
                <ThreadMessage key={msg.id} msg={msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            <ReplyComposer
              noteType={noteType}
              setNoteType={setNoteType}
              replyText={replyText}
              setReplyText={setReplyText}
              onSend={sendReply}
              onDraft={() => notify('Draft saved')}
            />
          </Panel>

          <Panel>
            <PanelHead
              icon={Paperclip}
              title="Files"
              right={
                <button type="button" className="text-[10px] text-brand/65 font-black font-heading uppercase tracking-wider hover:text-brand cursor-pointer transition-colors">
                  Upload
                </button>
              }
            />
            <div className="p-3 space-y-1.5">
              {[
                { name: 'bank-statement-july.pdf', size: '1.2 MB', ts: '01 Aug 2024 10:14', ext: 'PDF' },
                { name: 'transaction-screenshot.png', size: '380 KB', ts: '01 Aug 2024 10:14', ext: 'IMG' },
              ].map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-3 rounded-[8px] border border-border/12 bg-bg/10 px-3 py-2.5 hover:border-border/26 hover:bg-bg/20 transition-all group cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0 text-[8px] font-black font-heading border"
                    style={{
                      background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--brand) 15%, transparent)',
                      color: 'var(--brand)',
                    }}
                  >
                    {a.ext}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-heading font-semibold text-text/62 truncate">{a.name}</p>
                    <p className="text-[9.5px] font-mono text-text-muted/28 mt-0.5">
                      {a.size} · {a.ts}
                    </p>
                  </div>
                  <button type="button" className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted/38 hover:text-text cursor-pointer">
                    <Download size={12} />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHead icon={User} title="Client" />

            <div className="p-4 space-y-3.5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[12px] font-semibold font-heading border"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 18%, transparent)',
                    color: 'var(--brand)',
                  }}
                >
                  {t.user
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-text font-heading leading-tight truncate">{t.user}</p>
                  <p className="text-[11px] font-mono text-text-muted/75 truncate mt-0.5">{t.uid}</p>
                  <p className="text-[11px] text-text-muted/75 font-heading truncate">{t.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'KYC', val: t.kyc, color: KYC_CLR[t.kyc] },
                  { label: 'Wallet', val: t.wallet, color: WALL_CLR[t.wallet] },
                  { label: 'Trading', val: t.trading, color: TRADE_CLR[t.trading] },
                  { label: 'Region', val: t.region, color: 'var(--text-muted)' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-[7px] border border-border/10 bg-bg/10 px-2.5 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-0.5">
                      {label}
                    </p>
                    <p className="text-[12px] font-semibold font-heading uppercase tracking-[0.04em] truncate" style={{ color }}>
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate(`/admin/users/${t.uid}`)}
                className="w-full h-8 flex items-center justify-center gap-1.5 rounded-[7px] border border-border/14 bg-bg/10 text-text-muted/70 hover:text-text hover:border-border/28 hover:bg-bg/22 text-[10.5px] font-semibold uppercase tracking-wider font-heading transition-all cursor-pointer"
              >
                <ExternalLink size={10} />
                View profile
              </button>
            </div>

            <div className="border-t border-border/10 p-4 space-y-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading">
                  Time left
                </span>
                <span className="font-mono font-semibold text-[11.5px]" style={{ color: slaColor }}>
                  {t.slaMins != null ? `${t.slaMins}m left` : 'Done'}
                </span>
              </div>

              <SlaBar pct={t.sla} slaMins={t.slaMins} />

              <div className="space-y-2 pt-2.5 border-t border-border/8">
                <SlaCheckRow label="First reply" sla="4 hrs" met={true} />
                <SlaCheckRow label="Resolve by" sla="24 hrs" met={t.sla > 20} />
                <SlaCheckRow label="Escalate by" sla="8 hrs" met={status !== 'ESCALATED'} />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHead icon={ClipboardList} title="Details" />

            <div className="px-4 py-1">
              {[
                { label: 'Assigned to', value: owner?.name || 'Unassigned' },
                { label: 'Category', value: t.category },
                { label: 'Priority', value: t.priority },
                { label: 'Opened', value: t.created },
                { label: 'Last update', value: t.updated || '—' },
                { label: 'Messages', value: String(msgCount) },
              ].map(({ label, value }) => (
                <MetaRow key={label} label={label} value={value} />
              ))}
            </div>

            <div className="border-t border-border/10 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading mb-2 px-1">
                <Link size={9} className="shrink-0 text-text-muted/50" />
                Past tickets
              </p>

              <div className="space-y-1.5">
                {relatedTickets.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/admin/support/tickets/${r.id}`)}
                    className="flex items-center gap-2.5 rounded-[7px] border border-border/10 bg-bg/10 px-3 py-2 hover:border-border/24 hover:bg-bg/20 transition-all cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold font-heading text-text/85 truncate group-hover:text-text/78 transition-colors">
                        {r.subject}
                      </p>
                      <p className="text-[11px] font-mono text-text-muted/70 mt-0.5">{r.id}</p>
                    </div>
                    <SupportStatusBadge value={r.status} />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHead icon={Zap} title="Actions" />
            <div className="p-3 space-y-1.5">
              {[
                { label: 'View profile', icon: User, variant: 'ghost', cb: () => navigate(`/admin/users/${t.uid}`) },
                { label: 'View wallet', icon: CreditCard, variant: 'ghost', cb: () => notify('Wallet opened') },
                { label: 'Review security', icon: ShieldAlert, variant: 'warning', cb: () => notify('Sent for review') },
                { label: 'Suspend user', icon: Lock, variant: 'danger', cb: () => notify('Suspend dialog opened') },
              ].map(({ label, icon, variant, cb }) => (
                <ActionBtn
                  key={label}
                  onClick={cb}
                  icon={icon}
                  label={label}
                  variant={variant}
                  full
                />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
