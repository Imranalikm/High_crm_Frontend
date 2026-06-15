import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * SettingsTabs — Segmented underline tab bar for settings sub-sections.
 *
 * Uses CSS variables from the design system so it automatically adapts
 * to both light and dark themes.
 *
 * Tab shape: { id, label, Icon?, badge?, badgeColor? }
 */

/* ─── Individual Tab Button ─────────────────────────────────────── */
function Tab({ t, isActive, index, tabRef, setActive, onKeyDown }) {
  const [hovered, setHovered] = useState(false);
  const Icon = t.Icon;
  const badgeColor = t.badgeColor || 'var(--warning)';

  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${t.id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActive(t.id)}
      onKeyDown={(e) => onKeyDown(e, index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-[7px] px-3.5 py-[10px] whitespace-nowrap flex-shrink-0 outline-none cursor-pointer border-none"
      style={{ background: 'transparent' }}
    >
      {/* Hover / active background pill */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0.5 rounded-[8px] pointer-events-none transition-all duration-200"
        style={{
          top: 4,
          bottom: 4,
          background: isActive
            ? 'color-mix(in srgb, var(--brand) 8%, transparent)'
            : hovered
              ? 'color-mix(in srgb, var(--text-muted) 6%, transparent)'
              : 'transparent',
        }}
      />

      {/* Icon */}
      {Icon && (
        <Icon
          size={13}
          aria-hidden="true"
          className="flex-shrink-0 relative z-[1] transition-all duration-200"
          style={{
            color: isActive ? 'var(--brand)' : 'color-mix(in srgb, var(--text-muted) 45%, transparent)',
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      )}

      {/* Label */}
      <span
        className="relative z-[1] text-[13px] font-semibold font-heading tracking-[-0.01em] leading-none transition-colors duration-200"
        style={{
          color: isActive
            ? 'var(--text)'
            : hovered
              ? 'color-mix(in srgb, var(--text-muted) 80%, transparent)'
              : 'color-mix(in srgb, var(--text-muted) 50%, transparent)',
        }}
      >
        {t.label}
      </span>

      {/* Badge */}
      {t.badge !== undefined && t.badge !== null && t.badge !== '' && (
        <span
          className="relative z-[1] flex items-center justify-center leading-none flex-shrink-0 font-black font-heading transition-all duration-200"
          style={{
            minWidth: 15,
            height: 15,
            padding: '0 3.5px',
            borderRadius: 999,
            fontSize: 8,
            background: `color-mix(in srgb, ${badgeColor} 13%, transparent)`,
            color: badgeColor,
            border: `1px solid color-mix(in srgb, ${badgeColor} 26%, transparent)`,
            opacity: isActive ? 1 : 0.6,
          }}
        >
          {t.badge}
        </span>
      )}

      {/* Active underline */}
      <span
        aria-hidden="true"
        className="absolute left-3 right-3 rounded-full pointer-events-none transition-all duration-250"
        style={{
          bottom: 0,
          height: 1.5,
          background: 'var(--brand)',
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scaleX(1)' : 'scaleX(0.3)',
        }}
      />

      {/* Hover underline hint */}
      {!isActive && (
        <span
          aria-hidden="true"
          className="absolute left-3 right-3 rounded-full pointer-events-none transition-all duration-200"
          style={{
            bottom: 0,
            height: 1.5,
            background: 'color-mix(in srgb, var(--brand) 25%, transparent)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0.3)',
          }}
        />
      )}
    </button>
  );
}

/* ─── SettingsTabs ──────────────────────────────────────────────── */
export function SettingsTabs({ tabs, active, setActive }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);
  const [fades, setFades] = useState({ left: false, right: false });

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setFades({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateFades);
      ro.disconnect();
    };
  }, [updateFades]);

  // Scroll active tab into view on change
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }, [active]);

  const handleKeyDown = useCallback((e, index) => {
    if (e.key === 'ArrowRight' && tabs[index + 1]) {
      setActive(tabs[index + 1].id);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && tabs[index - 1]) {
      setActive(tabs[index - 1].id);
      e.preventDefault();
    }
  }, [tabs, setActive]);

  return (
    <div className="relative mb-6">
      {/* Left scroll fade */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: fades.left ? 1 : 0,
          background: 'linear-gradient(to right, var(--bg) 0%, transparent 100%)',
        }}
      />
      {/* Right scroll fade */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: fades.right ? 1 : 0,
          background: 'linear-gradient(to left, var(--bg) 0%, transparent 100%)',
        }}
      />

      {/* Tab strip */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-0.5 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {tabs.map((t, index) => (
          <Tab
            key={t.id}
            t={t}
            isActive={active === t.id}
            index={index}
            tabRef={active === t.id ? activeRef : null}
            setActive={setActive}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </div>
  );
}

export default SettingsTabs;