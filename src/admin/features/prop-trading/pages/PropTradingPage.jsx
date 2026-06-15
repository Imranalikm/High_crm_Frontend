import React from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Layers, Clipboard, Trophy, BarChart2, Tag, Shield } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PropOverviewPage }            from './PropOverviewPage';
import { ChallengeConfigPage } from './ChallengeConfigPage';
import EvaluationRequestsPage from './EvaluationRequestsPage';
import FundedAccountsPage from './FundedAccountsPage';
import StatisticsPage from './StatisticsPage';
import FeesCouponsPage from './FeesCouponsPage';
import { RiskRulesPanel }               from '../components/RiskRulesPanel';

const NAV_ITEMS = [
  { id: 'overview',    path: '/admin/prop-trading',                       label: 'Overview',           Icon: PieChart  },
  { id: 'challenges',  path: '/admin/prop-trading/challenge-configurations', label: 'Challenge Config.',  Icon: Layers    },
  { id: 'evaluations', path: '/admin/prop-trading/evaluation-requests',   label: 'Evaluation Requests', Icon: Clipboard, badge: 247 },
  { id: 'funded',      path: '/admin/prop-trading/funded-accounts',       label: 'Funded Accounts',    Icon: Trophy    },
  { id: 'statistics',  path: '/admin/prop-trading/statistics',            label: 'Statistics',          Icon: BarChart2 },
  { id: 'fees',        path: '/admin/prop-trading/fees-coupons',          label: 'Fees & Coupons',      Icon: Tag       },
  { id: 'rules',       path: '/admin/prop-trading/rules-risk',            label: 'Rules / Risk',        Icon: Shield    },
];

const PAGE_MAP = {
  overview:    PropOverviewPage,
  challenges:  ChallengeConfigPage,
  evaluations: EvaluationRequestsPage,
  funded:      FundedAccountsPage,
  statistics:  StatisticsPage,
  fees:        FeesCouponsPage,
  rules:       RiskRulesPanel,
};

function PropTradingPage() {
  const location = useLocation();

  const found = NAV_ITEMS.find((n) => n.path === location.pathname);
  const activeId = found?.id ?? 'overview';

  const PageComponent = PAGE_MAP[activeId] ?? PropOverviewPage;

  return (
    <PageShell className="!pt-0">
    
      {/* ── Active page ── */}
      <div className="space-y-5 animate-in fade-in duration-200">
        <PageComponent />
      </div>
    </PageShell>
  );
}

export default PropTradingPage;
