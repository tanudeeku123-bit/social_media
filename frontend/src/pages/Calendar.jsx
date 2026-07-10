import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { api } from '../api';
import { PLATFORM_LABELS, PLATFORM_HEX, ALL_PLATFORMS } from '../platformStyles';
import { useToast } from '../components/Toast';
import ConfirmButton from '../components/ConfirmButton';

const STATUS_RING = { draft: 'border-slate-800', scheduled: 'border-indigo-500/50', published: 'border-emerald-500/50', failed: 'border-rose-500/50' };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const STATUS_FILTERS = ['', 'draft', 'scheduled', 'published', 'failed'];
const CONFLICT_WINDOW_MS = 30 * 60000;

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function postDateObj(post) {
  const raw = post.status === 'published' ? post.published_at : post.scheduled_at;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d) ? null : d;
}
function formatTime(d) {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
function formatTimeWithZone(d) {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
}
function snippet(content, len = 42) {
  const clean = content.replace(/\s+/g, ' ').trim();
  return clean.length > len ? clean.slice(0, len).trim() + '…' : clean;
}
function toICSDate(d) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
function escapeICS(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
function googleCalUrl(post, d) {
  const start = toICSDate(d);
  const end = toICSDate(new Date(d.getTime() + 30 * 60000));
  const text = encodeURIComponent(`${PLATFORM_LABELS[post.platform] || post.platform} post`);
  const details = encodeURIComponent(post.content);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`;
}
function startOfWeek(d) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() - nd.getDay());
  nd.setHours(0, 0, 0, 0);
  return nd;
}
function sameContentSignature(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i], y = b[i];
    if (x.id !== y.id || x.status !== y.status || x.scheduled_at !== y.scheduled_at || x.content !== y.content || x.published_at !== y.published_at) return false;
  }
  return true;
}

const PostCard = memo(function PostCard({ p, rescheduling, rescheduleValue, onRescheduleValueChange, onStartReschedule, onSaveReschedule, onCancelReschedule, onRetry, onRemove }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 tracking-wider uppercase" style={{ color: PLATFORM_HEX[p.platform] }}>
          {PLATFORM_LABELS[p.platform] || p.platform}
        </span>
        {p._time && <span className="font-mono text-xs font-bold text-slate-400">{formatTimeWithZone(p._time)}</span>}
      </div>
      <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{p.content}</p>
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
        <span>Status: {p.status}</span>
      </div>

      {p.status === 'failed' && p.publish_result && (
        <p className="text-xs text-rose-400 font-mono bg-rose-500/10 rounded-xl px-3 py-1.5 border border-rose-500/20">{p.publish_result}</p>
      )}

      {rescheduling === p.id ? (
        <div className="pt-3 border-t border-slate-850 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="datetime-local"
              value={rescheduleValue}
              onChange={(e) => onRescheduleValueChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-mono"
            />
            <button onClick={() => onSaveReschedule(p)} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">Save</button>
            <button onClick={onCancelReschedule} className="text-xs font-semibold text-slate-500 hover:text-slate-400">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 text-xs font-semibold pt-3 border-t border-slate-850 items-center">
          {p.status === 'failed' && (
            <button onClick={() => onRetry(p)} className="text-indigo-400 hover:underline">Retry</button>
          )}
          {p.status !== 'published' && (
            <button onClick={() => onStartReschedule(p)} className="text-indigo-400 hover:underline">Reschedule</button>
          )}
          {p._time && (
            <a href={googleCalUrl(p, p._time)} target="_blank" rel="noreferrer" className="text-slate-400 hover:underline">+ Google Cal</a>
          )}
          <ConfirmButton onConfirm={() => onRemove(p.id)} className="text-rose-400 hover:underline ml-auto" confirmLabel="Confirm delete?">
            Delete Post
          </ConfirmButton>
        </div>
      )}
    </div>
  );
});

const DayCell = memo(function DayCell({
  cellKey, dayNum, inMonth, dayPosts, isToday, isSelected, isFocused, isDragOver, maxDayCount,
  onFocusCell, onClickCell, onDragOverCell, onDragLeaveCell, onDropCell, onChipDragStart,
}) {
  const intensity = dayPosts.length / maxDayCount;
  return (
    <button
      id={`cal-cell-${cellKey}`}
      tabIndex={isFocused ? 0 : -1}
      onFocus={() => onFocusCell(cellKey)}
      onClick={() => onClickCell(cellKey)}
      onDragOver={(e) => { e.preventDefault(); onDragOverCell(cellKey); }}
      onDragLeave={() => onDragLeaveCell(cellKey)}
      onDrop={(e) => onDropCell(e, cellKey)}
      className={`text-left rounded-xl border p-2 min-h-[85px] transition-all flex flex-col justify-between ${inMonth ? '' : 'opacity-30'} ${
        isSelected ? 'border-indigo-500 bg-indigo-500/5' : isDragOver ? 'border-indigo-500 border-dashed bg-slate-900' : isToday ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-900/10'
      }`}
      style={{ backgroundColor: dayPosts.length > 0 ? `rgba(99,102,241,${(0.04 + intensity * 0.15).toFixed(2)})` : '' }}
    >
      <div className={`text-xs font-mono font-bold ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>
        {dayNum}{isToday && <span className="ml-1 text-[10px]">📍</span>}
      </div>
      <div className="flex flex-col gap-1 w-full mt-1.5">
        {dayPosts.slice(0, 3).map((p) => (
          <div
            key={p.id}
            draggable={p.status !== 'published'}
            onDragStart={(e) => onChipDragStart(e, p.id)}
            title={`${PLATFORM_LABELS[p.platform] || p.platform} · ${p.status} · ${formatTime(p._time)} · ${p.content}`}
            className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 border text-[10px] font-medium truncate ${STATUS_RING[p.status]} ${p.status !== 'published' ? 'cursor-grab' : ''}`}
            style={{ backgroundColor: `${PLATFORM_HEX[p.platform]}15` }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_HEX[p.platform] }} />
            <span className="text-slate-200 truncate">{formatTime(p._time)}</span>
          </div>
        ))}
        {dayPosts.length > 3 && (
          <span className="text-[9px] font-semibold text-indigo-400">+ {dayPosts.length - 3} more</span>
        )}
      </div>
    </button>
  );
}, (prev, next) =>
  prev.dayPosts === next.dayPosts &&
  prev.isToday === next.isToday &&
  prev.isSelected === next.isSelected &&
  prev.isFocused === next.isFocused &&
  prev.isDragOver === next.isDragOver &&
  prev.inMonth === next.inMonth &&
  prev.maxDayCount === next.maxDayCount
);

export default function Calendar({ refreshKey, defaultPlatforms }) {
  const myPlatforms = defaultPlatforms?.length ? defaultPlatforms : ALL_PLATFORMS;

  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [supportedPlatforms, setSupportedPlatforms] = useState(ALL_PLATFORMS);
  
  // Connection Form states
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState('instagram');
  const [connectHandle, setConnectHandle] = useState('');
  const [connectPassword, setConnectPassword] = useState('');
  const [connectError, setConnectError] = useState('');
  const [connectBusy, setConnectBusy] = useState(false);

  // Compose Form states
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [composePlatform, setComposePlatform] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composeTime, setComposeTime] = useState('12:00');
  const [composeBusy, setComposeBusy] = useState(false);
  const [composeError, setComposeError] = useState('');

  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'agenda'
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [weekCursor, setWeekCursor] = useState(() => startOfWeek(new Date()));
  const [statusFilter, setStatusFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState(() => new Set(myPlatforms));
  const [selectedDate, setSelectedDate] = useState(null);
  const [focusedKey, setFocusedKey] = useState(dateKey(new Date()));
  const [rescheduling, setRescheduling] = useState(null);
  const [rescheduleValue, setRescheduleValue] = useState('');
  const [dragOverKey, setDragOverKey] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [bulkShiftDays, setBulkShiftDays] = useState(1);
  const showToast = useToast();
  const postsByDateCacheRef = useRef({});

  const cells = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(gridStart); d.setDate(gridStart.getDate() + i); return d; });
  }, [monthCursor]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekCursor); d.setDate(d.getDate() + i); return d; }),
    [weekCursor]
  );

  function loadAccounts() {
    api.getAccounts().then((d) => {
      setAccounts(d.accounts || []);
      if (d.supported_platforms) {
        setSupportedPlatforms(d.supported_platforms);
      }
    });
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    let from, to;
    if (viewMode === 'week') {
      from = weekDays[0];
      to = new Date(weekDays[6].getFullYear(), weekDays[6].getMonth(), weekDays[6].getDate(), 23, 59, 59);
    } else if (viewMode === 'agenda') {
      const now = new Date();
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth() + 4, 0, 23, 59, 59);
    } else {
      from = cells[0];
      to = new Date(cells[41].getFullYear(), cells[41].getMonth(), cells[41].getDate(), 23, 59, 59);
    }
    const params = { from: from.toISOString(), to: to.toISOString() };
    if (statusFilter) params.status = statusFilter;
    api.getPosts(params).then((d) => setPosts(d.posts));
  }, [viewMode, monthCursor, weekCursor, statusFilter, refreshKey]);

  function refresh() {
    let from, to;
    if (viewMode === 'week') {
      from = weekDays[0];
      to = new Date(weekDays[6].getFullYear(), weekDays[6].getMonth(), weekDays[6].getDate(), 23, 59, 59);
    } else if (viewMode === 'agenda') {
      const now = new Date();
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth() + 4, 0, 23, 59, 59);
    } else {
      from = cells[0];
      to = new Date(cells[41].getFullYear(), cells[41].getMonth(), cells[41].getDate(), 23, 59, 59);
    }
    const params = { from: from.toISOString(), to: to.toISOString() };
    if (statusFilter) params.status = statusFilter;
    api.getPosts(params).then((d) => setPosts(d.posts));
  }

  const filteredPosts = useMemo(
    () => posts.filter((p) => platformFilter.has(p.platform)),
    [posts, platformFilter]
  );

  const postsByDate = useMemo(() => {
    const fresh = {};
    for (const p of filteredPosts) {
      const d = postDateObj(p);
      if (!d) continue;
      const key = dateKey(d);
      (fresh[key] = fresh[key] || []).push({ ...p, _time: d });
    }
    for (const key in fresh) fresh[key].sort((a, b) => a._time - b._time);

    const prevCache = postsByDateCacheRef.current;
    const stabilized = {};
    for (const key in fresh) {
      const prevArr = prevCache[key];
      stabilized[key] = prevArr && sameContentSignature(prevArr, fresh[key]) ? prevArr : fresh[key];
    }
    postsByDateCacheRef.current = stabilized;
    return stabilized;
  }, [filteredPosts]);

  const undated = filteredPosts.filter((p) => !postDateObj(p));

  const maxDayCount = useMemo(
    () => Math.max(1, ...cells.map((d) => (postsByDate[dateKey(d)] || []).length)),
    [cells, postsByDate]
  );

  const monthHasPosts = useMemo(
    () => cells.some((d) => d.getMonth() === monthCursor.getMonth() && (postsByDate[dateKey(d)] || []).length > 0),
    [cells, monthCursor, postsByDate]
  );

  const todayKey = dateKey(new Date());
  const yearOptions = Array.from({ length: 9 }, (_, i) => new Date().getFullYear() - 4 + i);

  function goToday() {
    const now = new Date();
    setMonthCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setWeekCursor(startOfWeek(now));
    setFocusedKey(dateKey(now));
    setSelectedDate(null);
  }
  function changeMonth(delta) { setMonthCursor((cur) => new Date(cur.getFullYear(), cur.getMonth() + delta, 1)); setSelectedDate(null); }
  function changeWeek(delta) { setWeekCursor((cur) => { const nd = new Date(cur); nd.setDate(nd.getDate() + delta * 7); return nd; }); setSelectedDate(null); }
  function setMonth(m) { setMonthCursor((cur) => new Date(cur.getFullYear(), m, 1)); }
  function setYear(y) { setMonthCursor((cur) => new Date(y, cur.getMonth(), 1)); }
  function togglePlatformFilter(p) {
    setPlatformFilter((cur) => { const next = new Set(cur); next.has(p) ? next.delete(p) : next.add(p); return next; });
  }

  async function handleConnectAccount(e) {
    e.preventDefault();
    setConnectError('');
    if (!connectHandle.trim()) {
      setConnectError('Profile name / handle is required');
      return;
    }
    setConnectBusy(true);
    try {
      await api.connectAccount(connectPlatform, connectHandle.trim(), connectPlatform === 'bluesky' ? connectPassword.trim() : undefined);
      setConnectHandle('');
      setConnectPassword('');
      showToast('Account connected successfully!', 'success');
      loadAccounts();
      setShowConnectModal(false);
    } catch (err) {
      setConnectError(err.message);
    } finally {
      setConnectBusy(false);
    }
  }

  function toggleComposeForm() {
    if (!showComposeForm) {
      if (accounts.length > 0) {
        setComposePlatform(accounts[0].platform);
      } else {
        setComposePlatform('');
      }
      setComposeContent('');
      setComposeError('');
    }
    setShowComposeForm(!showComposeForm);
  }

  async function handleSchedulePost(e) {
    e.preventDefault();
    setComposeError('');
    if (!composePlatform) {
      setComposeError('Please select a platform');
      return;
    }
    if (!composeContent.trim()) {
      setComposeError('Post content cannot be empty');
      return;
    }
    setComposeBusy(true);
    try {
      const dateStr = `${selectedDate}T${composeTime}:00`;
      const scheduledAt = new Date(dateStr).toISOString();
      
      await api.createPost({
        platform: composePlatform,
        content: composeContent.trim(),
        scheduled_at: scheduledAt
      });
      
      showToast('Post scheduled successfully!', 'success');
      setComposeContent('');
      setShowComposeForm(false);
      refresh();
    } catch (err) {
      setComposeError(err.message);
    } finally {
      setComposeBusy(false);
    }
  }

  function startReschedule(post) {
    setRescheduling(post.id);
    setRescheduleValue(post.scheduled_at ? post.scheduled_at.slice(0, 16) : '');
  }

  async function saveReschedule(post) {
    if (!rescheduleValue) return;
    const previous = { scheduled_at: post.scheduled_at, status: post.status };
    const iso = new Date(rescheduleValue).toISOString();
    setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, scheduled_at: iso, status: 'scheduled' } : p)));
    setRescheduling(null);
    try {
      await api.updatePost(post.id, { content: post.content, platform: post.platform, scheduled_at: iso });
      showToast('Post rescheduled', 'success');
    } catch (err) {
      setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, ...previous } : p)));
      showToast(err.message, 'error');
    }
  }

  async function retryPublish(post) {
    try {
      await api.publishNow(post.id);
      showToast('Re-triggering publishing…', 'info');
      refresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function remove(id) {
    const removed = posts.find((p) => p.id === id);
    setPosts((cur) => cur.filter((p) => p.id !== id));
    if (rescheduling === id) setRescheduling(null);
    try {
      await api.deletePost(id);
      showToast('Post deleted', 'info');
    } catch (err) {
      if (removed) setPosts((cur) => [...cur, removed]);
      showToast(err.message, 'error');
    }
  }

  const handleDragStart = useCallback((e, postId) => {
    e.dataTransfer.setData('text/plain', postId);
  }, []);

  const handleDrop = useCallback(async (e, targetKey) => {
    e.preventDefault();
    const holdingShift = e.shiftKey;
    setDragOverKey(null);
    const postId = e.dataTransfer.getData('text/plain');

    setPosts((currentPosts) => {
      const post = currentPosts.find((p) => p.id === postId);
      if (!post || post.status === 'published') return currentPosts;

      const existing = postDateObj(post) || new Date();
      const target = keyToDate(targetKey);
      target.setHours(existing.getHours(), existing.getMinutes());

      const dayPosts = (postsByDate[targetKey] || []).filter((p) => p.id !== post.id);
      const conflict = dayPosts.find((p) => p.platform === post.platform && Math.abs(p._time - target) < CONFLICT_WINDOW_MS);
      if (conflict) {
        const proceed = window.confirm(
            `Another ${PLATFORM_LABELS[post.platform] || post.platform} post is scheduled within 30 min. Proceed?`
        );
        if (!proceed) return currentPosts;
      }

      const previous = { scheduled_at: post.scheduled_at, status: post.status };
      const iso = target.toISOString();

      api.updatePost(post.id, { content: post.content, platform: post.platform, scheduled_at: iso })
        .then(() => {
          showToast('Post moved successfully', 'success');
          if (holdingShift) startReschedule({ ...post, scheduled_at: iso });
        })
        .catch((err) => {
          setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, ...previous } : p)));
          showToast(err.message, 'error');
        });

      return currentPosts.map((p) => (p.id === post.id ? { ...p, scheduled_at: iso, status: 'scheduled' } : p));
    });
  }, [postsByDate, showToast]);

  const moveFocus = useCallback((deltaDays) => {
    setFocusedKey((cur) => {
      const nd = keyToDate(cur);
      nd.setDate(nd.getDate() + deltaDays);
      const nk = dateKey(nd);
      setMonthCursor((mc) => (nd.getMonth() !== mc.getMonth() || nd.getFullYear() !== mc.getFullYear()) ? new Date(nd.getFullYear(), nd.getMonth(), 1) : mc);
      requestAnimationFrame(() => document.getElementById(`cal-cell-${nk}`)?.focus());
      return nk;
    });
  }, []);

  function handleGridKeyDown(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); moveFocus(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveFocus(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(7); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-7); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDate(focusedKey); }
  }

  const onFocusCell = useCallback((key) => setFocusedKey(key), []);
  const onClickCell = useCallback((key) => setSelectedDate((cur) => (cur === key ? null : key)), []);
  const onDragOverCell = useCallback((key) => setDragOverKey(key), []);
  const onDragLeaveCell = useCallback((key) => setDragOverKey((cur) => (cur === key ? null : cur)), []);

  const selectedPosts = selectedDate ? (postsByDate[selectedDate] || []) : [];

  return (
    <div className="text-slate-100 font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Calendar Dashboard</h1>
        <p className="text-slate-400 text-sm">Organize and reschedule posts using calendar layouts with modern drag & drop controls.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={goToday} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors">
              Today
            </button>
            <div className="flex items-center border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <button onClick={() => changeMonth(-1)} className="px-3 py-2 text-xs hover:bg-slate-900 transition-colors">‹</button>
              <span className="px-4 text-sm font-bold text-white uppercase tracking-wider">
                {MONTH_NAMES[monthCursor.getMonth()]} {monthCursor.getFullYear()}
              </span>
              <button onClick={() => changeMonth(1)} className="px-3 py-2 text-xs hover:bg-slate-900 transition-colors">›</button>
            </div>

            <button 
              onClick={() => { setConnectError(''); setShowConnectModal(true); }}
              className="px-4 py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 font-semibold text-xs hover:bg-indigo-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Connect Channel
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  statusFilter === s ? 'bg-indigo-600 border-transparent text-white' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {s || 'All Statuses'}
              </button>
            ))}
          </div>
        </div>

        {/* Platform filter row */}
        {myPlatforms.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900/60">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mr-2">Channels:</span>
            {myPlatforms.map((p) => (
              <button
                key={p}
                onClick={() => togglePlatformFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  platformFilter.has(p) ? 'text-white' : 'text-slate-500 border-slate-900 bg-transparent'
                }`}
                style={platformFilter.has(p) ? { backgroundColor: PLATFORM_HEX[p], borderColor: PLATFORM_HEX[p] } : {}}
              >
                {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
        )}

        {/* Grid cells */}
        <div className="grid grid-cols-7 gap-2 mb-1.5">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-2">{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2" onKeyDown={handleGridKeyDown}>
          {cells.map((d) => {
            const key = dateKey(d);
            return (
              <DayCell
                key={key}
                cellKey={key}
                dayNum={d.getDate()}
                inMonth={d.getMonth() === monthCursor.getMonth()}
                dayPosts={postsByDate[key] || []}
                isToday={key === todayKey}
                isSelected={key === selectedDate}
                isFocused={key === focusedKey}
                isDragOver={key === dragOverKey}
                maxDayCount={maxDayCount}
                onFocusCell={onFocusCell}
                onClickCell={onClickCell}
                onDragOverCell={onDragOverCell}
                onDragLeaveCell={onDragLeaveCell}
                onDropCell={handleDrop}
                onChipDragStart={handleDragStart}
              />
            );
          })}
        </div>

        {!monthHasPosts && (
          <p className="text-center py-10 text-slate-500 text-sm">No items scheduled or published in this calendar view range.</p>
        )}
      </div>

      {/* Overlay for selected day detail card */}
      {selectedDate && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm" onClick={() => { setSelectedDate(null); setShowComposeForm(false); }}>
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {keyToDate(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <button onClick={() => { setSelectedDate(null); setShowComposeForm(false); }} className="text-slate-400 hover:text-white text-2xl font-semibold leading-none cursor-pointer">×</button>
            </div>
            {selectedPosts.length === 0 && !showComposeForm && (
              <p className="text-sm text-slate-500 mb-4">No scheduled events for this date.</p>
            )}
            <div className="space-y-4">
              {selectedPosts.map((p) => (
                <PostCard
                  key={p.id}
                  p={p}
                  rescheduling={rescheduling}
                  rescheduleValue={rescheduleValue}
                  onRescheduleValueChange={setRescheduleValue}
                  onStartReschedule={startReschedule}
                  onSaveReschedule={saveReschedule}
                  onCancelReschedule={() => setRescheduling(null)}
                  onRetry={retryPublish}
                  onRemove={remove}
                />
              ))}
            </div>

            {/* Inline Compose Form inside overlay */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              {!showComposeForm ? (
                <button
                  onClick={toggleComposeForm}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Schedule New Post
                </button>
              ) : (
                <form onSubmit={handleSchedulePost} className="space-y-4 bg-slate-900/40 p-4 border border-slate-850 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule Post</span>
                    <button 
                      type="button" 
                      onClick={() => setShowComposeForm(false)} 
                      className="text-slate-500 hover:text-slate-350 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {accounts.length === 0 ? (
                    <div className="text-center py-2">
                      <p className="text-xs text-amber-400 font-semibold mb-2">No linked accounts found.</p>
                      <button
                        type="button"
                        onClick={() => { setShowConnectModal(true); setShowComposeForm(false); }}
                        className="text-xs text-indigo-400 hover:underline font-bold cursor-pointer"
                      >
                        Link a Channel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Platform Channel</label>
                        <select
                          value={composePlatform}
                          onChange={(e) => setComposePlatform(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-200"
                        >
                          {accounts.map((a) => (
                            <option key={a.id} value={a.platform} className="bg-slate-950 text-slate-200">
                              {PLATFORM_LABELS[a.platform] || a.platform} (@{a.handle})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Post Content / Idea</label>
                        <textarea
                          required
                          rows="3"
                          placeholder="Write your post content here..."
                          value={composeContent}
                          onChange={(e) => setComposeContent(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time of Day</label>
                        <input
                          type="time"
                          required
                          value={composeTime}
                          onChange={(e) => setComposeTime(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>

                      {composeError && <p className="text-rose-400 text-xs font-semibold">{composeError}</p>}

                      <button
                        type="submit"
                        disabled={composeBusy}
                        className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {composeBusy ? 'Saving...' : 'Schedule Post'}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Connection Modal Overlay */}
      {showConnectModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowConnectModal(false)}>
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Link Connection</h3>
              <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={handleConnectAccount} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Platform</label>
                <select
                  value={connectPlatform}
                  onChange={(e) => setConnectPlatform(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-200"
                >
                  {supportedPlatforms.map((p) => (
                    <option key={p} value={p} className="bg-slate-950 text-slate-200">{PLATFORM_LABELS[p] || p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Profile Name / Handle</label>
                <input
                  type="text"
                  required
                  placeholder={connectPlatform === 'bluesky' ? "handle.bsky.social" : "@handle"}
                  value={connectHandle}
                  onChange={(e) => setConnectHandle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {connectPlatform === 'bluesky' ? 'App Password' : 'Account Password'}
                </label>
                <input
                  type="password"
                  required
                  placeholder={connectPlatform === 'bluesky' ? "App Password" : "Password"}
                  value={connectPassword}
                  onChange={(e) => setConnectPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium"
                />
              </div>

              {connectError && <p className="text-rose-400 text-xs font-semibold">{connectError}</p>}

              <button 
                type="submit" 
                disabled={connectBusy}
                className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
              >
                {connectBusy ? 'Connecting...' : 'Link Connection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}