import { useMemo, useState } from 'react';
import { applyTableQuery } from '../utils/table-query';

export function useTableState(items, options = {}) {
  const [search, setSearch] = useState(options.initialSearch ?? '');
  const [filters, setFilters] = useState(options.initialFilters ?? {});
  const [sort, setSort] = useState(options.initialSort ?? null);
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize ?? 10);

  const query = useMemo(() => ({
    search,
    filters,
    sort,
    page,
    pageSize,
  }), [search, filters, sort, page, pageSize]);

  const filteredItems = useMemo(
    () => applyTableQuery(items, query, options),
    [items, query, options],
  );

  const total = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  function setFilter(name, value) {
    setPage(1);
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function clearFilters() {
    setPage(1);
    setFilters({});
    setSearch('');
  }

  return {
    query,
    items: pagedItems,
    total,
    totalPages,
    page: safePage,
    pageSize,
    search,
    filters,
    sort,
    setSearch: (value) => {
      setPage(1);
      setSearch(value);
    },
    setFilters,
    setFilter,
    clearFilters,
    setSort,
    setPage,
    setPageSize,
  };
}
