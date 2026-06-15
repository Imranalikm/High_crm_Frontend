import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Users, LayoutDashboard, Wallet, LineChart, ShieldCheck } from 'lucide-react';
import { adminNavigation } from '@/config/sidebar/admin-sidebar.config';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  // Flatten navigation for search
  const flatNav = adminNavigation.reduce((acc, item) => {
    if (item.subItems) {
      item.subItems.forEach(sub => acc.push({ ...sub, parentLabel: item.label }));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  // Built-in actions
  const actions = [
    { id: 'action-add-user', label: 'Add New User', icon: Users, type: 'action', parentLabel: 'Quick Actions' },
    ...flatNav.map(item => ({ ...item, type: 'nav' }))
  ];

  const results = query
    ? actions.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) || 
      (item.parentLabel && item.parentLabel.toLowerCase().includes(query.toLowerCase()))
    )
    : actions.slice(0, 8); // default suggestions

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = useCallback((item) => {
    if (item.type === 'nav') {
      navigate(item.path);
    } else if (item.id === 'action-add-user') {
      navigate('/admin/users');
      // Ideally trigger user create modal, but for now navigate to users
    }
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          onClose(false); // Let parent handle opening, actually we just need parent to toggle
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleSelect]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[600px] bg-surface-elevated border border-border/40 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in slide-in-from-top-[5%] zoom-in-[98%]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border/20">
          <Search size={18} className="text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search commands, users, or go to..."
            className="flex-1 bg-transparent outline-none text-[15px] font-heading text-text placeholder:text-text-muted/60"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-bg/50 border border-border/30 text-text-muted text-[10px] font-bold tracking-widest uppercase">
            <span>ESC</span>
          </div>
        </div>

        <div className="px-2 py-3 overflow-y-auto max-h-[350px] custom-scrollbar">
          {results.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {results.map((item, index) => {
                const isSelected = selectedIndex === index;
                const Icon = item.icon || LayoutDashboard;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 text-left outline-none ${isSelected ? 'bg-primary/10 border-primary/20 cursor-pointer' : 'hover:bg-white/5 border-transparent'}`}
                    style={{ border: '1px solid', borderColor: isSelected ? 'var(--primary-color, rgba(var(--primary-rgb), 0.2))' : 'transparent' }}
                  >
                    <div className={`p-1.5 rounded-[8px] ${isSelected ? 'bg-primary/20 text-primary' : 'bg-bg text-text-muted'}`}>
                      <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className={`text-[13px] font-medium font-heading tracking-[-0.01em] ${isSelected ? 'text-primary' : 'text-text'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-primary/60' : 'text-text-muted'}`}>
                        {item.parentLabel || 'Navigation'}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-[10px] text-primary/70 font-bold uppercase tracking-widest px-2 pr-1">
                        Go
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Command size={32} className="text-text-muted/30 mb-3" />
              <p className="text-[13px] font-medium text-text">No results found</p>
              <p className="text-[11px] text-text-muted mt-1">Try a different search term or command</p>
            </div>
          )}
        </div>
        
        <div className="h-9 border-t border-border/20 bg-bg/50 flex items-center px-4 gap-4 text-[11px] text-text-muted font-medium">
          <div className="flex items-center gap-1.5"><span className="p-1 rounded bg-surface/50 leading-none">↑↓</span> Navigate</div>
          <div className="flex items-center gap-1.5"><span className="p-1 rounded bg-surface/50 leading-none">↵</span> Select</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
