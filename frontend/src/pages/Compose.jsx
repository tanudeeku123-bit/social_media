import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { PLATFORM_LABELS, PLATFORM_RATIOS, PLATFORM_HEX } from '../platformStyles';
import { useToast } from '../components/Toast';

const PLATFORM_CHAR_LIMIT = {
  instagram: 2200,
  tiktok: 2200,
  x: 280,
  linkedin: 3000,
  facebook: 63206,
  youtube: 5000,
};

const IDEA_CHAR_LIMIT = 500;

function useSpeechRecognition(onResult) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

  function toggle() {
    if (!supported) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join(' ');
      onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return { listening, supported, toggle };
}

async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download file:', err);
    window.open(url, '_blank');
  }
}

export default function Compose({ onSaved }) {
  const [idea, setIdea] = useState('');
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [selected, setSelected] = useState([]);

  const [drafts, setDrafts] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [scheduleFor, setScheduleFor] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');

  const [media, setMedia] = useState(null);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [fittedByPlatform, setFittedByPlatform] = useState({});
  const [fittingPlatform, setFittingPlatform] = useState(null);
  const [mediaMode, setMediaMode] = useState('upload'); // 'upload' | 'generate'
  const [imagePrompt, setImagePrompt] = useState('');
  const [genType, setGenType] = useState('image'); // 'image' | 'video'
  const [chosenFileName, setChosenFileName] = useState('');
  const fileInputRef = useRef(null);

  const ideaSpeech = useSpeechRecognition((transcript) => setIdea((cur) => (cur ? `${cur} ${transcript}` : transcript)));
  const showToast = useToast();

  useEffect(() => {
    api.getCampaigns().then((d) => setCampaigns(d.campaigns));
    api.getAccounts().then((d) => {
      const seen = new Set();
      const platforms = [];
      for (const a of d.accounts || []) {
        if (!seen.has(a.platform)) {
          seen.add(a.platform);
          platforms.push(a.platform);
        }
      }
      setConnectedPlatforms(platforms);
      setSelected(platforms);
      setAccountsLoaded(true);
    });
  }, []);

  function togglePlatform(p) {
    setSelected((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  const filteredCampaigns = useMemo(() => {
    if (!campaignFilter.trim()) return campaigns;
    const q = campaignFilter.trim().toLowerCase();
    return campaigns.filter((c) => c.name.toLowerCase().includes(q));
  }, [campaigns, campaignFilter]);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setChosenFileName(file.name);
    setMediaError('');
    setMediaBusy(true);
    setFittedByPlatform({});
    try {
      const uploaded = await api.uploadMedia(file);
      setMedia(uploaded);
    } catch (err) {
      setMediaError(err.message);
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleGenerateMedia() {
    if (!imagePrompt.trim()) return;
    setMediaError('');
    setMediaBusy(true);
    setFittedByPlatform({});
    try {
      const generated = await api.generateMedia(imagePrompt.trim(), genType);
      setMedia(generated);
      showToast(`${genType === 'video' ? 'Video' : 'Image'} generated successfully`, 'success');
    } catch (err) {
      setMediaError(err.message);
    } finally {
      setMediaBusy(false);
    }
  }

  function clearMedia() {
    setMedia(null);
    setFittedByPlatform({});
    setImagePrompt('');
    setChosenFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function fitForPlatform(platform, mediaItem = media) {
    if (!mediaItem || fittedByPlatform[platform]) return;
    setFittingPlatform(platform);
    try {
      const result = await api.fitMedia(mediaItem.filename, platform, mediaItem.mimetype);
      setFittedByPlatform((cur) => ({ ...cur, [platform]: result }));
    } catch (err) {
      setMediaError(err.message);
    } finally {
      setFittingPlatform(null);
    }
  }

  async function generate(e) {
    e.preventDefault();
    setError('');
    if (!idea.trim() || selected.length === 0) return;
    setBusy(true);
    setDrafts(null);
    try {
      // 1. Generate text drafts
      const d = await api.generatePosts(idea.trim(), selected);

      // 2. Automatically generate a matching AI visual based on their post idea!
      let currentMedia = media;
      if (!currentMedia) {
        setMediaBusy(true);
        try {
          const generated = await api.generateMedia(idea.trim(), genType);
          setMedia(generated);
          currentMedia = generated;
          showToast('AI automatically generated matching visual asset!', 'success');
        } catch (err) {
          console.error('Auto media generation failed:', err);
        } finally {
          setMediaBusy(false);
        }
      }

      setDrafts(d.posts);

      // 3. Fit media for all generated posts
      if (currentMedia) {
        for (const draft of d.posts) {
          await fitForPlatform(draft.platform, currentMedia);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function updateDraft(platform, content) {
    setDrafts((cur) => cur.map((d) => (d.platform === platform ? { ...d, content } : d)));
  }

  function mediaFieldsFor(platform) {
    const fitted = fittedByPlatform[platform];
    if (!fitted) return {};
    return { media_path: fitted.url, media_type: fitted.mediaType };
  }

  async function saveDraft(platform, content) {
    await api.createPost({ platform, content, campaign_id: campaignId || undefined, ...mediaFieldsFor(platform) });
    showToast('Saved as draft', 'success');
    onSaved();
  }

  async function schedule(platform, content) {
    const when = scheduleFor[platform];
    if (!when) return;
    await api.createPost({
      platform,
      content,
      scheduled_at: new Date(when).toISOString(),
      campaign_id: campaignId || undefined,
      ...mediaFieldsFor(platform),
    });
    showToast('Scheduled successfully', 'success');
    onSaved();
  }

  return (
    <div className="text-slate-100 font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Create New Post</h1>
        <p className="text-slate-400 text-sm">Draft, auto-generate AI media, and schedule multi-platform campaigns from a single cockpit.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-6">
          <form onSubmit={generate} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Target Channels</label>
              {!accountsLoaded ? (
                <p className="text-sm text-slate-500">Checking active connections…</p>
              ) : connectedPlatforms.length === 0 ? (
                <p className="text-sm text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                  No accounts linked yet. Visit the Accounts page to connect a profile first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {connectedPlatforms.map((p) => {
                    const isOn = selected.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          isOn ? 'text-white border-transparent' : 'text-slate-400 border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        }`}
                        style={isOn ? { backgroundColor: PLATFORM_HEX[p] } : {}}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isOn ? '#fff' : PLATFORM_HEX[p] }} />
                        {PLATFORM_LABELS[p]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Post Concept or Prompt</label>
                {ideaSpeech.supported && (
                  <button
                    type="button"
                    onClick={() => ideaSpeech.toggle()}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                      ideaSpeech.listening ? 'bg-rose-500/20 border-rose-500 animate-pulse' : 'border-slate-800 hover:border-slate-700'
                    }`}
                    title={ideaSpeech.listening ? 'Listening…' : 'Use voice recognition'}
                  >
                    🎙️
                  </button>
                )}
              </div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your announcement or post theme. (AI will draft optimized posts and automatically generate matching visual art if none is uploaded)"
                rows={4}
                maxLength={IDEA_CHAR_LIMIT}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
              <p className={`text-xs text-right mt-1.5 ${idea.length >= IDEA_CHAR_LIMIT ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                {idea.length}/{IDEA_CHAR_LIMIT}
              </p>
            </div>

            {campaigns.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Link to Campaign</label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-sm"
                >
                  <option value="">Stand-alone post</option>
                  {filteredCampaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Optional Custom Media</label>
              {!media ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaMode('upload')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${mediaMode === 'upload' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      📁 Upload Custom File
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaMode('generate')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${mediaMode === 'generate' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      🎨 Generate Specific AI Prompt
                    </button>
                  </div>

                  {mediaMode === 'upload' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="compose-file-input"
                      />
                      <label
                        htmlFor="compose-file-input"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/20 transition-all text-sm text-slate-400 cursor-pointer justify-center"
                      >
                        {chosenFileName ? `📂 ${chosenFileName}` : 'Select Image or Video Clip'}
                      </label>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <select
                        value={genType}
                        onChange={(e) => setGenType(e.target.value)}
                        className="px-3 py-2.5 rounded-xl glass-input text-sm bg-slate-900 text-slate-200 border-slate-800 shrink-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="image">🖼️ Image</option>
                        <option value="video">🎥 Video</option>
                      </select>
                      <input
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder={genType === 'video' ? "Describe the video you want to generate..." : "e.g. modern tech office, warm ambient light, high quality"}
                        className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateMedia}
                        disabled={mediaBusy || !imagePrompt.trim()}
                        className="px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold disabled:opacity-40 shrink-0"
                      >
                        {mediaBusy ? 'Generating…' : 'Generate'}
                      </button>
                    </div>
                  )}
                  {mediaBusy && mediaMode === 'upload' && <p className="text-xs text-slate-500">Uploading media asset…</p>}
                  {mediaError && <p className="text-xs text-rose-400">{mediaError}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                    {media.mediaType === 'video' ? (
                      <video src={media.originalUrl} controls className="h-full w-full object-cover" />
                    ) : (
                      <img src={media.originalUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Visual Asset Connected</p>
                    <p className="text-xs text-slate-400 mb-2">Automatically optimized copies will build below.</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => downloadFile(media.originalUrl, media.filename)}
                        className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        📥 Download Original
                      </button>
                      <span className="text-slate-800">|</span>
                      <button type="button" onClick={clearMedia} className="text-xs text-rose-400 hover:underline font-bold cursor-pointer">Remove visual</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-rose-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={busy || selected.length === 0}
              className="w-full py-3.5 rounded-xl btn-primary flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-50"
            >
              {busy ? 'Generating drafts & visuals…' : 'Generate & Stage Posts'}
            </button>
          </form>

          {drafts && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Staged Multi-Channel Previews</h2>
              {drafts.map((d) => {
                const fitted = fittedByPlatform[d.platform];
                const limit = PLATFORM_CHAR_LIMIT[d.platform];
                const len = d.content.length;
                const overLimit = limit && len > limit;
                return (
                  <div key={d.platform} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_HEX[d.platform] }} />
                        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: PLATFORM_HEX[d.platform] }}>
                          {PLATFORM_LABELS[d.platform] || d.platform}
                        </span>
                      </div>
                      {media && <span className="text-xs text-slate-500 font-mono">Aspect: {PLATFORM_RATIOS[d.platform]}</span>}
                    </div>

                    {media && (
                      <div>
                        {fittingPlatform === d.platform && <p className="text-xs text-slate-500">Optimizing media aspect ratio…</p>}
                        {fitted && (
                          <div className="space-y-2">
                            <div className="w-48 rounded-xl overflow-hidden border border-slate-800">
                              {fitted.mediaType === 'video' ? (
                                <video src={fitted.url} controls className="max-h-48 w-full object-cover" />
                              ) : (
                                <img src={fitted.url} alt="" className="max-h-48 w-full object-cover" />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => downloadFile(fitted.url, `${d.platform}-${media.filename}`)}
                              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline font-bold cursor-pointer"
                            >
                              📥 Download Fitted ({PLATFORM_LABELS[d.platform]})
                            </button>
                          </div>
                        )}
                        {!fitted && fittingPlatform !== d.platform && (
                          <button type="button" onClick={() => fitForPlatform(d.platform)} className="text-xs text-indigo-400 hover:underline">
                            Crop preview to {PLATFORM_LABELS[d.platform]} aspect ratio
                          </button>
                        )}
                      </div>
                    )}

                    <textarea
                      value={d.content}
                      onChange={(e) => updateDraft(d.platform, e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${overLimit ? 'border-rose-500 focus:border-rose-500' : ''}`}
                    />
                    {limit && (
                      <p className={`text-xs text-right ${overLimit ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                        {len}/{limit}{overLimit ? ' (Over limit)' : ''}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-900/60">
                      <button onClick={() => saveDraft(d.platform, d.content)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold transition-all">
                        Save as Draft
                      </button>
                      <div className="flex items-center gap-2 ml-auto">
                        <input
                          type="datetime-local"
                          value={scheduleFor[d.platform] || ''}
                          onChange={(e) => setScheduleFor({ ...scheduleFor, [d.platform]: e.target.value })}
                          className="px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                        <button
                          onClick={() => schedule(d.platform, d.content)}
                          disabled={!scheduleFor[d.platform]}
                          className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold disabled:opacity-40"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Tip Bar */}
        <aside className="hidden xl:block sticky top-24 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-lg font-bold mb-4 text-white">Creation Tips</h3>
            <ul className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <li className="flex gap-2">
                <span>🎙️</span>
                <span>Tap the mic to dictate your post concept instantly.</span>
              </li>
              <li className="flex gap-2">
                <span>🤖</span>
                <span>If you do not attach media, the AI will automatically generate a custom image to match your post content.</span>
              </li>
              <li className="flex gap-2">
                <span>🎯</span>
                <span>Select multiple channels to publish customized versions of one core message in parallel.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}