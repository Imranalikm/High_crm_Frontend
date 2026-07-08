import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Lock,
  MessageCircle,
  Paperclip,
  RefreshCw,
  Send,
  User,
  UserPlus,
  XCircle,
  X,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { adminSupportApi } from '../services/support.api';
import { socketClient } from '@/shared/api/client/socketClient';
import {
  PriorityBadge,
  SupportStatusBadge,
  CatTag,
  SupportToast,
} from '@/features/support/components/SupportComponents';

/* ── Helper: base URL for uploads ─────────────────────────────── */
const getUploadBase = () => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  return apiUrl.replace('/api', '');
};

/* ── Panel primitives ─────────────────────────────────────────── */
function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-[12px] border border-border/25 bg-surface-elevated overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function PanelHead({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/12 bg-bg/5">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="w-6 h-6 rounded-[7px] bg-brand/10 flex items-center justify-center shrink-0">
            <Icon size={12} className="text-brand" />
          </span>
        )}
        <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-text-muted/70 font-heading">
          {title}
        </span>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/8 last:border-0">
      <span className="text-[11px] text-text-muted/60 font-heading font-semibold uppercase tracking-[0.06em] shrink-0">
        {label}
      </span>
      <span className="text-[12.5px] font-semibold font-heading truncate text-right text-text/80">
        {value || '—'}
      </span>
    </div>
  );
}

/* ── Attachment display in messages ───────────────────────────── */
function AttachmentPreview({ attachment }) {
  const base = getUploadBase();
  const url = `${base}${attachment.url}`;
  const isImage = attachment.mimetype?.startsWith('image/');
  const sizeStr = attachment.size
    ? attachment.size > 1024 * 1024
      ? `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(attachment.size / 1024)} KB`
    : '';

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2 group/img">
        <img
          src={url}
          alt={attachment.name}
          className="rounded-[8px] border border-border/20 max-w-[280px] max-h-[200px] object-cover hover:border-brand/40 transition-all cursor-pointer"
        />
        <span className="text-[10px] text-text-muted/50 mt-1 block group-hover/img:text-brand transition-colors">
          {attachment.name} {sizeStr && `· ${sizeStr}`}
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.name}
      className="flex items-center gap-2.5 mt-2 px-3 py-2 rounded-[8px] border border-border/15 bg-bg/20 hover:border-brand/30 hover:bg-brand/[0.04] transition-all group/file"
    >
      <div className="w-8 h-8 rounded-[6px] bg-brand/10 border border-brand/15 flex items-center justify-center shrink-0">
        <FileText size={12} className="text-brand" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11.5px] font-semibold text-text/70 truncate group-hover/file:text-brand transition-colors">{attachment.name}</p>
        {sizeStr && <p className="text-[10px] text-text-muted/40 mt-0.5">{sizeStr}</p>}
      </div>
      <Download size={12} className="text-text-muted/30 group-hover/file:text-brand shrink-0 transition-colors" />
    </a>
  );
}

