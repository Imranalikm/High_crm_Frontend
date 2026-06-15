import React from 'react';
import { Paperclip } from 'lucide-react';

function Avatar({ initials, isAgent }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
      isAgent
        ? 'bg-brand/15 text-brand border border-brand/20'
        : 'bg-positive/15 text-positive border border-positive/20'
    }`}>
      {initials}
    </div>
  );
}

export function TicketTimeline({ messages = [] }) {
  if (!messages.length) return null;

  return (
    <div className="space-y-4 p-5 md:p-6">
      {messages.map((msg) => {
        /* System event row */
        if (msg.from === 'system') {
          return (
            <div key={msg.id} className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border/20" />
              <span className="text-[10.5px] text-text-muted/60 font-medium shrink-0">{msg.text}</span>
              <div className="flex-1 h-px bg-border/20" />
            </div>
          );
        }

        const isUser  = msg.from === 'user';
        const isAgent = msg.from === 'agent';

        return (
          <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <Avatar initials={msg.initials} isAgent={isAgent} />
            <div className={`max-w-[72%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-text">{msg.name}</span>
                <span className="text-[10px] text-text-muted/55 font-mono">{msg.ts}</span>
              </div>
              <div className={`rounded-[14px] px-4 py-3 text-[13px] leading-relaxed ${
                isUser
                  ? 'bg-brand/[0.12] border border-brand/20 rounded-tr-[4px] text-text'
                  : 'bg-surface-elevated border border-border/35 rounded-tl-[4px] text-text'
              }`}>
                {msg.text}
              </div>
              {msg.attachments?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.attachments.map((att) => (
                    <span key={att} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-muted-surface border border-border/30 text-[10.5px] text-text-muted">
                      <Paperclip size={10} />
                      {att}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
