import { useEffect } from 'react';

export default function Home({ onGetStarted, onSignIn, onSignUp }) {
  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-800 relative overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* CSS Micro-Animations injected inline */}
      <style>{`
        @keyframes float-instagram {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-facebook {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-twitter {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(8px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-linkedin {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-dashboard {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-6px) translateX(2px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes float-plant {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animate-float-instagram { animation: float-instagram 6s ease-in-out infinite; }
        .animate-float-facebook { animation: float-facebook 5s ease-in-out infinite; }
        .animate-float-twitter { animation: float-twitter 7s ease-in-out infinite; }
        .animate-float-linkedin { animation: float-linkedin 5.5s ease-in-out infinite; }
        .animate-float-dashboard { animation: float-dashboard 9s ease-in-out infinite; }
        .animate-float-plant { animation: float-plant 8s ease-in-out infinite; }
      `}</style>

      {/* Ambient background glow nodes */}
      <div className="w-[500px] h-[500px] rounded-full bg-indigo-100/50 absolute -top-40 -left-40 blur-[100px] pointer-events-none" />
      <div className="w-[600px] h-[600px] rounded-full bg-purple-100/40 absolute -top-20 -right-60 blur-[120px] pointer-events-none" />
      <div className="w-[500px] h-[500px] rounded-full bg-blue-50/60 absolute bottom-1/4 left-1/3 blur-[110px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2.5">
          {/* Socially Logo */}
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Socially</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#solutions" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            Solutions
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#resources" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            Resources
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
        </nav>

        {/* Header CTA Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onSignIn} 
            className="px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-white border border-indigo-100 rounded-xl hover:bg-indigo-50/50 hover:border-indigo-200 transition-all duration-200"
          >
            Login
          </button>
          <button 
            onClick={onSignUp || onGetStarted} 
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 z-10 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-6 border border-indigo-100/50">
              All-In-One Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
              Manage Smarter.<br />
              Post Better.<br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">Grow Faster.</span>
            </h1>
            <p className="text-[17px] text-slate-600 mb-8 max-w-md leading-relaxed">
              Streamline your social media, engage your audience, and grow your brand with powerful tools in one place.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
              <button
                onClick={onGetStarted}
                className="px-7 py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 group text-base"
              >
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button
                onClick={onSignIn}
                className="px-7 py-4 rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 font-semibold shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2.5 text-base"
              >
                See How It Works
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" className="text-slate-400" />
                </svg>
              </button>
            </div>

            {/* Quick Features Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 w-full">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-50/50 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2.5" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Schedule Posts</h4>
                <p className="text-xs text-slate-500 leading-normal">Plan and publish across platforms</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-50/50 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <path d="M4 4l5 5 4-4 7 7" strokeWidth="2.5" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Analytics</h4>
                <p className="text-xs text-slate-500 leading-normal">Track performance in real-time</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-sm shadow-pink-50/50 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2.5" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Engage</h4>
                <p className="text-xs text-slate-500 leading-normal">Respond and build connections</p>
              </div>
            </div>
          </div>

          {/* Hero Right Column (Dashboard Mockup) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <div className="relative animate-float-dashboard">
              
              {/* Surrounding Floating Elements */}
              {/* Instagram */}
              <div className="absolute -top-7 left-[45%] -translate-x-1/2 w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shadow-lg shadow-pink-200/50 border-2 border-white animate-float-instagram z-20">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>

              {/* Facebook */}
              <div className="absolute -right-5 top-1/4 w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-lg shadow-blue-200 border-2 border-white animate-float-facebook z-20">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.9.2-1.2 1.1-1.2H15V2h-3c-3.1 0-4 1.6-4 4v2z" />
                </svg>
              </div>

              {/* Twitter / X */}
              <div className="absolute -right-6 top-1/2 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg shadow-slate-300 border-2 border-white animate-float-twitter z-20">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>

              {/* LinkedIn */}
              <div className="absolute -bottom-6 left-1/3 w-10 h-10 rounded-full bg-[#0a66c2] text-white flex items-center justify-center shadow-lg shadow-blue-100 border-2 border-white animate-float-linkedin z-20">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>

              {/* Plant Pot */}
              <div className="absolute -bottom-7 -right-5 animate-float-plant z-20 pointer-events-none">
                <svg viewBox="0 0 100 120" className="w-20 h-24 text-slate-800" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35 85 L38 110 H62 L65 85 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                  <rect x="33" y="80" width="34" height="6" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                  <ellipse cx="50" cy="82" rx="14" ry="2" fill="#78350F" opacity="0.6" />
                  <path d="M48 80 Q35 70 25 55 Q35 50 47 70 Z" fill="#a7f3d0" stroke="#34d399" strokeWidth="1.5" />
                  <path d="M48 80 Q30 65 15 58 Q23 48 45 68 Z" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
                  <path d="M52 80 Q65 72 78 60 Q68 53 53 72 Z" fill="#a7f3d0" stroke="#34d399" strokeWidth="1.5" />
                  <path d="M50 80 Q50 50 50 30 Q60 40 52 70 Z" fill="#059669" stroke="#047857" strokeWidth="1.5" />
                  <path d="M50 80 Q45 55 40 35 Q35 45 48 70 Z" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Main Dashboard Card Wrapper */}
              <div className="w-[580px] max-w-full bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(99,102,241,0.06)] overflow-hidden flex flex-row shrink-0 relative z-10">
                
                {/* Mock sidebar (left side) */}
                <div className="w-14 border-r border-slate-100/80 bg-slate-50/50 flex flex-col items-center py-5 gap-6">
                  {/* Active Home Icon */}
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  
                  {/* Other Mock Sidebar Icons */}
                  <div className="text-slate-400 flex flex-col gap-5 pt-2">
                    <svg className="w-4 h-4 hover:text-slate-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <svg className="w-4 h-4 hover:text-slate-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <svg className="w-4 h-4 hover:text-slate-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <svg className="w-4 h-4 hover:text-slate-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    <svg className="w-4 h-4 hover:text-slate-600 transition-colors cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="flex-1 p-5 flex flex-col gap-4">
                  
                  {/* Top Dashboard Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-[15px]">Dashboard</h3>
                    </div>
                    
                    {/* Right Info Controls */}
                    <div className="flex items-center gap-2.5">
                      <div className="px-2.5 py-1.5 border border-slate-100 rounded-lg text-[10px] font-semibold text-slate-500 bg-slate-50/50 flex items-center gap-1.5 cursor-pointer">
                        May 12 - May 18, 2024
                        <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                      
                      <div className="w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 bg-slate-50/50 hover:text-slate-600 cursor-pointer">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </div>

                      {/* Mock avatar */}
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200">
                        <svg viewBox="0 0 32 32" className="w-full h-full fill-slate-300 bg-slate-100">
                          <path d="M16 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6zm0 16c-7.33 0-11 4.67-11 7v1h22v-1c0-2.33-3.67-7-11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {/* Stat item */}
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20">
                      <span className="text-[9px] font-semibold text-slate-400 block mb-1">Total Reach</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-800">125.4K</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center">
                          ▲ 12.5%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20">
                      <span className="text-[9px] font-semibold text-slate-400 block mb-1">Engagement</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-800">18.7K</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center">
                          ▲ 8.3%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20">
                      <span className="text-[9px] font-semibold text-slate-400 block mb-1">New Followers</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-800">2.4K</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center">
                          ▲ 15.7%
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/20">
                      <span className="text-[9px] font-semibold text-slate-400 block mb-1">Link Clicks</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-800">3.6K</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center">
                          ▲ 11.2%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle row: Performance Spline Chart & Top Platforms Donut */}
                  <div className="grid grid-cols-12 gap-3.5">
                    
                    {/* Performance Overview Spline */}
                    <div className="col-span-8 p-3.5 border border-slate-100 rounded-2xl flex flex-col gap-2 relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-700">Performance Overview</span>
                        <div className="px-2 py-1 border border-slate-100 rounded-md text-[8px] font-bold text-slate-500 bg-slate-50 flex items-center gap-1 cursor-pointer">
                          Last 7 Days
                          <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Spline Path Chart SVG */}
                      <div className="w-full flex-1 min-h-[110px] flex items-center">
                        <svg className="w-full h-[110px]" viewBox="0 0 350 110">
                          <defs>
                            <linearGradient id="chart-grad-mock" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          
                          {/* Grid Lines */}
                          <line x1="0" y1="15" x2="350" y2="15" stroke="#f8fafc" strokeDasharray="3 3" />
                          <line x1="0" y1="45" x2="350" y2="45" stroke="#f8fafc" strokeDasharray="3 3" />
                          <line x1="0" y1="75" x2="350" y2="75" stroke="#f8fafc" strokeDasharray="3 3" />
                          <line x1="0" y1="100" x2="350" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                          
                          {/* Area path */}
                          <path d="M 0 80 Q 30 95, 60 70 T 120 50 T 180 85 T 240 60 T 300 35 T 350 40 L 350 100 L 0 100 Z" fill="url(#chart-grad-mock)" />
                          {/* Spline line */}
                          <path d="M 0 80 Q 30 95, 60 70 T 120 50 T 180 85 T 240 60 T 300 35 T 350 40" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                          
                          {/* Highlight Dots */}
                          <circle cx="120" cy="50" r="3.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                          <circle cx="300" cy="35" r="3.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                        </svg>
                      </div>

                      {/* X Axis Labels */}
                      <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1">
                        <span>May 12</span>
                        <span>May 13</span>
                        <span>May 14</span>
                        <span>May 15</span>
                        <span>May 16</span>
                        <span>May 17</span>
                        <span>May 18</span>
                      </div>
                    </div>

                    {/* Top Platforms Donut */}
                    <div className="col-span-4 p-3.5 border border-slate-100 rounded-2xl flex flex-col items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 w-full text-left mb-1">Top Platforms</span>
                      
                      {/* Donut Chart SVG */}
                      <div className="relative my-1">
                        <svg className="w-24 h-24" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f8fafc" strokeWidth="3.2" />
                          
                          {/* Instagram arc (45%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="3.2" strokeDasharray="45 55" strokeDashoffset="25" />
                          {/* Facebook arc (30%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="30 70" strokeDashoffset="-20" />
                          {/* Twitter arc (15%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e293b" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-50" />
                          {/* LinkedIn arc (10%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3.2" strokeDasharray="10 90" strokeDashoffset="-65" />
                          
                          <text x="18" y="16.5" textAnchor="middle" fontSize="3" fontWeight="bold" fill="#94a3b8" className="font-sans">Total</text>
                          <text x="18" y="21.5" textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#0f172a" className="font-sans">125.4K</text>
                        </svg>
                      </div>

                      {/* Legend List */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 w-full text-[8px] font-bold text-slate-500">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></span>
                          <span>Instagram</span>
                          <span className="ml-auto text-slate-400">45%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                          <span>Facebook</span>
                          <span className="ml-auto text-slate-400">30%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0"></span>
                          <span>Twitter</span>
                          <span className="ml-auto text-slate-400">15%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                          <span>LinkedIn</span>
                          <span className="ml-auto text-slate-400">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Posts list */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-700">Scheduled Posts</span>
                      <div className="px-2 py-1 border border-slate-100 rounded-md text-[8px] font-bold text-slate-500 bg-slate-50 flex items-center gap-1 cursor-pointer">
                        View Calendar
                        <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Horizontal Item Container */}
                    <div className="grid grid-cols-4 gap-2.5">
                      
                      {/* Instagram Schedule Row */}
                      <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/10 flex items-center gap-2">
                        {/* Sunset Thumbnail SVG */}
                        <svg className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
                          <rect width="40" height="40" fill="#fbcfe8" />
                          <circle cx="20" cy="20" r="10" fill="#f43f5e" opacity="0.8" />
                          <path d="M 0 35 L 15 22 L 25 30 L 40 18 L 40 40 L 0 40 Z" fill="#ec4899" />
                          <path d="M 10 40 L 22 28 L 35 37 L 40 33 L 40 40 Z" fill="#db2777" opacity="0.6" />
                        </svg>
                        
                        <div className="min-w-0">
                          <span className="text-[8px] font-bold text-slate-800 block truncate">Mon, May 20</span>
                          <span className="text-[7px] text-slate-400 font-semibold flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-pink-500"></span>
                            10:00 AM
                          </span>
                        </div>
                      </div>

                      {/* Facebook Schedule Row */}
                      <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/10 flex items-center gap-2">
                        {/* Bridge/Water Thumbnail SVG */}
                        <svg className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
                          <rect width="40" height="40" fill="#bfdbfe" />
                          <circle cx="28" cy="12" r="6" fill="#fef08a" />
                          <path d="M 0 32 Q 10 20 20 28 T 40 22 L 40 40 L 0 40 Z" fill="#3b82f6" />
                          <path d="M 0 40 L 15 28 L 28 35 L 40 25 L 40 40 Z" fill="#1d4ed8" opacity="0.7" />
                        </svg>
                        
                        <div className="min-w-0">
                          <span className="text-[8px] font-bold text-slate-800 block truncate">Mon, May 20</span>
                          <span className="text-[7px] text-slate-400 font-semibold flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                            12:00 PM
                          </span>
                        </div>
                      </div>

                      {/* Twitter Schedule Row */}
                      <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/10 flex items-center gap-2">
                        {/* Mountains Thumbnail SVG */}
                        <svg className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
                          <rect width="40" height="40" fill="#bae6fd" />
                          <circle cx="12" cy="12" r="5" fill="#fef08a" />
                          <path d="M 0 30 L 12 18 L 24 28 L 35 15 L 40 20 L 40 40 L 0 40 Z" fill="#0ea5e9" />
                          <path d="M 5 40 L 18 28 L 30 36 L 40 28 L 40 40 Z" fill="#0369a1" opacity="0.6" />
                        </svg>
                        
                        <div className="min-w-0">
                          <span className="text-[8px] font-bold text-slate-800 block truncate">Tue, May 21</span>
                          <span className="text-[7px] text-slate-400 font-semibold flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                            09:00 AM
                          </span>
                        </div>
                      </div>

                      {/* LinkedIn Schedule Row */}
                      <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/10 flex items-center gap-2">
                        {/* Teal Run Thumbnail SVG */}
                        <svg className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100" viewBox="0 0 40 40">
                          <rect width="40" height="40" fill="#ccfbf1" />
                          <circle cx="30" cy="10" r="4" fill="#fb7185" />
                          <path d="M 0 25 L 18 10 L 32 20 L 40 12 L 40 40 L 0 40 Z" fill="#0d9488" />
                          <path d="M 0 32 L 12 24 L 25 35 L 40 22 L 40 40 Z" fill="#0f766e" opacity="0.7" />
                        </svg>
                        
                        <div className="min-w-0">
                          <span className="text-[8px] font-bold text-slate-800 block truncate">Tue, May 21</span>
                          <span className="text-[7px] text-slate-400 font-semibold flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                            03:00 PM
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
          
        </div>

        {/* Partners Logos Section */}
        <div className="mt-28 border-t border-slate-200/60 pt-16 text-center">
          <h5 className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] mb-10">
            Trusted by 10,000+ brands and agencies
          </h5>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 px-4">
            
            {/* HubSpot */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 100 24" fill="currentColor">
              <circle cx="10" cy="12" r="3.5" />
              <line x1="10" y1="12" x2="16" y2="6" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="16" cy="6" r="1.8" />
              <line x1="10" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="18" cy="12" r="1.2" />
              <line x1="10" y1="12" x2="14" y2="18" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="14" cy="18" r="1.8" />
              <text x="25" y="16.5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">HubSpot</text>
            </svg>

            {/* Canva */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 70 24" fill="currentColor">
              <text x="0" y="17" fontSize="16" fontWeight="900" fontFamily="'Playfair Display', serif" fontStyle="italic" letterSpacing="-0.5">Canva</text>
            </svg>

            {/* Airbnb */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 6 18 C 3 18 2 15 5 11 L 10 5 C 11 3 13 3 14 5 L 19 11 C 22 15 21 18 18 18 C 16 18 15 16 14 15 C 13 14 11 14 10 15 C 9 16 8 18 6 18 Z" />
              <circle cx="12" cy="10" r="1.5" fill="currentColor" />
              <text x="28" y="16.5" fontSize="13" fontWeight="bold" stroke="none" fill="currentColor" fontFamily="sans-serif">airbnb</text>
            </svg>

            {/* Amazon */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 100 24" fill="currentColor">
              <text x="5" y="14" fontSize="12" fontWeight="bold" fontFamily="sans-serif">amazon</text>
              <path d="M 8 16.5 Q 26 21.5 44 16.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 41 14.5 L 45 16.5 L 43 19.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Nike */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 60 24" fill="currentColor">
              <path d="M 5 14 C 18 14 38 8 50 3 C 35 10 20 18 2 18 C -1 18 1 15 5 14 Z" />
            </svg>

            {/* Uber */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 60 24" fill="currentColor">
              <text x="5" y="17" fontSize="16" fontWeight="bold" letterSpacing="-0.5" fontFamily="sans-serif">Uber</text>
            </svg>

            {/* Shopify */}
            <svg className="h-5 text-slate-400/80 hover:text-slate-800 transition-colors cursor-pointer" viewBox="0 0 100 24" fill="currentColor">
              <path d="M 5 6 L 3 20 A 2 2 0 0 0 5 22 L 17 22 A 2 2 0 0 0 19 20 L 17 6 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M 8 6 A 3 3 0 0 1 14 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M 11 11 L 11 17" stroke="currentColor" strokeWidth="1.5" />
              <text x="25" y="16.5" fontSize="13" fontWeight="bold" fontFamily="sans-serif">shopify</text>
            </svg>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 z-20 relative">
        <span>© {new Date().getFullYear()} Socially Corp. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
