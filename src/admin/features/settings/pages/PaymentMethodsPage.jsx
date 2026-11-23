import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Zap, Coins, Plus, Pencil, Trash2, QrCode, GripVertical } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { Toggle, WarnBanner, Btn } from '../components/SettingsForm';
import { PaymentMethodDrawer } from '../components/PaymentMethodDrawer';
import { TYPE_NAMES, REGION_NAMES } from '../configs/paymentMethods.config';
import { paymentMethodsService } from '../services/paymentMethodsService';
import { getUploadUrl } from '@/shared/utils/uploadUrl';

const SECTIONS = [
  { type: 'bank', title: 'Bank Accounts', desc: 'India accounts are shown to clients in India, International accounts to everyone else.', Icon: Building2 },
  { type: 'upi', title: 'UPI', desc: 'UPI IDs with an optional QR code.', Icon: Zap },
  { type: 'usdt', title: 'USDT', desc: 'Crypto wallets with an optional QR code.', Icon: Coins },
];

const mask = (value) => (value && value.length > 4 ? `•••• ${value.slice(-4)}` : value || '');
const shortAddress = (value) => (value && value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value || '');

// One-line summary of an account for the list
function summarize(method) {
  const d = method.details || {};
  if (method.type === 'bank') {
    return [d.bankName, d.accountNumber ? mask(d.accountNumber) : d.iban ? `IBAN ${mask(d.iban)}` : null, d.currency]
      .filter(Boolean).join(' · ');
  }
  if (method.type === 'upi') return [d.upiId, d.payeeName].filter(Boolean).join(' · ');
  return [d.network, shortAddress(d.walletAddress)].filter(Boolean).join(' · ');
}

function MethodRow({ method, onToggle, onEdit, onDelete, busy, handle, dragging }) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-[8px] border bg-bg px-4 py-3 transition-opacity ${
        dragging ? 'border-brand/40 opacity-50' : 'border-border/20'
      }`}
    >
      {handle}
      {method.type !== 'bank' && (
        method.qrImage ? (
          <div className="shrink-0 rounded-[6px] bg-white p-0.5">
            <img src={getUploadUrl(method.qrImage)} alt="" className="h-9 w-9 object-contain" />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-dashed border-border/30 text-text-muted/25" title="No QR code">
            <QrCode size={14} />
          </div>
        )
      )}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13px] font-semibold font-heading ${method.enabled ? 'text-text' : 'text-text-muted/50'}`}>
          {method.label}
          {!method.enabled && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-text-muted/40">Hidden</span>}
        </p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-text-muted/50">{summarize(method)}</p>
      </div>
      <Toggle val={method.enabled} onChange={(v) => onToggle(method, v)} disabled={busy} />
      <button type="button" onClick={() => onEdit(method)} title="Edit" className="cursor-pointer rounded-[6px] p-2 text-text-muted/50 transition-colors hover:bg-muted-surface hover:text-text">
        <Pencil size={13} />
      </button>
      <button type="button" onClick={() => onDelete(method)} title="Delete" disabled={busy} className="cursor-pointer rounded-[6px] p-2 text-text-muted/50 transition-colors hover:bg-negative/10 hover:text-negative disabled:opacity-40">
        <Trash2 size={13} />
      </button>
    </div>
  );
}

const moveId = (ids, id, toIndex) => {
  const next = ids.filter((x) => x !== id);
  next.splice(toIndex, 0, id);
  return next;
};

/**
 * Drag-to-reorder list using native drag events. Dragging starts only from the grip handle,
 * so the toggle and buttons in each row keep working. The handle also supports ↑/↓ keys.
 * `onReorder(ids)` is called once with the final order when it changed.
 */
function SortableList({ items, onReorder, renderItem }) {
  const [armedId, setArmedId] = useState(null); // row whose handle is held down
  const [dragId, setDragId] = useState(null);
  const [preview, setPreview] = useState(null); // ids in their in-progress order

  // Disarm if the handle is pressed and released anywhere without dragging
  useEffect(() => {
    if (armedId === null || dragId !== null) return undefined;
    const disarm = () => setArmedId(null);
    window.addEventListener('mouseup', disarm);
    return () => window.removeEventListener('mouseup', disarm);
  }, [armedId, dragId]);

  const ids = items.map((i) => i.id);
  const order = preview || ids;
  const byId = new Map(items.map((i) => [i.id, i]));
  const canSort = items.length > 1;

  const reset = () => {
    setArmedId(null);
    setDragId(null);
    setPreview(null);
  };

  const commit = (next) => {
    if (next.some((id, i) => id !== ids[i])) onReorder(next);
  };

  const allowDrop = (e) => {
    if (dragId === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleKey = (e, id) => {
    const index = ids.indexOf(id);
    const target = e.key === 'ArrowUp' ? index - 1 : e.key === 'ArrowDown' ? index + 1 : null;
    if (target === null) return;
    e.preventDefault();
    if (target >= 0 && target < ids.length) commit(moveId(ids, id, target));
  };

  return (
    <div className="space-y-2" onDragOver={allowDrop} onDrop={(e) => e.preventDefault()}>
      {order.map((id) => {
        const item = byId.get(id);
        if (!item) return null;
        const handle = canSort ? (
          <button
            type="button"
            title="Drag to reorder (or use ↑ ↓ keys)"
            aria-label={`Reorder ${item.label}`}
            onMouseDown={() => setArmedId(id)}
            onMouseUp={() => setArmedId(null)}
            onKeyDown={(e) => handleKey(e, id)}
            className="-ml-1.5 shrink-0 cursor-grab rounded-[4px] p-1 text-text-muted/30 transition-colors hover:text-text-muted/70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/50 active:cursor-grabbing"
          >
            <GripVertical size={14} />
          </button>
        ) : null;

        return (
          <div
            key={id}
            draggable={armedId === id}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(id));
              setDragId(id);
              setPreview(ids);
            }}
            onDragOver={(e) => {
              allowDrop(e);
              if (dragId === null || id === dragId) return;
              setPreview((p) => moveId(p || ids, dragId, (p || ids).indexOf(id)));
            }}
            onDragEnd={(e) => {
              // dropEffect 'none' = cancelled (Esc or dropped outside the list) → keep the old order
              if (e.dataTransfer.dropEffect !== 'none' && preview) commit(preview);
              reset();
            }}
          >
            {renderItem(item, { handle, dragging: dragId === id })}
          </div>
        );
      })}
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="rounded-[8px] border border-dashed border-border/25 px-4 py-4 text-center text-[11.5px] text-text-muted/40 font-heading">
      {text}
    </div>
  );
}

