/**
 * Status Constants & Theming
 * 
 * Maps business logic status states (e.g., ACTIVE, PENDING) to their respective 
 * semantic CSS variables (e.g., var(--positive)). This ensures that badges, text, 
 * and indicators share consistent coloring across the whole UI.
 * Used extensively in the frontend design components.
 */
export const STATUS_COLORS = {
  // ── Positive ───────────────────────────────────
  ACTIVE:    'var(--positive)',
  FILLED:    'var(--positive)',
  WIN:       'var(--positive)',
  APPROVED:  'var(--positive)',
  PUBLISHED: 'var(--positive)',
  VERIFIED:  'var(--positive)',
  PAID:      'var(--positive)',
  SUCCESS:   'var(--positive)',
  COMPLETED: 'var(--positive)',
  RENEWED:   'var(--positive)',
  SETTLED:   'var(--positive)',
  RESOLVED:  'var(--positive)',
  PASS:      'var(--positive)',
  CLEAR:     'var(--positive)',
  // ── Warning ────────────────────────────────────
  PENDING:     'var(--warning)',
  REVIEW:      'var(--warning)',
  PAUSED:      'var(--warning)',
  SUSPENDED:   'var(--warning)',
  WARNED:      'var(--warning)',
  READONLY:    'var(--warning)',
  PROCESSING:  'var(--warning)',
  EXPIRING:    'var(--warning)',
  IN_REVIEW:   'var(--warning)',
  FROZEN:      'var(--warning)',
  RETRY:       'var(--warning)',
  ESCALATED:   'var(--warning)',
  // ── Negative ───────────────────────────────────
  BLOCKED:     'var(--negative)',
  REJECTED:    'var(--negative)',
  FAILED:      'var(--negative)',
  LOSS:        'var(--negative)',
  BREACHED:    'var(--negative)',
  CRITICAL:    'var(--negative)',
  RESTRICTED:  'var(--negative)',
  FLAGGED:     'var(--negative)',
  UNRESOLVED:  'var(--negative)',
  FAIL:        'var(--negative)',
  FLAG:        'var(--negative)',
  // ── Cyan (informational) ───────────────────────
  OPEN:        'var(--cyan)',
  IN_PROGRESS: 'var(--cyan)',
  REVIEW_ONLY: 'var(--cyan)',
  // ── Muted (neutral/terminal) ───────────────────
  CANCELED:  'var(--text-muted)',
  EXPIRED:   'var(--text-muted)',
  DRAFT:     'var(--text-muted)',
  INACTIVE:  'var(--text-muted)',
  HEARTBEAT: 'var(--text-muted)',
  CLOSED:    'var(--text-muted)',
};

/** 
 * Risk levels mapped to semantic severity colors 
 */
export const RISK_COLORS = {
  LOW:    'var(--positive)',
  MEDIUM: 'var(--warning)',
  HIGH:   'var(--negative)',
};

/** Priority badge colors — Finance & Support */
export const PRIORITY_COLORS = {
  CRITICAL: 'var(--negative)',
  HIGH:     '#f97316',
  MEDIUM:   'var(--warning)',
  LOW:      'var(--cyan)',
};

/** Support-specific category tag colors */
export const CATEGORY_COLORS = {
  Finance:    'var(--brand)',
  Technical:  'var(--cyan)',
  KYC:        '#a78bfa',
  Account:    'var(--warning)',
  Trading:    'var(--positive)',
  IB:         'rgba(74,225,118,0.7)',
  Prop:       '#f97316',
  Compliance: 'var(--negative)',
};

export const SEVERITY_COLORS = {
  INFO: 'var(--positive)',
  WARN: 'var(--warning)',
  ERROR: 'var(--negative)',
  CRITICAL: 'var(--negative)',
};

/** SEV_CLR — used in audit logs, system reports, activity logs */
export const SEV_CLR = {
  INFO: 'var(--cyan)',
  WARNING: 'var(--warning)',
  ERROR: 'var(--negative)',
  CRITICAL: 'var(--negative)',
};


export const TRADING_LOG_COLORS = {
  EXECUTION: 'var(--positive)',
  SYNC: 'var(--cyan)',
  REJECTION: 'var(--negative)',
  RETRY: 'var(--warning)',
  PRICE_FEED: 'var(--purple)',
  HEARTBEAT: 'var(--text-muted)',
  MARGIN_CALL: 'var(--negative)',
};

export const COPY_LOG_COLORS = {
  COPY_EXECUTED: 'var(--positive)',
  SUBSCRIPTION: 'var(--cyan)',
  SYNC_FAIL: 'var(--negative)',
  PROVIDER_UPDATE: 'var(--warning)',
  RISK_FLAG: 'var(--negative)',
  FOLLOWER_JOINED: 'var(--purple)',
};

export const IB_TIER_COLORS = {
  GOLD: 'rgba(218,165,32,1)',
  PLATINUM: 'rgba(180,190,210,1)',
  ELITE: 'rgba(139,92,246,1)',
  STANDARD: 'rgba(100,116,139,1)',
};

/**
 * Maps standard string keywords to generic variant names.
 * These variant names (success, info, warning, danger) are generally 
 * picked up by generic UI components (like Badges) to automatically apply styles.
 */
export const statusVariantMap = {
  active: 'success',
  verified: 'success',
  approved: 'success',
  approve: 'success',
  completed: 'success',
  connected: 'success',
  funded: 'success',
  settled: 'success',
  success: 'success',
  healthy: 'success',
  top: 'success',
  ready: 'success',
  received: 'success',
  open: 'info',
  live: 'info',
  info: 'info',
  low: 'info',
  gold: 'info',
  elite: 'info',
  global: 'info',
  finance: 'info',
  users: 'info',
  trading: 'info',
  audit: 'info',
  infra: 'info',
  api: 'info',
  csv: 'info',
  xlsx: 'info',
  zip: 'info',
  pending: 'warning',
  review: 'warning',
  'in-review': 'warning',
  paused: 'warning',
  flagged: 'warning',
  warning: 'warning',
  escalated: 'warning',
  medium: 'warning',
  watch: 'warning',
  watchlist: 'warning',
  'in-progress': 'warning',
  'new-device': 'warning',
  processing: 'warning',
  review_only: 'warning',
  platinum: 'warning',
  desk: 'warning',
  challenge: 'warning',
  funded_scope: 'warning',
  trial: 'warning',
  failed: 'danger',
  rejected: 'danger',
  reject: 'danger',
  blocked: 'danger',
  limited: 'danger',
  disconnected: 'danger',
  critical: 'danger',
  high: 'danger',
  breach: 'danger',
  restricted: 'danger',
  'high-risk': 'danger',
  hold: 'danger',
  draft: 'danger',
  expired: 'danger',
};

/**
 * Helper to get a generic variant ('success', 'warning', 'danger', 'info', or 'muted')
 * from any arbitrary status string by normalizing it first.
 *
 * @param {string} status - The raw status string (e.g., 'In Progress', 'APPROVED')
 * @returns {string} The resolved UI variant.
 */
export function getStatusVariant(status = '') {
  const normalized = String(status)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return statusVariantMap[normalized] ?? 'muted';
}
