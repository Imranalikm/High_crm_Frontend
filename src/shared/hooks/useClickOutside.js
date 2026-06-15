import { useEffect } from 'react';

/**
 * Calls `handler` whenever a mousedown event fires outside of `ref`.
 * Shared across RowActionsMenu, MoreMenu, FilterDropdown, and any dropdown.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    if (!handler) return;
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}
