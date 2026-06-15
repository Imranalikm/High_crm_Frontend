/* ── Status colour maps ── */
export const STATUS_MAP = {
  OPEN: {
    label: 'Open',
    cls: 'bg-brand/10 text-brand border-brand/20',
    dot: true,
  },
  PENDING: {
    label: 'Pending',
    cls: 'bg-warning/10 text-warning border-warning/20',
    dot: false,
  },
  RESOLVED: {
    label: 'Resolved',
    cls: 'bg-positive/10 text-positive border-positive/20',
    dot: false,
  },
  CLOSED: {
    label: 'Closed',
    cls: 'bg-muted-surface text-text-muted border-border/30',
    dot: false,
  },
};

export const PRIORITY_MAP = {
  HIGH: { label: 'High',   cls: 'bg-negative/10 text-negative border-negative/20' },
  MED:  { label: 'Medium', cls: 'bg-warning/10 text-warning border-warning/20'   },
  LOW:  { label: 'Low',    cls: 'bg-positive/10 text-positive border-positive/20' },
};

export const CATEGORY_MAP = {
  Finance:       { cls: 'bg-brand/10 text-brand border-brand/20'         },
  KYC:           { cls: 'bg-positive/10 text-positive border-positive/20' },
  Technical:     { cls: 'bg-warning/10 text-warning border-warning/20'   },
  'Copy Trading':{ cls: 'bg-purple/10 text-purple border-purple/20' },
  Account:       { cls: 'bg-muted-surface text-text-muted border-border/30' },
  Other:         { cls: 'bg-muted-surface text-text-muted border-border/30' },
};

export const STATUS_FILTERS  = ['ALL', 'OPEN', 'PENDING', 'RESOLVED'];
export const CATEGORY_FILTERS = ['ALL', 'Finance', 'KYC', 'Technical', 'Copy Trading', 'Account'];
export const PRIORITY_FILTERS = ['ALL', 'HIGH', 'MED', 'LOW'];
