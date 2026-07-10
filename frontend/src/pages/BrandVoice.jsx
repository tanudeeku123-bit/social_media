import { useEffect, useState } from 'react';
import { api } from '../api';

export default function BrandVoice() {
  const [profile, setProfile] = useState({ tone: '', audience: '', rules: '', sample_posts: '' });
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBrand().then((d) => {
      setProfile(d.profile || profile);
      setLoading(false);
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      const d = await api.updateBrand(profile);
      setProfile(d.profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading Brand Voice profile…</p>;

  return (
    <div className="max-w-2xl text-slate-100 font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Brand Voice</h1>
        <p className="text-slate-400 text-sm">Define your tone and audience so that AI-generated drafts always match your messaging.</p>
      </div>

      <form onSubmit={save} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tone of Voice</label>
          <input
            value={profile.tone}
            onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
            placeholder="e.g. conversational, technical but simple, warm and educational"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Audience</label>
          <input
            value={profile.audience}
            onChange={(e) => setProfile({ ...profile, audience: e.target.value })}
            placeholder="e.g. tech developers, content creators, business marketing leaders"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Styling Guidelines & Rules</label>
          <textarea
            value={profile.rules}
            onChange={(e) => setProfile({ ...profile, rules: e.target.value })}
            placeholder="e.g. always include hashtags, keep sentences short, avoid industry jargon"
            rows={3}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sample Posts (Reference)</label>
          <textarea
            value={profile.sample_posts}
            onChange={(e) => setProfile({ ...profile, sample_posts: e.target.value })}
            placeholder="Paste 1-3 examples of posts you like to establish as a baseline."
            rows={4}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
          />
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-slate-900/60">
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold tracking-wide disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save Voice Profile'}
          </button>
          {saved && <span className="text-emerald-400 text-xs font-semibold">✓ Profile successfully updated</span>}
        </div>
      </form>
    </div>
  );
}
