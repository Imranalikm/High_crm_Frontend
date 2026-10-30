/**
 * Build a URL for a backend-hosted upload (/uploads/...).
 * The backend requires login for these files, and <img>/<a> tags cannot send
 * an Authorization header, so the current access token is appended as ?token=.
 * Older records may hold an absolute disk path; everything from "/uploads/" on is used.
 */
export function getUploadUrl(path) {
  if (!path) return null;

  let stringPath = '';
  if (typeof path === 'string') {
    stringPath = path;
  } else if (typeof path === 'object') {
    if (typeof File !== 'undefined' && path instanceof File) {
      try {
        return URL.createObjectURL(path);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    stringPath = path.url || path.path || path.location || path.filePath || '';
  }
  if (!stringPath) return null;

  if (/^(https?:|blob:|data:)/.test(stringPath) || stringPath.startsWith('/mock_')) {
    return stringPath;
  }

  const normalized = stringPath.replace(/\\/g, '/');
  const idx = normalized.indexOf('/uploads/');
  const relative = idx >= 0 ? normalized.slice(idx) : `/${normalized.replace(/^\/+/, '')}`;

  const baseUrl = (import.meta.env.VITE_API_URL || 'https://account.smatams.com/api')
    .replace(/\/+$/, '')
    .replace(/\/api$/, '');

  let token = null;
  try {
    token = localStorage.getItem('admin_token');
  } catch {
    token = null;
  }

  return `${baseUrl}${relative}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
}
