import { useEffect, useState } from 'react';
import { api } from '../api';
import { useToast } from '../components/Toast';
import ConfirmButton from '../components/ConfirmButton';

function ProgressBar({ counts, total }) {
  if (total === 0) return <p className="text-xs text-slate-500">No posts linked to this campaign yet</p>;
  const pct = (n) => Math.round((n / total) * 100);
  return (
    <div className="space-y-2">
      <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800">
        <div style={{ width: `${pct(counts.published)}%` }} className="bg-emerald-500 h-full" title="Published" />
        <div style={{ width: `${pct(counts.scheduled)}%` }} className="bg-indigo-500 h-full" title="Scheduled" />
        <div style={{ width: `${pct(counts.failed)}%` }} className="bg-rose-500 h-full" title="Failed" />
      </div>
      <p className="text-xs text-slate-400">
        {counts.published} published · {counts.scheduled} scheduled · {counts.draft} draft{counts.failed ? ` · ${counts.failed} failed` : ''}
      </p>
    </div>
  );
}

export default function Campaigns({ onOpenCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const showToast = useToast();

  function refresh() {
    api.getCampaigns().then((d) => setCampaigns(d.campaigns));
  }

  useEffect(refresh, []);

  async function create(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    try {
      await api.createCampaign({ name: name.trim(), goal: goal.trim() });
      setName('');
      setGoal('');
      showToast('Campaign created successfully', 'success');
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await api.deleteCampaign(id);
    showToast('Campaign removed', 'info');
    refresh();
  }

  return (
    <div className="text-slate-100 font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Campaign Management</h1>
        <p className="text-slate-400 text-sm">Group posts around specific marketing goals and track completion progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <div className="space-y-6">
          <form onSubmit={create} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Create Campaign</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Campaign Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Autumn Product Launch"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Goal</label>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. 500 waitlist registrations"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>
            {error && <p className="text-rose-400 text-xs">{error}</p>}
            <button type="submit" className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold tracking-wide">
              Create Campaign
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Active Campaigns</h2>
            {campaigns.length === 0 && (
              <p className="text-sm text-slate-500 bg-slate-900/20 rounded-xl px-4 py-4 border border-slate-800">No active campaigns.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campaigns.map((c) => (
                <div key={c.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{c.name}</h3>
                      <ConfirmButton
                        onConfirm={() => remove(c.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                        confirmLabel="Confirm Delete?"
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                    {c.goal && <p className="text-xs text-indigo-300 italic mb-4">Goal: {c.goal}</p>}
                  </div>
                  <ProgressBar counts={c.postCounts} total={c.totalPosts} />
                  {onOpenCampaign && (
                    <button
                      onClick={() => onOpenCampaign(c.id)}
                      className="text-xs text-indigo-400 hover:underline font-semibold w-fit pt-2"
                    >
                      View Campaign Posts →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Tip Bar */}
        <aside className="hidden lg:block sticky top-24 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold mb-4 text-white">Campaign Goals</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Assign scheduled drafts to specific marketing campaigns to view centralized metrics on publication success.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
