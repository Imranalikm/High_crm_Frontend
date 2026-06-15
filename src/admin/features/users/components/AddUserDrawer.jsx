import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  X,
  User,
  ChevronDown,
  ChevronUp,
  Check,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';
import { isUserDraftValid, validateUserDraft } from '@/utils/validators';

/* ══════════════════════════════════════════════════════════
   FORM PRIMITIVES — inline premium components matching Register Form
   ══════════════════════════════════════════════════════════ */

/* ── Icon Field ── */
function PIconField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = 'text',
  required = false,
  error = '',
}) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-text-muted/40 pointer-events-none z-10">
            <Icon size={13} />
          </div>
        )}
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-9 rounded-[8px] border bg-bg/60 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all ${
            Icon ? 'pl-9' : 'px-3'
          } ${error ? 'border-negative/50 focus:border-negative/70 focus:ring-negative/10' : 'border-border/18'}`}
        />
      </div>
      {error && (
        <p className="text-[10px] text-negative/90 font-medium flex items-center gap-1 mt-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── Country Selector Dropdown ── */
const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Canada',
  'Australia',
  'Singapore',
  'United Arab Emirates',
  'Japan',
  'India',
  'Brazil',
  'South Africa',
];

function PCountrySelector({ value, onChange, label, required = false, error = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="space-y-1.5 w-full relative">
      <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-9 rounded-[8px] border bg-bg/60 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all pl-9 pr-8 flex items-center justify-between text-left cursor-pointer ${
            error ? 'border-negative/50' : 'border-border/18'
          }`}
        >
          <div className="absolute left-3 text-text-muted/40 pointer-events-none">
            <Globe size={13} />
          </div>
          <span className={value ? 'text-text' : 'text-text-muted/20'}>
            {value || 'Select country'}
          </span>
          <ChevronDown
            size={11}
            className={`text-text-muted/35 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 max-h-[160px] overflow-y-auto bg-surface-elevated border border-border/18 rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-50 p-1">
            {COUNTRIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-[6px] text-[12px] transition-colors cursor-pointer ${
                  value === c
                    ? 'bg-brand/15 text-brand font-semibold'
                    : 'text-text-muted hover:bg-bg hover:text-text'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-negative/90 font-medium flex items-center gap-1 mt-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── Password strength logic ── */
const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return { label: '', score: 0, color: '', width: '0%' };
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const strengthMap = {
    1: { label: 'Weak', color: '#f87171', width: '25%' },
    2: { label: 'Fair', color: '#fbbf24', width: '50%' },
    3: { label: 'Good', color: '#4ade80', width: '75%' },
    4: { label: 'Strong', color: '#22c55e', width: '100%' },
  };
  const level = Math.min(Math.max(score, 1), 4);
  return { ...strengthMap[level], score };
};

/* ── Password input field with strength indicator and visibility toggle ── */
function PPasswordInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  showStrength = false,
}) {
  const [show, setShow] = useState(false);
  const strength = getPasswordStrength(value || '');

  return (
    <div className="space-y-1.5 w-full">
      <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
        {label}
        {required && <span className="text-brand/70">*</span>}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-text-muted/40 pointer-events-none z-10">
          <Lock size={13} />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-9 rounded-[8px] border bg-bg/60 pl-9 pr-9 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all ${
            error ? 'border-negative/50 focus:border-negative/70 focus:ring-negative/10' : 'border-border/18'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 text-text-muted/40 hover:text-text transition-colors flex items-center justify-center cursor-pointer z-10"
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
      {showStrength && value && (
        <div className="space-y-1 mt-1.5">
          <div className="h-1 rounded-full bg-border/10 overflow-hidden">
            <div
              className="h-full transition-all duration-200"
              style={{ width: strength.width, backgroundColor: strength.color }}
            />
          </div>
          <p className="text-[9px] font-bold text-text-muted/50 text-right uppercase tracking-wider">
            Strength: <span style={{ color: strength.color }}>{strength.label}</span>
          </p>
        </div>
      )}
      {error && (
        <p className="text-[10px] text-negative/90 font-medium flex items-center gap-1 mt-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

/* ── Two-column Form Grid ── */
function PGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION CARD
   ══════════════════════════════════════════════════════════ */
function Section({ step, icon, title, children, collapsible = false }) {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20">
      {/* Section Header Row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b transition-colors select-none rounded-t-[12px] ${
          isOpen ? 'border-border/10' : 'border-transparent rounded-b-[12px]'
        } ${collapsible ? 'cursor-pointer hover:bg-bg/30' : 'cursor-default'}`}
        onClick={() => collapsible && setIsOpen((v) => !v)}
      >
        {/* Step Number Badge */}
        <div className="w-[26px] h-[26px] rounded-[7px] bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-black text-brand leading-none tabular-nums">
            {String(step).padStart(2, '0')}
          </span>
        </div>

        {/* Icon */}
        <IconComponent size={13} className="text-text-muted/50 flex-shrink-0" />

        {/* Title */}
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          {title}
        </span>

        {/* Collapse Chevron */}
        {collapsible && (
          <div className="flex-shrink-0 w-5 h-5 rounded-[5px] flex items-center justify-center text-text-muted/30">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        )}
      </div>

      {/* Section Body */}
      {isOpen && (
        <div className="px-4 py-4 space-y-3.5 rounded-b-[12px]">
          {children}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADD USER DRAWER — Redesigned for Register Page Similarity
   ══════════════════════════════════════════════════════════ */
export function AddUserDrawer({ open, mode, draft, setDraft, onSubmit, onClose }) {
  const [touchedFields, setTouchedFields] = useState({});

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTouchedFields({});
    }
  }

  if (!draft) return null;

  const fieldErrors = validateUserDraft(draft, mode);
  const isValid = isUserDraftValid(draft, mode);
  const isEdit = mode === 'edit';

  const setField = (field) => (value) => {
    setDraft((curr) => ({ ...curr, [field]: value }));
    setTouchedFields((curr) => ({ ...curr, [field]: true }));
  };

  return (
    <MainDrawer open={open} width="max-w-[720px]" onClose={onClose}>
      <div className="flex h-full w-full flex-col overflow-hidden">

        {/* ════════════════════════════════════════
            HEADER
            ════════════════════════════════════════ */}
        <div className="flex-shrink-0 border-b border-border/15">
          {/* Brand accent top bar */}
          <div
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, var(--brand), color-mix(in srgb, var(--brand) 40%, transparent) 65%, transparent)',
            }}
          />

          <div className="px-6 py-5 flex items-start justify-between gap-4">
            {/* Title block */}
            <div className="min-w-0">
              {/* Mode eyebrow */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[9.5px] font-black uppercase tracking-[0.22em] text-brand/65 leading-none">
                  User · {isEdit ? 'Edit' : 'Create'}
                </span>
              </div>

              <h2 className="text-[22px] font-bold tracking-[-0.025em] text-text leading-none">
                {isEdit ? 'Edit User' : 'Create User'}
              </h2>
              <p className="text-[12px] text-text-muted/50 mt-2 leading-relaxed max-w-[460px]">
                {isEdit
                  ? 'Update user info and settings.'
                  : 'Add a new user with balance and account options.'}
              </p>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            BODY — scrollable
            ════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">

          {/* ── Section 1: User Profile Details (Same as Register Form) ── */}
          <Section step={1} icon={User} title="User Profile Details">
            <PIconField
              label="Full Name"
              value={draft.name}
              onChange={setField('name')}
              placeholder="Jane Doe"
              icon={User}
              required
              error={touchedFields.name ? fieldErrors.name : ''}
            />
            <PIconField
              label="Email"
              value={draft.email}
              onChange={setField('email')}
              placeholder="jane@example.com"
              type="email"
              icon={Mail}
              required
              error={touchedFields.email ? fieldErrors.email : ''}
            />

            <PGrid>
              <PIconField
                label="Phone (optional)"
                value={draft.phone}
                onChange={setField('phone')}
                placeholder="+1 555 120 4567"
                icon={Phone}
                error={touchedFields.phone ? fieldErrors.phone : ''}
              />
              <PCountrySelector
                label="Country (optional)"
                value={draft.country}
                onChange={setField('country')}
                error={touchedFields.country ? fieldErrors.country : ''}
              />
            </PGrid>

            {!isEdit && (
              <PGrid>
                <PPasswordInput
                  label="Password"
                  value={draft.password}
                  onChange={setField('password')}
                  placeholder="••••••••"
                  required
                  error={touchedFields.password ? fieldErrors.password : ''}
                  showStrength
                />
                <PPasswordInput
                  label="Confirm"
                  value={draft.confirmPassword}
                  onChange={setField('confirmPassword')}
                  placeholder="••••••••"
                  required
                  error={touchedFields.confirmPassword ? fieldErrors.confirmPassword : ''}
                />
              </PGrid>
            )}
          </Section>

          {/* Bottom padding so last section isn't flush against footer */}
          <div className="h-2" />
        </div>

        {/* ════════════════════════════════════════
            FOOTER — sticky at bottom
            ════════════════════════════════════════ */}
        <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated">
          {/* Validation warning banner */}
          {!isValid && (
            <div className="flex items-center gap-2.5 mx-6 mt-4 rounded-[9px] border border-warning/22 bg-warning/6 px-3.5 py-2.5">
              <AlertTriangle size={13} className="text-warning flex-shrink-0" />
              <span className="text-[11.5px] font-medium text-warning leading-tight">
                {isEdit ? 'Name and email are required.' : 'Name, email, and matching passwords (min 8 chars) are required.'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-6 py-4">
            {/* Required fields hint */}
            <p className="text-[10px] text-text-muted/35 font-medium">
              <span className="text-brand/60 font-black">*</span> Required fields
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/20 bg-bg/40 text-text-muted hover:text-text hover:border-border/32 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!isValid}
                className="flex items-center gap-1.5 h-9 px-5 rounded-[9px] text-[11.5px] font-black uppercase tracking-wider bg-brand text-bg hover:brightness-110 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isEdit ? (
                  <>
                    <Check size={12} /> Save Changes
                  </>
                ) : (
                  <>
                    <User size={12} /> Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </MainDrawer>
  );
}

export default AddUserDrawer;