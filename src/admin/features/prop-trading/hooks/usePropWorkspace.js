import { useState, useMemo, useCallback } from 'react';
import { useDrawerState } from '@/hooks/useDrawerState';

/**
 * usePropWorkspace — shared local state for Prop Trading list pages.
 *
 * Eliminates the 20-line copy-pasted block that was in every Prop
 * Trading sub-page (EvaluationRequests, FundedAccounts, etc.).
 *
 * @param {object} config
 * @param {Array}  config.rows        — source data rows
 * @param {string} [config.statusKey='status']     — row key to filter by
 * @param {string} [config.searchKey='trader']     — primary search field
 * @param {string} [config.searchKey2='id']        — secondary search field
 * @param {function} [config.customFilter]         — (row, filter) => bool override
 *
 * @returns {{
 *   search: string, setSearch: fn,
 *   filter: string, setFilter: fn,
 *   filtered: Array,
 *   drawer: any,   openDrawer: fn, closeDrawer: fn,
 *   toast: string|null, onAction: fn,
 * }}
 */
export function usePropWorkspace({
  rows = [],
  statusKey = 'status',
  searchKey = 'trader',
  searchKey2 = 'id',
  customFilter = null,
}) {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('ALL');
  const drawerState = useDrawerState(null);
  const [toast,  setToast]    = useState(null);

  const onAction = useCallback((msg, id) => {
    setToast(`${msg}: ${id}`);
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const openDrawer  = drawerState.open;
  const closeDrawer = drawerState.close;

  const filtered = useMemo(() => {
    let result = rows;

    if (filter !== 'ALL') {
      if (customFilter) {
        result = result.filter((r) => customFilter(r, filter));
      } else {
        result = result.filter((r) => r[statusKey] === filter);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        String(r[searchKey] ?? '').toLowerCase().includes(q) ||
        String(r[searchKey2] ?? '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [rows, filter, search, statusKey, searchKey, searchKey2, customFilter]);

  return {
    search, setSearch,
    filter, setFilter,
    filtered,
    drawer: drawerState.value,
    isDrawerOpen: drawerState.isOpen,
    openDrawer, closeDrawer,
    toast,  onAction,
  };
}
