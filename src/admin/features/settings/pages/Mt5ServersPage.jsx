import React, { useEffect, useState } from 'react';
import { Server, Plus, Pencil, Trash2, PlugZap, Power, History, CheckCircle2, XCircle } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsCard } from '../components/SettingsCard';
import { WarnBanner, Btn } from '../components/SettingsForm';
import { Mt5ServerDrawer } from '../components/Mt5ServerDrawer';
import { mt5ServersService } from '../services/mt5ServersService';
import { useAuth } from '@/shared/features/auth/AuthContext';

const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');

const ACTION_LABELS = {
  created: 'Added',
  updated: 'Edited',
  activated: 'Activated',
  deactivated: 'Deactivated',
  tested: 'Tested',
  deleted: 'Deleted',
};
const ACTION_COLORS = {
  activated: 'var(--positive)',
  deactivated: 'var(--warning)',
  deleted: 'var(--negative)',
  tested: 'var(--cyan)',
};

const FIELD_NAMES = {
  label: 'name', baseUrl: 'API URL', apiUsername: 'API username', apiPassword: 'API password',
  managerId: 'manager ID', managerPassword: 'manager password', serverIp: 'server IP',
  serverName: 'server name', wsUrl: 'live feed URL', notes: 'notes',
};

// One readable line for a history entry
function describeLog(log) {
  const d = log.details || {};
  if (log.action === 'updated' && d.changed) return `Changed ${d.changed.map((k) => FIELD_NAMES[k] || k).join(', ')}`;
  if (log.action === 'tested') return `${d.ok ? 'Passed' : 'Failed'}${d.beforeActivation ? ' (before activation)' : ''}${d.ms ? ` · ${d.ms} ms` : ''}`;
  if (log.action === 'activated') {
    if (d.source) return `Imported from ${d.source}`;
    return [d.previous?.length ? `Replaced ${d.previous.join(', ')}` : null, d.forced ? 'activated without a passing test' : null].filter(Boolean).join(' · ');
  }
  if (log.action === 'deactivated' && d.replacedBy) return `Replaced by ${d.replacedBy}`;
  if (log.action === 'created' && d.source) return `Imported from ${d.source}`;
  return '';
}

function ServerFacts({ server }) {
  const rows = [
    ['Server name', server.serverName],
    ['API URL', server.baseUrl],
    ['API username', server.apiUsername],
    ['Manager ID', server.managerId],
    ['Server IP', server.serverIp],
    ['Live feed', server.effectiveWsUrl],
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted/40 font-heading">{k}</p>
          <p className="truncate font-mono text-[12px] text-text" title={v}>{v || '—'}</p>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ server }) {
  const [text, color] = server.isActive
    ? ['Active', 'var(--positive)']
    : server.lastActivatedAt
      ? ['Previously used', 'var(--warning)']
      : ['Never used', 'var(--text-muted)'];
  return (
    <span
      className="rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
    >
      {text}
    </span>
  );
}

function InlineTest({ result }) {
  if (!result) return null;
  const Icon = result.ok ? CheckCircle2 : XCircle;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-heading" style={{ color: result.ok ? 'var(--positive)' : 'var(--negative)' }}>
      <Icon size={11} /> {result.message}
    </p>
  );
}

/**
 * Mt5ServersPage — MT5 gateway + manager connection profiles.
 * One is active; switching keeps the old one (and a full change log) as history.
 */
