import React, { useState } from 'react';
import { FiZap, FiEye, FiTrendingUp, FiType, FiUpload, FiChevronRight, FiRefreshCw, FiStar, FiSun, FiMoon } from 'react-icons/fi';

const CATEGORIES = [
  { id: 1, name: 'Film & Animation' }, { id: 2, name: 'Autos & Vehicles' },
  { id: 10, name: 'Music' }, { id: 15, name: 'Pets & Animals' },
  { id: 17, name: 'Sports' }, { id: 19, name: 'Travel & Events' },
  { id: 20, name: 'Gaming' }, { id: 22, name: 'People & Blogs' },
  { id: 23, name: 'Comedy' }, { id: 24, name: 'Entertainment' },
  { id: 25, name: 'News & Politics' }, { id: 26, name: 'Howto & Style' },
  { id: 27, name: 'Education' }, { id: 28, name: 'Science & Technology' },
];

const SUBSCRIBER_RANGES = [
  { value: 500, label: '0–1K', min: 0, max: 1000 },
  { value: 5000, label: '1K–10K', min: 1000, max: 10000 },
  { value: 25000, label: '10K–50K', min: 10000, max: 50000 },
  { value: 75000, label: '50K–100K', min: 50000, max: 100000 },
  { value: 175000, label: '100K–250K', min: 100000, max: 250000 },
  { value: 375000, label: '250K–500K', min: 250000, max: 500000 },
  { value: 750000, label: '500K–1M', min: 500000, max: 1000000 },
  { value: 5000000, label: '1M–10M', min: 1000000, max: 10000000 },
  { value: 15000000, label: '10M+', min: 10000000, max: 100000000 },
];

