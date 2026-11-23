import React, { useEffect, useMemo, useState } from 'react';
import { Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Toggle, WarnBanner } from '../components/SettingsForm';
import { PaymentMethodDrawer } from '../components/PaymentMethodDrawer';
import { PaymentAccountCard, AddAccountTile } from '../components/PaymentAccountCard';
import { SortableGrid } from '../components/SortableGrid';
import { TYPE_META, TYPE_ORDER, tint } from '../configs/paymentMethods.config';
import { paymentMethodsService } from '../services/paymentMethodsService';
import { getUploadUrl } from '@/shared/utils/uploadUrl';

const LANES = [
  { region: 'IN', title: 'Clients in India' },
  { region: 'INTL', title: 'Clients outside India' },
];

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/* ── What clients see: per region, which payment types are offered right now ── */
function CoveragePanel({ settings, byType, onPick }) {
  const visible = (type, region) =>
    byType[type].filter((m) => m.enabled && (type !== 'bank' || m.region === region));

  return (
    <section
      aria-label="What clients see"
      className="rounded-[14px] border bg-surface-elevated"
      style={{ borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }}
    >
      <div className="px-5 pt-4 pb-1">
        <h2 className="text-[14px] font-semibold text-text font-heading">What clients see on the deposit page</h2>
        <p className="mt-0.5 text-[12px] text-text-muted/60 font-heading">
          Updates as you switch accounts on or off. Bank accounts depend on the client's location; UPI and USDT are shown to everyone.
        </p>
      </div>
      <div className="divide-y divide-border/40">
        {LANES.map(({ region, title }) => (
          <div key={region} className="flex flex-col gap-2.5 px-5 py-3.5 sm:flex-row sm:items-center">
            <p className="w-[150px] shrink-0 text-[12.5px] font-medium text-text-muted font-heading">{title}</p>
            <div className="flex flex-wrap gap-2">
              {TYPE_ORDER.map((type) => {
                const meta = TYPE_META[type];
                const Icon = meta.Icon;
                const list = visible(type, region);
                const off = !settings[type];
                const gap = !off && list.length === 0;
                const color = off ? 'var(--text-muted)' : gap ? 'var(--warning)' : meta.color;
                const text = off
                  ? `${meta.tab} is off`
                  : gap
                    ? `No ${meta.noun}`
                    : list.length === 1
                      ? list[0].label
                      : plural(list.length, meta.noun);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onPick(type)}
                    title={off ? `Turn on ${meta.tab}` : gap ? `Add or switch on a ${meta.noun}` : `View ${meta.tab}`}
                    className={`flex max-w-[260px] cursor-pointer items-center gap-2 rounded-[8px] border px-2.5 py-1.5 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 ${
                      off ? 'border-dashed opacity-60 hover:opacity-90' : 'hover:brightness-110'
                    }`}
                    style={{
                      borderColor: tint(color, off ? 35 : 28),
                      background: off ? 'transparent' : tint(color, 8),
                    }}
                  >
                    {gap ? <AlertTriangle size={13} style={{ color }} /> : <Icon size={13} style={{ color }} />}
                    <span className="truncate text-[12px] font-medium font-heading" style={{ color: off ? 'var(--text-muted)' : 'var(--text)' }}>
                      {text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Type tabs ── */
function TypeTabs({ active, onChange, settings, byType }) {
  return (
    <div role="tablist" aria-label="Payment type" className="grid grid-cols-3 gap-2">
      {TYPE_ORDER.map((type) => {
        const meta = TYPE_META[type];
        const Icon = meta.Icon;
        const selected = active === type;
        const total = byType[type].length;
        const shown = byType[type].filter((m) => m.enabled).length;
        return (
          <button
            key={type}
            role="tab"
            id={`pm-tab-${type}`}
            aria-selected={selected}
            aria-controls={`pm-panel-${type}`}
            type="button"
            onClick={() => onChange(type)}
            className="flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60"
            style={{
              borderColor: selected ? tint(meta.color, 45) : 'color-mix(in srgb, var(--border) 55%, transparent)',
              background: selected ? tint(meta.color, 7) : 'transparent',
            }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: tint(meta.color, selected ? 16 : 9), color: meta.color }}
            >
              <Icon size={15} />
            </span>
            <span className="min-w-0">
              <span className={`block truncate text-[13px] font-semibold font-heading ${selected ? 'text-text' : 'text-text-muted'}`}>{meta.tab}</span>
              <span className="block truncate text-[11px] text-text-muted/55 font-heading">
                {!settings[type] ? 'Off for clients' : total === 0 ? 'No accounts yet' : `${shown} of ${total} shown`}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * PaymentMethodsPage — company accounts clients pay into (bank, UPI, USDT).
 * Each type has a master switch and any number of accounts with their own switch and order.
 */
export function PaymentMethodsPage() {
  const [settings, setSettings] = useState({ bank: true, upi: true, usdt: true });
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { id, text }
  const [busyId, setBusyId] = useState(null);
  const [tab, setTab] = useState('bank');
  const [drawer, setDrawer] = useState({ open: false, session: 0, type: 'bank', region: 'IN', method: null });

  useEffect(() => {
    paymentMethodsService.list()
      .then((data) => {
        setSettings(data.settings);
        setMethods(data.methods || []);
      })
      .catch((err) => setError(err.message || 'Failed to load payment methods.'))
      .finally(() => setLoading(false));
  }, []);

  // Confirmation toast clears itself
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const byType = useMemo(() => {
    const groups = { bank: [], upi: [], usdt: [] };
    [...methods]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id)
      .forEach((m) => groups[m.type]?.push(m));
    return groups;
  }, [methods]);

  const flash = (text) => {
    setError('');
    setToast({ id: Date.now(), text });
  };
  const fail = (err, fallback) => setError(err.message || fallback);

  const replaceMethod = (updated) => setMethods((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  // Optimistically apply the new order, then save; restore the old order if saving fails
  const handleReorder = async (ids) => {
    const previous = methods;
    const position = new Map(ids.map((id, i) => [id, i + 1]));
    setMethods((prev) => prev.map((m) => (position.has(m.id) ? { ...m, sortOrder: position.get(m.id) } : m)));
    try {
      await paymentMethodsService.reorder(ids);
      flash('Order saved. Clients see accounts in this order.');
    } catch (err) {
      setMethods(previous);
      fail(err, 'Failed to save the new order.');
    }
  };

  const handleTypeToggle = async (type, value) => {
    const previous = settings;
    setSettings((s) => ({ ...s, [type]: value }));
    try {
      const data = await paymentMethodsService.updateTypeSettings({ [type]: value });
      if (data) setSettings(data);
      flash(value ? `${TYPE_META[type].tab} is now offered to clients.` : `${TYPE_META[type].tab} is hidden from clients.`);
    } catch (err) {
      setSettings(previous);
      fail(err, 'Failed to update setting.');
    }
  };

  const handleToggle = async (method, value) => {
    setBusyId(method.id);
    replaceMethod({ ...method, enabled: value });
    try {
      const updated = await paymentMethodsService.toggle(method.id, value);
      if (updated) replaceMethod(updated);
      flash(value ? `"${method.label}" is shown to clients.` : `"${method.label}" is hidden from clients.`);
    } catch (err) {
      replaceMethod(method);
      fail(err, 'Failed to update payment method.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (method) => {
    if (!window.confirm(`Delete "${method.label}"? Clients will no longer see this account.`)) return;
    setBusyId(method.id);
    try {
      await paymentMethodsService.remove(method.id);
      setMethods((prev) => prev.filter((m) => m.id !== method.id));
      flash(`"${method.label}" deleted.`);
    } catch (err) {
      fail(err, 'Failed to delete payment method.');
    } finally {
      setBusyId(null);
    }
  };

  const openAdd = (type, region) => setDrawer((d) => ({ open: true, session: d.session + 1, type, region: region || 'IN', method: null }));
  const openEdit = (method) => setDrawer((d) => ({ open: true, session: d.session + 1, type: method.type, region: method.region, method }));
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  const handleSubmit = async (payload) => {
    if (drawer.method) {
      const updated = await paymentMethodsService.update(drawer.method.id, payload);
      replaceMethod(updated);
      flash(`"${updated.label}" saved.`);
    } else {
      const created = await paymentMethodsService.create(payload);
      setMethods((prev) => [...prev, created]);
      flash(`"${created.label}" added.`);
    }
    closeDrawer();
  };

  const renderGrid = (list, type, addLabel, region) => (
    <SortableGrid
      className="grid grid-cols-1 gap-3 xl:grid-cols-2"
      items={list}
      onReorder={handleReorder}
      renderItem={(m, { handle, dragging }) => (
        <PaymentAccountCard
          method={m}
          qrUrl={m.qrImage ? getUploadUrl(m.qrImage) : null}
          handle={handle}
          dragging={dragging}
          busy={busyId === m.id}
          onToggle={(v) => handleToggle(m, v)}
          onEdit={() => openEdit(m)}
          onDelete={() => handleDelete(m)}
        />
      )}
      trailing={<AddAccountTile type={type} label={addLabel} onClick={() => openAdd(type, region)} />}
    />
  );

  const meta = TYPE_META[tab];
  const typeOn = settings[tab];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-text font-heading">Payment methods</h1>
          <p className="mt-1 max-w-[62ch] text-[13px] text-text-muted/65 font-heading">
            The company accounts clients pay into when they deposit. Drag cards to set the order clients see.
          </p>
        </div>
      </header>

      {error && <WarnBanner title="Something went wrong" message={error} severity="danger" />}

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <div className="h-[132px] animate-pulse rounded-[14px] bg-muted-surface/60" />
          <div className="h-[60px] animate-pulse rounded-[10px] bg-muted-surface/50" />
          <div className="h-[220px] animate-pulse rounded-[14px] bg-muted-surface/40" />
        </div>
      ) : (
        <>
          <CoveragePanel settings={settings} byType={byType} onPick={setTab} />

          <TypeTabs active={tab} onChange={setTab} settings={settings} byType={byType} />

          <section
            role="tabpanel"
            id={`pm-panel-${tab}`}
            aria-labelledby={`pm-tab-${tab}`}
            className="rounded-[14px] border bg-surface-elevated/40"
            style={{ borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }}
          >
            {/* Master switch */}
            <div
              className="flex flex-wrap items-center gap-3 border-b px-5 py-4"
              style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}
            >
              <Toggle val={typeOn} onChange={(v) => handleTypeToggle(tab, v)} />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-text font-heading">{meta.offer}</p>
                <p className="text-[12px] text-text-muted/60 font-heading">
                  {typeOn
                    ? 'Clients can choose it when they deposit. Each account below has its own switch too.'
                    : 'Hidden from every client, whatever the switches on the accounts say.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAdd(tab, 'IN')}
                className="flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-text-on-accent transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand/60 font-heading"
              >
                <Plus size={14} /> Add {meta.noun}
              </button>
            </div>

            <div className={`space-y-6 p-5 transition-opacity ${typeOn ? '' : 'opacity-60'}`}>
              {tab === 'bank' ? (
                [
                  { region: 'IN', title: 'India', hint: 'Shown to clients in India' },
                  { region: 'INTL', title: 'International', hint: 'Shown to everyone outside India' },
                ].map(({ region, title, hint }) => {
                  const list = byType.bank.filter((m) => m.region === region);
                  return (
                    <div key={region}>
                      <div className="mb-3 flex items-baseline gap-2">
                        <h3 className="text-[13.5px] font-semibold text-text font-heading">{title}</h3>
                        <span className="text-[12px] text-text-muted/55 font-heading">{hint}</span>
                      </div>
                      {renderGrid(list, 'bank', `Add ${title === 'India' ? 'an Indian' : 'an international'} bank account`, region)}
                    </div>
                  );
                })
              ) : (
                renderGrid(byType[tab], tab, `Add ${meta.noun === 'UPI ID' ? 'a UPI ID' : 'a USDT wallet'}`)
              )}
            </div>
          </section>
        </>
      )}

      {/* Confirmation toast */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 right-6 z-[150] flex max-w-[360px] items-center gap-2.5 rounded-[10px] border bg-surface-elevated px-4 py-3 text-[12.5px] text-text shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none font-heading"
          style={{ borderColor: tint('var(--positive)', 30) }}
        >
          <CheckCircle2 size={15} className="shrink-0 text-positive" />
          {toast.text}
        </div>
      )}

      <PaymentMethodDrawer
        open={drawer.open}
        session={drawer.session}
        onClose={closeDrawer}
        type={drawer.type}
        region={drawer.region}
        method={drawer.method}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default PaymentMethodsPage;
