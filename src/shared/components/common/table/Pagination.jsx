/**
 * Pagination — unified pagination for ALL feature tables.
 *
 * Supports two API shapes:
 *  A) Canonical (Users/Trading):  page, totalPages, onPageChange, pageSize, onPageSizeChange
 *  B) Finance legacy:             page, total, perPage, setPage
 *
 * Both render identically: a compact row with "Showing X–Y of Z" on the left
 * and numbered page buttons + rows-per-page select on the right.
 */
import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Pagination({
  // Shape A
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  // Shape B (Finance legacy aliases)
  total,
  perPage,
  setPage,
}) {
  // Normalise to one shape
  const _pageSize   = pageSize   ?? perPage  ?? 10;
  const _total      = total      ?? (totalPages != null ? totalPages * _pageSize : 0);
  const _totalPages = totalPages ?? Math.ceil(_total / _pageSize);
  const _setPage    = onPageChange ?? setPage ?? (() => {});
  const _setSize    = onPageSizeChange;

  if (_totalPages <= 1 && !_setSize) return null;

  const from  = Math.min((page - 1) * _pageSize + 1, _total);
  const to    = Math.min(page * _pageSize, _total);

  // Show at most 5 page numbers, centred around current page
  const getPages = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(_totalPages, page + delta);
      i++
    ) range.push(i);
    return range;
  };

  return (
    <div className="flex flex-col gap-3 border-t border-border/15 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: count */}
      <span className="text-[11px] text-text-muted/45 font-heading">
        {_total > 0
          ? `Showing ${from}–${to} of ${_total}`
          : 'No results'}
      </span>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Rows-per-page */}
        {_setSize && (
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted/40">Rows</span>
            <select
              value={_pageSize}
              onChange={(e) => _setSize(Number(e.target.value))}
              className="h-7 rounded-[7px] border border-border/20 bg-bg px-2 text-[11px] text-text outline-none cursor-pointer focus:border-primary/40 transition-all"
            >
              {[7, 10, 20, 30, 50].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Prev */}
        <button
          onClick={() => _setPage(page - 1)}
          disabled={page <= 1}
          className="w-7 h-7 rounded-[6px] border border-border/20 bg-bg flex items-center justify-center text-text-muted/40 hover:text-text hover:border-border/40 disabled:opacity-30 cursor-pointer transition-all"
        >
          <ChevronDown size={12} className="rotate-90" />
        </button>

        {/* Page numbers */}
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => _setPage(p)}
            className={`w-7 h-7 rounded-[6px] border text-[11px] font-bold font-heading cursor-pointer transition-all
              ${page === p
                ? 'bg-primary/[0.12] text-primary border-primary/25'
                : 'border-border/20 bg-bg text-text-muted/40 hover:text-text hover:border-border/40'
              }`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => _setPage(page + 1)}
          disabled={page >= _totalPages}
          className="w-7 h-7 rounded-[6px] border border-border/20 bg-bg flex items-center justify-center text-text-muted/40 hover:text-text hover:border-border/40 disabled:opacity-30 cursor-pointer transition-all"
        >
          <ChevronDown size={12} className="-rotate-90" />
        </button>
      </div>
    </div>
  );
}