export function Mt5ServersPage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'super-admin';

  const [servers, setServers] = useState([]);
  const [activeSource, setActiveSource] = useState('db');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(null); // `${action}-${id}`
  const [tests, setTests] = useState({}); // serverId -> last test result
  const [drawer, setDrawer] = useState({ open: false, session: 0, server: null });

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

  const flash = (message) => { setError(''); setNotice(message); };
  const fail = (err, fallback) => { setNotice(''); setError(err.message || fallback); };

  const active = servers.find((s) => s.isActive);
  const others = servers.filter((s) => !s.isActive);

  const openAdd = () => setDrawer((d) => ({ open: true, session: d.session + 1, server: null }));
  const openEdit = (server) => setDrawer((d) => ({ open: true, session: d.session + 1, server }));
  const closeDrawer = () => setDrawer((d) => ({ ...d, open: false }));

  const handleSubmit = async (payload) => {
    const { serverId, ...body } = payload;
    if (serverId) await mt5ServersService.update(serverId, body);
    else await mt5ServersService.create(body);
    closeDrawer();
    flash(serverId ? 'MT5 server updated.' : 'MT5 server saved. Test it, then activate it when ready.');
    await reload();
  };

  const handleTest = async (server) => {
    setBusy(`test-${server.id}`);
    try {
      const result = await mt5ServersService.test({ serverId: server.id });
      setTests((t) => ({ ...t, [server.id]: result }));
      setLogs(await mt5ServersService.logs());
    } catch (err) {
      fail(err, 'Test failed.');
    } finally {
      setBusy(null);
    }
  };

  const handleActivate = async (server) => {
    const message = `Switch to "${server.label}"?\n\nFrom now on, all deposits, withdrawals, balance operations, account creation and the live feed go to this server (${server.baseUrl}).\nExisting client MT5 accounts will be operated on this server too.\n\nA connection test runs first.`;
    if (!window.confirm(message)) return;
    setBusy(`activate-${server.id}`);
    try {
      let res;
      try {
        res = await mt5ServersService.activate(server.id, false);
      } catch (err) {
        if (err.data?.code !== 'TEST_FAILED') throw err;
        setTests((t) => ({ ...t, [server.id]: err.data.data }));
        const force = window.confirm(`${err.message}\n\nActivate "${server.label}" anyway? MT5 operations will fail until the connection works.`);
        if (!force) {
          setLogs(await mt5ServersService.logs());
          return;
        }
        res = await mt5ServersService.activate(server.id, true);
      }
      flash(res?.message || `"${server.label}" is now active.`);
      await reload();
    } catch (err) {
      fail(err, 'Failed to activate MT5 server.');
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (server) => {
    if (!window.confirm(`Delete "${server.label}"? It has never been used, so no history is lost.`)) return;
    setBusy(`delete-${server.id}`);
    try {
      await mt5ServersService.remove(server.id);
      flash(`"${server.label}" deleted.`);
      await reload();
    } catch (err) {
      fail(err, 'Failed to delete MT5 server.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5.5">
      <SettingsSection
        title="MT5 Servers"
        desc="Gateway API and manager credentials used for every MT5 operation. Past servers are kept as history."
      />

      {error && <WarnBanner title="Error" message={error} severity="danger" />}
      {notice && <WarnBanner title="Done" message={notice} severity="info" />}
      {!canEdit && !loading && (
        <WarnBanner title="View only" message="Only a Super Admin can add, edit, test or switch MT5 servers." severity="info" />
      )}
      {activeSource === 'env' && !loading && (
        <WarnBanner title="Using .env settings" message="No server is active here, so the EXTERNAL_API_* values in .env are being used. Add a server and activate it." />
      )}
      {activeSource === 'error' && !loading && (
        <WarnBanner severity="danger" title="Active server can't be used" message="Its saved passwords can't be decrypted (the encryption key changed). Edit the active server and re-enter both passwords." />
      )}

      {loading ? (
        <p className="text-[12px] text-text-muted/60 font-heading">Loading MT5 servers…</p>
      ) : (
        <>
          <SettingsCard
            title={active ? active.label : 'No active server'}
            desc={active ? `Active since ${fmt(active.lastActivatedAt)}` : 'MT5 operations are using .env until a server is activated.'}
            Icon={Server}
            action={active && canEdit && (
              <>
                <Btn small Icon={PlugZap} label="Test" variant="cyan" onClick={() => handleTest(active)} loading={busy === `test-${active.id}`} />
                <Btn small Icon={Pencil} label="Edit" onClick={() => openEdit(active)} />
              </>
            )}
          >
            {active && (
              <>
                <ServerFacts server={active} />
                {active.notes && <p className="mt-3 text-[11.5px] text-text-muted/60 font-heading">{active.notes}</p>}
                <InlineTest result={tests[active.id]} />
              </>
            )}
          </SettingsCard>

          <SettingsCard
            title="Other Servers"
            desc="Servers you can switch to, including ones used before."
            Icon={History}
            action={canEdit && <Btn small Icon={Plus} label="Add Server" variant="brand" onClick={openAdd} />}
          >
            {others.length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-border/25 px-4 py-4 text-center text-[11.5px] text-text-muted/40 font-heading">
                No other servers yet. Add one to prepare a switch.
              </div>
            ) : (
              <div className="space-y-2">
                {others.map((s) => (
                  <div key={s.id} className="rounded-[8px] border border-border/20 bg-bg px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-semibold text-text font-heading">{s.label}</span>
                          <StatusBadge server={s} />
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-text-muted/50">
                          {s.serverName} · {s.baseUrl} · manager {s.managerId}
                        </p>
                        {s.lastActivatedAt && (
                          <p className="mt-0.5 text-[10.5px] text-text-muted/40 font-heading">
                            Last used {fmt(s.lastActivatedAt)} → {fmt(s.lastDeactivatedAt)}
                          </p>
                        )}
                      </div>
                      {canEdit && (
                        <div className="flex items-center gap-1.5">
                          <Btn small Icon={PlugZap} label="Test" onClick={() => handleTest(s)} loading={busy === `test-${s.id}`} />
                          <Btn small Icon={Power} label="Activate" variant="primary" onClick={() => handleActivate(s)} loading={busy === `activate-${s.id}`} />
                          <button type="button" onClick={() => openEdit(s)} title="Edit" className="cursor-pointer rounded-[6px] p-2 text-text-muted/50 hover:bg-muted-surface hover:text-text">
                            <Pencil size={13} />
                          </button>
                          {!s.lastActivatedAt && (
                            <button type="button" onClick={() => handleDelete(s)} title="Delete" className="cursor-pointer rounded-[6px] p-2 text-text-muted/50 hover:bg-negative/10 hover:text-negative">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <InlineTest result={tests[s.id]} />
                  </div>
                ))}
              </div>
            )}
          </SettingsCard>

          <SettingsCard title="History" desc="Every change to MT5 servers, newest first (last 200)." Icon={History}>
            {logs.length === 0 ? (
              <p className="text-[12px] text-text-muted/50 font-heading">No history yet.</p>
            ) : (
              <div className="divide-y divide-border/10">
                {logs.map((log) => (
                  <div key={log.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2.5 text-[12px] font-heading">
                    <span className="w-[150px] shrink-0 font-mono text-[11px] text-text-muted/50">{fmt(log.createdAt)}</span>
                    <span className="w-[82px] shrink-0 font-semibold" style={{ color: ACTION_COLORS[log.action] || 'var(--text)' }}>
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                    <span className="font-semibold text-text">{log.serverLabel || '—'}</span>
                    <span className="text-text-muted/60">{describeLog(log)}</span>
                    <span className="ml-auto text-[11px] text-text-muted/40">{log.userName || 'System'}</span>
                  </div>
                ))}
              </div>
            )}
          </SettingsCard>
        </>
      )}

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
