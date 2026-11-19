import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { ClientKpis } from '../components/ClientKpis';
import { LatestDepositsWidget } from '../components/LatestDepositsWidget';
import { LatestWithdrawalsWidget } from '../components/LatestWithdrawalsWidget';
import { NotificationsWidget } from '../components/NotificationsWidget';
import { WalletWidget } from '../components/WalletWidget';

export function ClientDashboardPage() {
  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">
        {/* ── ROW 1: Welcome Banner ── */}
        <WelcomeBanner />

        {/* ── ROW 2: Trading KPIs ── */}
        <ClientKpis />

        {/* ── ROW 3: Wallet, Deposits, Notifications & Withdrawals ── */}
        <section className="grid grid-cols-12 gap-5 items-start">
          {/* Wallet: CRM wallet + live MT5 balance */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[400px]">
            <WalletWidget />
          </div>

          {/* Latest Deposits */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[400px]">
            <LatestDepositsWidget />
          </div>

          {/* Notifications Feed */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[400px]">
            <NotificationsWidget />
          </div>

          {/* Latest Withdrawals */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 h-[400px]">
            <LatestWithdrawalsWidget />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default ClientDashboardPage;
