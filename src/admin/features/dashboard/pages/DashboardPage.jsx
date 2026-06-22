import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { DashboardKpis } from '../components/DashboardKpis';
import { DashboardChart } from '../components/DashboardChart';
import { DashboardAlerts } from '../components/DashboardAlerts';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import DashboardStream from '../components/DashboardStream';
import { useDashboardData } from '../hooks/useDashboardData';

export function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  // If there's a load-blocking error, we still want to show the page with empty/error states
  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">
        {error && (
          <div className="p-4 rounded-[10px] bg-negative/10 border border-negative/20 text-negative text-[13.5px] font-medium flex items-center justify-between">
            <span>Error fetching dashboard data: {error}</span>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1 rounded bg-negative/15 hover:bg-negative/20 transition text-[12px] font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── ROW 1: Platform-wide KPI Telemetry ── */}
        <DashboardKpis kpis={data?.kpis} loading={loading} />

        {/* ── ROW 2: Liquidity Flow + Alerts Command Center ── */}
        <section className="grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-8">
            <DashboardChart financeSummary={data?.financeSummary} loading={loading} />
          </div>
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
            <DashboardAlerts actionItems={data?.actionItems} loading={loading} />
            <DashboardQuickActions />
          </div>
        </section>

        {/* ── ROW 3: Active Ledger (Full Width) ── */}
        <section className="grid grid-cols-12 gap-5 items-start">
          <div className="col-span-12">
            <DashboardStream recentActivity={data?.recentActivity} loading={loading} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default DashboardPage;
