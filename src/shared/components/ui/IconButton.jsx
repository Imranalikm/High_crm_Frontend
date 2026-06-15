import React from 'react';

/**
 * ActionBtn — canonical action button for all feature pages and drawers.
 *
 * Variants: danger | success | warning | cyan | brand | orange | default
 * Sizes:    normal (h-8) | small (h-7, pass small={true})
 */
const VARIANTS = {
  danger:  {
    border: '1px solid color-mix(in srgb, var(--negative) 22%, transparent)',
    bg:     'color-mix(in srgb, var(--negative) 7%, transparent)',
    color:  'var(--negative)',
  },
  success: {
    border: '1px solid color-mix(in srgb, var(--positive) 22%, transparent)',
    bg:     'color-mix(in srgb, var(--positive) 7%, transparent)',
    color:  'var(--positive)',
  },
  warning: {
    border: '1px solid color-mix(in srgb, var(--warning) 22%, transparent)',
    bg:     'color-mix(in srgb, var(--warning) 7%, transparent)',
    color:  'var(--warning)',
  },
  cyan: {
    border: '1px solid color-mix(in srgb, var(--cyan) 22%, transparent)',
    bg:     'color-mix(in srgb, var(--cyan) 7%, transparent)',
    color:  'var(--cyan)',
  },
  brand: {
    border: '1px solid color-mix(in srgb, var(--brand) 25%, transparent)',
    bg:     'color-mix(in srgb, var(--brand) 9%, transparent)',
    color:  'var(--brand)',
  },
  primary: {
    border: '1px solid color-mix(in srgb, var(--brand) 25%, transparent)',
    bg:     'color-mix(in srgb, var(--brand) 9%, transparent)',
    color:  'var(--brand)',
  },
  orange: {
    border: '1px solid color-mix(in srgb, #f97316 25%, transparent)',
    bg:     'color-mix(in srgb, #f97316 9%, transparent)',
    color:  '#f97316',
  },
  default: {
    border: '1px solid var(--border)',
    bg:     'transparent',
    color:  'var(--text-muted)',
  },
};

export function IconButton({ Icon: Ic, label, variant = 'default', onClick, small = false, disabled = false }) {
  const s = VARIANTS[variant] ?? VARIANTS.default;
  const h = small ? 'h-7 px-2.5 text-[10.5px]' : 'h-8 px-3 text-[11px]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 ${h} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed`}
      style={{ border: s.border, background: s.bg, color: s.color }}
    >
      {Ic && <Ic size={small ? 11 : 12} />}
      {label}
    </button>
  );
}

export { IconButton as ActionBtn };
