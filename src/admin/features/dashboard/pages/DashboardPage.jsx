import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { DashboardKpis } from '../components/DashboardKpis';
import { DashboardChart } from '../components/DashboardChart';
import { DashboardAlerts } from '../components/DashboardAlerts';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import DashboardStream from '../components/DashboardStream';
import { DashboardMarket } from '../components/DashboardMarket';
import { DashboardHealth } from '../components/DashboardHealth';

export function DashboardPage() {
  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">
        {/* ── ROW 1: Platform-wide KPI Telemetry ── */}
        <DashboardKpis />

        {/* ── ROW 2: Liquidity Flow + Alerts Command Center ── */}
        <section className="grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-8">
            <DashboardChart />
          </div>
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
            <DashboardAlerts />
            <DashboardQuickActions />
          </div>
        </section>

        {/* ── ROW 3: Active Ledgers + Health Topologies ── */}
        <section className="grid grid-cols-12 gap-5 items-start">
          <div className="col-span-12 xl:col-span-8">
            <DashboardStream />
          </div>
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
            <DashboardMarket />
            <DashboardHealth />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
