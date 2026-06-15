import { useState, useMemo } from 'react';
import { useTableState } from './useTableState';

/**
 * useWorkspace — shared generic workspace hook.
 *
 * Replaces the two previously identical hooks:
 *   • useTradingWorkspace    (trading/hooks/)
 *   • useCopyTradingWorkspace (copy-trading/hooks/)
 *
 * Accepts a workspace config object that defines `rows`, `searchFields`,
 * and optional filter option arrays (e.g. `statusOpts`, `riskOpts`).
 * Builds filter sets dynamically from whichever option arrays are present,
 * applies search + filters to the rows, and feeds the result into useTableState.
 *
 * @param {object} config  - Workspace config (rows, searchFields, *Opts arrays)
 * @returns {{ search, setSearch, filters, setFilter, filterSets, filtered, table }}
 */
export function useWorkspace(config) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    // Trading filter keys
    status:   'all',
    type:     'all',
    symbol:   'all',
    side:     'all',
    server:   'all',
    severity: 'all',
    bridge:   'all',
    source:   'all',
    pnl:      'all',
    // Copy-trading filter keys
    risk:     'all',
    approval: 'all',
    region:   'all',
    plan:     'all',
    trend:    'all',
  });

  const setFilter = (key, val) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  /* Build filterSets dynamically — only includes filters the config declares */
  const filterSets = useMemo(() => {
    const s = config;
    const sets = [];
    // Copy-trading filter options
    if (s.statusOpts)   sets.push({ label: 'Status',   opts: s.statusOpts,   get: filters.status,   set: (v) => setFilter('status',   v), key: 'status'   });
    if (s.riskOpts)     sets.push({ label: 'Risk',     opts: s.riskOpts,     get: filters.risk,     set: (v) => setFilter('risk',     v), key: 'risk'     });
    if (s.approvalOpts) sets.push({ label: 'Approval', opts: s.approvalOpts, get: filters.approval, set: (v) => setFilter('approval', v), key: 'approval' });
    if (s.regionOpts)   sets.push({ label: 'Region',   opts: s.regionOpts,   get: filters.region,   set: (v) => setFilter('region',   v), key: 'region'   });
    if (s.planOpts)     sets.push({ label: 'Plan',     opts: s.planOpts,     get: filters.plan,     set: (v) => setFilter('plan',     v), key: 'plan'     });
    if (s.trendOpts)    sets.push({ label: 'Trend',    opts: s.trendOpts,    get: filters.trend,    set: (v) => setFilter('trend',    v), key: 'trend'    });
    if (s.severityOpts) sets.push({ label: 'Severity', opts: s.severityOpts, get: filters.severity, set: (v) => setFilter('severity', v), key: 'severity' });
    if (s.typeOpts)     sets.push({ label: 'Type',     opts: s.typeOpts,     get: filters.type,     set: (v) => setFilter('type',     v), key: 'type'     });
    // Trading-specific filter options
    if (s.symbolOpts)   sets.push({ label: 'Symbol',   opts: s.symbolOpts,   get: filters.symbol,   set: (v) => setFilter('symbol',   v), key: 'symbol'   });
    if (s.sideOpts)     sets.push({ label: 'Side',     opts: s.sideOpts,     get: filters.side,     set: (v) => setFilter('side',     v), key: 'side'     });
    if (s.serverOpts)   sets.push({ label: 'Server',   opts: s.serverOpts,   get: filters.server,   set: (v) => setFilter('server',   v), key: 'server'   });
    if (s.bridgeOpts)   sets.push({ label: 'Bridge',   opts: s.bridgeOpts,   get: filters.bridge,   set: (v) => setFilter('bridge',   v), key: 'bridge'   });
    if (s.resultOpts)   sets.push({ label: 'Result',   opts: s.resultOpts,   get: filters.status,   set: (v) => setFilter('status',   v), key: 'status'   });
    if (s.sourceOpts)   sets.push({ label: 'Source',   opts: s.sourceOpts,   get: filters.source,   set: (v) => setFilter('source',   v), key: 'source'   });
    if (s.profitOpts)   sets.push({ label: 'P&L',      opts: s.profitOpts,   get: filters.pnl,      set: (v) => setFilter('pnl',      v), key: '_pnl'     });
    return sets.slice(0, 4);
  }, [config, filters]);

  /* Apply search + filters to rows */
  const filtered = useMemo(() => {
    let rows = config.rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        config.searchFields.some((f) => String(r[f] ?? '').toLowerCase().includes(q))
      );
    }
    for (const fs of filterSets) {
      if (fs.get !== 'all') {
        rows = rows.filter((r) => {
          if (fs.key === '_pnl') {
            return fs.get === 'Profit'
              ? String(r.pnl).startsWith('+')
              : !String(r.pnl).startsWith('+');
          }
          return r[fs.key] === fs.get;
        });
      }
    }
    return rows;
  }, [config, search, filterSets]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  return {
    search,
    setSearch,
    filters,
    setFilter,
    filterSets,
    filtered,
    table,
  };
}
