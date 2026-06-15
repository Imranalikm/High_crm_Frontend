import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function MainDrawer({
  open,
  children,
  onClose,
  width = 'max-w-[720px]',
}) {
  const [active, setActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(open);
  const [cachedChildren, setCachedChildren] = useState(children);

  if (open && !shouldRender) {
    setShouldRender(true);
  }
  if (open && children !== cachedChildren) {
    setCachedChildren(children);
  }

  useEffect(() => {
    let unmountTimer;
    let rAF;

    if (open) {
      rAF = requestAnimationFrame(() => {
        rAF = requestAnimationFrame(() => {
          setActive(true);
        });
      });
    } else {
      setTimeout(() => setActive(false), 0);
      unmountTimer = setTimeout(() => setShouldRender(false), 400);
    }

    return () => {
      clearTimeout(unmountTimer);
      cancelAnimationFrame(rAF);
    };
  }, [open]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Backdrop with Fade */}
      <div 
        className={`absolute inset-0 bg-[#020617]/65 backdrop-blur-md transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* Drawer Surface with Velocity Slide */}
      <aside 
        className={`fixed right-0 top-0 bottom-0 flex h-full w-full ${width} flex-col overflow-hidden border-l border-border/40 bg-surface-elevated shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ 
          transform: active ? 'translateX(0)' : 'translateX(100%)',
          backgroundColor: 'var(--surface-2)' 
        }}
      >
        {/* Left accent reflective bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[0.5px] bg-white/[0.08] backdrop-blur-sm z-[10]" />
        
        {/* Children (DrawerHeader, DrawerBody, DrawerFooter) */}
        {cachedChildren}
      </aside>
    </div>,
    document.body,
  );
}
