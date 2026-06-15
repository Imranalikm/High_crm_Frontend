import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { supportApi } from '../services/support.api';
import { SEV_STYLES } from '../configs/announcements.config';
import { PageShell } from '@/shared/components/layout/PageShell';

const STATUS_STYLES = {
  investigating: { cls: 'bg-warning/10 text-warning border-warning/20', label: 'Investigating' },
  resolved:      { cls: 'bg-positive/10 text-positive border-positive/20', label: 'Resolved'     },
};

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openInc, setOpenInc] = useState(null);

  useEffect(() => {
    Promise.all([supportApi.getAnnouncements(), supportApi.getIncidents()]).then(([anns, incs]) => {
      setAnnouncements(anns);
      setIncidents(incs);
      setLoading(false);
    });
  }, []);

  return (
    <PageShell className="space-y-6 max-w-[1100px] w-full mx-auto">
      {/* Header */}
      <div>
        <p className="text-section-eyebrow">Support</p>
        <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-1">Announcements</h1>
        <p className="text-[13px] text-text-muted mt-1">Updates on maintenance and system status.</p>
      </div>

      {/* Incident board */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted/65 mb-3.5">System status</p>
        <div className="space-y-3">
          {incidents.map((inc) => {
            const s  = STATUS_STYLES[inc.status] ?? STATUS_STYLES.resolved;
            const sev = SEV_STYLES[inc.severity] ?? SEV_STYLES.info;
            const isOpen = openInc === inc.id;
            return (
              <div key={inc.id} className={`rounded-[14px] border ${sev.border} overflow-hidden bg-surface-elevated shadow-sm`}>
                <button
                  type="button"
                  onClick={() => setOpenInc(isOpen ? null : inc.id)}
                  className="w-full flex items-center gap-3 p-4.5 text-left hover:bg-muted-surface/10 transition-colors cursor-pointer"
                >
                  {inc.status === 'resolved'
                    ? <CheckCircle2 size={15} className="text-positive shrink-0" />
                    : <AlertTriangle size={15} className="text-warning shrink-0 animate-pulse" />
                  }
                  <p className="flex-1 text-[13.5px] font-bold text-text">{inc.title}</p>
                  <span className={`px-2.5 py-1 rounded-full border text-[9.5px] font-black uppercase tracking-[0.1em] ${s.cls}`}>
                    {s.label}
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-text-muted/40 hover:text-text hover:bg-muted-surface/50 ml-2">
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-205 ${isOpen ? 'rotate-180 text-text' : ''}`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-border/15 p-5 space-y-3 bg-muted-surface/5 animate-in fade-in duration-200">
                    {inc.updates.map((u, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="font-mono text-[11px] font-bold text-text-muted/50 shrink-0 w-24">{u.time}</span>
                        <p className="text-[12.5px] text-text-muted leading-relaxed">{u.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted/65 mb-3.5">Announcements</p>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-20 rounded-[12px] bg-surface-elevated border border-border/30 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => <AnnouncementCard key={a.id} ann={a} />)}
          </div>
        )}
      </div>

      {announcements.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-[12px] border border-dashed border-border/30">
          <Bell size={24} className="text-text-muted/30 mb-3" />
          <p className="text-[13px] font-semibold text-text-muted">No announcements</p>
          <p className="text-[11.5px] text-text-muted/55 mt-1">We will post system updates here.</p>
        </div>
      )}
    </PageShell>
  );
}

export default AnnouncementsPage;
