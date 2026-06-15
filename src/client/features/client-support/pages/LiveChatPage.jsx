import React, { useRef, useState } from 'react';
import { Send, Paperclip, MessageCircle, Dot } from 'lucide-react';
import { PageShell } from '@/shared/components/layout/PageShell';

const INITIAL_MSGS = [
  { id: 1, from: 'agent', name: 'Maya — Support', initials: 'MA', ts: 'Just now', text: 'Hello! How can I help you today?' },
];

export function LiveChatPage() {
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  const scrollDown = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now(),
      from: 'user',
      name: 'You',
      initials: 'ME',
      ts: 'Just now',
      text: input.trim(),
    };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    scrollDown();

    /* Simulate agent typing + reply */
    setTyping(true);
    setTimeout(() => {
      const replies = [
        'Thanks! I am checking this for you now.',
        'Please share your email or ticket ID.',
        'I will forward this to our team. We will reply soon.',
        'I have saved your request. Do you need help with anything else?',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setTyping(false);
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, from: 'agent', name: 'Maya — Support', initials: 'MA', ts: 'Just now', text: reply },
      ]);
      scrollDown();
    }, 1800);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <PageShell className="max-w-[720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div>
        <p className="text-section-eyebrow">Support</p>
        <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-1">Live chat</h1>
        <p className="text-[13px] text-text-muted mt-1">Chat with our team.</p>
      </div>

      {/* Chat window */}
      <div className="rounded-[16px] border border-border/35 bg-surface-elevated overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center text-[12px] font-bold text-brand">
              MA
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-positive border-2 border-surface-elevated" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-text">Maya — Support</p>
            <div className="flex items-center gap-1 text-[10.5px] text-positive">
              <Dot size={14} className="-ml-1" />Online · Replies in minutes
            </div>
          </div>
          <MessageCircle size={15} className="ml-auto text-text-muted/40" />
        </div>

        {/* Messages */}
        <div className="h-[360px] overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.from === 'user';
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isUser
                    ? 'bg-positive/15 text-positive border border-positive/20'
                    : 'bg-brand/15 text-brand border border-brand/20'
                }`}>
                  {msg.initials}
                </div>
                <div className={`max-w-[72%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10.5px] font-bold text-text">{msg.name}</span>
                    <span className="text-[9.5px] text-text-muted/50">{msg.ts}</span>
                  </div>
                  <div className={`px-3.5 py-2.5 rounded-[12px] text-[13px] leading-relaxed ${
                    isUser
                      ? 'bg-brand/[0.12] border border-brand/20 rounded-tr-[4px] text-text'
                      : 'bg-surface border border-border/35 rounded-tl-[4px] text-text'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-brand/15 border border-brand/20 flex items-center justify-center text-[10px] font-bold text-brand shrink-0">
                MA
              </div>
              <div className="px-3.5 py-2.5 rounded-[12px] rounded-tl-[4px] bg-surface border border-border/35 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-text-muted/50 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-border/20 p-4 flex items-end gap-3">
          <button className="w-9 h-9 rounded-[8px] border border-border/35 bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-muted-surface/50 transition-colors shrink-0">
            <Paperclip size={14} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 min-h-[40px] max-h-[100px] resize-none bg-surface border border-border/35 rounded-[9px] px-3 py-2.5 text-[13px] text-text placeholder:text-text-muted/50 outline-none focus:border-brand/40 transition-colors"
            style={{ fieldSizing: 'content' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || typing}
            className="w-10 h-10 rounded-[9px] bg-brand text-text-on-accent flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="text-center">
        <p className="text-[11px] text-text-muted/55">
          We are online Mon–Fri, 9am–6pm UTC. Outside these hours, replies might take longer.{' '}
          <button onClick={() => {}} className="text-brand hover:opacity-75 transition-opacity font-bold">
            Leave a message
          </button>
        </p>
      </div>
    </PageShell>
  );
}

export default LiveChatPage;
