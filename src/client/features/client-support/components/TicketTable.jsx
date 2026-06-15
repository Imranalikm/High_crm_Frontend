import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { TicketStatusBadge } from './TicketStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CATEGORY_MAP } from '../configs/tickets.config';
import { MainTable } from '@/components/common/table';

function CategoryTag({ category }) {
  const c = CATEGORY_MAP[category] ?? CATEGORY_MAP.Other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-[0.05em] ${c.cls}`}>
      {category}
    </span>
  );
}

export function TicketTable({ tickets = [], onSelect, loading = false, pagination }) {
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'Ticket ID',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {row.unread && (
            <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
          )}
          <span className="font-mono text-[12px] font-bold text-brand tracking-tight">{val}</span>
        </div>
      ),
      width: '100px',
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val, row) => (
        <div className="max-w-[280px]">
          <p className={`text-[13px] truncate transition-colors group-hover:text-text ${row.unread ? 'font-bold text-text' : 'font-medium text-text-muted'}`}>
            {val}
          </p>
          <p className="text-[10.5px] text-text-muted/50 mt-0.5">{row.messages} message{row.messages !== 1 ? 's' : ''}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => <CategoryTag category={val} />,
      width: '130px',
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <PriorityBadge priority={val} />,
      width: '100px',
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <TicketStatusBadge status={val} />,
      width: '110px',
    },
    {
      key: 'updated',
      label: 'Updated',
      render: (val) => (
        <span className="font-mono text-[11.5px] font-semibold text-text-muted/65">{val}</span>
      ),
      width: '115px',
    },
    {
      key: 'id', // Render action arrow cell
      label: '',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect?.(row); }}
          className="w-8 h-8 rounded-[8px] border border-border/30 bg-surface flex items-center justify-center text-text-muted/50 group-hover:text-brand group-hover:border-brand/40 group-hover:bg-brand/8 transition-all duration-200 ml-auto"
        >
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      ),
      width: '50px',
    }
  ], [onSelect]);

  if (loading) {
    return (
      <div className="divide-y divide-border/20 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse bg-muted-surface/20 my-2 rounded-[9px]" />
        ))}
      </div>
    );
  }

  return (
    <MainTable
      columns={columns}
      data={tickets}
      onRowClick={onSelect}
      emptyTitle="No tickets found matching filters."
      pagination={pagination}
      rowClassName={(row) => {
        if (row.status === 'RESOLVED') return 'hover:bg-positive/[0.03] hover:border-l-positive';
        if (row.status === 'OPEN') return 'hover:bg-brand/[0.03] hover:border-l-brand';
        if (row.status === 'PENDING') return 'hover:bg-warning/[0.03] hover:border-l-warning';
        return 'hover:bg-muted-surface/30 hover:border-l-border';
      }}
    />
  );
}

export default TicketTable;
