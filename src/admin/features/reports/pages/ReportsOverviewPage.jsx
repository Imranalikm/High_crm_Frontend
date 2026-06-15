import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionHead } from '@/components/ui/SectionHead';
import { KpiCard } from '@/components/cards';
import { IconBtn, FORMAT_ICONS, FORMAT_CLR, TYPE_CLR, StatusBadge } from '../components/ReportsComponents';
import { ActivityBarChart, DeliveryAreaChart, TypePieChart } from '../components/ReportsCharts';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { useDrawerState } from '@/hooks/useDrawerState';
import { PageShell } from '@/components/layout/PageShell';
import {
  overviewKpis, reportActivity, reportTypeSplit, deliveryTrend, recentReports
} from '@/config/constants/reports/mockData';
import {
  CheckCircle2, Plus, AlarmClock, Download, RefreshCw,
  Layers, Send, Clock, BarChart2, PieChart, Zap, FileText,
  TrendingUp, ArrowRight, ChevronRight,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────
   LOCAL PRIMITIVES
───────────────────────────────────────────────────────── */

/** Compact glass panel */
function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-[10px] border border-border/28 bg-surface-elevated overflow-hidden transition-all duration-200 hover:border-border/40 ${className}`}>
      {children}
    </div>
  );
}

/** Panel header strip — icon · title · optional right slot */
function PanelHead({ icon, title, sub, right }) {
  const IconComponent = icon;
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/12">
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-[6px] bg-brand/10 flex items-center justify-center shrink-0">
          <IconComponent size={10} className="text-brand" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">
            {title}
          </p>
          {sub && (
            <p className="text-[11px] text-text-muted/50 mt-0.5 leading-none">{sub}</p>
          )}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/** Primary CTA button */
function PrimaryBtn({ icon: Icon, label, onClick, variant = 'brand' }) {
  const map = {
    brand: 'bg-brand border-brand/35 text-text-on-accent hover:bg-brand-hover',
    ghost: 'bg-bg/25 border-border/22 text-text-muted/65 hover:text-text hover:border-border/40 hover:bg-bg/40',
    success: 'bg-positive/10 border-positive/22 text-positive hover:bg-positive/18',
    warning: 'bg-warning/10 border-warning/22 text-warning hover:bg-warning/18',
    cyan: 'bg-cyan/10 border-cyan/22 text-cyan hover:bg-cyan/18',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 h-8 px-3.5 rounded-[7px] border text-[11px] font-bold uppercase tracking-wider active:scale-[0.97] transition-all cursor-pointer ${map[variant]}`}
    >
      {Icon && <Icon size={12} className="shrink-0" />}
      {label}
    </button>
  );
}

