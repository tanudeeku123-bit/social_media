import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import BrandVoice from './pages/BrandVoice';
import Accounts from './pages/Accounts';
import Calendar from './pages/Calendar';
import Campaigns from './pages/Campaigns';
import { ToastProvider } from './components/Toast';
import { setToken } from './api';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'compose', label: 'Write Post', icon: '✍️' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'campaigns', label: 'Campaigns', icon: '🎯' },
  { id: 'brand', label: 'Brand Voice', icon: '🗣️' },
  { id: 'accounts', label: 'Accounts', icon: '👥' },
];

function AppInner() {
  const [user, setUser] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [tab, setTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const hasToken = !!sessionStorage.getItem('scripta_token');
    if (hasToken) setUser({});
    setCheckedSession(true);
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
    setShowAuth(false); // Redirect back to Home page
  }

  if (!checkedSession) return null;

  if (!user) {
    if (!showAuth) {
      return (
        <Home 
          onGetStarted={() => { setAuthMode('register'); setShowAuth(true); }} 
          onSignIn={() => { setAuthMode('login'); setShowAuth(true); }} 
          onSignUp={() => { setAuthMode('register'); setShowAuth(true); }} 
        />
      );
    }
    return (
      <Auth initialMode={authMode} onAuthed={setUser} onBack={() => setShowAuth(false)} />
    );
  }

  if (tab === 'dashboard') {
    return <Dashboard refreshKey={refreshKey} onNavigate={(newTab) => setTab(newTab)} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen gradient-bg flex text-slate-100 font-sans">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/60 backdrop-blur-md flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">S</div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Scripta</span>
          </div>

          <nav className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full sidebar-link ${tab === t.id ? 'active' : ''}`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-indigo-300">U</div>
            <span className="text-xs font-semibold text-slate-400">Account Connected</span>
          </div>
          <button 
            onClick={logout} 
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Cockpit area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <span className="text-sm font-semibold capitalize text-slate-200">{tab === 'compose' ? 'Write Post' : tab} View</span>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">Cockpit v1.0</span>
            <button 
              onClick={logout} 
              className="text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 max-w-5xl w-full mx-auto">
          {tab === 'dashboard' && <Dashboard refreshKey={refreshKey} />}
          {tab === 'compose' && <Compose onSaved={() => { setRefreshKey((k) => k + 1); setTab('dashboard'); }} />}
          {tab === 'calendar' && <Calendar refreshKey={refreshKey} />}
          {tab === 'campaigns' && <Campaigns onOpenCampaign={() => setTab('dashboard')} />}
          {tab === 'brand' && <BrandVoice />}
          {tab === 'accounts' && <Accounts />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
