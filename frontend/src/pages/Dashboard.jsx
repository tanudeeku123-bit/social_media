import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

export default function Dashboard({ refreshKey, onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [accounts, setAccounts] = useState([]);

  function refresh() {
    api.getPosts().then((d) => setPosts(d.posts || []));
    api.getCampaigns().then((d) => setCampaigns(d.campaigns || []));
    api.getAccounts().then((d) => setAccounts(d.accounts || []));
  }

  useEffect(refresh, [refreshKey]);

  // Drafts items logic (live data + mock fallbacks)
  const draftsList = useMemo(() => {
    const liveDrafts = posts.filter((p) => p.status === 'draft' || p.status === 'scheduled').slice(0, 3);
    if (liveDrafts.length > 0) {
      return liveDrafts.map((p, idx) => ({
        id: p.id,
        title: p.status === 'scheduled' ? `Scheduled Post ${idx + 1}` : `Draft Post ${idx + 1}`,
        body: p.content,
        status: p.status,
        mediaPath: p.media_path,
        platform: p.platform
      }));
    }
    // Fallback Mock items
    return [
      {
        id: 'mock-dr-1',
        title: 'Scheduled Post 1',
        body: 'Planorate your sootias camba...',
        status: 'scheduled',
        platform: 'instagram'
      },
      {
        id: 'mock-dr-2',
        title: 'Scheduled post 2',
        body: 'Planorate your sootias camba...',
        status: 'scheduled',
        platform: 'facebook'
      },
      {
        id: 'mock-dr-3',
        title: 'Scheduled post 3',
        body: 'Planorate your sootias camba...',
        status: 'scheduled',
        platform: 'linkedin'
      }
    ];
  }, [posts]);

  // Highlights items logic (live data + mock fallbacks)
  const highlightsList = useMemo(() => {
    const liveScheduled = posts.filter((p) => p.status === 'scheduled').slice(0, 3);
    if (liveScheduled.length > 0) {
      return liveScheduled.map((p, idx) => ({
        id: p.id,
        title: `Upcoming Post ${idx + 1}`,
        body: p.content
      }));
    }
    // Fallback Mock items
    return [
      {
        id: 'mock-hl-1',
        title: 'Upcoming Post 1',
        body: 'Welcoms your scheduled our unnesting posts, and text tents.'
      },
      {
        id: 'mock-hl-2',
        title: 'Upcoming Post 12',
        body: 'Welcoms your scheduled our unnesting posts, and text tents.'
      },
      {
        id: 'mock-hl-3',
        title: 'Upcoming Post 13',
        body: 'Welcoms your scheduled our unnesting posts, and text tents.'
      }
    ];
  }, [posts]);

  // Platforms verification connection list
  const instagramAccount = accounts.find(a => a.platform === 'instagram');
  const facebookAccount = accounts.find(a => a.platform === 'facebook');
  const twitterAccount = accounts.find(a => a.platform === 'x' || a.platform === 'twitter');
  const linkedInAccount = accounts.find(a => a.platform === 'linkedin');

  // Mini graphic creators for thumbnails
  function renderThumbnail(platform) {
    if (platform === 'instagram') {
      return (
        <svg className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
          <rect width="40" height="40" fill="#fbcfe8" />
          <circle cx="20" cy="20" r="10" fill="#f43f5e" opacity="0.8" />
          <path d="M 0 35 L 15 22 L 25 30 L 40 18 L 40 40 L 0 40 Z" fill="#ec4899" />
          <path d="M 10 40 L 22 28 L 35 37 L 40 33 L 40 40 Z" fill="#db2777" opacity="0.6" />
        </svg>
      );
    } else if (platform === 'facebook') {
      return (
        <svg className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
          <rect width="40" height="40" fill="#bfdbfe" />
          <circle cx="28" cy="12" r="6" fill="#fef08a" />
          <path d="M 0 32 Q 10 20 20 28 T 40 22 L 40 40 L 0 40 Z" fill="#3b82f6" />
          <path d="M 0 40 L 15 28 L 28 35 L 40 25 L 40 40 Z" fill="#1d4ed8" opacity="0.7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
          <rect width="40" height="40" fill="#ccfbf1" />
          <circle cx="30" cy="10" r="4" fill="#fb7185" />
          <path d="M 0 25 L 18 10 L 32 20 L 40 12 L 40 40 L 0 40 Z" fill="#0d9488" />
          <path d="M 0 32 L 12 24 L 25 35 L 40 22 L 40 40 Z" fill="#0f766e" opacity="0.7" />
        </svg>
      );
    }
  }

  return (
    <div className="bg-[#c3bdd9] p-6 min-h-screen text-slate-800 flex flex-col justify-start selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Dynamic Keyframes injected inline */}
      <style>{`
        @keyframes float-insta-dash {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-fb-dash {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-tw-dash {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(5px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-in-dash {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(6px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-insta-dash { animation: float-insta-dash 5s ease-in-out infinite; }
        .animate-float-fb-dash { animation: float-fb-dash 4.5s ease-in-out infinite; }
        .animate-float-tw-dash { animation: float-tw-dash 5.8s ease-in-out infinite; }
        .animate-float-in-dash { animation: float-in-dash 5.2s ease-in-out infinite; }
      `}</style>

      {/* Main dashboard frame */}
      <div className="bg-[#f0eef6] rounded-[28px] p-8 flex-1 flex flex-col gap-6 shadow-2xl shadow-indigo-950/10">
        
        {/* Top Header Row */}
        <header className="bg-white rounded-2xl shadow-sm px-6 py-4 flex justify-between items-center select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Socially</span>
          </div>

          {/* Right Action Options */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate && onNavigate('compose')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-sm shadow-indigo-100 hover:shadow"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Post Generator
            </button>
            
            <button
              onClick={() => onNavigate && onNavigate('calendar')}
              className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Calendar
            </button>

            <button
              onClick={() => onNavigate && onNavigate('accounts')}
              className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Social Accounts
            </button>

            <button
              onClick={() => onNavigate && onNavigate('compose')}
              className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-slate-450" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add
            </button>

            <button
              onClick={() => onLogout && onLogout()}
              className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100/50 transition-all shadow-sm cursor-pointer ml-3"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SECTION (WELCOME & DRAFTS) */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
                Welcome Back.<br />
                Manage your social presence with ease.
              </h1>
              
              {/* Summary Items list */}
              <div className="flex flex-col gap-3 mt-5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <span className="text-[10px]">📅</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Centralized Dashboard</span>
                  <span className="text-xs text-slate-400">— View all your social metrics and tools.</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <span className="text-[10px]">📊</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Performance Reports</span>
                  <span className="text-xs text-slate-400">— Generate detailed, insights-driven reports.</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                    <span className="text-[10px]">🔔</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Audience Growth</span>
                  <span className="text-xs text-slate-400">— Track and engage new followers.</span>
                </div>
              </div>
            </div>

            {/* Split cards list */}
            <div className="grid sm:grid-cols-2 gap-5 items-start mt-2">
              
              {/* Drafts Cards List */}
              <div className="relative">
                
                {/* Floating Elements on drafts */}
                <div className="absolute -top-3.5 right-6 w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-md animate-float-insta-dash z-20">
                  <span className="text-[9px]">📸</span>
                </div>
                <div className="absolute -left-3.5 top-[40%] w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-md animate-float-tw-dash z-20">
                  <span className="text-[7px] font-bold">𝕏</span>
                </div>
                <div className="absolute -bottom-3.5 left-1/3 w-6 h-6 rounded-full bg-[#0a66c2] text-white flex items-center justify-center shadow-md animate-float-in-dash z-20">
                  <span className="text-[7px] font-bold">in</span>
                </div>
                <div className="absolute -bottom-3.5 -left-3 animate-float-insta-dash z-20 pointer-events-none">
                  <svg viewBox="0 0 100 120" className="w-8 h-10" fill="none">
                    <path d="M35 85 L38 110 H62 L65 85 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" />
                    <path d="M48 80 Q35 70 25 55 Q35 50 47 70 Z" fill="#a7f3d0" stroke="#34d399" strokeWidth="1.5" />
                    <path d="M50 80 Q50 50 50 30 Q60 40 52 70 Z" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4 relative z-10">
                  <h3 className="text-xs font-bold text-slate-700 border-b border-slate-50 pb-2">Post Generator Drafts</h3>
                  
                  <div className="flex flex-col gap-3">
                    {draftsList.map((d) => (
                      <div key={d.id} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl border border-slate-100/30">
                        {renderThumbnail(d.platform)}
                        
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-slate-800 block truncate">{d.title}</span>
                          <p className="text-[8px] text-slate-400 truncate mt-0.5">{d.body}</p>
                          <span className="inline-block mt-1 text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-55 text-indigo-600 bg-indigo-50 border border-indigo-100">
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights Cards List */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-700 border-b border-slate-50 pb-2">Content Calendar Highlights</h3>
                
                <div className="flex flex-col gap-3">
                  {highlightsList.map((h) => (
                    <div key={h.id} className="flex flex-col gap-1 text-[9px] leading-normal pl-3 border-l-2 border-indigo-500">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
                        {h.title}
                      </span>
                      <p className="text-slate-500 mt-0.5">{h.body}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SECTION (CONNECTED ACCOUNTS & WIDGETS) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Connected Accounts Card */}
            <div className="relative">
              
              {/* Floating icons around accounts */}
              <div className="absolute -top-3.5 left-[80%] w-6 h-6 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-md animate-float-insta-dash z-20">
                <span className="text-[9px]">📸</span>
              </div>
              <div className="absolute -top-4 left-[90%] w-6 h-6 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-md animate-float-fb-dash z-20">
                <span className="text-[8px] font-bold">f</span>
              </div>
              <div className="absolute -right-3 top-1/3 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-md animate-float-tw-dash z-20">
                <span className="text-[7px] font-bold">𝕏</span>
              </div>
              <div className="absolute -right-2.5 top-[60%] w-6 h-6 rounded-full bg-[#0a66c2] text-white flex items-center justify-center shadow-md animate-float-in-dash z-20">
                <span className="text-[7px] font-bold">in</span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4 relative z-10">
                <h3 className="text-xs font-bold text-slate-700 border-b border-slate-50 pb-2">Social Accounts Connected</h3>
                
                <div className="grid grid-cols-4 gap-3.5">
                  {/* Instagram Card */}
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20 flex flex-col items-center gap-2">
                    {instagramAccount && instagramAccount.avatar_url ? (
                      <img src={instagramAccount.avatar_url} alt="Instagram profile" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow shadow-pink-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shrink-0 shadow shadow-pink-100">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-800">Instagram</span>
                    
                    {instagramAccount ? (
                      <span className="text-[8px] font-bold text-emerald-500 flex flex-col items-center gap-0.5">
                        <span>✓ Connected</span>
                        <span className="text-slate-400 font-normal truncate max-w-[70px]" title={instagramAccount.handle}>@{instagramAccount.handle}</span>
                      </span>
                    ) : (
                      <span 
                        onClick={() => onNavigate && onNavigate('accounts')}
                        className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        + Link
                      </span>
                    )}
                  </div>

                  {/* Facebook Card */}
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20 flex flex-col items-center gap-2">
                    {facebookAccount && facebookAccount.avatar_url ? (
                      <img src={facebookAccount.avatar_url} alt="Facebook profile" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow shadow-blue-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#1877f2] text-white flex items-center justify-center shrink-0 shadow shadow-blue-100">
                        <span className="text-base font-bold">f</span>
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-800">Facebook</span>
                    
                    {facebookAccount ? (
                      <span className="text-[8px] font-bold text-emerald-500 flex flex-col items-center gap-0.5">
                        <span>✓ Connected</span>
                        <span className="text-slate-400 font-normal truncate max-w-[70px]" title={facebookAccount.handle}>@{facebookAccount.handle}</span>
                      </span>
                    ) : (
                      <span 
                        onClick={() => onNavigate && onNavigate('accounts')}
                        className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        + Link
                      </span>
                    )}
                  </div>

                  {/* Twitter (X) Card */}
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20 flex flex-col items-center gap-2">
                    {twitterAccount && twitterAccount.avatar_url ? (
                      <img src={twitterAccount.avatar_url} alt="Twitter profile" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow shadow-slate-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow shadow-slate-200">
                        <span className="text-xs font-bold">𝕏</span>
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-800 font-mono">Twitter (X)</span>
                    
                    {twitterAccount ? (
                      <span className="text-[8px] font-bold text-emerald-500 flex flex-col items-center gap-0.5">
                        <span>✓ Connected</span>
                        <span className="text-slate-400 font-normal truncate max-w-[70px]" title={twitterAccount.handle}>@{twitterAccount.handle}</span>
                      </span>
                    ) : (
                      <span 
                        onClick={() => onNavigate && onNavigate('accounts')}
                        className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        + Link
                      </span>
                    )}
                  </div>

                  {/* LinkedIn Card */}
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20 flex flex-col items-center gap-2">
                    {linkedInAccount && linkedInAccount.avatar_url ? (
                      <img src={linkedInAccount.avatar_url} alt="LinkedIn profile" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow shadow-blue-50" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center shrink-0 shadow shadow-blue-50">
                        <span className="text-xs font-bold">in</span>
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-800">LinkedIn</span>
                    
                    {linkedInAccount ? (
                      <span className="text-[8px] font-bold text-emerald-500 flex flex-col items-center gap-0.5">
                        <span>✓ Connected</span>
                        <span className="text-slate-400 font-normal truncate max-w-[70px]" title={linkedInAccount.handle}>@{linkedInAccount.handle}</span>
                      </span>
                    ) : (
                      <span 
                        onClick={() => onNavigate && onNavigate('accounts')}
                        className="text-[8px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        + Link
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Widget Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Overall Performance */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-left flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Overall Performance
                </span>
                <span className="text-[11px] font-bold text-slate-800 leading-normal">Positive overall engagement!</span>
                <p className="text-[9px] text-slate-500">You're overall engagement!</p>
              </div>

              {/* Top Performing Platform */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-left flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Top Performing Platform
                </span>
                <span className="text-[11px] font-bold text-slate-800 leading-normal">Top Performing</span>
                <p className="text-[9px] text-slate-500">Platform</p>
              </div>

              {/* New Followers */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-left flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    New Followers
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    Status
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-normal">Positix new followers</span>
                <p className="text-[9px] text-slate-500">You're overall engagement.</p>
              </div>

              {/* Audience Growth */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-left flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    Audience Growth
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    Status
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-normal">Audience growth in</span>
                <p className="text-[9px] text-slate-500">Track and engage new followers.</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
