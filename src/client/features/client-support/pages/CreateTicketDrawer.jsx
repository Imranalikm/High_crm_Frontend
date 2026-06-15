  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ArrowRight, AlertTriangle, Send } from 'lucide-react';
import { MainDrawer, DrawerBody } from '@/components/common/drawer';
import { DrawerFormGrid, SelectField, TextField, TextareaField } from '@/components/common/drawer';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { supportApi } from '../services/support.api';

const CATEGORIES = ['Finance', 'KYC', 'Technical', 'Copy Trading', 'Account', 'Other'];
const PRIORITIES = [
  { value: 'LOW',  label: 'Low'      },
  { value: 'MED',  label: 'Medium'   },
  { value: 'HIGH', label: 'High'     },
];

export function CreateTicketDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: '', category: '', priority: 'MED', message: '' });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const upd = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const isValid = form.subject.trim() && form.category && form.message.trim();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    try {
      const ticket = await supportApi.createTicket({ 
        ...form, 
        attachments: files.map((f) => f.name) 
      });
      setCreated(ticket);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreated(null);
    setForm({ subject: '', category: '', priority: 'MED', message: '' });
    setFiles([]);
    onClose();
  };

  return (
    <MainDrawer open={open} width="max-w-[640px]" onClose={handleClose}>
      <div className="flex h-full w-full flex-col overflow-hidden">
        
        {/* Brand accent top bar */}
        <div
          className="h-[2.5px] w-full shrink-0"
          style={{
            background:
              'linear-gradient(90deg, var(--brand), color-mix(in srgb, var(--brand) 40%, transparent) 65%, transparent)',
          }}
        />

        {/* ── Success Screen ── */}
        {created ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-positive/12 flex items-center justify-center mb-5 border border-positive/20">
              <CheckCircle2 size={30} className="text-positive" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-positive">Submitted</span>
            <h2 className="font-heading font-semibold text-[22px] tracking-[-0.03em] text-text mt-2.5 mb-2">
              Ticket Sent Successfully
            </h2>
            <p className="text-[13px] text-text-muted leading-relaxed mb-6 max-w-[380px]">
              Ticket <span className="font-mono font-bold text-brand">{created.id}</span> has been opened. Our support team typically replies within 4 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
              <button
                onClick={() => {
                  navigate(`/client/support/tickets/${created.id}`);
                  handleClose();
                }}
                className="h-10 px-5 rounded-[9px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
              >
                View Ticket <ArrowRight size={13} />
              </button>
              <button
                onClick={() => {
                  setCreated(null);
                  setForm({ subject: '', category: '', priority: 'MED', message: '' });
                  setFiles([]);
                }}
                className="h-10 px-5 rounded-[9px] border border-border/20 text-[12.5px] font-bold flex items-center justify-center hover:bg-muted-surface/50 transition-colors cursor-pointer"
              >
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex-shrink-0 border-b border-border/15 px-6 py-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span className="text-[9.5px] font-black uppercase tracking-[0.22em] text-brand/65 leading-none">
                    Support · Create
                  </span>
                </div>
                <h2 className="text-[22px] font-bold tracking-[-0.025em] text-text leading-none">
                  New Support Ticket
                </h2>
                <p className="text-[12px] text-text-muted/50 mt-2.5 leading-relaxed max-w-[460px]">
                  Fill out the details below to request help from our support team.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>

            {/* Body */}
            <DrawerBody className="px-6 py-5 space-y-5">
              <DrawerFormGrid>
                <SelectField
                  label="Category"
                  value={form.category}
                  onChange={upd('category')}
                  options={CATEGORIES}
                  placeholder="Select category..."
                />
                <SelectField
                  label="Priority"
                  value={form.priority}
                  onChange={upd('priority')}
                  options={PRIORITIES}
                />
              </DrawerFormGrid>

              <TextField
                label="Subject"
                value={form.subject}
                onChange={upd('subject')}
                placeholder="What is the issue?"
              />

              <TextareaField
                label="Message"
                value={form.message}
                onChange={upd('message')}
                placeholder="Provide detailed information here..."
                rows={5}
              />

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">
                  Attachments <span className="text-text-muted/40 font-normal normal-case tracking-normal">(optional)</span>
                </span>
                <AttachmentUploader files={files} onChange={setFiles} />
              </div>
            </DrawerBody>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated">
              {/* Validation Warning */}
              {!isValid && (form.subject || form.category || form.message) && (
                <div className="flex items-center gap-2.5 mx-6 mt-4 rounded-[9px] border border-warning/22 bg-warning/6 px-3.5 py-2.5">
                  <AlertTriangle size={13} className="text-warning flex-shrink-0" />
                  <span className="text-[11.5px] font-medium text-warning leading-tight">
                    Please select a category, and fill in the subject and message.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 px-6 py-4">
                <p className="text-[10px] text-text-muted/35 font-medium">
                  <span className="text-brand/60 font-black">*</span> Required fields
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/20 bg-bg/40 text-text-muted hover:text-text hover:border-border/32 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                    className="flex items-center gap-1.5 h-9 px-5 rounded-[9px] text-[11.5px] font-black uppercase tracking-wider bg-brand text-bg hover:brightness-110 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Send size={11} /> {submitting ? 'Sending...' : 'Send Ticket'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </MainDrawer>
  );
}

export default CreateTicketDrawer;
