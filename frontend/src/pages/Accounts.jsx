import { useEffect, useState } from 'react';
import { api } from '../api';
import ConfirmButton from '../components/ConfirmButton';
import { useToast } from '../components/Toast';

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  x: 'X / Twitter',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  youtube: 'YouTube',
  bluesky: 'Bluesky',
};

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [error, setError] = useState('');
  const showToast = useToast();

  function refresh() {
    api.getAccounts().then((d) => {
      setAccounts(d.accounts);
      setPlatforms(d.supported_platforms);
    });
  }

  useEffect(refresh, []);

  async function connect(e) {
    e.preventDefault();
    setError('');
    if (!handle.trim()) return;
    try {
      await api.connectAccount(platform, handle.trim(), platform === 'bluesky' ? appPassword.trim() : undefined);
      setHandle('');
      setAppPassword('');
      showToast('Account connected successfully', 'success');
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function disconnect(id) {
    await api.disconnectAccount(id);
    showToast('Account disconnected', 'info');
    refresh();
  }

  return (
    <div className="max-w-3xl font-body text-slate-100">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Social Connections</h1>
        <p className="text-slate-400 text-sm">Link your target accounts to publish posts automatically on schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <div className="space-y-6">
          <form onSubmit={connect} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Link Channel</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-sm"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>{PLATFORM_LABELS[p] || p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Handle / Profile Name</label>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder={platform === 'bluesky' ? "handle.bsky.social" : "@handle"}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {platform === 'bluesky' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">App Password</label>
                <input
                  type="password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="App Password (optional, required for real publishing)"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
                <p className="text-[10px] text-slate-500 mt-1">Generate a secure app password inside your Bluesky Account Settings.</p>
              </div>
            )}

            {error && <p className="text-rose-400 text-xs">{error}</p>}

            <button type="submit" className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold tracking-wide">
              Link Connection
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Active Connections</h2>
            {accounts.length === 0 && (
              <p className="text-sm text-slate-500 bg-slate-900/20 rounded-xl px-4 py-4 border border-slate-800">No channels linked yet.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all"
                >
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 uppercase tracking-wider text-indigo-400 block w-fit mb-1">
                      {PLATFORM_LABELS[a.platform] || a.platform}
                    </span>
                    <span className="text-sm text-slate-200 font-mono">@{a.handle}</span>
                  </div>
                  <ConfirmButton onConfirm={() => disconnect(a.id)} className="text-xs text-rose-400 hover:text-rose-300 font-semibold" confirmLabel="Confirm unpin?">
                    Disconnect
                  </ConfirmButton>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Tip Bar */}
        <aside className="hidden lg:block sticky top-24 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold mb-4 text-white">Connected Platforms</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Bluesky connections utilize real app passwords for true posting.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Other connected platforms operate in simulated posting mode for workspace validation until real API keys are registered.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
