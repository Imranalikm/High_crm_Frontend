import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import StrategyDetailPage from '../detail/StrategyDetailPage';
import ProviderDetailPage from '../detail/ProviderDetailPage';
import FollowerDetailPage from '../detail/FollowerDetailPage';
import SubscriptionDetailPage from '../detail/SubscriptionDetailPage';
import LogDetailPage from '../detail/LogDetailPage';

import { STRATEGY_ROWS, PROVIDER_ROWS, FOLLOWER_ROWS, SUBSCRIPTION_ROWS, LOG_ROWS } from '@/config/constants/copy-trading/workspaces';

const strategiesData = STRATEGY_ROWS.map(s => ({
  ...s,
  copiedVol: s.copiedVolume || s.copiedVol,
  aum: s.copiedVolume || s.aum,
  winRateN: parseFloat((s.winRate || '0').replace(/%/g, '')) || 0,
  ddN: parseFloat((s.drawdown || '0').replace(/[-%]/g, '')) || 0,
  roiN: parseFloat((s.roi || '0').replace(/[+%]/g, '')) || 0,
  rating: s.rating || 4.5,
  tags: s.tags || ['forex', 'scalping'],
  phase: s.phase || 'Phase-2',
}));

const providersData = PROVIDER_ROWS.map(p => ({
  ...p,
  name: p.provider,
  email: p.email || `${p.provider}@firm.com`,
  joined: p.joined || '2023-06-15',
  kyc: p.kyc || 'APPROVED',
  verified: p.verified ?? true,
  risk: p.risk || 'LOW',
}));

const followersData = FOLLOWER_ROWS.map(f => ({
  ...f,
  alloc: f.allocation || f.alloc,
  ratio: f.copyRatio || f.ratio,
  pnl: f.pnlImpact || f.pnl,
  pnlN: parseFloat((f.pnlImpact || f.pnl || '0').replace(/[+$$,]/g, '')) || 0,
}));

const subsData = SUBSCRIPTION_ROWS.map(s => ({
  ...s,
  alloc: s.allocation || s.alloc,
  fee: s.fee || '20%',
}));

const logsData = LOG_ROWS.map(l => ({
  ...l,
  id: l.eventId || l.id,
  sev: l.severity || l.sev,
  ts: l.timestamp || l.ts,
}));

export function CopyTradingDetailPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    // If slug is strategy, providers, logs, subs etc. navigate back to respective tab
    let plural = 'strategies';
    if (slug === 'provider') plural = 'providers';
    if (slug === 'follower') plural = 'followers';
    if (slug === 'subscription') plural = 'subscriptions';
    if (slug === 'log') plural = 'logs';
    navigate(`/admin/copy-trading/${plural}`);
  };

  const handleAction = (msg, entityId) => {
    console.log(`Action on ${slug} (${entityId}): ${msg}`);
  };

  switch (slug) {
    case 'strategy': {
      const row = strategiesData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Strategy not found</div>;
      return <StrategyDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'provider': {
      const row = providersData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Provider not found</div>;
      return <ProviderDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'follower': {
      const row = followersData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Follower not found</div>;
      return <FollowerDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'subscription': {
      const row = subsData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Subscription not found</div>;
      return <SubscriptionDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    case 'log': {
      const row = logsData.find(x => x.id === id);
      if (!row) return <div className="p-6 text-text font-heading">Log not found</div>;
      return <LogDetailPage row={row} onBack={handleBack} act={handleAction} />;
    }
    default:
      return <div className="p-6 text-text font-heading">Detail category not found</div>;
  }
}

export default CopyTradingDetailPage;
