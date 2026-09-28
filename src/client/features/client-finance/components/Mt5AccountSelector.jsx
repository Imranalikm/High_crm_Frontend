import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Monitor, Check, AlertTriangle } from 'lucide-react';

export function Mt5AccountSelector({ accounts = [], selectedId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedAcc = accounts.find(a => String(a.accountid) === String(selectedId));

  if (accounts.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-8 text-center rounded-[12px] mb-5"
        style={{ background: 'var(--muted-surface)', border: '1px dashed var(--border)' }}
      >
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--warning) 10%, transparent)' }}
        >
          <AlertTriangle size={22} style={{ color: 'var(--warning)' }} strokeWidth={1.6} />
        </div>
        <div>
          <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
            No Account Found
          </p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
            You don't have any MT5 accounts available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-5 w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-[12px] transition-all duration-300 outline-none text-left"
        style={{
          background: 'var(--muted-surface)',
          border: `1.5px solid ${isOpen ? 'var(--brand)' : 'var(--border)'}`,
          boxShadow: isOpen ? '0 0 0 4px color-mix(in srgb, var(--brand) 15%, transparent)' : 'none',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div 
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-colors" 
            style={{ 
              background: 'color-mix(in srgb, var(--brand) 12%, transparent)', 
              color: 'var(--brand)' 
            }}
          >
            <Monitor size={18} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
              Selected Account
            </p>
            {selectedAcc ? (
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
                  {selectedAcc.accountid}
                </p>
                <span className="w-1 h-1 rounded-full" style={{ background: 'color-mix(in srgb, var(--text-muted) 30%, transparent)' }} />
                <p className="text-[13px] font-mono font-medium" style={{ color: 'var(--positive)' }}>
                  ${parseFloat(selectedAcc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            ) : (
              <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Select an account...</p>
            )}
          </div>
        </div>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isOpen ? 'color-mix(in srgb, var(--brand) 10%, transparent)' : 'transparent',
            color: isOpen ? 'var(--brand)' : 'var(--text-muted)'
          }}
        >
          <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[calc(100%+8px)] left-0 right-0 p-2 rounded-[14px] z-50 flex flex-col gap-1 transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ 
          background: 'var(--surface-elevated)', 
          border: '1px solid var(--border)', 
          boxShadow: '0 12px 40px -8px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {accounts.map(acc => {
          const isSelected = String(acc.accountid) === String(selectedId);
          return (
            <button
              type="button"
              key={acc.accountid}
              onClick={() => {
                onSelect(acc.accountid);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-[10px] transition-all duration-200 cursor-pointer outline-none text-left hover:bg-white/5"
              style={{
                background: isSelected ? 'color-mix(in srgb, var(--brand) 8%, transparent)' : 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                 <div 
                   className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0 transition-colors duration-200" 
                   style={{ 
                     background: isSelected ? 'color-mix(in srgb, var(--brand) 15%, transparent)' : 'color-mix(in srgb, var(--text-muted) 5%, transparent)', 
                     color: isSelected ? 'var(--brand)' : 'var(--text-muted)' 
                   }}
                 >
                    <Monitor size={16} strokeWidth={1.8} />
                 </div>
                <div>
                  <p className="text-[13px] font-semibold transition-colors duration-200" style={{ color: isSelected ? 'var(--brand)' : 'var(--text)' }}>
                    {acc.accountid}
                  </p>
                  <p className="text-[12px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Balance: <span style={{ color: 'var(--text)' }}>${parseFloat(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </p>
                </div>
              </div>
              
              <div
                className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200"
                style={{ borderColor: isSelected ? 'var(--brand)' : 'rgba(194,198,214,0.2)' }}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--brand)' }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
