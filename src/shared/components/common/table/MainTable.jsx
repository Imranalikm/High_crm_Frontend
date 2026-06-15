import React from 'react';
import { EmptyState } from '../../feedback/EmptyState';
import { Pagination } from './Pagination';

function alignmentClass(align) {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

/**
 * MainTable - The unified premium table for the admin dashboard.
 * 
 * Props:
 * - columns: Array of { key, label, render, align, width, className }
 * - data: Array of row objects
 * - onRowClick: function(row)
 * - rowKey: string (default 'id')
 * - emptyTitle: string
 * - rowClassName: string or function(row, index) -> string
 * - pagination: { page, totalPages, pageSize, onPageChange, onPageSizeChange } (optional)
 */
export function MainTable({
  columns = [],
  data = [],
  onRowClick,
  rowKey = 'id',
  emptyTitle = 'No records found',
  rowClassName,
  pagination,
}) {
  if (!data.length) {
    return (
      <div className="p-10 flex items-center justify-center">
        <EmptyState title={emptyTitle} />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 border-b border-border/10 bg-bg/20">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-4 py-3 ${alignmentClass(col.align)} ${col.className || ''}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/8">
            {data.map((row, idx) => {
              const rKey = row[rowKey] ?? row._id ?? row.id ?? idx;
              const defaultHover = 'hover:bg-positive/5 hover:border-l-positive';
              const customClass = typeof rowClassName === 'function' ? rowClassName(row, idx) : (rowClassName || defaultHover);
              const isClickable = !!onRowClick;

              return (
                <tr
                  key={rKey}
                  onClick={() => isClickable && onRowClick(row)}
                  className={`group transition-colors border-l-2 border-transparent ${isClickable ? 'cursor-pointer' : ''} ${customClass}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${alignmentClass(col.align)}`}
                    >
                      {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="border-t border-border/10">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            pageSize={pagination.pageSize}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </>
  );
}
