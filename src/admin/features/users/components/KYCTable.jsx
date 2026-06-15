import React from 'react';
import { StatusBadge, RiskChip } from '@/components/ui';
import { MainTable } from '@/components/common/table';

export function KYCTable({ tableState, onReviewUser }) {
  const columns = [
    { 
      key: 'id', 
      label: 'S.No.', 
      render: (_, __, idx) => {
        const page = tableState?.page || 1;
        const pageSize = tableState?.pageSize || 10;
        const sNo = (page - 1) * pageSize + idx + 1;
        return (
          <span className="inline-flex px-2 py-0.5 rounded-[5px] border border-border/15 bg-bg/30 font-mono text-[11px] font-bold text-text-muted select-none">
            {sNo}
          </span>
        );
      }
    },
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <div>
            <div className="text-[13.5px] font-semibold text-text leading-tight">{row.user}</div>
            <div className="mt-1 select-none">
              <span className="px-1.5 py-0.5 rounded-[4px] border border-border/12 bg-bg/40 font-mono text-[10.5px] font-bold uppercase text-text-muted tracking-wider">
                {row.country || 'GLOBAL'}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    { 
      key: 'docs', 
      label: 'Files', 
      render: (val) => (
        <span className="font-mono text-[12.5px] text-text-muted font-medium select-none">
          {val} files
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => {
        const isVerified = val === 'VERIFIED';
        const isRejected = val === 'REJECTED';
        const pulseColor = isVerified ? 'bg-positive shadow-[0_0_8px_var(--positive)]' : isRejected ? 'bg-negative shadow-[0_0_8px_var(--negative)]' : 'bg-warning shadow-[0_0_8px_var(--warning)]';
        return (
          <div className="flex items-center gap-2 select-none">
            <span className={`h-1.5 w-1.5 rounded-full ${pulseColor} animate-pulse shrink-0`} />
            <StatusBadge status={val} />
          </div>
        );
      } 
    },
    { 
      key: 'risk', 
      label: 'Risk', 
      render: (val) => (
        <div className="select-none scale-[0.95] origin-left">
          <RiskChip value={val} />
        </div>
      ) 
    },
    { 
      key: 'submittedAt', 
      label: 'Time', 
      render: (val) => {
        if (!val) return <span className="text-text-muted/40 font-mono text-[11px]">—</span>;
        
        let displayVal = val;
        try {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            displayVal = date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          }
        } catch {
          // fallback
        }
        
        return (
          <span className="font-mono text-[11.5px] text-text-muted font-medium select-none">
            {displayVal}
          </span>
        );
      } 
    },
    { 
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReviewUser(row.userId, row); }}
          className="inline-flex items-center justify-center h-7 px-3.5 rounded-[7px] border border-border/15 bg-bg/25 text-text-muted hover:text-text hover:border-brand/40 hover:bg-bg/40 text-[10.5px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-[0.94] shadow-sm select-none"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <MainTable
      columns={columns}
      data={tableState.items}
      onRowClick={(row) => onReviewUser(row.userId, row)}
      emptyTitle="No requests match the search."
      pagination={tableState}
      rowClassName={(row) => {
        const isFlagged = ['REJECTED', 'FAILED', 'FLAGGED'].includes(row.status);
        const isPending = ['PENDING', 'NONE'].includes(row.status);
        if (isFlagged) return 'hover:bg-negative/[0.02] hover:border-l-negative hover:border-l-3 transition-all duration-150';
        if (isPending) return 'hover:bg-warning/[0.02] hover:border-l-warning hover:border-l-3 transition-all duration-150';
        return 'hover:bg-positive/[0.02] hover:border-l-positive hover:border-l-3 transition-all duration-150';
      }}
    />
  );
}

