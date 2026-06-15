function matchesSearch(item, search, searchFields = []) {
  if (!search) return true;

  const normalizedSearch = search.toLowerCase();

  return searchFields.some((field) => {
    const value = field.split('.').reduce((result, part) => result?.[part], item);
    return String(value ?? '').toLowerCase().includes(normalizedSearch);
  });
}

function matchesFilters(item, filters = {}) {
  return Object.entries(filters).every(([key, value]) => {
    if (value == null || value === '' || value === 'all') {
      return true;
    }

    return String(item[key] ?? '').toLowerCase() === String(value).toLowerCase();
  });
}

function sortItems(items, sort) {
  if (!sort?.key) return items;

  const direction = sort.direction === 'desc' ? -1 : 1;

  return [...items].sort((left, right) => {
    const a = left[sort.key];
    const b = right[sort.key];

    if (a === b) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return a > b ? direction : -direction;
  });
}

export function applyTableQuery(items = [], query = {}, options = {}) {
  const searched = items.filter((item) => matchesSearch(item, query.search, options.searchFields));
  const filtered = searched.filter((item) => matchesFilters(item, query.filters));
  return sortItems(filtered, query.sort);
}
