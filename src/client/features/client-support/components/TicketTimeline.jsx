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
                <div className="mt-2 space-y-1.5 w-full">
                  {msg.attachments.map((att, idx) => {
                    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
                    const url = `${base}${att.url}`;
                    const isImage = att.mimetype?.startsWith('image/');
                    const sizeStr = att.size
                      ? att.size > 1024 * 1024
                        ? `${(att.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${Math.round(att.size / 1024)} KB`
                      : '';

                    if (isImage) {
                      return (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block group/img max-w-full">
                          <img
                            src={url}
                            alt={att.name}
                            className="rounded-[8px] border border-border/20 max-w-[200px] max-h-[150px] object-cover hover:border-brand/40 transition-all cursor-pointer"
                          />
                          <span className="text-[10px] text-text-muted/50 mt-1 block group-hover/img:text-brand transition-colors">
                            {att.name} {sizeStr && `· ${sizeStr}`}
                          </span>
                        </a>
                      );
                    }

                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={att.name}
                        className="flex items-center gap-2 px-3 py-2 rounded-[8px] border border-border/15 bg-bg/25 hover:border-brand/30 hover:bg-brand/[0.04] transition-all group/file max-w-[280px]"
                      >
                        <Paperclip size={11} className="text-brand shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-text/75 truncate group-hover/file:text-brand transition-colors">{att.name}</p>
                          {sizeStr && <p className="text-[9.5px] text-text-muted/40 mt-0.5">{sizeStr}</p>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
