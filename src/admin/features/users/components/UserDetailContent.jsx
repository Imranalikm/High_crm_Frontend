import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Cpu,
  Landmark,
  Clock,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  Lock,
  Sliders,
  History,
  ShieldCheck
} from 'lucide-react';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { StatusBadge, SecureImage } from '@/components/ui';
import { DrawerField, DrawerFormGrid, DrawerSection, SelectField } from '@/components/common/drawer';
import { usersService } from '../services/userService';
import { kycService } from '../services/kycService';
import { PaymentMethodsTab } from './PaymentMethodsTab';

/* ─────────────────────────────────────────────────────────────
   INTERNAL DESIGN PRIMITIVES
───────────────────────────────────────────────────────────── */

/** Sleek section header with left-rule accent + dot marker */
const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <span className="block w-[3px] h-3.5 rounded-full bg-brand shrink-0" />
      <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 select-none">
        {title}
      </h3>
    </div>
    {action && <div>{action}</div>}
  </div>
);

/** Flat metric tile — large value, muted label below */
const MetricTile = ({ label, value, sub, color = 'text-text', icon: Icon, accentClass = '' }) => (
  <div className={`relative flex flex-col justify-between p-4 rounded-[8px] border border-border/15 bg-bg/20 overflow-hidden group transition-all duration-200 hover:bg-bg/40 ${accentClass}`}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 select-none">{label}</span>
      {Icon && (
        <span className="p-1.5 rounded-[5px] bg-bg/60 border border-border/10">
          <Icon size={11} className="text-text-muted/40" />
        </span>
      )}
    </div>
    <div>
      <p className={`text-[22px] font-semibold tracking-[-0.02em] font-mono leading-none ${color}`}>{value}</p>
      {sub && <p className="text-[12px] text-text-muted/80 mt-1 leading-none">{sub}</p>}
    </div>
    {/* Subtle bottom accent line */}
    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />
  </div>
);

/** Horizontal data row — label left, value right */
const DataRow = ({ label, value, mono = false, valueClass = '' }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/8 last:border-0 gap-4">
    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 shrink-0">{label}</span>
    <span className={`text-[11.5px] font-bold text-text text-right truncate ${mono ? 'font-mono' : ''} ${valueClass}`}>{value}</span>
  </div>
);

