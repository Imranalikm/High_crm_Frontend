import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, PlugZap, ArrowRightLeft, CheckCircle2, Server } from 'lucide-react';
import { WarnBanner } from '../components/SettingsForm';
import { Mt5ServerDrawer } from '../components/Mt5ServerDrawer';
import { ConnectionPath } from '../components/ConnectionPath';
import { Mt5AlertsPanel } from '../components/Mt5AlertsPanel';
import { hostOf } from '../configs/mt5Servers.config';
import { mt5ServersService } from '../services/mt5ServersService';
import { ConfirmDialog } from '@/components/overlays/ConfirmDialog';
import { useAuth } from '@/shared/features/auth/AuthContext';
import { useLiveMt5Accounts } from '@/shared/hooks/useLiveMt5Accounts';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const fmtTime = (d) => new Date(d).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const ACTION_VERBS = {
  created: 'added',
  updated: 'edited',
  activated: 'switched to',
  deactivated: 'switched away from',
  tested: 'tested',
  deleted: 'deleted',
  connection_lost: 'lost the connection to',
  connection_restored: 'reconnected to',
  alerts_updated: 'changed the failure alerts',
};
const ACTION_COLORS = {
  activated: 'var(--positive)',
  deactivated: 'var(--warning)',
  deleted: 'var(--negative)',
  tested: 'var(--cyan)',
  connection_lost: 'var(--negative)',
  connection_restored: 'var(--positive)',
};
const COMPONENT_NAMES = { api: 'Gateway API login', manager: 'MT5 manager login' };
const minutes = (ms) => {
  const m = Math.round(ms / 60000);
  if (m < 1) return 'under a minute';
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
};

const FIELD_NAMES = {
  label: 'name', baseUrl: 'API URL', apiUsername: 'API username', apiPassword: 'API password',
  managerId: 'manager ID', managerPassword: 'manager password', serverIp: 'server address',
  serverName: 'server name', wsUrl: 'live feed URL', notes: 'notes',
};

function logDetail(log) {
  const d = log.details || {};
  if (log.action === 'updated' && d.changed) return `Changed ${d.changed.map((k) => FIELD_NAMES[k] || k).join(', ')}.`;
  if (log.action === 'tested') return `${d.ok ? 'Connection worked' : d.tokenOk ? 'Manager login failed' : 'Gateway login failed'}${d.beforeActivation ? ' before switching' : ''}${d.ms ? ` (${d.ms} ms)` : ''}.`;
  if (log.action === 'activated') {
    if (d.source) return `Imported from ${d.source}.`;
    const parts = [];
    if (d.previous?.length) parts.push(`Replaced ${d.previous.join(', ')}.`);
    if (d.forced) parts.push('Switched without a passing test.');
    return parts.join(' ');
  }
  if (log.action === 'deactivated' && d.replacedBy) return `Replaced by ${d.replacedBy}.`;
  if (log.action === 'created' && d.source) return `Imported from ${d.source}.`;
  if (log.action === 'connection_lost') return `${COMPONENT_NAMES[d.component] || 'Login'} failed: ${d.error || 'unknown error'}`;
  if (log.action === 'connection_restored') return `${COMPONENT_NAMES[d.component] || 'Login'} working again after ${minutes(d.downForMs || 0)}.`;
  if (log.action === 'alerts_updated') return `Emails ${d.emailEnabled ? 'on' : 'off'}, ${d.emails ? `${d.emails} address${d.emails === 1 ? '' : 'es'}` : 'sent to every Super Admin'}.`;
  return '';
}

function dayLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const panelBorder = { borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' };

/* ── Active server: identity + connection map ── */
function ActiveServer({ server, activatedBy, test, testing, feedConnected, canEdit, onTest, onEdit }) {
  return (
    <section aria-label="Active server" className="overflow-hidden rounded-[14px] border bg-surface-elevated" style={panelBorder}>
      <div className="flex flex-wrap items-start gap-4 px-5 pt-5">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[12px] font-medium text-positive font-heading">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
            </span>
            Active server
          </p>
          <h2 className="mt-1.5 truncate text-[22px] font-semibold tracking-[-0.02em] text-text font-heading">{server.label}</h2>
          <p className="mt-1 text-[12.5px] text-text-muted/70 font-heading">
            Clients see the server name <span className="font-semibold text-text">{server.serverName}</span>.
            {' '}In use since {fmtDateTime(server.lastActivatedAt)}{activatedBy ? `, switched by ${activatedBy}` : ''}.
          </p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTest}
              disabled={testing}
              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] border px-3 py-2 text-[12.5px] font-semibold text-text transition-colors hover:bg-muted-surface focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 disabled:opacity-50 font-heading"
              style={panelBorder}
            >
              <PlugZap size={14} style={{ color: 'var(--cyan)' }} /> {testing ? 'Testing…' : 'Test connection'}
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] px-3 py-2 text-[12.5px] font-medium text-text-muted transition-colors hover:bg-muted-surface hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 font-heading"
            >
              <Pencil size={13} /> Edit
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 border-t px-5 py-5" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
        <ConnectionPath server={server} result={test} testing={testing} feedConnected={feedConnected} />
        {test && !testing && (
          <p className="mt-4 text-[12px] font-heading" style={{ color: test.ok ? 'var(--positive)' : 'var(--negative)' }}>
            {test.message} <span className="text-text-muted/50">({test.ms} ms)</span>
          </p>
        )}
        {server.notes && <p className="mt-4 max-w-[70ch] text-[12px] text-text-muted/60 font-heading">{server.notes}</p>}
      </div>
    </section>
  );
}

/* ── One row in "Other servers" ── */
function ServerRow({ server, test, busy, canEdit, onTest, onSwitch, onEdit, onDelete }) {
  const used = Boolean(server.lastActivatedAt);
  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="min-w-[220px] flex-1">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: used ? 'var(--warning)' : 'color-mix(in srgb, var(--text-muted) 40%, transparent)' }}
            />
            <p className="truncate text-[13.5px] font-semibold text-text font-heading">{server.label}</p>
          </div>
          <p className="mt-0.5 pl-4 text-[12px] text-text-muted/60 font-heading">
            {used
              ? `Used ${fmtDate(server.lastActivatedAt)} to ${fmtDate(server.lastDeactivatedAt) || 'now'}`
              : 'Never used'}
            , shown to clients as {server.serverName}
          </p>
        </div>
        <div className="w-[200px] min-w-0">
          <p className="text-[11px] text-text-muted/50 font-heading">Gateway</p>
          <p className="truncate font-mono text-[12px] text-text/85" title={server.baseUrl}>{hostOf(server.baseUrl)}</p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onTest}
              disabled={busy === 'test'}
              className="flex cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12px] font-medium text-text-muted transition-colors hover:bg-muted-surface hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 disabled:opacity-50 font-heading"
            >
              <PlugZap size={13} /> {busy === 'test' ? 'Testing…' : 'Test'}
            </button>
            <button
              type="button"
              onClick={onSwitch}
              className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border px-2.5 py-1.5 text-[12px] font-semibold text-positive transition-colors hover:bg-positive/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-positive/60 font-heading"
              style={{ borderColor: 'color-mix(in srgb, var(--positive) 35%, transparent)' }}
            >
              <ArrowRightLeft size={13} /> Switch to this server
            </button>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${server.label}`}
              className="cursor-pointer rounded-[7px] p-2 text-text-muted/60 transition-colors hover:bg-muted-surface hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60"
            >
              <Pencil size={13} />
            </button>
            {!used && (
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete ${server.label}`}
                className="cursor-pointer rounded-[7px] p-2 text-text-muted/60 transition-colors hover:bg-negative/10 hover:text-negative focus-visible:outline focus-visible:outline-1 focus-visible:outline-negative/60"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>
      {(test || busy === 'test') && (
        <div className="mt-4 rounded-[10px] border px-4 py-3.5" style={{ borderColor: 'color-mix(in srgb, var(--border) 45%, transparent)' }}>
          <ConnectionPath server={server} result={test} testing={busy === 'test'} showFeed={false} />
          {test && busy !== 'test' && (
            <p className="mt-3 text-[12px] font-heading" style={{ color: test.ok ? 'var(--positive)' : 'var(--negative)' }}>{test.message}</p>
          )}
        </div>
      )}
    </li>
  );
}