/** Recent report row */
function ReportRow({ r, onOpen }) {
  const FmtIc = FORMAT_ICONS[r.format] || FileText;
  const fmtC = FORMAT_CLR[r.format] || 'var(--text-muted)';
  const typeC = TYPE_CLR[r.type] || 'rgba(255,255,255,0.3)';

  return (
    <div
      onClick={() => onOpen(r)}
      className="group flex items-center gap-3 px-4 py-3 border-b border-border/8 last:border-0 hover:bg-bg/8 transition-colors cursor-pointer"
    >
      {/* Format icon */}
      <div
        className="w-8 h-8 rounded-[8px] flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105"
        style={{
          background: `color-mix(in srgb, ${fmtC} 10%, transparent)`,
          borderColor: `color-mix(in srgb, ${fmtC} 18%, transparent)`,
        }}
      >
        <FmtIc size={13} style={{ color: fmtC }} />
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-bold text-text/82 truncate group-hover:text-text transition-colors">
          {r.name}
        </p>
        <p className="text-[11px] font-mono text-text-muted/60 mt-0.5 truncate">
          {r.id} · {r.generatedAt}
        </p>
      </div>

      {/* Status + type */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge value={r.status} />
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em]"
          style={{ color: typeC }}
        >
          {r.type}
        </span>
      </div>

      <ChevronRight size={11} className="text-text-muted/20 group-hover:text-text-muted/50 transition-colors shrink-0 ml-1" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */

export function ReportsOverviewPage() {
  const [toast, setToast] = useState(null);
  const drawerRowState = useDrawerState(null);

  const act = (action, label = '') => {
    const msgs = {
      'Generate Report': 'Generating report...',
      'Schedule Export': 'Export schedule saved.',
      'Download All Ready': 'Downloading all ready reports.',
      'Retry Failed Jobs': 'Retrying 2 failed reports.',
      'Manage Templates': 'Opening templates...',
      'Export Center': 'Opening export schedules...',
      'Downloaded': `Downloaded: ${label}`,
      'Retried': `Report retried: ${label}`,
      'Deleted': `Report archived: ${label}`,
      'Link copied': `Link copied: ${label}`,
    };
    setToast(msgs[action] ?? `${action} initiated`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── TOAST ── */}
        {toast && (
          <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 rounded-[12px] border border-positive/28 bg-surface/88 backdrop-blur-md px-4 py-3 text-[12px] font-semibold text-positive font-heading shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={13} className="text-positive shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* ─────────────────────────────────────────────────
            HEADER — title, subtitle, primary CTAs
        ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title block */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              Reports Module
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
              Reports Overview
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
              A quick look at report activity, delivery stats, and recent reports.
            </p>
          </div>

          {/* Action button cluster */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <PrimaryBtn
              icon={Plus}
              label="New Report"
              variant="brand"
              onClick={() => act('Generate Report')}
            />
            <PrimaryBtn
              icon={AlarmClock}
              label="Schedule"
              variant="cyan"
              onClick={() => act('Schedule Export')}
            />
            <PrimaryBtn
              icon={Download}
              label="Download All"
              variant="success"
              onClick={() => act('Download All Ready')}
            />
            <PrimaryBtn
              icon={RefreshCw}
              label="Retry Failed"
              variant="warning"
              onClick={() => act('Retry Failed Jobs')}
            />
            <PrimaryBtn
              icon={Layers}
              label="Templates"
              variant="ghost"
              onClick={() => act('Manage Templates')}
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────
            KPI STRIP — 6 metric cards
        ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {overviewKpis.map(k => (
            <KpiCard
              key={k.label}
              label={k.label}
              value={k.value}
              Icon={k.Icon}
              accent={k.color}
              trend={k.trend}
              sub={k.sub}
              trendUp={
                k.trend?.startsWith('+') ? true :
                  k.trend?.startsWith('-') ? false :
                    undefined
              }
            />
          ))}
        </div>

        {/* ─────────────────────────────────────────────────
            CHARTS ROW — Activity (wide) + Type split
        ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">

          {/* Activity bar chart */}
          <Panel>
            <PanelHead
              icon={BarChart2}
              title="Report Activity"
              sub="Today — by hour"
              right={
                <div className="flex items-center gap-3">
                  {[
                    ['Generated', 'var(--brand)'],
                    ['Failed', 'var(--negative)'],
                  ].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/70">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      {l}
                    </div>
                  ))}
                </div>
              }
            />
            <div className="px-5 pt-4 pb-5">
              <ActivityBarChart data={reportActivity} />
            </div>
          </Panel>

          {/* Type donut */}
          <Panel>
            <PanelHead
              icon={PieChart}
              title="Reports by Type"
              sub="Breakdown by category"
            />
            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center gap-4">
                <TypePieChart data={reportTypeSplit} />
                <div className="flex flex-col gap-0 flex-1 min-w-0">
                  {reportTypeSplit.map(t => (
                    <div
                      key={t.name}
                      className="flex items-center gap-2 py-2 border-b border-border/8 last:border-0"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: t.color }}
                      />
                      <span className="text-[11px] font-semibold text-text-muted/75 truncate flex-1">
                        {t.name}
                      </span>
                      <span
                        className="text-[11.5px] font-mono font-bold shrink-0"
                        style={{ color: t.color }}
                      >
                        {t.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* ─────────────────────────────────────────────────
            LOWER ROW — Delivery trend + Recent reports
        ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">

          {/* Delivery success trend */}
          <Panel className="flex flex-col h-full">
            <PanelHead
              icon={TrendingUp}
              title="Delivery Trend"
              sub="Last 7 days"
              right={
                <div className="flex items-center gap-3">
                  {[
                    ['Delivered', 'var(--positive)'],
                    ['Failed', 'var(--negative)'],
                  ].map(([l, c]) => (
                    <div key={l} className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted/70">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
                      {l}
                    </div>
                  ))}
                </div>
              }
            />
            <div className="flex-1 pt-4 px-0 pb-0">
              <DeliveryAreaChart data={deliveryTrend} />
            </div>
          </Panel>

          {/* Recent reports */}
          <Panel className="flex flex-col">
            <PanelHead
              icon={Clock}
              title="Recent Reports"
              sub="Latest 5"
              right={
                <button
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand hover:text-brand-hover transition-colors cursor-pointer"
                  onClick={() => act('Export Center')}
                >
                  View All
                  <ArrowRight size={11} />
                </button>
              }
            />

            {/* Report rows */}
            <div className="flex-1">
              {recentReports.map(r => (
                <ReportRow
                  key={r.id}
                  r={r}
                  onOpen={row => drawerRowState.open(row)}
                />
              ))}
            </div>

            {/* Footer action strip */}
            <div className="border-t border-border/10 px-4 py-3 flex items-center justify-between bg-bg/5">
              <span className="text-[11px] font-semibold text-text-muted/60">
                {recentReports.length} reports shown
              </span>
              <button
                onClick={() => act('Export Center')}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand hover:text-brand-hover transition-colors cursor-pointer"
              >
                <Send size={11} />
                Export Center
              </button>
            </div>
          </Panel>
        </div>

        {/* ── DRAWER ── */}
        <ReportDetailDrawer
          open={drawerRowState.isOpen}
          row={drawerRowState.value}
          onClose={() => drawerRowState.close()}
          onAction={act}
        />
      </div>
    </PageShell>
  );
}