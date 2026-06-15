import React, { useMemo, useState } from 'react';
import { Download, Edit2, Printer, Search, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTableState } from '@/hooks/useTableState';
import { exportRows } from '@/utils/exporters';
import { MainTable } from '@/components/common/table';
import { StatusBadge } from '@/components/ui';

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

export function GroupDirectoryTab({ groups, onEditGroup, onAddGroup, onDeleteGroup }) {
  const [search, setSearch] = useState('');

  const filteredGroups = useMemo(() => {
    return filterBySearch(groups, search, ['name', 'mt5GroupName', 'groupType', 'currencyUnit']);
  }, [search, groups]);

  const tableState = useTableState(filteredGroups, { searchFields: [], initialPageSize: 10 });

  const handleExportCSV = (e) => {
    e.stopPropagation();
    exportRows(filteredGroups, 'group-list.csv');
  };

  const handlePrint = (e) => {
    e.stopPropagation();
    window.print();
  };

  const columns = [
    {
      key: 'id',
      label: 'Id',
      render: (_, row) => (
        <span className="font-mono text-[13px] font-semibold text-text-muted select-none">
          {row.id}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <span className="text-[13.5px] font-bold text-text hover:text-brand cursor-pointer transition-colors" onClick={() => onEditGroup(row)}>
          {row.name}
        </span>
      ),
    },
    {
      key: 'mt5GroupName',
      label: 'MT5 Group',
      render: (_, row) => (
        <span className="font-mono text-[12.5px] font-semibold text-brand tracking-wider select-none">
          {row.mt5GroupName}
        </span>
      ),
    },
    {
      key: 'groupType',
      label: 'Group Type',
      render: (_, row) => (
        <span className="text-[12.5px] font-semibold text-text-muted select-none">
          {row.groupType}
        </span>
      ),
    },
    {
      key: 'leverage',
      label: 'Leverage',
      render: (_, row) => (
        <span className="font-mono text-[12.5px] font-semibold text-text select-none">
          {row.maxLeverage || '1'}
        </span>
      ),
    },
    {
      key: 'groupStatus',
      label: 'Status',
      render: (_, row) => {
        const statusVal = row.groupStatus ? row.groupStatus.toUpperCase() : 'ACTIVE';
        // Display ACTIVE or INACTIVE (or whatever the groupStatus is) directly
        return <StatusBadge status={statusVal} size="sm" />;
      },
    },
    {
      key: 'currencyUnit',
      label: 'Currency',
      render: (_, row) => (
        <span className="text-[12.5px] font-semibold text-text-muted select-none">
          {row.currencyUnit}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Created',
      render: (_, row) => (
        <span className="font-mono text-[12px] text-text-muted font-medium select-none">
          {row.date}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onEditGroup(row)}
            className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-border/20 bg-bg/50 text-text-muted hover:border-brand/40 hover:text-brand transition-all cursor-pointer active:scale-[0.95]"
            title="Edit Group"
          >
            <Edit2 size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteGroup(row.id)}
            className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-border/20 bg-bg/50 text-text-muted hover:border-negative/40 hover:text-negative transition-all cursor-pointer active:scale-[0.95]"
            title="Delete Group"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card padding={false} className="animate-in fade-in duration-200">
      {/* Table Toolbar controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-border/10 bg-bg/15">
        {/* Search */}
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/30" size={13.5} />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); tableState.setPage(1); }}
            className="w-full h-8 pl-8 pr-3 rounded-[8px] border border-border/20 bg-bg text-[12.5px] text-text placeholder:text-text-muted/30 outline-none focus:border-brand/40 transition-all font-heading"
          />
        </div>
        
        {/* Buttons list */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-bg/60 text-text-muted hover:text-text border border-border/20 text-[11px] font-bold tracking-wide transition-all cursor-pointer uppercase active:scale-[0.97]"
          >
            <Download size={11} /> CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-bg/60 text-text-muted hover:text-text border border-border/20 text-[11px] font-bold tracking-wide transition-all cursor-pointer uppercase active:scale-[0.97]"
          >
            <Printer size={11} /> Print
          </button>
          <button
            type="button"
            onClick={onAddGroup}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out hover:brightness-110 active:scale-[0.97] cursor-pointer"
          >
            <Plus size={12} /> Add Group
          </button>
        </div>
      </div>

      <MainTable
        columns={columns}
        data={tableState.items}
        onRowClick={(row) => onEditGroup(row)}
        emptyTitle="No groups found."
        pagination={tableState}
        rowClassName={() => 'hover:bg-brand/[0.02] hover:border-l-brand hover:border-l-3 transition-all duration-150'}
      />
    </Card>
  );
}

export default GroupDirectoryTab;
