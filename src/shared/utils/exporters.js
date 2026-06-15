export function exportRows(rows, filename = 'export.csv') {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);
  const content = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
