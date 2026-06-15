import React, { useRef, useState } from 'react';
import { Upload, Paperclip, X, File } from 'lucide-react';

export function AttachmentUploader({ files = [], onChange }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const addFiles = (incoming) => {
    const next = [...files, ...Array.from(incoming)];
    onChange?.(next);
  };

  const remove = (idx) => {
    onChange?.(files.filter((_, i) => i !== idx));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-2 p-6 rounded-[12px] border-2 border-dashed cursor-pointer transition-all ${
          drag
            ? 'border-brand/60 bg-brand/[0.06]'
            : 'border-border/30 hover:border-brand/35 hover:bg-brand/[0.03]'
        }`}
      >
        <div className="w-9 h-9 rounded-[9px] bg-muted-surface flex items-center justify-center">
          <Upload size={16} className="text-text-muted" />
        </div>
        <p className="text-[12.5px] font-semibold text-text-muted">Drop files here or <span className="text-brand">browse</span></p>
        <p className="text-[10.5px] text-text-muted/55">PDF, JPG, PNG up to 10MB each</p>
      </div>
      <input ref={ref} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-[9px] bg-surface border border-border/30">
              <div className="w-7 h-7 rounded-[7px] bg-brand/10 flex items-center justify-center shrink-0">
                <File size={13} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-text truncate">{f.name}</p>
                <p className="text-[10px] text-text-muted/60">{(f.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:text-negative transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