/** Status chip */
const Chip = ({ label, variant = 'neutral' }) => {
  const map = {
    neutral: 'border-border/25 text-text-muted bg-bg/30',
    positive: 'border-positive/25 text-positive bg-positive/5',
    negative: 'border-negative/25 text-negative bg-negative/5',
    warning: 'border-warning/25 text-warning bg-warning/5',
    brand: 'border-brand/25 text-brand bg-brand/5',
  };
  return (
    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] border font-mono ${map[variant]}`}>
      {label}
    </span>
  );
};

/** Pill button */
const PillBtn = ({ onClick, children, variant = 'ghost', disabled = false, className = '' }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 px-3.5 h-8 rounded-[6px] text-[11px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] border';
  const variants = {
    ghost: 'border-border/20 bg-bg/25 text-text-muted hover:text-text hover:border-border/40 hover:bg-bg/50',
    danger: 'border-negative/20 bg-negative/5 text-negative hover:bg-negative/12 hover:border-negative/35',
    brand: 'border-brand/25 bg-brand text-text-on-accent hover:bg-brand-hover shadow-sm shadow-brand/10',
    warning: 'border-warning/20 bg-warning/5 text-warning hover:bg-warning/12 hover:border-warning/35',
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

/** Glassy panel wrapper */
const Panel = ({ children, className = '' }) => (
  <div className={`rounded-[10px] border border-border/15 bg-bg/30 overflow-hidden ${className}`}>
    {children}
  </div>
);

/** Panel header strip */
const PanelHead = ({ title, subtitle, right }) => (
  <div className="px-4 py-3 border-b border-border/10 bg-bg/20 flex items-center justify-between gap-3 flex-wrap">
    <div>
      <h4 className="text-[13px] font-semibold text-text tracking-tight">{title}</h4>
      {subtitle && <p className="text-[12px] text-text-muted/80 mt-1">{subtitle}</p>}
    </div>
    {right && <div>{right}</div>}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export function UserDetailContent({ user, activeTab, onUpdateUser, onCreateMt5Account, onOpenMt5Account }) {
  const [selectedDoc, setSelectedDoc] = useState('passport');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [contrastInverted, setContrastInverted] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const location = useLocation();
  const kycId = new URLSearchParams(location.search).get('kycId');

  const [kycRecord, setKycRecord] = useState(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycError, setKycError] = useState(null);
  const [kycActionLoading, setKycActionLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'kyc') {
      let active = true;
      const fetchKyc = async () => {
        setKycLoading(true);
        setKycError(null);
        try {
          let record = null;
          if (kycId) {
            record = await kycService.getById(kycId);
          } else {
            const queue = await kycService.list('all');
            const found = queue.find(q => q.userId === user.id);
            if (found && found.id !== 'N/A') {
              record = await kycService.getById(found.id);
            }
          }
          if (active) {
            setKycRecord(record);
          }
        } catch (err) {
          if (active) {
            setKycError(err.message || 'Failed to load KYC details from server');
          }
        } finally {
          if (active) {
            setKycLoading(false);
          }
        }
      };
      fetchKyc();
      return () => {
        active = false;
      };
    }
  }, [activeTab, kycId, user.id]);

  const getImageUrl = (path) => {
    if (!path) return null;
    let stringPath = typeof path === 'object' ? (path.url || path.path || path.location || path.filePath || '') : path;
    if (!stringPath) return null;
    if (stringPath.startsWith('http://') || stringPath.startsWith('https://') || stringPath.startsWith('blob:') || stringPath.startsWith('/mock_')) {
      return stringPath;
    }
    let baseUrl = import.meta.env.VITE_API_URL || 'https://account.smatams.com/api';
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    baseUrl = baseUrl.replace(/\/api$/, '');
    return `${baseUrl}${stringPath.startsWith('/') ? '' : '/'}${stringPath}`;
  };

  const raw = kycRecord?.raw || {};
  const idDocType = raw.idDocType || raw.identityDocument?.type || 'passport';
  const hasBackImage = idDocType !== 'passport';

  const docTabs = [];
  const frontFile = raw.idFrontImage || raw.identityDocument?.front;
  if (frontFile) {
    docTabs.push({ id: 'front', label: 'ID Front', file: frontFile });
  }
  const backFile = raw.idBackImage || raw.identityDocument?.back;
  if (hasBackImage && backFile) {
    docTabs.push({ id: 'back', label: 'ID Back', file: backFile });
  }
  const selfieFile = raw.selfieImage || raw.selfie;
  if (selfieFile) {
    docTabs.push({ id: 'selfie', label: 'Selfie', file: selfieFile });
  }
  const addressFile = raw.addressDocImage || raw.addressProof?.file;
  if (addressFile) {
    docTabs.push({ id: 'address', label: 'Address Proof', file: addressFile });
  }

  if (docTabs.length === 0) {
    docTabs.push({ id: 'passport', label: 'Passport ID', file: '/mock_passport.png' });
    docTabs.push({ id: 'address', label: 'Proof of Address', file: '/mock_utility_bill.png' });
  }

  useEffect(() => {
    if (activeTab === 'kyc' && docTabs.length > 0) {
      const isValid = docTabs.some(t => t.id === selectedDoc);
      if (!isValid) {
        setSelectedDoc(docTabs[0].id);
      }
    }
  }, [docTabs, selectedDoc, activeTab]);

  const [pendingAdjustments, setPendingAdjustments] = useState([]);
  const [makerAmount, setMakerAmount] = useState('');
  const [makerAsset, setMakerAsset] = useState('USD');
  const [makerType, setMakerType] = useState('CREDIT');
  const [makerReason, setMakerReason] = useState('');
  const [adjustmentSuccessMsg, setAdjustmentSuccessMsg] = useState('');

  const handleCreateAdjustment = (e) => {
    e.preventDefault();
    if (!makerAmount || parseFloat(makerAmount) <= 0) return;
    const newAdjustment = {
      id: `ADJ-${Date.now()}`,
      amount: makerAmount,
      asset: makerAsset,
      type: makerType,
      reason: makerReason || 'Manual balance correction',
      maker: 'Financial Admin',
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setPendingAdjustments(prev => [...prev, newAdjustment]);
    setMakerAmount('');
    setMakerReason('');
    setAdjustmentSuccessMsg('Maker adjustment queued. Awaiting Checker review.');
    setTimeout(() => setAdjustmentSuccessMsg(''), 4000);
  };

  const handleApproveAdjustment = (adjId) => {
    const adj = pendingAdjustments.find(a => a.id === adjId);
    if (!adj) return;
    const amountNum = parseFloat(adj.amount) || 0;
    const updatedUser = usersService.adjustUserBalance(user.id, adj.asset, amountNum, adj.type);
    if (updatedUser) {
      usersService.logAdminAction('Financial Auditor', user.name, `Approved manual wire: ${adj.type} $${amountNum} (${adj.asset}) - Reason: ${adj.reason}`);
      onUpdateUser?.({ walletBalance: updatedUser.walletBalance, equity: updatedUser.equity, walletHistory: updatedUser.walletHistory });
      setPendingAdjustments(prev => prev.filter(p => p.id !== adjId));
      setAdjustmentSuccessMsg('Adjustment successfully checker-approved.');
      setTimeout(() => setAdjustmentSuccessMsg(''), 4000);
    }
  };

  const handleDeclineAdjustment = (adjId) => {
    const adj = pendingAdjustments.find(a => a.id === adjId);
    if (adj) usersService.logAdminAction('Financial Auditor', user.name, `Declined manual wire: ${adj.type} $${adj.amount} (${adj.asset}) - Reason: ${adj.reason}`);
    setPendingAdjustments(prev => prev.filter(p => p.id !== adjId));
  };

  const handleToggleLock = (lockKey) => {
    const currentLocks = {
      withdrawalsBlocked: user.withdrawalsBlocked ?? false,
      readOnlyTerminals: user.readOnlyTerminals ?? false,
      apiBlocked: user.apiBlocked ?? false,
    };
    currentLocks[lockKey] = !currentLocks[lockKey];
    const updated = usersService.updateUserSecurityRestrictions(user.id, currentLocks);
    if (updated) {
      const actionVerb = currentLocks[lockKey] ? 'Enabled' : 'Disabled';
      const lockLabel = lockKey === 'withdrawalsBlocked' ? 'Payout Lock' : lockKey === 'readOnlyTerminals' ? 'Read-Only Terminals' : 'API Connection Block';
      usersService.logAdminAction('Compliance Officer', user.name, `${actionVerb} Restriction: ${lockLabel}`);
      onUpdateUser?.({ withdrawalsBlocked: updated.withdrawalsBlocked, readOnlyTerminals: updated.readOnlyTerminals, apiBlocked: updated.apiBlocked });
    }
  };

  const handleForceClose = (ticketId, symbol) => {
    const result = usersService.forceCloseUserPosition(user.id, ticketId);
    if (result) {
      usersService.logAdminAction('Risk Desk', user.name, `Force Closed Position ${symbol} #${ticketId}`);
      onUpdateUser?.({ livePositions: result.user.livePositions, tradingHistory: result.user.tradingHistory, walletBalance: result.user.walletBalance, equity: result.user.equity });
    }
  };

  const handleForceHedge = (ticketId, symbol) => {
    const result = usersService.forceHedgeUserPosition(user.id, ticketId);
    if (result) {
      usersService.logAdminAction('Risk Desk', user.name, `Hedged Position ${symbol} #${ticketId} with counter-trade #${result.hedgePosition.ticket}`);
      onUpdateUser?.({ livePositions: result.user.livePositions });
    }
  };

  const handleRebateRateChange = (nextRate) => {
    const updated = usersService.updateUserRebateRate(user.id, nextRate);
    if (updated) {
      usersService.logAdminAction('Marketing Admin', user.name, `Updated affiliate rebate commission rate to ${nextRate}%`);
      onUpdateUser?.({ rebateRate: nextRate });
    }
  };

  /* ── 1. OVERVIEW ── */
  if (activeTab === 'overview') {
    const isPnLNegative = String(user.pnl30d).startsWith('-');

    const handleTierChange = (nextTier) => onUpdateUser?.({ tier: nextTier });
    const handleSegmentChange = (nextSegment) => onUpdateUser?.({ segment: nextSegment });

    return (
      <div className="space-y-6 animate-fade-up">

        {/* Suspension banner */}
        {user.suspended && (
          <div className="flex items-start gap-3 rounded-[8px] border-l-2 border-l-negative border border-negative/15 bg-negative/[0.03] px-4 py-3">
            <AlertCircle size={13} className="text-negative mt-0.5 shrink-0" />
            <div>
              <h4 className="text-[12px] font-semibold text-negative">Administrative Suspension Active</h4>
              <p className="text-[12px] text-negative/85 mt-1 leading-relaxed">
                Trading capabilities, API access, and wallet withdrawals are locked until review completion.
              </p>
            </div>
          </div>
        )}

        {/* ── Financial Overview ── */}
        <div>
          <SectionHeader title="Finances" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricTile
              label="Balance"
              value={user.walletBalance}
              sub="Total funds in the user's wallet."
              icon={Landmark}
            />
            <MetricTile
              label="Equity"
              value={user.equity}
              sub="Real-time account value including open trades."
              color="text-positive"
              icon={TrendingUp}
            />
            <MetricTile
              label="30d Profit/Loss"
              value={user.pnl30d || '$0'}
              sub="Profit or loss in the last 30 days."
              color={isPnLNegative ? 'text-negative' : 'text-positive'}
              icon={isPnLNegative ? TrendingDown : TrendingUp}
            />
          </div>
        </div>

        {/* ── Classification ── */}
        <div>
          <SectionHeader title="Account Summary" />
          <Panel>
            <div className="divide-y divide-border/8">
              {[
                ['Verification Status', user.kycStatus],
                ['Risk Status', user.riskStatus],
                ['Segment', user.segment],
                ['Tier', user.tier],
                ['MT5 Accounts', `${user.mt5Accounts} accounts`],
                ['Active Trades', `${user.openPositions} active trades`],
              ].map(([label, val], i) => (
                <div key={i} className="px-4">
                  <DataRow label={label} value={val} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── Trader Group & Pricing ── */}
        <div>
          <SectionHeader title="Group & Tier Settings" />
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SelectField
                label="Pricing Tier"
                value={user.tier || 'Standard'}
                onChange={handleTierChange}
                options={['Standard', 'Prime', 'VIP', 'Institutional', 'Partner']}
              />
              <SelectField
                label="Trader Segment"
                value={user.segment || 'Retail FX'}
                onChange={handleSegmentChange}
                options={['Retail FX', 'Institutional Copy', 'Prop Trader', 'IB Partner', 'MAM Manager']}
              />
            </div>

            {/* Dynamic rule strip */}
            <div className="grid grid-cols-3 divide-x divide-border/10 border border-border/12 rounded-[8px] overflow-hidden bg-bg/15">
              {[
                {
                  label: 'Max Leverage',
                  value: user.tier === 'VIP' ? '1:500' : user.tier === 'Institutional' ? '1:1000' : user.tier === 'Prime' ? '1:200' : '1:100',
                  cls: 'text-text',
                },
                {
                  label: 'Fee Discount',
                  value: user.tier === 'VIP' ? '50% VIP rate' : user.tier === 'Institutional' ? '75% Custom rate' : user.tier === 'Prime' ? '25% discount' : 'Standard commission',
                  cls: 'text-positive',
                },
                {
                  label: 'Server Routing',
                  value: user.tier === 'Institutional' ? 'Direct LP Bridge (LD4)' : 'Retail Cluster NY4',
                  cls: 'text-brand',
                },
              ].map(({ label, value, cls }, i) => (
                <div key={i} className="px-4 py-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">{label}</span>
                  <span className={`font-mono font-semibold text-[13px] ${cls}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Compliance Notes ── */}
        {user.notesSummary && (
          <div>
            <SectionHeader title="Notes" />
            <Panel>
              <div className="px-4 py-3 flex items-start gap-3">
                <FileText size={12} className="text-brand shrink-0 mt-0.5" />
                <p className="text-[11.5px] leading-relaxed text-text-muted/75">{user.notesSummary}</p>
              </div>
            </Panel>
          </div>
        )}
      </div>
    );
  }

  /* ── 2. KYC ── */
  if (activeTab === 'kyc') {
    if (kycLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2 animate-fade-in">
          <span className="relative flex h-5 w-5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-brand/80" />
          </span>
          <span className="text-[11px] font-bold text-text-muted mt-2 uppercase tracking-widest animate-pulse">Loading compliance data...</span>
        </div>
      );
    }

    if (kycError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 animate-fade-in">
          <ShieldAlert size={28} className="text-negative shrink-0" />
          <h4 className="text-[14px] font-bold text-text">Compliance Data Error</h4>
          <p className="text-[12px] text-text-muted/65 max-w-md">{kycError}</p>
        </div>
      );
    }

    if (!kycRecord) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 animate-fade-in">
          <Clock size={32} className="text-text-muted/30" />
          <h4 className="text-[14px] font-bold text-text">No Submissions Found</h4>
          <p className="text-[12.5px] text-text-muted/60 max-w-xs leading-relaxed">
            This user has not submitted any KYC verification documents yet.
          </p>
        </div>
      );
    }

    const isVerified = kycRecord.status === 'VERIFIED';
    const isRejected = kycRecord.status === 'REJECTED';
    const isDraft = kycRecord.status === 'DRAFT';

    const handleApprove = () => {
      setShowApproveModal(true);
    };

    const confirmApprove = async () => {
      setShowApproveModal(false);
      setKycActionLoading(true);
      try {
        await kycService.approve(kycRecord.id);
        if (onUpdateUser) {
          onUpdateUser({
            kycStatus: 'VERIFIED',
            kyc: { 
              ...user.kyc, 
              status: 'VERIFIED', 
              reviewer: 'Compliance Officer', 
              submittedAt: kycRecord.raw?.updatedAt || kycRecord.raw?.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16) 
            }
          });
        }
        const updated = await kycService.getById(kycRecord.id);
        setKycRecord(updated);
      } catch (err) {
        alert(err.message || 'Failed to approve KYC submission');
      } finally {
        setKycActionLoading(false);
      }
    };

    const handleReject = async () => {
      if (!rejectionReason.trim()) { 
        setShowRejectionForm(true); 
        return; 
      }
      setKycActionLoading(true);
      try {
        await kycService.reject(kycRecord.id, rejectionReason.trim());
        if (onUpdateUser) {
          onUpdateUser({
            kycStatus: 'REJECTED',
            kyc: { 
              ...user.kyc, 
              status: 'REJECTED', 
              reviewer: 'Compliance Officer', 
              submittedAt: kycRecord.raw?.updatedAt || kycRecord.raw?.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16), 
              rejectionReason: rejectionReason 
            }
          });
        }
        setShowRejectionForm(false);
        setRejectionReason('');
        const updated = await kycService.getById(kycRecord.id);
        setKycRecord(updated);
      } catch (err) {
        alert(err.message || 'Failed to reject KYC submission');
      } finally {
        setKycActionLoading(false);
      }
    };

    const currentTab = docTabs.find(t => t.id === selectedDoc) || docTabs[0];
    const docSrc = currentTab ? getImageUrl(currentTab.file) : '';

    const statusConfig = isVerified
      ? { border: 'border-l-positive border-positive/12 bg-positive/[0.03]', icon: <CheckCircle size={13} className="text-positive" />, titleCls: 'text-positive', text: 'Verification Complete: The identity document and address bill have been reviewed and approved.' }
      : isRejected
      ? { border: 'border-l-negative border-negative/12 bg-negative/[0.03]', icon: <ShieldAlert size={13} className="text-negative" />, titleCls: 'text-negative', text: `Verification Rejected: This account did not pass review. Reason: ${kycRecord.raw?.rejectionReason || user.kyc?.rejectionReason || 'Operator rejection'}` }
      : isDraft
      ? { border: 'border-l-text-muted border-text-muted/12 bg-text-muted/[0.03]', icon: <Clock size={13} className="text-text-muted" />, titleCls: 'text-text-muted', text: 'Draft Submission: The user has created an account but has not yet finalized and submitted their documents.' }
      : { border: 'border-l-warning border-warning/12 bg-warning/[0.03]', icon: <Clock size={13} className="text-warning" />, titleCls: 'text-warning', text: 'Pending Review: The submitted documents are waiting for administrator approval.' };

    return (
      <div className="space-y-5 animate-fade-up">

        {/* Status banner */}
        <div className={`flex items-start gap-3 rounded-[8px] border-l-2 border px-4 py-3 ${statusConfig.border}`}>
          <div className="shrink-0 mt-0.5">{statusConfig.icon}</div>
          <div>
            <h4 className={`text-[12.5px] font-semibold ${statusConfig.titleCls}`}>Verification Status: {kycRecord.status}</h4>
            <p className="text-[12.5px] text-text-muted/80 mt-1 leading-relaxed">{statusConfig.text}</p>
          </div>
        </div>

        {/* KYC workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* LEFT: Document viewer */}
          <div className="lg:col-span-7">
            <Panel>
              <PanelHead
                title="Documents"
                right={
                  <div className="flex items-center gap-2">
                    {/* Doc tabs */}
                    <div className="flex bg-bg/40 rounded-[5px] border border-border/15 overflow-hidden">
                      {docTabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => { setSelectedDoc(tab.id); setRotation(0); setZoom(1); }}
                          className={`px-3 h-7 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer
                            ${selectedDoc === tab.id ? 'bg-brand text-text-on-accent' : 'text-text-muted hover:text-text'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    {/* Controls */}
                    <div className="flex items-center gap-1 border border-border/15 rounded-[5px] overflow-hidden bg-bg/40">
                      {[
                        { title: 'Rotate 90°', label: '↻', action: () => setRotation(r => (r + 90) % 360) },
                        { title: 'Zoom In', label: '+', action: () => setZoom(z => Math.min(z + 0.25, 2.5)) },
                        { title: 'Zoom Out', label: '−', action: () => setZoom(z => Math.max(z - 0.25, 0.75)) },
                      ].map(({ title, label, action }) => (
                        <button key={label} type="button" title={title} onClick={action}
                          className="h-7 w-7 flex items-center justify-center text-[11px] font-bold text-text-muted hover:text-text hover:bg-bg/60 transition-all cursor-pointer border-r border-border/10 last:border-0 font-sans">
                          {label}
                        </button>
                      ))}
                      <button type="button" title="Invert Colors" onClick={() => setContrastInverted(v => !v)}
                        className={`h-7 px-2.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer
                          ${contrastInverted ? 'bg-warning/20 text-warning' : 'text-text-muted hover:text-text hover:bg-bg/60'}`}>
                        INV
                      </button>
                    </div>
                  </div>
                }
              />
              <div className="relative h-[288px] flex items-center justify-center bg-bg overflow-hidden p-4">
                {docSrc ? (
                  <SecureImage
                    src={docSrc}
                    alt={currentTab?.label || "Verification Document"}
                    className="max-h-full max-w-full object-contain transition-all duration-300 transform-gpu"
                    style={{ transform: `rotate(${rotation}deg) scale(${zoom})`, filter: contrastInverted ? 'invert(1) contrast(1.2)' : 'none' }}
                  />
                ) : (
                  <div className="text-[11.5px] text-text-muted/40 italic animate-pulse">No document image available.</div>
                )}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[3px] bg-bg/90 border border-border/12 text-[8.5px] font-mono text-text-muted/50 uppercase tracking-wide select-none">
                  Secure Connection · Safe
                </span>
              </div>
            </Panel>
          </div>

          {/* RIGHT: Checklist + actions */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Checklist */}
            <Panel className="flex-1">
              <PanelHead title="Checklist" />
              <div className="divide-y divide-border/8">
                {[
                  [`Identity Document`, `Type: ${idDocType.replace('_', ' ').toUpperCase()}`],
                  ['Liveness Check', raw.selfieImage ? 'Selfie image provided.' : 'Pending liveness check.'],
                  ['Name Match', `Name matches identity document: "${raw.fullName || user.name}"`],
                  ['Address Match', `Address matches utility bill/bank statement: "${raw.streetAddress || user.address || 'Standard Address'}"`],
                ].map(([label, val], idx) => (
                  <div key={idx} className="flex items-start gap-3 px-4 py-2.5">
                    <input type="checkbox" defaultChecked className="mt-0.5 accent-brand cursor-pointer shrink-0" />
                    <div>
                      <h5 className="text-[11px] font-bold text-text leading-tight">{label}</h5>
                      <p className="text-[9.5px] text-text-muted/50 mt-0.5 leading-snug">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Decision desk */}
            <Panel>
              <PanelHead title="Actions" />
              <div className="p-4">
                {showRejectionForm ? (
                  <div className="space-y-2.5 animate-fade-in">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a clear rejection reason (e.g., Expired ID, utility bill name mismatch)..."
                      className="w-full text-[11px] p-2.5 rounded-[6px] border border-negative/30 bg-bg text-text outline-none focus:border-negative transition-all resize-none"
                      rows={2}
                      disabled={kycActionLoading}
                    />
                    <div className="flex gap-2">
                      <PillBtn onClick={() => setShowRejectionForm(false)} variant="ghost" disabled={kycActionLoading} className="flex-1">Cancel</PillBtn>
                      <PillBtn onClick={handleReject} variant="danger" disabled={kycActionLoading} className="flex-1">
                        {kycActionLoading ? 'Rejecting...' : 'Confirm Reject'}
                      </PillBtn>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <PillBtn onClick={() => setShowRejectionForm(true)} variant="danger" disabled={kycActionLoading || isRejected || isVerified || isDraft} className="flex-1">Reject</PillBtn>
                    <PillBtn onClick={handleApprove} variant="brand" disabled={kycActionLoading || isVerified || isDraft} className="flex-1">
                      {kycActionLoading ? 'Approving...' : 'Approve'}
                    </PillBtn>
                  </div>
                )}
              </div>
            </Panel>
          </div>

          {/* Approve Confirmation Modal */}
          {showApproveModal && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="relative w-full max-w-md rounded-[12px] border border-border/15 bg-surface-elevated shadow-2xl overflow-hidden flex flex-col text-left">
                <div className="px-6 py-5 border-b border-border/10">
                  <h3 className="text-[16px] font-bold font-heading text-text flex items-center gap-2">
                    <CheckCircle className="text-brand" size={18} />
                    Approve KYC Verification
                  </h3>
                </div>
                <div className="px-6 py-6">
                  <p className="text-[13px] text-text-muted/80 leading-relaxed">
                    Are you sure you want to approve this KYC application? This action will verify the user's identity and automatically send an approval email to them.
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-border/10 bg-bg/30 flex justify-end gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 text-[12px] font-bold text-text-muted hover:text-text cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApprove}
                    className="px-5 py-2 text-[12px] font-bold rounded-[8px] bg-brand text-text-on-accent cursor-pointer hover:brightness-110 transition-all shadow-lg shadow-brand/20 flex items-center gap-2"
                  >
                    Confirm Approval
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

        </div>

        {/* Metadata */}
        <div>
          <SectionHeader title="History & Metadata" />
          <Panel>
            <div className="divide-y divide-border/8">
              {[
                ['Level', 'Level 1', false],
                ['Submitted At', kycRecord.raw?.createdAt || 'N/A', true],
                ['Reviewer', kycRecord.raw?.reviewedBy || 'Compliance Queue', false],
                ['Files', [kycRecord.raw?.idFrontImage, kycRecord.raw?.idBackImage, kycRecord.raw?.selfieImage, kycRecord.raw?.addressDocImage].filter(Boolean).map(path => typeof path === 'string' ? path.split('/').pop() : 'Attached File').join(', ') || 'No files attached', false],
              ].map(([label, val, mono], i) => (
                <div key={i} className="px-4"><DataRow label={label} value={val} mono={mono} /></div>
              ))}
            </div>
          </Panel>
        </div>

      </div>
    );
  }

  /* ── 3. WALLET ── */

  if (activeTab === 'payment-methods') {
    return <PaymentMethodsTab user={user} />;
  }

  if (activeTab === 'wallet') {
    return (
      <div className="space-y-5 animate-fade-up">

        {/* Success toast */}
        {adjustmentSuccessMsg && (
          <div className="flex items-center gap-2.5 rounded-[6px] border-l-2 border-l-brand border border-brand/15 bg-brand/[0.04] px-4 py-2.5 text-[11px] font-bold text-brand">
            <CheckCircle size={12} className="shrink-0" />
            {adjustmentSuccessMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT: Assets + History */}
          <div className="lg:col-span-7 space-y-5">

            {/* Wallet assets */}
            <div>
              <SectionHeader title="Balances" />
              <div className="space-y-2.5">
                {(user.wallet ?? []).length > 0 ? (
                  user.wallet.map((w, idx) => (
                    <Panel key={idx}>
                      <div className="flex items-center gap-4 p-4">
                        {/* Asset badge */}
                        <div className="h-9 w-9 rounded-[7px] border border-brand/20 bg-brand/[0.06] text-brand flex items-center justify-center font-semibold text-[12px] font-mono shrink-0">
                          {w.asset}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-semibold text-text">{w.asset}</h4>
                          <p className="text-[12px] text-text-muted/80 mt-1">Main wallet currency.</p>
                        </div>
                        {/* Metrics */}
                        <div className="flex items-center divide-x divide-border/15 shrink-0">
                          {[
                            { label: 'Balance', val: user.walletBalance, cls: 'text-text' },
                            { label: 'Available', val: user.walletBalance, cls: 'text-positive' },
                            { label: 'Hold', val: '$0.00', cls: 'text-text-muted/50' },
                          ].map(({ label, val, cls }) => (
                            <div key={label} className="px-4 text-right">
                              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">{label}</p>
                              <p className={`font-mono text-[12.5px] font-semibold mt-0.5 ${cls}`}>{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  ))
                ) : (
                  <div className="rounded-[8px] border border-dashed border-border/20 p-6 text-center text-[11.5px] text-text-muted/40 italic">
                    No collateral balances registered.
                  </div>
                )}
              </div>
            </div>

            {/* Transaction history */}
            <div>
              <SectionHeader title="Transactions" />
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {(user.walletHistory ?? []).length > 0 ? (
                  user.walletHistory.map((tx) => {
                    const isDebit = tx.type === 'WITHDRAWAL';
                    return (
                      <div key={tx.id}
                        className={`flex items-center justify-between gap-4 px-4 py-2.5 rounded-[7px] border-l-2 border border-border/10 bg-bg/20 hover:bg-bg/35 transition-all
                          ${isDebit ? 'border-l-negative' : 'border-l-positive'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-[5px] shrink-0 ${isDebit ? 'bg-negative/8 text-negative' : 'bg-positive/8 text-positive'}`}>
                            {isDebit ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
                          </div>
                          <div>
                            <h4 className="text-[11.5px] font-bold text-text leading-tight">{tx.method}</h4>
                            <p className="text-[9.5px] text-text-muted/45 mt-0.5 font-mono uppercase">
                              {tx.type} · <span className="text-positive font-bold">{tx.status}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-mono text-[12px] font-black block ${isDebit ? 'text-negative' : 'text-positive'}`}>{tx.amount}</span>
                          <span className="font-mono text-[9px] text-text-muted/35 block mt-0.5">{tx.time}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-[8px] border border-dashed border-border/20 p-6 text-center text-[11.5px] text-text-muted/40 italic">
                    No transactions recorded.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Maker-Checker */}
          <div className="lg:col-span-5 space-y-4">

            {/* Maker form */}
            <Panel>
              <PanelHead
                title="Adjust Balance"
                subtitle="Request a balance change. Another admin must approve this."
              />
              <div className="p-4">
                <form onSubmit={handleCreateAdjustment} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Action', val: makerType, set: setMakerType, opts: [['CREDIT', 'CREDIT (Add)'], ['DEBIT', 'DEBIT (Remove)']] },
                      { label: 'Currency', val: makerAsset, set: setMakerAsset, opts: [['USD', 'USD'], ['BTC', 'BTC'], ['EUR', 'EUR']] },
                    ].map(({ label, val, set, opts }) => (
                      <div key={label}>
                        <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">{label}</label>
                        <select value={val} onChange={e => set(e.target.value)}
                          className="w-full h-8 text-[12px] px-2.5 rounded-[6px] border border-border/18 bg-bg text-text outline-none focus:border-brand/40 transition-all font-semibold">
                          {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">Amount (USD)</label>
                    <input type="number" value={makerAmount} onChange={e => setMakerAmount(e.target.value)}
                      placeholder="e.g. 5000.00" required step="0.01" min="0.01"
                      className="w-full h-8 text-[12px] px-2.5 rounded-[6px] border border-border/18 bg-bg text-text outline-none focus:border-brand/40 font-mono transition-all font-semibold" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 block mb-1">Reason</label>
                    <textarea value={makerReason} onChange={e => setMakerReason(e.target.value)}
                      placeholder="Write the reason for this adjustment..." required
                      className="w-full text-[12px] p-2.5 rounded-[6px] border border-border/18 bg-bg text-text outline-none focus:border-brand/40 resize-none transition-all"
                      rows={2} />
                  </div>
                  <button type="submit"
                    className="w-full h-8 rounded-[6px] bg-brand text-text-on-accent border border-brand/20 hover:bg-brand-hover text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer">
                    Submit Request
                  </button>
                </form>
              </div>
            </Panel>

            {/* Checker queue */}
            <Panel>
              <PanelHead
                title="Pending Adjustments"
                subtitle="Approve or reject balance change requests."
              />
              <div className="p-4 space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
                {pendingAdjustments.length > 0 ? (
                  pendingAdjustments.map((adj) => (
                    <div key={adj.id} className="rounded-[8px] border border-border/15 bg-bg/20 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-border/10">
                        <Chip label={adj.type} variant={adj.type === 'CREDIT' ? 'positive' : 'negative'} />
                        <span className="font-mono text-text font-semibold text-[12.5px]">${parseFloat(adj.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="px-3 py-2.5">
                        <p className="text-[12px] text-text-muted/80 leading-relaxed">Reason: "{adj.reason}"</p>
                        <p className="text-[11px] text-text-muted/70 font-semibold mt-1">Requested by {adj.maker} · {adj.time}</p>
                      </div>
                      <div className="flex border-t border-border/8">
                        <button onClick={() => handleDeclineAdjustment(adj.id)}
                          className="flex-1 h-7 text-negative text-[11px] font-bold uppercase tracking-wider hover:bg-negative/5 transition-all cursor-pointer border-r border-border/10">
                          Decline
                        </button>
                        <button onClick={() => handleApproveAdjustment(adj.id)}
                          className="flex-1 h-7 text-brand text-[11px] font-bold uppercase tracking-wider hover:bg-brand/5 transition-all cursor-pointer">
                          Approve & Apply
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[8px] border border-dashed border-border/18 p-5 text-center text-[11px] text-text-muted/35 italic">
                    No adjustments are currently waiting for checker approval.
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    );
  }

  /* ── 4. MT5 TERMINALS ── */
  if (activeTab === 'mt5-accounts') {
    return (
      <div className="space-y-5 animate-fade-up">

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-text">MT5 Accounts</h3>
            <p className="text-[12.5px] text-text-muted/80 mt-1">Manage active trading accounts.</p>
          </div>
          <PillBtn onClick={onCreateMt5Account} variant="brand">Create Account</PillBtn>
        </div>

        <div>
          <SectionHeader title="MT5 Accounts" />
          <div className="space-y-3">
            {(user.mt5 ?? []).length > 0 ? (
              user.mt5.map((terminal) => (
                <div
                  key={terminal.login}
                  onClick={() => onOpenMt5Account?.(terminal)}
                  className="rounded-[10px] border border-border/15 bg-bg/20 overflow-hidden hover:border-brand/40 hover:bg-bg/35 transition-all duration-200 transform-gpu hover:scale-[1.005] cursor-pointer"
                >
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-border/10 bg-bg/20 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[13.5px] font-semibold text-brand">{terminal.login}</span>
                      <span className="px-2 py-0.5 rounded-[4px] text-[9px] font-bold border border-border/20 text-text-muted font-mono bg-bg/60">
                        {terminal.server}
                      </span>
                    </div>
                    <StatusBadge status={terminal.status} />
                  </div>

                  {/* Parameters */}
                  <div className="grid grid-cols-4 divide-x divide-border/8 px-0">
                    {[
                      { label: 'Leverage', val: terminal.leverage, cls: '' },
                      { label: 'Group', val: terminal.group, cls: 'font-mono' },
                      { label: 'Equity', val: terminal.equity, cls: 'font-mono text-brand' },
                      { label: 'Margin Level', val: terminal.marginLevel ?? terminal.marginLvl ?? '—', cls: 'font-mono' },
                    ].map(({ label, val, cls }) => (
                      <div key={label} className="px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">{label}</p>
                        <p className={`text-[12.5px] font-semibold text-text mt-0.5 ${cls}`}>{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-bg/15 border-t border-border/8 flex justify-between items-center text-[11px] text-text-muted/70 font-mono">
                    <span className="flex items-center gap-1.5"><Clock size={9} /> Connected</span>
                    <span>Last Synced: {terminal.lastSync}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[10px] border border-dashed border-border/20 p-10 text-center flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border border-brand/15 bg-brand/5 text-brand flex items-center justify-center mb-3">
                  <Cpu size={17} />
                </div>
                <h4 className="text-[13px] font-bold text-text">No Accounts</h4>
                <p className="text-[10.5px] text-text-muted/45 mt-1 max-w-xs leading-relaxed">
                  This user has no MT5 accounts. Click below to create one.
                </p>
                <PillBtn onClick={onCreateMt5Account} variant="brand" className="mt-4">Create Account</PillBtn>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── 5. TRADE LOG ── */
  if (activeTab === 'trading-history') {
    return (
      <div className="space-y-6 animate-fade-up">

        {/* Live positions */}
        <div>
          <SectionHeader title="Open Positions" />
          <div className="space-y-2.5">
            {(user.livePositions ?? []).length > 0 ? (
              user.livePositions.map((trade) => {
                const isLoss = String(trade.pnl).startsWith('-');
                const isBuy = trade.side === 'BUY';
                return (
                  <Panel key={trade.ticket}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                      {/* Side + Symbol */}
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <span className={`h-8 w-12 rounded-[6px] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center border shrink-0
                          ${isBuy ? 'border-positive/20 bg-positive/8 text-positive' : 'border-negative/20 bg-negative/8 text-negative'}`}>
                          {trade.side}
                        </span>
                        <div>
                          <h4 className="text-[13px] font-semibold text-text">{trade.symbol}</h4>
                          <p className="font-mono text-[11px] text-text-muted/70 mt-1">#{trade.ticket}</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex-1 grid grid-cols-4 gap-4 border-x border-border/10 px-4">
                        {[
                          { label: 'Volume', val: trade.lots },
                          { label: 'Entry', val: trade.openPrice },
                          { label: 'Current', val: trade.livePrice },
                          { label: 'Swap', val: trade.swaps },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">{label}</p>
                            <p className="font-mono text-[12px] font-semibold text-text mt-0.5">{val}</p>
                          </div>
                        ))}
                      </div>

                      {/* PnL + actions */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">P&L</p>
                          <p className={`font-mono font-semibold text-[14px] mt-0.5 ${isLoss ? 'text-negative' : 'text-positive'}`}>{trade.pnl}</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <PillBtn onClick={() => handleForceHedge(trade.ticket, trade.symbol)} variant="warning">
                            Hedge
                          </PillBtn>
                          <PillBtn onClick={() => handleForceClose(trade.ticket, trade.symbol)} variant="danger">
                            Close Trade
                          </PillBtn>
                        </div>
                      </div>
                    </div>
                  </Panel>
                );
              })
            ) : (
              <div className="rounded-[8px] border border-dashed border-border/18 p-7 text-center text-[11.5px] text-text-muted/40 italic">
                No open positions.
              </div>
            )}
          </div>
        </div>

        {/* Closed history */}
        <div>
          <SectionHeader title="Closed Trades" />
          <div className="space-y-1.5">
            {(user.tradingHistory ?? []).length > 0 ? (
              user.tradingHistory.map((trade) => {
                const isLoss = String(trade.pnl).startsWith('-');
                const isBuy = trade.side === 'BUY';
                return (
                  <div key={trade.ticket}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-2.5 rounded-[7px] border-l-2 border border-border/10 bg-bg/18 hover:bg-bg/30 transition-all
                      ${isBuy ? 'border-l-positive' : 'border-l-negative'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`h-7 w-10 rounded-[5px] text-[11px] font-bold uppercase flex items-center justify-center border shrink-0
                        ${isBuy ? 'border-positive/18 bg-positive/6 text-positive' : 'border-negative/18 bg-negative/6 text-negative'}`}>
                        {trade.side}
                      </span>
                      <div>
                        <h4 className="text-[13px] font-semibold text-text">{trade.symbol}</h4>
                        <p className="font-mono text-[11px] text-text-muted/70 mt-1">#{trade.ticket}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 shrink-0">
                      {[
                        { label: 'Volume', val: trade.lots, cls: '' },
                        { label: 'Prices', val: `${trade.open} → ${trade.close}`, cls: 'font-mono text-text-muted/65' },
                        { label: 'P&L', val: trade.pnl, cls: `font-mono font-semibold ${isLoss ? 'text-negative' : 'text-positive'}` },
                      ].map(({ label, val, cls }) => (
                        <div key={label} className="text-right">
                          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">{label}</p>
                          <p className={`text-[12px] font-semibold mt-0.5 ${cls}`}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[8px] border border-dashed border-border/18 p-6 text-center text-[11.5px] text-text-muted/40 italic">
                No closed trades.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── 6. ACTIVITY LOGS ── */
  if (activeTab === 'activity-logs') {
    const handleRevokeSession = (sessionId) => {
      const updatedSessions = (user.sessions ?? []).filter((s) => s.id !== sessionId);
      onUpdateUser?.({ sessions: updatedSessions });
    };

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Sessions */}
          <div className="lg:col-span-6">
            <SectionHeader title="Active Sessions" />
            <div className="space-y-2">
              {(user.sessions ?? []).length > 0 ? (
                user.sessions.map((sess) => (
                  <Panel key={sess.id}>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <h4 className="text-[12.5px] font-semibold text-text truncate">{sess.device}</h4>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <Chip label={sess.location} variant="brand" />
                          <span className="font-mono text-[11px] text-text-muted/70">IP: {sess.ip}</span>
                        </div>
                        <p className="text-[11px] text-text-muted/70 mt-1">Logged in: {sess.lastActive}</p>
                      </div>
                      <PillBtn onClick={() => handleRevokeSession(sess.id)} variant="danger">Revoke</PillBtn>
                    </div>
                  </Panel>
                ))
              ) : (
                <div className="rounded-[8px] border border-dashed border-border/18 p-6 text-center text-[11.5px] text-text-muted/35 italic">
                  No active sessions.
                </div>
              )}
            </div>
          </div>

          {/* Activity stream */}
          <div className="lg:col-span-6">
            <SectionHeader title="Activity Log" />
            <div className="relative space-y-0 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
              {/* Timeline vertical line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-border/15 pointer-events-none" />
              {(user.activity ?? []).length > 0 ? (
                user.activity.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4 pl-8 pb-3">
                    {/* Dot */}
                    <span className="absolute left-[11px] top-[6px] h-[9px] w-[9px] rounded-full bg-bg border-2 border-brand/40 shrink-0" />
                    <div className="flex-1 rounded-[7px] border border-border/10 bg-bg/18 hover:bg-bg/30 transition-all px-3.5 py-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-[12px] font-semibold text-text leading-tight">{item.action}</h4>
                        <span className="font-mono text-[11px] text-text-muted/70 shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11.5px] text-text-muted/70 mt-1">
                        By {item.actor} · via <span className="font-mono uppercase">{item.channel}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[8px] border border-dashed border-border/18 p-6 text-center text-[11.5px] text-text-muted/35 italic ml-8">
                  No recent events.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── 7. RISK VIEW ── */
  if (activeTab === 'risk-view') {
    const isWatch = user.riskStatus === 'WATCHLIST';
    const isHigh = ['HIGH', 'ELEVATED'].includes(user.riskStatus);

    const riskConfig = isHigh
      ? { accentCls: 'border-l-negative border-negative/12 bg-negative/[0.03]', iconCls: 'text-negative', titleCls: 'text-negative', text: 'High volatility / margin triggers active. Monitor open positions closely to prevent liquidations.' }
      : isWatch
      ? { accentCls: 'border-l-warning border-warning/12 bg-warning/[0.03]', iconCls: 'text-warning', titleCls: 'text-warning', text: 'Moderate concentration warning. Avoid increasing leverage multipliers.' }
      : { accentCls: 'border-l-positive border-positive/12 bg-positive/[0.03]', iconCls: 'text-positive', titleCls: 'text-positive', text: 'User risk levels are low. Operational thresholds are active and stable.' };

    const LOCKS = [
      {
        key: 'withdrawalsBlocked',
        active: user.withdrawalsBlocked ?? false,
        title: 'Restrict Withdrawals',
        sub: 'Restrict payout transactions & wires',
        activeColor: 'negative',
        activeLabel: 'LOCKED',
        inactiveLabel: 'ACTIVE',
      },
      {
        key: 'readOnlyTerminals',
        active: user.readOnlyTerminals ?? false,
        title: 'Read-Only Terminals',
        sub: 'Disable order creation & adjustments',
        activeColor: 'warning',
        activeLabel: 'READ-ONLY',
        inactiveLabel: 'ACTIVE',
      },
      {
        key: 'apiBlocked',
        active: user.apiBlocked ?? false,
        title: 'Restrict API Access',
        sub: 'Revoke algorithmic terminal access keys',
        activeColor: 'negative',
        activeLabel: 'BLOCKED',
        inactiveLabel: 'ACTIVE',
      },
    ];

    return (
      <div className="space-y-5 animate-fade-up">

        {/* Risk banner */}
        <div className={`flex items-start gap-3 rounded-[8px] border-l-2 border px-4 py-3 ${riskConfig.accentCls}`}>
          <ShieldAlert size={13} className={`${riskConfig.iconCls} shrink-0 mt-0.5`} />
          <div>
            <h4 className={`text-[12px] font-semibold ${riskConfig.titleCls}`}>Risk Rating: {user.riskStatus}</h4>
            <p className="text-[12px] text-text-muted/80 mt-1 leading-relaxed">{riskConfig.text}</p>
          </div>
        </div>

        {/* Security Restrictions */}
        <div>
          <SectionHeader title="Security Controls" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LOCKS.map(({ key, active, title, sub, activeColor, activeLabel, inactiveLabel }) => {
              const colorMap = { negative: { ring: 'border-negative/30 bg-negative/[0.03]', chip: 'border-negative/20 text-negative bg-negative/6', icon: 'bg-negative/8 text-negative' }, warning: { ring: 'border-warning/30 bg-warning/[0.03]', chip: 'border-warning/20 text-warning bg-warning/6', icon: 'bg-warning/8 text-warning' } };
              const c = active ? colorMap[activeColor] : null;
              return (
                <div
                  key={key}
                  onClick={() => handleToggleLock(key)}
                  className={`relative rounded-[8px] border p-4 cursor-pointer select-none transition-all duration-200 overflow-hidden
                    ${active ? `${c.ring}` : 'border-border/15 bg-bg/18 hover:bg-bg/30 hover:border-border/30'}`}
                >
                  {/* Active glow line top */}
                  {active && <span className={`absolute top-0 left-0 right-0 h-[2px] ${activeColor === 'negative' ? 'bg-negative/40' : 'bg-warning/40'}`} />}

                  <div className="flex items-start justify-between mb-4">
                    <span className={`p-2 rounded-[6px] ${active ? c.icon : 'bg-bg/50 border border-border/15 text-text-muted/45'}`}>
                      <Lock size={12} />
                    </span>
                    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] border font-mono
                      ${active ? c.chip : 'border-border/20 text-text-muted/45 bg-bg/30'}`}>
                      {active ? activeLabel : inactiveLabel}
                    </span>
                  </div>
                  <h4 className="text-[12.5px] font-semibold text-text">{title}</h4>
                  <p className="text-[11.5px] text-text-muted/70 mt-1 leading-tight">{sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Parameters */}
        <div>
          <SectionHeader title="Risk Parameters" />
          <Panel>
            <div className="divide-y divide-border/8">
              {[
                ['Risk Score', user.risk?.score || '15 / 100', false],
                ['Exposure', user.risk?.exposure || '$0.00', true],
                ['Drawdown', user.risk?.drawdown || '0%', true],
                ['Concentration', user.risk?.concentration || '0%', false],
              ].map(([label, val, mono], i) => (
                <div key={i} className="px-4"><DataRow label={label} value={val} mono={mono} /></div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Compliance Alerts */}
        <div>
          <SectionHeader title="Risk Alerts" />
          <div className="space-y-1.5">
            {(user.risk?.alerts ?? []).length > 0 ? (
              user.risk.alerts.map((al, index) => (
                <div key={index}
                  className="flex items-start gap-3 rounded-[7px] border-l-2 border-l-negative border border-negative/12 bg-negative/[0.02] px-3.5 py-2.5">
                  <AlertTriangle size={11} className="text-negative shrink-0 mt-0.5" />
                  <span className="text-[11px] text-text-muted font-medium leading-normal">{al}</span>
                </div>
              ))
            ) : (
              <div className="rounded-[8px] border border-dashed border-border/18 p-5 text-center text-[11.5px] text-text-muted/35 italic">
                No alerts.
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

  /* ── 9. REFERRALS ── */
  if (activeTab === 'referrals') {
    const totalEarnings = (user.referrals ?? []).reduce((acc, curr) => acc + (parseFloat(curr.earnings.replace(/[$,]/g, '')) || 0), 0);
    const totalVolume = (user.referrals ?? []).reduce((acc, curr) => acc + (parseFloat(curr.volume.replace(/[^0-9.]/g, '')) || 0), 0);

    return (
      <div className="space-y-5 animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT: Commission controls */}
          <div className="lg:col-span-5">
            <Panel>
              <PanelHead
                title="Referral Commission"
                subtitle="Set the commission percentage paid back to this partner."
              />
              <div className="p-5 space-y-5">
                {/* Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">Commission Rate</span>
                    <span className="font-mono text-brand font-semibold text-[16px]">{user.rebateRate ?? 10}%</span>
                  </div>
                  <input
                    type="range" min="5" max="20" step="1"
                    value={user.rebateRate ?? 10}
                    onChange={(e) => handleRebateRateChange(parseInt(e.target.value))}
                    className="w-full accent-brand cursor-pointer h-1 bg-border/20 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-text-muted/70 font-bold uppercase">
                    <span>5% · Standard</span>
                    <span>12% · Mid</span>
                    <span>20% · VIP</span>
                  </div>
                </div>

                {/* Summary tiles */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/8">
                  <MetricTile
                    label="Total Earned"
                    value={`$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    color="text-positive"
                  />
                  <MetricTile
                    label="Referred Volume"
                    value={`${totalVolume.toFixed(1)} Lots`}
                    color="text-brand"
                  />
                </div>
              </div>
            </Panel>
          </div>

          {/* RIGHT: Referral table */}
          <div className="lg:col-span-7">
            <Panel>
              <PanelHead title="Referred Users" />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/10">
                      {['User', 'UID', 'Volume', 'Commission'].map((h, i) => (
                        <th key={h} className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/6">
                    {(user.referrals ?? []).length > 0 ? (
                      user.referrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-bg/20 transition-colors">
                          <td className="px-4 py-3 text-[12px] font-semibold text-text">{ref.name}</td>
                          <td className="px-4 py-3 font-mono text-[11.5px] text-text-muted/70">{ref.uid}</td>
                          <td className="px-4 py-3 font-mono text-[12px] text-text font-semibold">{ref.volume}</td>
                          <td className="px-4 py-3 font-mono text-[12px] font-semibold text-positive text-right">{ref.earnings}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[11.5px] text-text-muted/35 italic">
                          No referred accounts.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

        </div>
      </div>
    );
  }

  /* ── 8. NOTES & TAGS ── */
  const allAvailableTags = ['Scalper', 'HedgeTrader', 'Whale', 'VIPPriority', 'HighRisk', 'MAMManager'];

  const handleToggleTag = (tag) => {
    const currentTags = user.tags ?? [];
    const nextTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
    onUpdateUser?.({ tags: nextTags });
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `NOTE-${Date.now()}`,
      author: 'Compliance Officer',
      time: 'Just now',
      text: newNoteText,
    };
    onUpdateUser?.({ notes: [newNote, ...(user.notes ?? [])] });
    setNewNoteText('');
  };

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Tags */}
      <div>
        <SectionHeader title="Tags" />
        <div className="flex flex-wrap gap-2">
          {allAvailableTags.map((tag) => {
            const isActive = (user.tags ?? []).includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`px-3 py-1.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer border
                  ${isActive
                    ? 'bg-brand text-text-on-accent border-brand/20 shadow-sm shadow-brand/10'
                    : 'bg-bg/20 border-border/15 text-text-muted/60 hover:text-text hover:border-border/35'}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-text-muted/80 mt-2 leading-relaxed">
          Add or remove tags to identify trader behavior.
        </p>
      </div>

      {/* Notes */}
      <div>
        <SectionHeader title="Notes" />
        <div className="space-y-4">

          {/* Input */}
          <Panel>
            <PanelHead title="Add Note" />
            <div className="p-4 space-y-3">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write a note about compliance, phone logs, etc..."
                className="w-full text-[11px] p-2.5 rounded-[6px] border border-border/15 bg-bg text-text outline-none focus:border-brand/40 transition-all leading-relaxed resize-none"
                rows={3}
              />
              <div className="flex justify-end">
                <PillBtn onClick={handleAddNote} variant="brand" disabled={!newNoteText.trim()}>
                  Save Note
                </PillBtn>
              </div>
            </div>
          </Panel>

          {/* Notes feed */}
          <div className="space-y-2.5">
            {(user.notes ?? []).length > 0 ? (
              user.notes.map((n) => (
                <div key={n.id} className="rounded-[8px] border-l-2 border-l-brand/30 border border-border/10 bg-bg/18 hover:bg-bg/28 transition-all px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[12.5px] font-semibold text-text">{n.author}</span>
                    <span className="font-mono text-[11px] text-text-muted/70">{n.time}</span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-text-muted/80">{n.text}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[8px] border border-dashed border-border/18 p-6 text-center text-[11.5px] text-text-muted/35 italic">
                No notes.
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}