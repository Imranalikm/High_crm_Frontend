import React, { useRef, useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

export function TicketComposer({ onSend, sending = false, disabled = false }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const fileRef = useRef();

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    await onSend?.(text.trim());
    setText('');
    setFiles([]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = '';
  };

  return (
    <div className="border-t border-border/20 p-4">
      {/* Attached files */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-muted-surface border border-border/30 text-[10.5px] text-text-muted">
              <Paperclip size={10} />
              {f.name}
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="ml-1 text-text-muted/60 hover:text-negative transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Attach button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-9 h-9 rounded-[8px] border border-border/35 bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-muted-surface/50 transition-colors shrink-0"
        >
          <Paperclip size={14} />
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a reply… (Enter to send)"
          disabled={disabled}
          rows={1}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none bg-surface border border-border/35 rounded-[9px] px-3 py-2.5 text-[13px] text-text placeholder:text-text-muted/50 outline-none focus:border-brand/40 transition-colors disabled:opacity-50"
          style={{ fieldSizing: 'content' }}
        />

        {/* Send button */}
        <button
          type="button"
          disabled={!text.trim() || sending || disabled}
          onClick={handleSend}
          className="w-10 h-10 rounded-[9px] bg-brand text-text-on-accent flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