const THEMES = {
  dark: {
    page:          { background: '#0d1220', color: '#e2e8f0' },
    panel:         { background: '#1e2a3f', border: '1px solid rgba(255,255,255,0.12)' },
    card:          { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' },
    input:         { background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9' },
    cta:           { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 24px rgba(220,38,38,0.3)' },
    heroGrad:      { background: 'linear-gradient(135deg,rgba(220,38,38,0.15),rgba(185,28,28,0.08))', border: '1px solid rgba(220,38,38,0.25)' },
    emptyBg:       { background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' },
    toggleBg:      { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' },
    tabActive:     { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 24px rgba(220,38,38,0.3)', color: '#fff' },
    tabInactive:   { color: '#64748b' },
    sectionBorder: { borderBottom: '1px solid rgba(255,255,255,0.08)' },
    previewBorder: { borderTop: '1px solid rgba(255,255,255,0.06)' },
    thumbBg:       { background: '#0a0e18' },
    counterBg:     { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' },
    inputCls:      'w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all',
    labelCls:      'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2',
    titleCls:      'text-white',
    subCls:        'text-slate-400',
    mutedCls:      'text-slate-500',
    dimCls:        'text-slate-600',
  },
  light: {
    page:          { background: '#ffffff', color: '#111111' },
    panel:         { background: '#ffffff', border: '1px solid #fecaca', boxShadow: '0 1px 6px rgba(220,38,38,0.06)' },
    card:          { background: '#fff5f5', border: '1px solid #fecaca' },
    input:         { background: '#ffffff', border: '1px solid #fca5a5', color: '#111111' },
    cta:           { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 24px rgba(220,38,38,0.25)' },
    heroGrad:      { background: 'linear-gradient(135deg,rgba(220,38,38,0.07),rgba(185,28,28,0.03))', border: '1px solid rgba(220,38,38,0.2)' },
    emptyBg:       { background: '#fff5f5', border: '1px dashed #fca5a5' },
    toggleBg:      { background: '#fff5f5', border: '1px solid #fecaca' },
    tabActive:     { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 24px rgba(220,38,38,0.25)', color: '#fff' },
    tabInactive:   { color: '#dc2626' },
    sectionBorder: { borderBottom: '1px solid #fecaca' },
    previewBorder: { borderTop: '1px solid #fecaca' },
    thumbBg:       { background: '#fff5f5' },
    counterBg:     { background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)' },
    inputCls:      'w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-red-300 outline-none transition-all',
    labelCls:      'block text-xs font-semibold text-red-400 uppercase tracking-wider mb-2',
    titleCls:      'text-gray-900',
    subCls:        'text-gray-600',
    mutedCls:      'text-red-400',
    dimCls:        'text-red-300',
  },
};

const fmt = (n) => { if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`; if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`; return String(n); };
const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

const PostPredictorV2 = () => {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('pp_theme') || 'dark');
  const T = THEMES[themeKey];
  const isDark = themeKey === 'dark';
  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setThemeKey(next);
    localStorage.setItem('pp_theme', next);
  };

  const [mode, setMode] = useState('predict');
  const [form, setForm] = useState({
    title: '', description: '', thumbnail_url: '', thumbnail_file: null,
    category_id: 24, subscriber_count: 10000, duration_seconds: 600,
  });
  const [predictions, setPredictions] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictErr, setPredictErr] = useState(null);
  const [predictionsRemaining, setPredictionsRemaining] = useState(5);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [personalizedModel, setPersonalizedModel] = useState(null);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelResults, setChannelResults] = useState([]);
  const [isSearchingChannel, setIsSearchingChannel] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [nlpResults, setNlpResults] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [nlpErr, setNlpErr] = useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) { setPredictionsRemaining(999); return; }
    const today = new Date().toDateString();
    const stored = localStorage.getItem('predictionLimit');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      setPredictionsRemaining(date === today ? Math.max(0, 5 - count) : 5);
      if (date !== today) localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count: 0 }));
    } else {
      localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handlePredict = async () => {
    if (!form.title || !form.description) { setPredictErr('Title and description required'); return; }
    const token = localStorage.getItem('token');
    if (!token && predictionsRemaining <= 0) { setShowLoginPrompt(true); return; }
    setIsPredicting(true); setPredictErr(null);
    try {
      let thumb = form.thumbnail_url;
      if (form.thumbnail_file) {
        thumb = await new Promise(res => { const r = new FileReader(); r.onloadend = () => res(r.result); r.readAsDataURL(form.thumbnail_file); });
      }
      const API = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';
      const endpoint = usePersonalized && personalizedModel
        ? `${API}/predict/personalized/predict`
        : `${API}/predict/`;
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, thumbnail_url: thumb || 'https://via.placeholder.com/1280x720' }),
      });
      if (!res.ok) throw new Error('Prediction failed');
      setPredictions(await res.json());
      if (!token) {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('predictionLimit');
        const count = stored ? JSON.parse(stored).count + 1 : 1;
        localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count }));
        setPredictionsRemaining(Math.max(0, 5 - count));
        if (count >= 5) setShowLoginPrompt(true);
      }
    } catch (e) { setPredictErr(e.message); }
    finally { setIsPredicting(false); }
  };

  const handleOptimize = async () => {
    if (!form.title || !form.description) { setNlpErr('Title and description required'); return; }
    setIsOptimizing(true); setNlpErr(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5000'}/optimizer/optimize-title`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_title: form.title, description: form.description, category_id: form.category_id, subscriber_count: form.subscriber_count, duration_seconds: form.duration_seconds }),
      });
      if (!res.ok) throw new Error('Optimization failed');
      setNlpResults(await res.json());
    } catch (e) { setNlpErr(e.message); }
    finally { setIsOptimizing(false); }
  };

  const handleChannelSearch = async () => {
    if (!channelName.trim()) return;
    setIsSearchingChannel(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5000'}/youtube/search/channel?q=${encodeURIComponent(channelName)}`);
      const data = await res.json();
      setChannelResults(data.items || []);
    } catch (e) { setPredictErr(e.message); }
    finally { setIsSearchingChannel(false); }
  };

  const handleChannelSelect = async (ch) => {
    setIsTrainingModel(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_ML_API_URL || 'http://localhost:5000'}/predict/personalized`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: ch.id.channelId, max_videos: 40 }),
      });
      if (!res.ok) throw new Error('Training failed');
      const data = await res.json();
      setPersonalizedModel(data);
      setUsePersonalized(true);
      setChannelResults([]);
      set('subscriber_count', data.stats.subscriber_count);
    } catch (e) { setPredictErr(e.message); }
    finally { setIsTrainingModel(false); }
  };

  const reset = () => {
    setForm({ title: '', description: '', thumbnail_url: '', thumbnail_file: null, category_id: 24, subscriber_count: 10000, duration_seconds: 600 });
    setPredictions(null); setNlpResults(null); setPredictErr(null); setNlpErr(null);
  };

  const ic = T.inputCls;

  return (
    <div className="w-full" style={T.page}>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-8 relative" style={T.panel}>
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-xl" style={{ color: T.page.color }}>×</button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <FiZap className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: T.page.color }}>Daily Limit Reached</h3>
              <p className={`text-sm ${T.subCls}`}>Create a free account for unlimited predictions.</p>
            </div>
            <div className="space-y-3">
              <a href="/signup" className="block w-full text-center py-3 rounded-xl font-bold text-white text-sm" style={T.cta}>Create Free Account</a>
              <a href="/login" className="block w-full text-center py-3 rounded-xl font-medium text-sm" style={{ ...T.card, color: T.page.color }}>Log In</a>
            </div>
          </div>
        </div>
      )}

      {/* Mode Toggle + Theme Toggle */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 rounded-2xl" style={T.toggleBg}>
          {[
            { id: 'predict', label: 'Performance Predictor', icon: <FiZap className="w-4 h-4" /> },
            { id: 'optimize', label: 'Title Optimizer', icon: <FiType className="w-4 h-4" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setMode(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={mode === tab.id ? T.tabActive : T.tabInactive}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
        <button onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={T.card}>
          {isDark
            ? <><FiSun className="w-4 h-4 text-yellow-400" /><span style={{ color: T.page.color }}>Light Mode</span></>
            : <><FiMoon className="w-4 h-4 text-red-400" /><span style={{ color: T.page.color }}>Dark Mode</span></>}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* LEFT: Input Panel */}
        <div className="xl:col-span-2 space-y-5">

          {/* Prediction counter */}
          {predictionsRemaining < 999 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={T.counterBg}>
              <FiZap className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className={T.subCls}>
                <span className="font-bold" style={{ color: T.page.color }}>{predictionsRemaining}</span> free predictions left today —{' '}
                <a href="/signup" className="text-red-500 hover:text-red-400 underline">sign up for unlimited</a>
              </span>
            </div>
          )}

          {/* Input card */}
          <div className="rounded-2xl overflow-hidden" style={T.panel}>
            <div className="px-6 pt-6 pb-4" style={T.sectionBorder}>
              <h2 className="text-lg font-bold" style={{ color: T.page.color }}>
                {mode === 'predict' ? 'Video Details' : 'Title Optimizer'}
              </h2>
            </div>
            <div className="p-6 space-y-5">

              {/* Title */}
              <div>
                <label className={T.labelCls}>{mode === 'predict' ? 'Video Title *' : 'Base Title *'}</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder={mode === 'predict' ? 'e.g. 10 Python Tips for Beginners' : 'e.g. Python Tutorial'}
                  className={ic} style={T.input} />
              </div>

              {/* Description */}
              <div>
                <label className={T.labelCls}>Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Describe your video content in detail..."
                  rows={4} className={`${ic} resize-none`} style={T.input} />
              </div>

              {/* Category + Subscribers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={T.labelCls}>Category</label>
                  <select value={form.category_id} onChange={e => set('category_id', parseInt(e.target.value))} className={ic} style={T.input}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={T.labelCls}>Subscribers</label>
                  <select value={SUBSCRIBER_RANGES.find(r => form.subscriber_count >= r.min && form.subscriber_count <= r.max)?.value || 10000}
                    onChange={e => set('subscriber_count', parseInt(e.target.value))} className={ic} style={T.input}>
                    {SUBSCRIBER_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Duration */}
              {mode === 'predict' && (
                <div>
                  <label className={T.labelCls}>
                    Duration (seconds) — <span className="text-red-500">{fmtTime(form.duration_seconds)}</span>
                  </label>
                  <input type="number" min="1" value={form.duration_seconds}
                    onChange={e => set('duration_seconds', parseInt(e.target.value))} className={ic} style={T.input} />
                </div>
              )}

              {/* Thumbnail */}
              {mode === 'predict' && (
                <div>
                  <label className={T.labelCls}>Thumbnail</label>
                  <div className="flex gap-2">
                    <input type="url" value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)}
                      placeholder="Paste URL or upload →" disabled={!!form.thumbnail_file}
                      className={`${ic} flex-1`} style={T.input} />
                    <label className="flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer transition-all" style={T.card}>
                      <FiUpload className="w-4 h-4 text-red-400" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) set('thumbnail_file', f); }} />
                    </label>
                  </div>
                  {form.thumbnail_file && <p className="text-xs text-green-500 mt-1">✓ {form.thumbnail_file.name}</p>}
                </div>
              )}

              {/* Error */}
              {(mode === 'predict' ? predictErr : nlpErr) && (
                <div className="px-4 py-3 rounded-xl text-sm text-red-500" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {mode === 'predict' ? predictErr : nlpErr}
                </div>
              )}

              {/* CTA */}
              <button onClick={mode === 'predict' ? handlePredict : handleOptimize}
                disabled={mode === 'predict' ? isPredicting : isOptimizing}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={T.cta}>
                {(mode === 'predict' ? isPredicting : isOptimizing)
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                  : mode === 'predict'
                    ? <><FiZap className="w-4 h-4" />Generate Prediction</>
                    : <><FiType className="w-4 h-4" />Generate Title Variations</>}
              </button>

              {(predictions || nlpResults) && (
                <button onClick={reset} className={`w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${T.subCls}`} style={T.card}>
                  <FiRefreshCw className="w-3.5 h-3.5" />Reset
                </button>
              )}
            </div>
          </div>

          {/* Personalized model */}
          {mode === 'predict' && (
            <div className="rounded-2xl p-5" style={T.panel}>
              <div className="flex items-center gap-2 mb-4">
                <FiStar className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold" style={{ color: T.page.color }}>Personalized Model</span>
                {usePersonalized && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-green-600" style={{ background: 'rgba(34,197,94,0.1)' }}>Active</span>
                )}
              </div>
              {personalizedModel ? (
                <div className="space-y-2 text-sm">
                  <p className={T.subCls}>Channel: <span className="font-medium" style={{ color: T.page.color }}>{personalizedModel.stats.channel_name}</span></p>
                  <p className={T.subCls}>Trained on: <span className="font-medium" style={{ color: T.page.color }}>{personalizedModel.stats.videos_analyzed} videos</span></p>
                  <p className={T.subCls}>Avg views: <span className="font-medium" style={{ color: T.page.color }}>{fmt(personalizedModel.stats.avg_views)}</span></p>
                  <button onClick={() => { setPersonalizedModel(null); setUsePersonalized(false); }} className="text-xs text-red-500 hover:text-red-400 mt-1">Switch to global model</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className={`text-xs ${T.subCls}`}>Train on your channel's 40 most recent videos for tailored predictions.</p>
                  <div className="flex gap-2">
                    <input type="text" value={channelName} onChange={e => setChannelName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleChannelSearch()}
                      placeholder="Your channel name..." className={`${ic} flex-1`} style={{ ...T.input, fontSize: '0.8rem' }} />
                    <button onClick={handleChannelSearch} disabled={isSearchingChannel || isTrainingModel}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={T.cta}>
                      {isSearchingChannel ? '...' : 'Search'}
                    </button>
                  </div>
                  {isTrainingModel && (
                    <div className={`flex items-center gap-2 text-sm ${T.subCls}`}>
                      <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                      Training personalized model...
                    </div>
                  )}
                  {channelResults.map((ch, i) => (
                    <div key={i} onClick={() => handleChannelSelect(ch)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={T.card}>
                      <img src={ch.snippet.thumbnails.default.url} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: T.page.color }}>{ch.snippet.title}</p>
                        <p className={`text-xs truncate ${T.subCls}`}>{ch.snippet.description?.substring(0, 60)}...</p>
                      </div>
                      <FiChevronRight className="w-4 h-4 text-red-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Preview + Results */}
        <div className="xl:col-span-3 space-y-5">

          {/* Live Preview */}
          <div className="rounded-2xl overflow-hidden" style={T.panel}>
            <div className="px-5 py-4 flex items-center justify-between" style={T.sectionBorder}>
              <div className="flex items-center gap-2">
                <FiEye className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold" style={{ color: T.page.color }}>Live Preview</span>
              </div>
              <span className={`text-xs font-mono ${T.dimCls}`}>youtube.com</span>
            </div>
            <div className="p-5">
              <div className="relative rounded-xl overflow-hidden mb-4 aspect-video" style={T.thumbBg}>
                {form.thumbnail_file ? (
                  <img src={URL.createObjectURL(form.thumbnail_file)} alt="" className="w-full h-full object-cover" />
                ) : form.thumbnail_url ? (
                  <img src={form.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(239,68,68,0.1)' }}>
                        <FiUpload className="w-5 h-5 text-red-500" />
                      </div>
                      <p className={`text-xs ${T.mutedCls}`}>No thumbnail yet</p>
                    </div>
                  </div>
                )}
                {form.duration_seconds > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs text-white font-mono" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    {fmtTime(form.duration_seconds)}
                  </div>
                )}
              </div>
              <p className={`font-semibold text-sm line-clamp-2 mb-1 ${T.titleCls}`}>
                {form.title || <span className={T.dimCls}>Your video title will appear here...</span>}
              </p>
              <p className={`text-xs mb-2 ${T.dimCls}`}>Channel Name · Just now</p>
              <p className={`text-xs line-clamp-2 ${T.mutedCls}`}>{form.description || 'Your description will appear here...'}</p>
              <div className="mt-4 pt-4 grid grid-cols-3 gap-2 text-center" style={T.previewBorder}>
                {[
                  { label: 'Category', val: CATEGORIES.find(c => c.id === form.category_id)?.name?.split(' ')[0] || '—' },
                  { label: 'Subs', val: SUBSCRIBER_RANGES.find(r => form.subscriber_count >= r.min && form.subscriber_count <= r.max)?.label || '—' },
                  { label: 'Duration', val: fmtTime(form.duration_seconds) },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className={`text-xs ${T.dimCls}`}>{label}</p>
                    <p className={`text-xs font-semibold ${T.subCls}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PREDICT RESULTS */}
          {mode === 'predict' && predictions && (
            <div className="space-y-4">
              {/* Hero */}
              <div className="rounded-2xl p-6 relative overflow-hidden" style={T.heroGrad}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(220,38,38,0.15),transparent 70%)', filter: 'blur(30px)' }} />
                <p className="text-xs font-mono text-red-500 uppercase tracking-widest mb-2">Predicted Views</p>
                <p className="text-5xl font-black mb-3" style={{ color: T.page.color }}>{fmt(predictions.predicted_views)}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`text-sm ${T.subCls}`}>
                    Model accuracy: <span className="font-bold" style={{ color: T.page.color }}>{(predictions.confidence_score * 100).toFixed(0)}%</span>
                  </span>
                  {predictions.confidence_interval && (
                    <span className="text-xs px-3 py-1 rounded-full text-red-500" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                      {predictions.confidence_interval.range_description}
                    </span>
                  )}
                  <span className={`text-xs ${T.mutedCls}`}>
                    {predictions.model_type === 'personalized' ? '🎯 Personalized' : '🌐 Global Model'}
                  </span>
                </div>
              </div>

              {/* Engagement grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Est. Likes', val: fmt(Math.round(predictions.predicted_views * 0.04)), sub: '~4% of views' },
                  { label: 'Est. Comments', val: fmt(Math.round(predictions.predicted_views * 0.005)), sub: '~0.5% of views' },
                  { label: 'Engagement', val: '4.5%', sub: 'Industry avg' },
                ].map(({ label, val, sub }) => (
                  <div key={label} className="rounded-xl p-4 text-center" style={T.card}>
                    <p className={`text-xs mb-1 ${T.mutedCls}`}>{label}</p>
                    <p className="text-xl font-bold" style={{ color: T.page.color }}>{val}</p>
                    <p className={`text-xs mt-0.5 ${T.dimCls}`}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Feature importance */}
              {predictions.feature_importance?.length > 0 && (
                <div className="rounded-2xl p-5" style={T.panel}>
                  <p className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: T.page.color }}>
                    <FiTrendingUp className="w-4 h-4 text-red-500" />Why This Prediction?
                  </p>
                  <div className="space-y-2">
                    {predictions.feature_importance.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={T.card}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: f.impact === 'high' ? 'rgba(34,197,94,0.1)' : f.impact === 'negative' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)' }}>
                          <span style={{ color: f.impact === 'high' ? '#16a34a' : f.impact === 'negative' ? '#dc2626' : '#6366f1' }}>
                            {f.impact === 'high' ? '↑' : f.impact === 'negative' ? '↓' : '•'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: T.page.color }}>{f.factor}</p>
                          <p className={`text-xs truncate ${T.mutedCls}`}>{f.description}</p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0"
                          style={{ color: f.impact === 'high' ? '#16a34a' : f.impact === 'negative' ? '#dc2626' : '#6366f1' }}>
                          {f.impact_percent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar videos */}
              {predictions.similar_videos?.count > 0 && (
                <div className="rounded-2xl p-5" style={T.panel}>
                  <p className="text-sm font-semibold mb-1" style={{ color: T.page.color }}>Similar Videos in Dataset</p>
                  <p className={`text-xs mb-4 ${T.mutedCls}`}>{predictions.similar_videos.count} videos matching "{predictions.similar_videos.keyword}"</p>
                  <div className="space-y-2">
                    {predictions.similar_videos.videos.slice(0, 3).map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={T.card}>
                        <p className={`text-sm flex-1 mr-3 truncate ${T.subCls}`}>{v.title}</p>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: T.page.color }}>{v.views_formatted}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 px-3 py-2 rounded-xl text-xs" style={T.counterBg}>
                    <span className={T.subCls}>Dataset average: </span>
                    <span className="font-bold" style={{ color: T.page.color }}>{predictions.similar_videos.average_views_formatted}</span>
                    <span className={T.subCls}> views</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OPTIMIZE RESULTS */}
          {mode === 'optimize' && nlpResults && (
            <div className="space-y-4">
              {/* Best title hero */}
              <div className="rounded-2xl p-6 relative overflow-hidden" style={T.heroGrad}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(220,38,38,0.15),transparent 70%)', filter: 'blur(30px)' }} />
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-widest">Best Title</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#dc2626' }}>+{nlpResults.improvement?.toFixed(1)}%</span>
                </div>
                <p className="text-xl font-bold mb-3" style={{ color: T.page.color }}>{nlpResults.best_title}</p>
                <p className={`text-sm ${T.subCls}`}>Predicted views: <span className="font-bold" style={{ color: T.page.color }}>{fmt(nlpResults.best_views)}</span></p>
              </div>

              {/* All variations */}
              <div className="rounded-2xl p-5" style={T.panel}>
                <p className="text-sm font-semibold mb-4" style={{ color: T.page.color }}>All Variations</p>
                <div className="space-y-2">
                  {nlpResults.variations?.map((v, i) => (
                    <div key={i} className="p-4 rounded-xl transition-all cursor-pointer"
                      style={i === 0
                        ? { background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)' }
                        : T.card}
                      onClick={() => set('title', v.title)}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium flex-1" style={{ color: T.page.color }}>{v.title}</p>
                        {i === 0 && <span className="text-xs px-2 py-0.5 rounded font-bold text-white flex-shrink-0" style={{ background: '#dc2626' }}>BEST</span>}
                      </div>
                      <div className={`flex items-center gap-4 text-xs ${T.mutedCls}`}>
                        <span>Views: <span className={`font-medium ${T.subCls}`}>{fmt(v.predicted_views)}</span></span>
                        <span className={v.improvement_percent > 0 ? 'text-green-600' : v.improvement_percent < 0 ? 'text-red-500' : T.mutedCls}>
                          {v.improvement_percent > 0 ? '+' : ''}{v.improvement_percent}%
                        </span>
                        <span>Confidence: <span className={T.subCls}>{(v.confidence * 100).toFixed(0)}%</span></span>
                      </div>
                      {v.insights?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {v.insights.map((ins, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded-full text-red-500" style={{ background: 'rgba(220,38,38,0.1)' }}>{ins}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* NLP feature importance */}
              {nlpResults.variations?.[0]?.feature_importance?.length > 0 && (
                <div className="rounded-2xl p-5" style={T.panel}>
                  <p className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: T.page.color }}>
                    <FiTrendingUp className="w-4 h-4 text-red-500" />Performance Factors
                  </p>
                  <div className="space-y-2">
                    {nlpResults.variations[0].feature_importance.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={T.card}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: f.impact === 'high' ? 'rgba(34,197,94,0.1)' : f.impact === 'negative' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)' }}>
                          <span style={{ color: f.impact === 'high' ? '#16a34a' : f.impact === 'negative' ? '#dc2626' : '#6366f1' }}>
                            {f.impact === 'high' ? '↑' : f.impact === 'negative' ? '↓' : '•'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: T.page.color }}>{f.factor}</p>
                          <p className={`text-xs truncate ${T.mutedCls}`}>{f.description}</p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0"
                          style={{ color: f.impact === 'high' ? '#16a34a' : f.impact === 'negative' ? '#dc2626' : '#6366f1' }}>
                          {f.impact_percent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty states */}
          {mode === 'predict' && !predictions && !isPredicting && (
            <div className="rounded-2xl p-10 text-center" style={T.emptyBg}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <FiZap className="w-6 h-6 text-red-500" />
              </div>
              <p className={`font-medium mb-1 ${T.subCls}`}>No prediction yet</p>
              <p className={`text-sm ${T.mutedCls}`}>Fill in your video details and hit Generate Prediction</p>
            </div>
          )}

          {mode === 'optimize' && !nlpResults && !isOptimizing && (
            <div className="rounded-2xl p-10 text-center" style={T.emptyBg}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <FiType className="w-6 h-6 text-red-500" />
              </div>
              <p className={`font-medium mb-1 ${T.subCls}`}>No variations yet</p>
              <p className={`text-sm ${T.mutedCls}`}>Enter your base title and description, then generate variations</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostPredictorV2;
