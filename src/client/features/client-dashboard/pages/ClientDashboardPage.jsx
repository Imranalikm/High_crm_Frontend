import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { ClientKpis } from '../components/ClientKpis';
import { PortfolioChart } from '../components/PortfolioChart';
import { OpenPositionsWidget } from '../components/OpenPositionsWidget';
import { WatchlistWidget } from '../components/WatchlistWidget';
import { CopyTradingWidget } from '../components/CopyTradingWidget';
import { WalletWidget } from '../components/WalletWidget';
import { NotificationsWidget } from '../components/NotificationsWidget';

export function ClientDashboardPage() {
  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">
        {/* ── ROW 1: Welcome Banner ── */}
        <WelcomeBanner />

        {/* ── ROW 2: Trading KPIs ── */}
        <ClientKpis />

        {/* ── ROW 3: Main Performance Chart & Feed alerts ── */}
        <section className="grid grid-cols-12 gap-5 items-start">
          {/* Main Chart Focal Point */}
          <div className="col-span-12 xl:col-span-8 h-[520px]">
            <PortfolioChart />
          </div>

          {/* Right sidebar: Notifications + Watchlist */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-5 h-[520px]">
            <div className="h-[270px]">
              <NotificationsWidget />
            </div>
            <div className="h-[230px]">
              <WatchlistWidget />
            </div>
          </div>
        </section>

        {/* ── ROW 4: Trading Positions, Copy Strategies & Wallets ── */}
        <section className="grid grid-cols-12 gap-5 items-start">
          {/* Open Positions */}
          <div className="col-span-12 lg:col-span-4 h-[380px]">
            <OpenPositionsWidget />
          </div>

          {/* Copy Trading */}
          <div className="col-span-12 lg:col-span-4 h-[380px]">
            <CopyTradingWidget />
          </div>

          {/* Wallet Balance & History */}
          <div className="col-span-12 lg:col-span-4 h-[380px]">
            <WalletWidget />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default ClientDashboardPage;