/**
 * PaymentMethodsPage — company accounts clients pay into (bank, UPI, USDT).
 * Each type has a master switch and any number of accounts with their own switch.
 */
export function PaymentMethodsPage() {
  const [settings, setSettings] = useState({ bank: true, upi: true, usdt: true });
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [drawer, setDrawer] = useState({ open: false, session: 0, type: 'bank', region: 'IN', method: null });

  const load = () =>
    paymentMethodsService.list().then((data) => {
      setSettings(data.settings);
      setMethods(data.methods || []);
    });

  useEffect(() => {
    load()
      .catch((err) => setError(err.message || 'Failed to load payment methods.'))
      .finally(() => setLoading(false));
  }, []);

  const byType = useMemo(() => {
    const groups = { bank: [], upi: [], usdt: [] };
    [...methods]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id)
      .forEach((m) => groups[m.type]?.push(m));
    return groups;
  }, [methods]);

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

  const flash = (message) => {
    setError('');
    setNotice(message);
  };
  const fail = (err, fallback) => {
    setNotice('');
    setError(err.message || fallback);
  };

  const replaceMethod = (updated) => setMethods((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  const handleTypeToggle = async (type, value) => {
    const previous = settings;
    setSettings((s) => ({ ...s, [type]: value }));
    try {
      const data = await paymentMethodsService.updateTypeSettings({ [type]: value });
      if (data) setSettings(data);
      flash(`${TYPE_NAMES[type]} payments ${value ? 'enabled' : 'disabled'} for clients.`);
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
      flash(`"${updated.label}" updated.`);
    } else {
      const created = await paymentMethodsService.create(payload);
      setMethods((prev) => [...prev, created]);
      flash(`"${created.label}" added.`);
    }
    closeDrawer();
  };

  const renderRows = (list, emptyText) =>
    list.length === 0 ? (
      <EmptyRow text={emptyText} />
    ) : (
      <SortableList
        items={list}
        onReorder={handleReorder}
        renderItem={(m, { handle, dragging }) => (
          <MethodRow
            method={m}
            onToggle={handleToggle}
            onEdit={openEdit}
            onDelete={handleDelete}
            busy={busyId === m.id}
            handle={handle}
            dragging={dragging}
          />
        )}
      />
    );

  const renderBody = (type) => {
    if (type !== 'bank') return renderRows(byType[type], `No ${TYPE_NAMES[type]} added yet.`);

    return (
      <div className="space-y-5">
        {['IN', 'INTL'].map((region) => (
          <div key={region}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
                {REGION_NAMES[region]}
                <span className="ml-2 font-semibold normal-case tracking-normal text-text-muted/35">
                  {region === 'IN' ? 'clients in India' : 'everyone outside India'}
                </span>
              </p>
              <Btn small Icon={Plus} label="Add" onClick={() => openAdd('bank', region)} />
            </div>
            {renderRows(
              byType.bank.filter((m) => m.region === region),
              `No ${REGION_NAMES[region]} bank accounts. Clients ${region === 'IN' ? 'in India' : 'outside India'} won't see bank transfer.`
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="Payment Methods"
        desc="Company accounts clients pay into from the deposit page."
      />

      {error && <WarnBanner title="Error" message={error} severity="danger" />}
      {notice && <WarnBanner title="Saved" message={notice} severity="info" />}

      {loading ? (
        <p className="text-[12px] text-text-muted/60 font-heading">Loading payment methods…</p>
      ) : (
        SECTIONS.map(({ type, title, desc, Icon }) => {
          const activeCount = byType[type].filter((m) => m.enabled).length;
          return (
            <SettingsCard
              key={type}
              title={title}
              desc={desc}
              Icon={Icon}
              action={(
                <>
                  <span className="text-[11px] text-text-muted/50 font-heading">{settings[type] ? 'On' : 'Off'}</span>
                  <Toggle val={settings[type]} onChange={(v) => handleTypeToggle(type, v)} />
                  {type !== 'bank' && <Btn small Icon={Plus} label="Add" variant="brand" onClick={() => openAdd(type)} />}
                </>
              )}
            >
              {!settings[type] && (
                <div className="mb-4">
                  <WarnBanner title={`${title} hidden from clients`} message="Turn the switch on to offer this payment type on the deposit page." />
                </div>
              )}
              {settings[type] && activeCount === 0 && byType[type].length > 0 && (
                <div className="mb-4">
                  <WarnBanner title="No active accounts" message="Every account here is switched off, so clients won't see this payment type." />
                </div>
              )}
              {renderBody(type)}
            </SettingsCard>
          );
        })
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
