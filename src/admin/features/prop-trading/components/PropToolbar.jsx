import React from 'react';
import { PageToolbar } from '@/components/layout/PageToolbar';

/**
 * PropToolbar — wraps the canonical PageToolbar (same as CopyTradingToolbar / TradingToolbar).
 * Converts legacy prop shape → PageToolbar prop shape.
 *
 * Legacy props:
 *   search, setSearch, filters, activeFilter, setFilter, actions
 */
export function PropToolbar({
  search,
  setSearch,
  filters,
  activeFilter,
  setFilter,
  actions = [],
}) {
  // Build filterSets in the PageToolbar format
  const filterSets = filters
    ? [
        {
          label: 'Status',
          get: (activeFilter === 'ALL' || !activeFilter) ? 'all' : activeFilter,
          set: (v) => setFilter(v === 'all' ? 'ALL' : v),
          opts: filters.map(f => ({ value: f === 'ALL' ? 'all' : f, label: f })),
        },
      ]
    : [];

  // Convert actions to PageToolbar format
  const pageActions = actions.map(a => ({
    label: a.label,
    icon: a.Icon,
    variant: a.variant === 'success' ? 'primary' : 'secondary',
    onClick: a.onClick,
  }));

  return (
    <PageToolbar
      search={search}
      onSearchChange={setSearch}
      filterSets={filterSets}
      actions={pageActions}
    />
  );
}
