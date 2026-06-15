import React from 'react';
import { Edit2, PauseCircle, PlayCircle } from 'lucide-react';
import { StatusChip as Badge } from '@/components/ui';
import { MainTable, TableToolbar } from '@/components/common/table';

const feesCols = [
  { key: 'challenge',  label: 'Challenge',   render: (v) => <span className="font-heading font-semibold text-text/75">{v}</span> },
  { key: 'fee',        label: 'Fee',         render: (v) => <span className="font-mono font-bold text-brand">{v}</span> },
  { key: 'refundable', label: 'Refundable',  render: (v) => (
    <span className={`text-[10px] font-black uppercase font-heading ${v ? 'text-positive' : 'text-text-muted/40'}`}>
      {v ? '✓ Yes' : '✗ No'}
    </span>
  )},
  { key: 'freeRetry',  label: 'Free Retry',  render: () => <span className="text-text-muted/30 font-heading text-[10.5px]">No</span> },
  { key: 'active',     label: 'Status',      render: (v) => <Badge value={v ? 'ACTIVE' : 'PAUSED'} /> },
];

export function FeesTable({ rows, showToast }) {
  // Inject action col with showToast bound
  const cols = [
    ...feesCols,
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <button onClick={() => showToast(`Editing ${r.challenge}`)} className="w-6 h-6 rounded-[5px] border border-border/25 flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer">
            <Edit2 size={10} />
          </button>
          <button onClick={() => showToast(`Toggled ${r.challenge}`)} className="w-6 h-6 rounded-[5px] border border-border/25 flex items-center justify-center text-text-muted/40 hover:text-warning cursor-pointer">
            {r.active ? <PauseCircle size={10} /> : <PlayCircle size={10} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden flex flex-col">
      <TableToolbar 
        title="Challenge Fees" 
        actions={<button onClick={() => showToast('Fee edit mode')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"><Edit2 size={12}/> Edit Fees</button>} 
      />
      <MainTable 
        columns={cols} 
        data={rows} 
        rowClassName={() => "hover:bg-brand/5 hover:border-l-brand"} 
      />
    </section>
  );
}