/* ── History timeline, grouped by day ── */
function HistoryTimeline({ logs }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? logs : logs.slice(0, 20);
  const groups = useMemo(() => {
    const out = [];
    visible.forEach((log) => {
      const label = dayLabel(log.createdAt);
      if (!out.length || out[out.length - 1].label !== label) out.push({ label, items: [] });
      out[out.length - 1].items.push(log);
    });
    return out;
  }, [visible]);

  if (logs.length === 0) return <p className="px-5 pb-5 text-[12.5px] text-text-muted/55 font-heading">Nothing has changed yet.</p>;

  return (
    <div className="px-5 pb-5">
      {groups.map((group) => (
        <div key={group.label} className="mt-4 first:mt-1">
          <h3 className="mb-2 text-[12px] font-semibold text-text-muted font-heading">{group.label}</h3>
          <ol className="relative ml-[5px] border-l" style={{ borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)' }}>
            {group.items.map((log) => {
              const color = ACTION_COLORS[log.action] || 'var(--text-muted)';
              const detail = logDetail(log);
              return (
                <li key={log.id} className="relative pb-3 pl-5 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-[6px] h-[9px] w-[9px] rounded-full border-2 bg-surface-elevated"
                    style={{ borderColor: color }}
                  />
                  <p className="text-[12.5px] text-text/90 font-heading">
                    <span className="font-semibold text-text">{log.userName || 'System'}</span>
                    {' '}{ACTION_VERBS[log.action] || log.action}
                    {log.action !== 'alerts_updated' && <>{' '}<span className="font-semibold text-text">{log.serverLabel || 'a server'}</span></>}
                    <span className="ml-2 text-[11.5px] text-text-muted/50">{fmtTime(log.createdAt)}</span>
                  </p>
                  {detail && <p className="mt-0.5 text-[12px] text-text-muted/60 font-heading">{detail}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
      {logs.length > 20 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 cursor-pointer text-[12px] font-semibold text-brand hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 font-heading"
        >
          {showAll ? 'Show less' : `Show all ${logs.length} entries`}
        </button>
      )}
    </div>
  );
}

/**
 * Mt5ServersPage — MT5 gateway + manager connection profiles.
 * One is active; switching keeps the old one (and a full change log) as history.
 */
export function Mt5ServersPage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'super-admin';
  const { feedConnected } = useLiveMt5Accounts();

  const [servers, setServers] = useState([]);
  const [activeSource, setActiveSource] = useState('db');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState({}); // serverId -> 'test'
  const [tests, setTests] = useState({}); // serverId -> last test result
  const [drawer, setDrawer] = useState({ open: false, session: 0, server: null });
  const [confirm, setConfirm] = useState(null); // { kind: 'switch' | 'force' | 'delete', server, message? }
  const [confirmBusy, setConfirmBusy] = useState(false);

  const reload = async () => {
    const [list, history] = await Promise.all([mt5ServersService.list(), mt5ServersService.logs()]);
    setServers(list.servers || []);
    setActiveSource(list.activeSource);
    setLogs(history);
  };

  useEffect(() => {
    reload()
      .catch((err) => setError(err.message || 'Failed to load MT5 servers.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const flash = useCallback((text) => { setError(''); setToast({ id: Date.now(), text }); }, []);
  const fail = useCallback((err, fallback) => setError(err.message || fallback), []);

  const active = servers.find((s) => s.isActive);
  const others = servers.filter((s) => !s.isActive);
  const activatedBy = active && logs.find((l) => l.serverId === active.id && l.action === 'activated')?.userName;

  const openAdd = () => setDrawer((d) => ({ open: true, session: d.session + 1, server: null }));
  const openEdit = (server) => setDrawer((d) => ({ open: true, session: d.session + 1, server }));
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  const handleSubmit = async (payload) => {
    const { serverId, ...body } = payload;
    if (serverId) await mt5ServersService.update(serverId, body);
    else await mt5ServersService.create(body);
    closeDrawer();
    flash(serverId ? 'Server saved.' : 'Server added. Test it, then switch to it when you are ready.');
    await reload();
  };

  const handleTest = async (server) => {
    setBusy((b) => ({ ...b, [server.id]: 'test' }));
    try {
      const result = await mt5ServersService.test({ serverId: server.id });
      setTests((t) => ({ ...t, [server.id]: result }));
      setLogs(await mt5ServersService.logs());
    } catch (err) {
      fail(err, 'The test could not run.');
    } finally {
      setBusy((b) => ({ ...b, [server.id]: null }));
    }
  };

  const runSwitch = async (server, force) => {
    setConfirmBusy(true);
    try {
      const res = await mt5ServersService.activate(server.id, force);
      setConfirm(null);
      flash(res?.message || `Switched to ${server.label}.`);
      setTests({});
      await reload();
    } catch (err) {
      if (err.data?.code === 'TEST_FAILED') {
        setTests((t) => ({ ...t, [server.id]: err.data.data }));
        setConfirm({ kind: 'force', server, message: err.data.data?.message });
        setLogs(await mt5ServersService.logs());
      } else {
        setConfirm(null);
        fail(err, 'Could not switch servers.');
      }
    } finally {
      setConfirmBusy(false);
    }
  };

  const runDelete = async (server) => {
    setConfirmBusy(true);
    try {
      await mt5ServersService.remove(server.id);
      setConfirm(null);
      flash(`${server.label} deleted.`);
      await reload();
    } catch (err) {
      setConfirm(null);
      fail(err, 'Could not delete the server.');
    } finally {
      setConfirmBusy(false);
    }
  };

  const dialog = confirm && {
    switch: {
      title: `Switch to ${confirm.server.label}?`,
      description: `Deposits, withdrawals, balance operations, new accounts and the live feed will all go to ${hostOf(confirm.server.baseUrl)}, including existing client accounts. The connection is tested first; nothing changes if the test fails.`,
      confirmLabel: 'Test and switch',
      confirmVariant: 'primary',
      onConfirm: () => runSwitch(confirm.server, false),
    },
    force: {
      title: 'The connection test failed',
      description: `${confirm.message || 'The server did not respond as expected.'} You can still switch, but MT5 operations will fail until this server connects.`,
      confirmLabel: 'Switch anyway',
      confirmVariant: 'danger',
      onConfirm: () => runSwitch(confirm.server, true),
    },
    delete: {
      title: `Delete ${confirm.server.label}?`,
      description: 'This server has never been used, so no history is lost.',
      confirmLabel: 'Delete server',
      confirmVariant: 'danger',
      onConfirm: () => runDelete(confirm.server),
    },
  }[confirm.kind];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-text font-heading">MT5 servers</h1>
          <p className="mt-1 max-w-[64ch] text-[13px] text-text-muted/65 font-heading">
            The gateway and manager login every MT5 operation goes through. Servers you switch away from stay here as history.
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={openAdd}
            className="flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-text-on-accent transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand/60 font-heading"
          >
            <Plus size={14} /> Add server
          </button>
        )}
      </header>

      {error && <WarnBanner title="Something went wrong" message={error} severity="danger" />}
      {!canEdit && !loading && (
        <WarnBanner title="View only" message="Only a Super Admin can add, edit, test or switch MT5 servers." severity="info" />
      )}
      {activeSource === 'env' && !loading && (
        <WarnBanner title="Using the .env settings" message="No server is active, so MT5 calls use the EXTERNAL_API values in .env. Add a server and switch to it." />
      )}
      {activeSource === 'error' && !loading && (
        <WarnBanner severity="danger" title="The active server can't connect" message="Its saved passwords can't be read because the encryption key changed. Edit the server and enter both passwords again." />
      )}

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <div className="h-[230px] animate-pulse rounded-[14px] bg-muted-surface/60" />
          <div className="h-[120px] animate-pulse rounded-[14px] bg-muted-surface/45" />
        </div>
      ) : (
        <>
          {active ? (
            <ActiveServer
              server={active}
              activatedBy={activatedBy}
              test={tests[active.id]}
              testing={busy[active.id] === 'test'}
              feedConnected={feedConnected}
              canEdit={canEdit}
              onTest={() => handleTest(active)}
              onEdit={() => openEdit(active)}
            />
          ) : (
            <section className="flex items-center gap-4 rounded-[14px] border border-dashed px-5 py-6" style={panelBorder}>
              <Server size={20} className="text-text-muted/50" />
              <p className="text-[13px] text-text-muted font-heading">No server is active. Add one and switch to it to manage MT5 from here.</p>
            </section>
          )}

          <Mt5AlertsPanel canEdit={canEdit} onToast={flash} onError={fail} />

          <section aria-label="Other servers" className="rounded-[14px] border bg-surface-elevated/40" style={panelBorder}>
            <div className="px-5 pt-4 pb-3">
              <h2 className="text-[14px] font-semibold text-text font-heading">Other servers</h2>
              <p className="text-[12px] text-text-muted/60 font-heading">Ready to switch to, or used before.</p>
            </div>
            {others.length === 0 ? (
              <p className="border-t px-5 py-5 text-[12.5px] text-text-muted/55 font-heading" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
                {canEdit ? 'Add a server here before a migration, test it, then switch when the broker is ready.' : 'No other servers yet.'}
              </p>
            ) : (
              <ul className="divide-y divide-border/40 border-t" style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}>
                {others.map((s) => (
                  <ServerRow
                    key={s.id}
                    server={s}
                    test={tests[s.id]}
                    busy={busy[s.id]}
                    canEdit={canEdit}
                    onTest={() => handleTest(s)}
                    onSwitch={() => setConfirm({ kind: 'switch', server: s })}
                    onEdit={() => openEdit(s)}
                    onDelete={() => setConfirm({ kind: 'delete', server: s })}
                  />
                ))}
              </ul>
            )}
          </section>

          <section aria-label="History" className="rounded-[14px] border bg-surface-elevated/40" style={panelBorder}>
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-[14px] font-semibold text-text font-heading">History</h2>
              <p className="text-[12px] text-text-muted/60 font-heading">Every change to MT5 servers and who made it.</p>
            </div>
            <HistoryTimeline logs={logs} />
          </section>
        </>
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 right-6 z-[150] flex max-w-[380px] items-center gap-2.5 rounded-[10px] border bg-surface-elevated px-4 py-3 text-[12.5px] text-text shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none font-heading"
          style={{ borderColor: 'color-mix(in srgb, var(--positive) 30%, transparent)' }}
        >
          <CheckCircle2 size={15} className="shrink-0 text-positive" />
          {toast.text}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={dialog?.title}
        description={dialog?.description}
        confirmLabel={confirmBusy ? 'Working…' : dialog?.confirmLabel}
        confirmVariant={dialog?.confirmVariant}
        busy={confirmBusy}
        onClose={() => !confirmBusy && setConfirm(null)}
        onConfirm={dialog?.onConfirm}
      />

      <Mt5ServerDrawer
        open={drawer.open}
        session={drawer.session}
        server={drawer.server}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        onTest={(payload) => mt5ServersService.test(payload)}
      />
    </div>
  );
}

export default Mt5ServersPage;