/* ── Chat message bubble ──────────────────────────────────────── */
function ThreadMessage({ msg }) {
  if (msg.type === 'system') {
    return (
      <div className="flex items-center gap-4 px-5 py-2.5">
        <div className="flex-1 h-px bg-border/10" />
        <span className="text-[10px] font-mono italic text-text-muted/30 shrink-0 px-1">
          {msg.body}
        </span>
        <div className="flex-1 h-px bg-border/10" />
      </div>
    );
  }

  const isUser = msg.type === 'user';
  const isAgent = msg.type === 'agent';
  const isInternal = msg.type === 'internal';

  const accent = isInternal ? '#a78bfa' : isAgent ? 'var(--brand)' : 'var(--text-muted)';
  const initials = (msg.author || 'User')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const attachments = msg.attachments || [];
  const isOutgoing = isAgent || isInternal;

  return (
    <div
      className={`flex gap-3 px-5 py-4 transition-colors hover:bg-bg/[0.01] ${
        isOutgoing ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold font-heading border mt-1"
        style={{
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          borderColor: `color-mix(in srgb, ${accent} 22%, transparent)`,
          color: accent,
        }}
      >
        {initials}
      </div>

      {/* Content Wrapper */}
      <div className={`max-w-[75%] flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}>
        {/* Header info */}
        <div className={`flex items-center gap-2 mb-1.5 flex-wrap ${isOutgoing ? 'flex-row-reverse' : ''}`}>
          <span
            className="text-[12px] font-bold font-heading leading-none"
            style={{ color: isUser ? 'var(--text)' : accent }}
          >
            {msg.author}
          </span>

          {msg.role && (
            <span
              className="text-[9.5px] font-bold uppercase tracking-[0.06em] font-heading px-1.5 py-[2px] rounded-[4px] leading-none"
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
              className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.06em] font-heading px-1.5 py-[2px] rounded-[4px] leading-none border"
              style={{
                background: 'color-mix(in srgb, #a78bfa 12%, transparent)',
                borderColor: 'color-mix(in srgb, #a78bfa 22%, transparent)',
                color: '#a78bfa',
              }}
            >
              <Lock size={8} />
              Private
            </span>
          )}

          <span className="text-[10px] font-mono text-text-muted/40 leading-none">
            {msg.ts}
          </span>
        </div>

        {/* Bubble */}
        {msg.body && (
          <div
            className={`rounded-[12px] border px-4 py-3 text-[13px] font-medium text-text/85 leading-relaxed ${
              isOutgoing ? 'rounded-tr-[4px]' : 'rounded-tl-[4px]'
            }`}
            style={{
              background: isInternal
                ? 'color-mix(in srgb, #a78bfa 6%, transparent)'
                : isAgent
                  ? 'color-mix(in srgb, var(--brand) 6%, transparent)'
                  : 'color-mix(in srgb, var(--bg) 35%, transparent)',
              borderColor: isInternal
                ? 'color-mix(in srgb, #a78bfa 18%, transparent)'
                : isAgent
                  ? 'color-mix(in srgb, var(--brand) 18%, transparent)'
                  : 'color-mix(in srgb, var(--border) 20%, transparent)',
            }}
          >
            <p className="whitespace-pre-wrap">{msg.body}</p>
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className={`mt-1.5 space-y-1.5 ${isOutgoing ? 'flex flex-col items-end' : 'w-full'}`}>
            {attachments.map((att, i) => (
              <AttachmentPreview key={i} attachment={att} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Reply Composer with file upload ──────────────────────────── */
function ReplyComposer({ noteType, setNoteType, replyText, setReplyText, onSend, files, setFiles }) {
  const activeColor = noteType === 'REPLY' ? 'var(--brand)' : '#a78bfa';
  const fileInputRef = useRef(null);

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
    e.target.value = '';
  };

  return (
    <div className="border-t border-border/12 bg-bg/4">
      {/* Tab bar */}
      <div className="flex items-end px-5 pt-3 gap-0 border-b border-border/10">
        {[
          ['REPLY', 'Reply', Send],
          ['INTERNAL', 'Note', Lock],
        ].map((item) => {
          const IconC = item[2];
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
                  : { color: 'var(--text-muted)', opacity: 0.55, borderColor: 'transparent' }
              }
            >
              <IconC size={10} />
              {label}
            </button>
          );
        })}
        <div className="flex-1" />
      </div>

      <div className="px-5 py-3.5 space-y-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={noteType === 'REPLY' ? 'Write your reply...' : 'Write a private note...'}
          rows={3}
          className="w-full resize-none rounded-[8px] border border-border/18 bg-bg/15 px-3.5 py-3 text-[12.5px] text-text font-heading font-medium outline-none placeholder:text-text-muted/22 transition-all leading-relaxed focus:border-brand/30"
        />

        {/* Attached files preview */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] border border-border/20 bg-bg/20 text-[11px] font-heading font-semibold text-text/70">
                {f.type?.startsWith('image/') ? <ImageIcon size={10} className="text-brand shrink-0" /> : <FileText size={10} className="text-brand shrink-0" />}
                <span className="truncate max-w-[120px]">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-text-muted/40 hover:text-negative cursor-pointer transition-colors ml-0.5">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept=".png,.jpg,.jpeg,.pdf,.gif,.webp,.doc,.docx,.txt,.zip"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-[11px] text-text-muted/60 hover:text-brand cursor-pointer transition-colors"
          >
            <Paperclip size={12} />
            Attach files
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={!replyText.trim() && files.length === 0}
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
  );
}

/* ── Assign Dropdown ──────────────────────────────────────────── */
function AssignDropdown({ owner, onAssign, open, setOpen, agents = [] }) {
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
          {agents.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onAssign(a)}
              className="w-full text-left px-3.5 py-2.5 text-[11.5px] font-heading font-semibold hover:bg-bg/45 cursor-pointer transition-colors flex items-center gap-2.5"
              style={{ color: owner?.name === a.name ? 'var(--brand)' : 'var(--text-muted)' }}
            >
              <div
                className="w-5 h-5 rounded-full text-[8px] font-black flex items-center justify-center shrink-0"
                style={{
                  background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                  color: 'var(--brand)',
                }}
              >
                {a.name.split(' ').map((w) => w[0]).join('')}
              </div>
              {a.name}
              {owner?.name === a.name && <Check size={10} className="ml-auto" style={{ color: 'var(--brand)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page: fetch + socket ─────────────────────────────────────── */
export function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromEscalated = location.state?.fromEscalated;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let socket;
    let currentUuid;

    adminSupportApi.getTicket(ticketId).then(data => {
      if (!active) return;
      setTicket(data);
      setLoading(false);
      currentUuid = data.uuid;

      const token = localStorage.getItem('admin_token');
      socket = socketClient.connect(token);
      socket.emit('join_ticket', data.uuid);

      const handleNewMessage = (msg) => {
        setTicket((prev) => {
          if (!prev) return prev;
          if (prev.conversation.some(m => m.id === msg.id)) return prev;

          const newMsg = {
            id: msg.id,
            type: msg.type,
            author: msg.author?.name || 'Unknown',
            role: msg.author?.role?.type === 'admin' ? 'Admin' : (msg.type === 'user' ? 'Client' : 'Support'),
            ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
            body: msg.body,
            attachments: msg.attachments || []
          };
          return { ...prev, conversation: [...prev.conversation, newMsg] };
        });
      };

      const handleTicketUpdated = (updated) => {
        setTicket((prev) => {
          if (!prev) return prev;
          return { ...prev, status: updated.status };
        });
      };

      socket.on('new_message', handleNewMessage);
      socket.on('ticket_updated', handleTicketUpdated);

    }).catch(err => {
      console.error(err);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      if (socket) {
        socket.off('new_message');
        socket.off('ticket_updated');
        if (currentUuid) socket.emit('leave_ticket', currentUuid);
      }
    };
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

/* ── Main layout ──────────────────────────────────────────────── */
function TicketDetail({ ticket: t, onBack, navigate }) {
  const [messages, setMessages] = useState(t.conversation || []);
  const [replyText, setReplyText] = useState('');
  const [noteType, setNoteType] = useState('REPLY');
  const [status, setStatus] = useState(t.status);
  const [files, setFiles] = useState([]);
  const [owner, setOwner] = useState(() => {
    if (typeof t.owner === 'object' && t.owner !== null) return t.owner;
    return { name: t.owner || 'Unassigned', photo: '' };
  });
  const [showAssign, setShowAssign] = useState(false);
  const [agents, setAgents] = useState([]);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    adminSupportApi.getAgents().then(setAgents).catch(console.error);
  }, []);

  useEffect(() => {
    setMessages(t.conversation || []);
  }, [t.conversation]);

  useEffect(() => {
    setStatus(t.status);
  }, [t.status]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendReply = async () => {
    if (!replyText.trim() && files.length === 0) return;

    const type = noteType === 'REPLY' ? 'agent' : 'internal';
    try {
      let result;
      if (files.length > 0) {
        // Use FormData for file upload
        const formData = new FormData();
        if (replyText.trim()) formData.append('body', replyText.trim());
        formData.append('type', type);
        files.forEach(f => formData.append('attachments', f));
        result = await adminSupportApi.replyToTicketWithFiles(t.uuid, formData);
      } else {
        result = await adminSupportApi.replyToTicket(t.uuid, replyText.trim(), type);
      }

      const msg = result;
      const newMsg = {
        id: msg.id,
        type: msg.type,
        author: msg.author?.name || 'Admin',
        role: msg.author?.roleId === 1 ? 'Admin' : 'Agent',
        ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
        body: msg.body,
        attachments: msg.attachments || [],
      };

      setMessages((prev) => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setReplyText('');
      setFiles([]);
      notify(noteType === 'REPLY' ? 'Reply sent' : 'Note saved');
    } catch (err) {
      console.error('Error sending reply:', err);
      notify('Failed to send reply');
    }
  };

  const assignAgent = async (agent) => {
    try {
      await adminSupportApi.assignTicketAgent(t.uuid, agent.id);
      setOwner({ name: agent.name, id: agent.id });
      setShowAssign(false);
      notify(`Assigned to ${agent.name}`);
    } catch (err) {
      console.error('Error assigning agent:', err);
      notify('Failed to assign agent');
    }
  };

  const changeStatus = async (newStatus) => {
    try {
      await adminSupportApi.updateTicketStatus(t.uuid, newStatus);
      setStatus(newStatus);
      notify(`Ticket marked as ${newStatus.toLowerCase()}`);
    } catch (err) {
      console.error('Error updating status:', err);
      notify('Failed to update status');
    }
  };

  const msgCount = messages.filter((m) => m.type !== 'system').length;

  return (
    <PageShell className="!pt-0">
      <SupportToast msg={toast} onDone={() => setToast(null)} />

      {/* Breadcrumb */}
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

      {/* Ticket header */}
      <Panel className="mb-4 animate-fade-up">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className="text-[10.5px] font-mono font-semibold text-text-muted/32">{t.id}</span>
                <PriorityBadge value={t.priority} />
                <SupportStatusBadge value={status} />
                <CatTag value={t.category} />
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
                agents={agents}
              />

              {status === 'OPEN' || status === 'PENDING' ? (
                <button
                  type="button"
                  onClick={() => changeStatus('RESOLVED')}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[7px] border text-[11.5px] font-semibold font-heading uppercase tracking-[0.05em] cursor-pointer transition-all active:scale-[0.97] border-positive/22 bg-positive/7 text-positive hover:bg-positive/14"
                >
                  <CheckCircle2 size={12} /> Resolve
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => changeStatus('OPEN')}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[7px] border text-[11.5px] font-semibold font-heading uppercase tracking-[0.05em] cursor-pointer transition-all active:scale-[0.97] border-warning/22 bg-warning/7 text-warning hover:bg-warning/14"
                >
                  <RefreshCw size={12} /> Reopen
                </button>
              )}

              <button
                type="button"
                onClick={() => changeStatus('CLOSED')}
                className="flex items-center gap-1.5 h-8 px-3 rounded-[7px] border text-[11.5px] font-semibold font-heading uppercase tracking-[0.05em] cursor-pointer transition-all active:scale-[0.97] border-negative/22 bg-negative/7 text-negative hover:bg-negative/14"
              >
                <XCircle size={12} /> Close
              </button>
            </div>
          </div>

          {/* Compact info row */}
          <div className="flex items-center flex-wrap gap-0 border-t border-border/8 pt-3">
            {[
              { label: t.user },
              { label: t.uid },
              { label: `Opened ${t.created}` },
              { label: `${msgCount} messages` },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[11.5px] text-text-muted/70 font-heading font-semibold px-3.5 first:pl-0 border-r border-border/8 last:border-0"
              >
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Content: Chat + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-4 items-start animate-fade-up">
        {/* Chat panel */}
        <Panel>
          <PanelHead
            icon={MessageCircle}
            title={`Conversation (${msgCount})`}
            right={
              <div className="flex items-center gap-4 text-[9.5px] font-heading font-semibold text-text-muted/30">
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

          <div className="max-h-[560px] overflow-y-auto scroll-smooth custom-scrollbar divide-y divide-border/[0.06]">
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
            files={files}
            setFiles={setFiles}
          />
        </Panel>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details panel */}
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
          </Panel>

          {/* Client panel */}
          <Panel>
            <PanelHead icon={User} title="Client" />
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[12px] font-semibold font-heading border"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 18%, transparent)',
                    color: 'var(--brand)',
                  }}
                >
                  {(t.user || 'U')
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-text font-heading leading-tight truncate">{t.user}</p>
                  <p className="text-[11px] font-mono text-text-muted/60 truncate mt-0.5">{t.uid}</p>
                  {t.email && <p className="text-[11px] text-text-muted/60 font-heading truncate">{t.email}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/admin/users/${t.uid}`)}
                className="w-full h-8 flex items-center justify-center gap-1.5 rounded-[7px] border border-border/14 bg-bg/10 text-text-muted/60 hover:text-text hover:border-border/28 hover:bg-bg/22 text-[10.5px] font-semibold uppercase tracking-wider font-heading transition-all cursor-pointer"
              >
                <ExternalLink size={10} />
                View profile
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
