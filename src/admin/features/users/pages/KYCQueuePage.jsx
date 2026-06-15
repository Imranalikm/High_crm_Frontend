import React, { useMemo, useState, useEffect } from 'react';
import { Download, FileCheck, Layers, Search, Users, Clock, Cpu, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageShell } from '@/components/layout/PageShell';
import { useTableState } from '@/hooks/useTableState';
import { exportRows } from '@/utils/exporters';
import { TableToolbar } from '@/components/common/table';
import { KYCTable } from '../components/KYCTable';
import { kycService } from '../services/kycService';
import { KYC_OPTIONS, RISK_OPTIONS } from "@/config/constants/USER_FORM";
import { UsersKPIGrid } from '../components/UsersKpiGrid';

const USER_NAV_TABS = [
  { id: 'list', label: 'Users', path: '/users', Icon: Users },
  { id: 'kyc', label: 'Verification', path: '/users/kyc', Icon: FileCheck },
  { id: 'mt5', label: 'MT5 Accounts', path: '/users/mt5', Icon: Layers },
];

const PAGE = {
  accent: 'var(--warning)',
  eyebrow: 'Verification',
  title: 'Verification Queue',
  description: 'Review submitted documents and verify user accounts.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

function KYCQueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchQueue = async () => {
      setLoading(true);
      try {
        const data = await kycService.list('all');
        if (active) {
          setKycList(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load verification queue');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchQueue();
    return () => {
      active = false;
    };
  }, []);

  // Load unique countries for dynamic triage filters
  const countries = useMemo(() => {
    const unique = [...new Set(kycList.map((item) => item.country))].filter(Boolean);
    return unique.sort();
  }, [kycList]);

  const filteredKyc = useMemo(
    () => {
      let rows = filterBySearch(kycList, search, ['id', 'user', 'country', 'status', 'risk', 'submittedAt']);
      if (kycFilter !== 'all') {
        rows = rows.filter((r) => r.status === kycFilter);
      }
      if (riskFilter !== 'all') {
        rows = rows.filter((r) => r.risk === riskFilter);
      }
      if (countryFilter !== 'all') {
        rows = rows.filter((r) => r.country === countryFilter);
      }
      return rows;
    },
    [kycList, search, kycFilter, riskFilter, countryFilter]
  );

  // Compute real-time KYC metrics for compliance officers
  const kpis = useMemo(() => {
    return [
      { label: 'Total Requests', value: kycList.length, subtext: 'submitted requests', trend: 'Global Registry', positive: true, Icon: Users, accent: 'var(--brand)' },
      { label: 'Pending Review', value: kycList.filter((k) => k.status === 'PENDING').length, subtext: 'waiting for review', trend: 'Action Required', positive: true, Icon: Clock, accent: 'var(--warning)', pulse: true },
      { label: 'Verified Users', value: kycList.filter((k) => k.status === 'VERIFIED').length, subtext: 'approved users', trend: 'Active traders', positive: true, Icon: FileCheck, accent: 'var(--positive)' },
      { label: 'Avg Review Time', value: '4.2 min', subtext: 'average review speed', trend: 'Fast Sync', positive: true, Icon: Cpu, accent: 'var(--cyan)' },
    ];
  }, [kycList]);

  const tableState = useTableState(filteredKyc, { searchFields: [], initialPageSize: 10 });

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-2">
          <span className="relative flex h-5.5 w-5.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-60" />
            <span className="relative inline-flex rounded-full h-5.5 w-5.5 bg-warning/80" />
          </span>
          <span className="text-[12px] font-bold text-text-muted mt-2 uppercase tracking-widest animate-pulse">Loading queue...</span>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
          <ShieldAlert size={36} className="text-negative animate-bounce" />
          <h2 className="text-lg font-black text-text">Failed to Load Verification Queue</h2>
          <p className="text-[12px] text-text-muted/65 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="h-8 px-4 text-[11px] rounded-[7px] border border-border/20 bg-muted-surface text-text font-bold cursor-pointer hover:bg-surface-bright transition-all"
          >
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-5">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text">
              {PAGE.title}
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(filteredKyc, `kyc-queue.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
          </div>
        </header>

        {/* ── Directory Sub-Navigation tabs ── */}
      

        {/* ── KYC KPI Scorecard Grid ── */}
        <UsersKPIGrid items={kpis} />

        {/* ── Table registry panel ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="Verification Queue"
            count={filteredKyc.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => { setSearch(val); tableState.setPage(1); }}
            searchPlaceholder="Search queue..."
            filters={
              <>
                {/* 1. Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Status:</span>
                  <select
                    value={kycFilter}
                    onChange={(e) => { setKycFilter(e.target.value); tableState.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {KYC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Risk Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Risk:</span>
                  <select
                    value={riskFilter}
                    onChange={(e) => { setRiskFilter(e.target.value); tableState.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {RISK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Dynamic Country Filter */}
                {countries.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Country:</span>
                    <select
                      value={countryFilter}
                      onChange={(e) => { setCountryFilter(e.target.value); tableState.setPage(1); }}
                      className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                      style={{ minWidth: '76px' }}
                    >
                      <option value="all">ALL</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            }
          />

          <KYCTable
            tableState={tableState}
            onReviewUser={(nextUserId, row) => navigate(`/admin/users/${nextUserId}/kyc?kycId=${row.id}`)}
          />
        </section>

      </div>
    </PageShell>
  );
}
export default KYCQueuePage;

