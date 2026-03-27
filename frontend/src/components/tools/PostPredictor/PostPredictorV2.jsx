import React, { useState } from 'react';

const API = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

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

const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(n);
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// ── small reusable pieces ─────────────────────────────────────────────────────

const inputBase = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-400';

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const ImpactRow = ({ feature }) => {
  const color = feature.impact === 'high' ? 'text-green-600' : feature.impact === 'negative' ? 'text-red-500' : 'text-orange-500';
  const bg = feature.impact === 'high' ? 'bg-green-50' : feature.impact === 'negative' ? 'bg-red-50' : 'bg-orange-50';
  const sym = feature.impact === 'high' ? '↑' : feature.impact === 'negative' ? '↓' : '→';
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${bg} ${color}`}>{sym}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-800">{feature.factor}</span>
          <span className={`text-xs font-bold ${color}`}>{feature.impact_percent}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, accent = false }) => (
  <div className={`rounded-xl p-4 border ${accent ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' : 'bg-white border-gray-200'}`}>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-2xl font-bold ${accent ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const PostPredictorV2 = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', thumbnail_url: '', thumbnail_file: null,
    category_id: 24, subscriber_count: 10000, duration_seconds: 600,
  });

  // results
  const [predictions, setPredictions] = useState(null);
  const [titleResults, setTitleResults] = useState(null);
  const [thumbComp, setThumbComp] = useState(null);

  // loading / error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // prediction limit
  const [predictionsRemaining, setPredictionsRemaining] = useState(() => {
    if (localStorage.getItem('token')) return 999;
    const stored = localStorage.getItem('predictionLimit');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === new Date().toDateString()) return Math.max(0, 5 - count);
    }
    return 5;
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // model selection
  const [modelMode, setModelMode] = useState('global'); // 'global' | 'personalized'
  const [channelQuery, setChannelQuery] = useState('');
  const [channelResults, setChannelResults] = useState([]);
  const [isSearchingChannel, setIsSearchingChannel] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [personalizedModel, setPersonalizedModel] = useState(null);

  // thumbnails
  const [thumbnailMode, setThumbnailMode] = useState('single'); // 'single' | 'compare'
  const [thumbnailFiles, setThumbnailFiles] = useState([]);

  // active results tab
  const [resultsTab, setResultsTab] = useState('performance');

  const set = (field, value) => { setFormData(p => ({ ...p, [field]: value })); setError(null); };

  // ── channel search ──────────────────────────────────────────────────────────
  const handleChannelSearch = async () => {
    if (!channelQuery.trim()) return;
    setIsSearchingChannel(true); setError(null);
    try {
      const res = await fetch(`${API}/youtube/search/channel?q=${encodeURIComponent(channelQuery)}`);
      if (!res.ok) throw new Error('Channel search failed');
      const data = await res.json();
      setChannelResults(data.items || []);
      if (!data.items?.length) setError('No channels found.');
    } catch (e) { setError(e.message); }
    finally { setIsSearchingChannel(false); }
  };

  const handleChannelSelect = async (channel) => {
    setIsTrainingModel(true); setError(null); setChannelResults([]);
    try {
      const res = await fetch(`${API}/predict/personalized`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: channel.id.channelId, max_videos: 40 }),
      });
      if (!res.ok) throw new Error('Failed to train personalized model');
      const data = await res.json();
      setPersonalizedModel(data);
      setFormData(p => ({ ...p, subscriber_count: data.stats.subscriber_count }));
    } catch (e) { setError(e.message); setModelMode('global'); }
    finally { setIsTrainingModel(false); }
  };

  // ── thumbnail helpers ───────────────────────────────────────────────────────
  const handleSingleThumb = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith('image/')) { set('thumbnail_file', file); set('thumbnail_url', ''); }
  };

  const handleMultiThumb = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 2 || files.length > 5) { setError('Upload 2–5 thumbnails for comparison'); return; }
    setThumbnailFiles(files); setThumbComp(null); setError(null);
  };

  const [isThumbLoading, setIsThumbLoading] = useState(false);

  const runThumbComparison = async () => {
    if (thumbnailFiles.length < 2) {
      setError('Upload at least 2 thumbnails to compare');
      return;
    }
    setIsThumbLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      thumbnailFiles.forEach(f => fd.append('thumbnails', f));
      const res = await fetch(`${API}/thumbnail/compare`, { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Thumbnail comparison failed');
      }
      const data = await res.json();
      setThumbComp(data);
      setResultsTab('thumbnail');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsThumbLoading(false);
    }
  };

  // ── main predict ────────────────────────────────────────────────────────────
  const handlePredict = async () => {
    if (!formData.title || !formData.description) { setError('Please fill in title and description'); return; }
    if (!localStorage.getItem('token') && predictionsRemaining <= 0) { setShowLoginPrompt(true); return; }

    setIsLoading(true); setError(null); setPredictions(null); setTitleResults(null); setThumbComp(null);

    try {
      let thumbData = formData.thumbnail_url;
      if (formData.thumbnail_file) {
        thumbData = await new Promise(resolve => {
          const r = new FileReader(); r.onloadend = () => resolve(r.result); r.readAsDataURL(formData.thumbnail_file);
        });
      }
      const thumbUrl = thumbData || 'https://via.placeholder.com/1280x720';

      const endpoint = modelMode === 'personalized' && personalizedModel
        ? `${API}/predict/personalized/predict` : `${API}/predict/`;

      const [predRes, titleRes] = await Promise.all([
        fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, thumbnail_url: thumbUrl }),
        }),
        fetch(`${API}/optimizer/optimize-title`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base_title: formData.title, description: formData.description,
            category_id: formData.category_id, subscriber_count: formData.subscriber_count,
            duration_seconds: formData.duration_seconds, thumbnail_url: thumbUrl,
          }),
        }),
      ]);

      if (!predRes.ok) throw new Error('Prediction failed');
      if (!titleRes.ok) throw new Error('Title optimization failed');

      const [predData, titleData] = await Promise.all([predRes.json(), titleRes.json()]);
      setPredictions(predData);
      setTitleResults(titleData);

      setResultsTab('performance');

      if (!localStorage.getItem('token')) {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('predictionLimit');
        const count = stored ? JSON.parse(stored).count + 1 : 1;
        localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count }));
        setPredictionsRemaining(Math.max(0, 5 - count));
        if (count >= 5) setShowLoginPrompt(true);
      }
    } catch (e) { setError(e.message); }
    finally { setIsLoading(false); }
  };

  const reset = () => {
    setPredictions(null); setTitleResults(null); setThumbComp(null); setResultsTab('performance');
    setFormData(p => ({ title: '', description: '', thumbnail_url: '', thumbnail_file: null, category_id: 24, subscriber_count: p.subscriber_count, duration_seconds: 600 }));
  };

  const subRange = SUBSCRIBER_RANGES.find(r => formData.subscriber_count >= r.min && formData.subscriber_count <= r.max);

  const hasResults = predictions !== null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* ── Login prompt modal ─────────────────────────────────────────────── */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Daily Limit Reached</h3>
              <p className="text-sm text-gray-500">Create a free account for unlimited predictions.</p>
            </div>
            <div className="space-y-2">
              <a href="/signup" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-center text-sm transition-colors">Create Account</a>
              <a href="/login" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl text-center text-sm transition-colors">Log in</a>
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT: Input form ───────────────────────────────────────────────── */}
      <div className="w-full lg:w-[480px] flex-shrink-0 space-y-4">

        {/* prediction counter */}
        {predictionsRemaining < 999 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm">
            <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
            <span className="text-orange-800 font-medium">{predictionsRemaining} prediction{predictionsRemaining !== 1 ? 's' : ''} left today —{' '}
              <a href="/signup" className="text-red-600 font-semibold hover:underline">sign up</a> for unlimited
            </span>
          </div>
        )}

        {/* ── Video Details card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Video Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in your video info to get a prediction</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Title */}
            <div>
              <FieldLabel required>Video Title</FieldLabel>
              <input className={inputBase} placeholder="e.g. 10 Python Tips for Beginners"
                value={formData.title} onChange={e => set('title', e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">We'll generate optimized title variations too</p>
            </div>

            {/* Description */}
            <div>
              <FieldLabel required>Description</FieldLabel>
              <textarea className={`${inputBase} resize-none`} rows={3}
                placeholder="Describe your video content in detail..."
                value={formData.description} onChange={e => set('description', e.target.value)} />
            </div>

            {/* Category + Subscribers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Category</FieldLabel>
                <select className={inputBase} value={formData.category_id}
                  onChange={e => set('category_id', parseInt(e.target.value))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel>Subscribers</FieldLabel>
                <select className={inputBase}
                  value={subRange?.value || 10000}
                  onChange={e => set('subscriber_count', parseInt(e.target.value))}>
                  {SUBSCRIBER_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <FieldLabel>Duration (seconds)</FieldLabel>
              <div className="flex items-center gap-3">
                <input className={`${inputBase} flex-1`} type="number" min="1"
                  value={formData.duration_seconds} onChange={e => set('duration_seconds', parseInt(e.target.value) || 0)} />
                <span className="text-sm font-mono text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 flex-shrink-0">
                  {fmtTime(formData.duration_seconds)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Model Selection card ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Prediction Model</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {/* toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              {[
                { key: 'global', label: 'Global Model', icon: '🌍' },
                { key: 'personalized', label: 'My Channel', icon: '📺' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setModelMode(opt.key)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    modelMode === opt.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <span>{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>

            {modelMode === 'global' && (
              <p className="text-xs text-gray-400">Uses our model trained on 51,888 YouTube videos for general predictions.</p>
            )}

            {modelMode === 'personalized' && (
              <div className="space-y-3">
                {personalizedModel ? (
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-800">{personalizedModel.stats.channel_name}</p>
                      <p className="text-xs text-green-600">{personalizedModel.stats.videos_analyzed} videos · avg {fmt(personalizedModel.stats.avg_views)} views</p>
                    </div>
                    <button onClick={() => { setPersonalizedModel(null); setModelMode('global'); }}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors">✕</button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-400">Train a model on your channel's 40 most recent videos.</p>
                    <div className="flex gap-2">
                      <input className={`${inputBase} flex-1`} placeholder="Your channel name…"
                        value={channelQuery} onChange={e => setChannelQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChannelSearch()} />
                      <button onClick={handleChannelSearch} disabled={isSearchingChannel || isTrainingModel}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex-shrink-0">
                        {isSearchingChannel ? '…' : 'Search'}
                      </button>
                    </div>
                    {isTrainingModel && (
                      <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                        Training your personalized model…
                      </div>
                    )}
                    {channelResults.length > 0 && (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {channelResults.map((ch, i) => (
                          <button key={i} onClick={() => handleChannelSelect(ch)}
                            className="w-full flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl transition-all text-left">
                            <img src={ch.snippet.thumbnails.default.url} alt={ch.snippet.title} className="w-9 h-9 rounded-full flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{ch.snippet.title}</p>
                              <p className="text-xs text-gray-400 truncate">{ch.snippet.description?.substring(0, 60)}…</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Thumbnail card ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Thumbnail</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {/* toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              {[
                { key: 'single', label: 'Single' },
                { key: 'compare', label: 'Compare 2–5' },
              ].map(opt => (
                <button key={opt.key} onClick={() => setThumbnailMode(opt.key)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    thumbnailMode === opt.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            {thumbnailMode === 'single' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input className={`${inputBase} flex-1`} type="url" placeholder="Paste thumbnail URL…"
                    value={formData.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)}
                    disabled={!!formData.thumbnail_file} />
                  <label className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg cursor-pointer transition-colors flex-shrink-0 text-sm">
                    Upload<input type="file" accept="image/*" className="hidden" onChange={handleSingleThumb} />
                  </label>
                </div>
                {formData.thumbnail_file && (
                  <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span>{formData.thumbnail_file.name}</span>
                    <button onClick={() => set('thumbnail_file', null)} className="text-gray-400 hover:text-red-500">✕</button>
                  </div>
                )}
              </div>
            )}

            {thumbnailMode === 'compare' && (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 hover:border-red-400 rounded-xl cursor-pointer transition-colors bg-gray-50 hover:bg-red-50">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span className="text-sm text-gray-500 font-medium">
                    {thumbnailFiles.length > 0 ? `${thumbnailFiles.length} file(s) selected — click to change` : 'Upload 2–5 thumbnails to compare'}
                  </span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiThumb} />
                </label>

                {/* preview strip */}
                {thumbnailFiles.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {thumbnailFiles.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt={`thumb ${i+1}`}
                        className="w-16 h-11 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                )}

                {/* compare button — works standalone or after prediction */}
                {thumbnailFiles.length >= 2 && (
                  <button onClick={runThumbComparison} disabled={isThumbLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isThumbLoading
                      ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Analyzing thumbnails…</>
                      : 'Compare Thumbnails'}
                  </button>
                )}
                {thumbnailFiles.length >= 2 && (!formData.title || !formData.description) && (
                  <p className="text-xs text-gray-400 text-center">Fill in title & description above first</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        )}

        {/* submit */}
        <button onClick={handlePredict} disabled={isLoading || !formData.title || !formData.description}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-200">
          {isLoading ? (
            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Analyzing your video…</>
          ) : (
            <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg> Generate Prediction</>
          )}
        </button>
      </div>

      {/* ── RIGHT: Preview (before results) / Results (after) ─────────────── */}
      <div className="flex-1 min-w-0">

        {/* ── BEFORE results: live preview + tips ─────────────────────────── */}
        {!hasResults && !thumbComp && (
          <div className="space-y-4">
            {/* Live preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                </svg>
                <span className="text-white font-semibold text-sm">Live Preview</span>
              </div>
              <div className="p-5">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-4">
                  {formData.thumbnail_file ? (
                    <img src={URL.createObjectURL(formData.thumbnail_file)} alt="thumb" className="w-full h-full object-cover" />
                  ) : formData.thumbnail_url ? (
                    <img src={formData.thumbnail_url} alt="thumb" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                      <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p className="text-xs opacity-50">No thumbnail yet</p>
                    </div>
                  )}
                  {formData.duration_seconds > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                      {fmtTime(formData.duration_seconds)}
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {formData.title || <span className="text-gray-400">Your video title will appear here…</span>}
                </h4>
                <p className="text-xs text-gray-400 mb-2">Channel Name · Just now</p>
                <p className="text-xs text-gray-500 line-clamp-2">{formData.description || 'Your description will appear here…'}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs font-bold text-gray-800">{CATEGORIES.find(c => c.id === formData.category_id)?.name}</p>
                    <p className="text-xs text-gray-400">Category</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{subRange?.label || '—'}</p>
                    <p className="text-xs text-gray-400">Subscribers</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{fmtTime(formData.duration_seconds)}</p>
                    <p className="text-xs text-gray-400">Duration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-5 py-3 border-b border-orange-100">
                <h3 className="font-bold text-orange-900 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Pro Tips
                </h3>
              </div>
              <div className="p-5 space-y-3 text-xs text-gray-600">
                {[
                  { t: 'Thumbnails', tips: ['High contrast colors (red, orange) beat muted tones.', 'Clear imagery can boost CTR by 200–300%.'] },
                  { t: 'Titles', tips: ['Numbers perform 36% better — try "7 Proven Ways…"', 'Words like "unlock" and "transform" drive curiosity.'] },
                  { t: 'Mobile', tips: ['60%+ of views are mobile — keep text readable on small screens.'] },
                ].map(s => (
                  <div key={s.t}>
                    <p className="font-semibold text-gray-800 mb-1">{s.t}</p>
                    <ul className="space-y-1 ml-2">{s.tips.map((tip, i) => <li key={i} className="flex gap-1.5"><span className="text-orange-400 mt-0.5">•</span>{tip}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AFTER results: tabbed results panel ─────────────────────────── */}
        {(hasResults || thumbComp) && (
          <div className="results-content space-y-4">
            {/* tab bar */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
              {[
                ...(hasResults ? [{ key: 'performance', label: 'Performance' }] : []),
                ...(thumbComp  ? [{ key: 'thumbnail',   label: 'Thumbnails'  }] : []),
                ...(hasResults ? [{ key: 'titles',       label: 'Title Optimizer' }] : []),
              ].map(tab => (
                <button key={tab.key} onClick={() => setResultsTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    resultsTab === tab.key ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Performance tab ─────────────────────────────────────────── */}
            {resultsTab === 'performance' && (
              <div className="space-y-4">
                {/* hero metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Predicted Views" value={fmt(predictions.predicted_views)} accent />
                  <StatCard label="Model Accuracy" value={`${(predictions.confidence_score * 100).toFixed(0)}%`} />
                  <StatCard label="Est. Likes" value={fmt(Math.round(predictions.predicted_views * 0.04))} sub="~4% of views" />
                  <StatCard label="Est. Comments" value={fmt(Math.round(predictions.predicted_views * 0.005))} sub="~0.5% of views" />
                </div>

                {/* confidence range */}
                {predictions.confidence_interval && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">{predictions.confidence_interval.confidence_level} Confidence Range</p>
                        <p className="text-2xl font-bold text-red-900">{predictions.confidence_interval.range_description}</p>
                        <p className="text-xs text-red-600 mt-1">predicted views</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-1">{predictions.model_type === 'personalized' ? 'Personalized Model' : 'Global Model'}</p>
                        <p className="text-sm font-bold text-gray-800">
                          {predictions.model_type === 'personalized' ? predictions.channel_stats?.channel_name : predictions.subscriber_range}
                        </p>
                        {predictions.seasonal_factor && predictions.seasonal_factor !== 1.0 && (
                          <p className="text-xs text-orange-600 mt-1">+{((predictions.seasonal_factor - 1) * 100).toFixed(0)}% seasonal boost</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* engagement breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Engagement Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Estimated Watch Time', value: `${fmt(Math.round(predictions.predicted_views * formData.duration_seconds * 0.5 / 60))} min total`, sub: `Based on ${fmtTime(Math.round(formData.duration_seconds * 0.5))} avg view duration` },
                      { label: 'Estimated CTR', value: '5–8%', sub: 'Expected click-through rate' },
                      { label: 'View Range', value: `${fmt(Math.round(predictions.predicted_views * 0.5))} – ${fmt(Math.round(predictions.predicted_views * 1.5))}`, sub: 'Worst to best case' },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{row.label}</p>
                          <p className="text-xs text-gray-400">{row.sub}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 text-right">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* why this prediction */}
                {predictions.feature_importance?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Why This Prediction?</h3>
                    <div className="space-y-2">
                      {predictions.feature_importance.map((f, i) => <ImpactRow key={i} feature={f} />)}
                    </div>
                  </div>
                )}

                {/* similar videos */}
                {predictions.similar_videos?.count > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-1">Similar Videos in Dataset</h3>
                    <p className="text-xs text-gray-400 mb-3">{predictions.similar_videos.count} videos with "{predictions.similar_videos.keyword}"</p>
                    <div className="space-y-2 mb-3">
                      {predictions.similar_videos.videos.slice(0, 3).map((v, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 text-sm">
                          <p className="text-gray-700 flex-1 mr-3 truncate">{v.title}</p>
                          <span className="font-bold text-gray-900 whitespace-nowrap">{v.views_formatted}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-800">
                      Average: <span className="font-bold">{predictions.similar_videos.average_views_formatted} views</span>
                    </div>
                  </div>
                )}

                {/* personalized comparison */}
                {predictions.model_type === 'personalized' && predictions.comparison && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-orange-900 mb-3">vs Your Channel</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">vs Average</p>
                        <p className="text-lg font-bold text-orange-900">{predictions.comparison.vs_channel_avg}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">vs Median</p>
                        <p className="text-lg font-bold text-orange-900">{predictions.comparison.vs_channel_median}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Thumbnails tab ───────────────────────────────────────────── */}
            {resultsTab === 'thumbnail' && thumbComp && (
              <div className="space-y-4">

                {/* winner hero */}
                {(() => {
                  const winner = thumbComp.thumbnails.find(t => t.rank === 1);
                  return winner ? (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-400 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Recommended Thumbnail</p>
                      </div>
                      <div className="flex gap-4 items-start">
                        <img src={winner.image_data} alt="Best thumbnail"
                          className="w-40 h-[90px] object-cover rounded-xl flex-shrink-0 shadow-md border border-orange-200"
                          onError={e => { e.target.style.display = 'none'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-bold text-gray-900 mb-0.5">
                            Thumbnail #{winner.thumbnail_id}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 bg-orange-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${winner.ctr_score}%` }} />
                            </div>
                            <span className="text-sm font-bold text-orange-700">{winner.ctr_score.toFixed(0)}/100</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span>{winner.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* all thumbnails ranked with score breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Visual Quality Breakdown</h3>
                  <div className="space-y-4">
                    {thumbComp.thumbnails.map(t => {
                      const metrics = [
                        { label: 'CNN Activation',    value: t.activation_score,      tip: 'Visual complexity detected by AI' },
                        { label: 'Contrast',          value: t.contrast_score,        tip: 'How much the image pops' },
                        { label: 'Color Richness',    value: t.color_score,           tip: 'Vibrancy of colors' },
                        { label: 'Distinctiveness',   value: t.distinctiveness_score, tip: 'How unique vs other thumbnails' },
                        { label: 'Content Diversity', value: t.diversity_score,       tip: 'Variety of visual elements' },
                      ];
                      return (
                        <div key={t.thumbnail_id}
                          className={`p-4 rounded-xl border-2 ${t.rank === 1 ? 'border-orange-400 bg-orange-50' : 'border-gray-100'}`}>
                          <div className="flex gap-3 mb-3">
                            <div className="relative flex-shrink-0">
                              <img src={t.image_data} alt={`Thumb ${t.thumbnail_id}`}
                                className="w-20 h-14 object-cover rounded-lg bg-gray-200"
                                onError={e => { e.target.style.background = '#e5e7eb'; }} />
                              {t.rank === 1 && (
                                <div className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">#1</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-gray-900">Thumbnail #{t.thumbnail_id}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  t.rank === 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                                }`}>Rank #{t.rank}</span>
                              </div>
                              {/* overall CTR score bar */}
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div className={`h-1.5 rounded-full ${t.rank === 1 ? 'bg-orange-500' : 'bg-gray-400'}`}
                                    style={{ width: `${t.ctr_score}%` }} />
                                </div>
                                <span className="text-xs font-bold text-gray-600 w-12 text-right">
                                  {t.ctr_score.toFixed(0)}/100
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">Overall CTR score</p>
                            </div>
                          </div>

                          {/* metric bars */}
                          <div className="grid grid-cols-1 gap-1.5">
                            {metrics.map(m => (
                              <div key={m.label} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-32 flex-shrink-0">{m.label}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                  <div className="bg-red-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${Math.min(100, m.value || 0)}%` }} />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 w-8 text-right">
                                  {(m.value || 0).toFixed(0)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {t.recommendation && (
                            <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100 italic">
                              {t.recommendation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* analysis summary */}
                {thumbComp.analysis && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p>{thumbComp.analysis.recommendation}</p>
                      {thumbComp.analysis.score_range > 20 && (
                        <p className="mt-1 text-blue-600">Score range: {thumbComp.analysis.score_range.toFixed(0)} points — there's a clear winner here.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Title Optimizer tab ──────────────────────────────────────── */}
            {resultsTab === 'titles' && titleResults && (
              <div className="space-y-4">
                {/* best title */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Best Performing Title</p>
                  <p className="text-lg font-bold text-red-900 mb-3">"{titleResults.best_title}"</p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-red-600">Predicted Views</p>
                      <p className="text-xl font-bold text-red-900">{fmt(titleResults.best_views)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-red-600">Improvement</p>
                      <p className="text-xl font-bold text-green-700">+{titleResults.improvement?.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* all variations */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">All Variations</h3>
                  <div className="space-y-2">
                    {titleResults.variations?.map((v, i) => (
                      <div key={i} className={`p-3.5 rounded-xl border-2 transition-all ${i === 0 ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900 flex-1">{v.title}</p>
                          {i === 0 && <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-md flex-shrink-0">BEST</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Views: <span className="font-bold text-gray-800">{fmt(v.predicted_views)}</span></span>
                          <span className={`font-bold ${v.improvement_percent > 0 ? 'text-green-600' : v.improvement_percent < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {v.improvement_percent > 0 ? '+' : ''}{v.improvement_percent}%
                          </span>
                          <span>Conf: <span className="font-bold text-gray-800">{(v.confidence * 100).toFixed(0)}%</span></span>
                        </div>
                        {v.insights?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {v.insights.map((ins, j) => (
                              <span key={j} className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">{ins}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* feature importance for titles */}
                {titleResults.variations?.[0]?.feature_importance?.length > 0 && (() => {
                  const fi = titleResults.variations[0].feature_importance;
                  const groups = [
                    { key: 'title', label: 'Title Factors' },
                    { key: 'description', label: 'Description Factors' },
                    { key: 'metadata', label: 'Other Factors' },
                  ];
                  return groups.map(g => {
                    const items = fi.filter(f => f.type === g.key);
                    if (!items.length) return null;
                    return (
                      <div key={g.key} className="bg-white border border-gray-200 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-gray-800 mb-3">{g.label}</h3>
                        <div className="space-y-2">{items.map((f, i) => <ImpactRow key={i} feature={f} />)}</div>
                      </div>
                    );
                  });
                })()}

                {/* similar videos */}
                {titleResults.variations?.[0]?.similar_videos?.count > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-1">Similar Videos in Dataset</h3>
                    <p className="text-xs text-gray-400 mb-3">{titleResults.variations[0].similar_videos.count} videos with "{titleResults.variations[0].similar_videos.keyword}"</p>
                    <div className="space-y-2 mb-3">
                      {titleResults.variations[0].similar_videos.videos.slice(0, 3).map((v, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 text-sm">
                          <p className="text-gray-700 flex-1 mr-3 truncate">{v.title}</p>
                          <span className="font-bold text-gray-900 whitespace-nowrap">{v.views_formatted}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-800">
                      Average: <span className="font-bold">{titleResults.variations[0].similar_videos.average_views_formatted} views</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors">
                New Prediction
              </button>
              <button onClick={() => { setPredictions(null); setTitleResults(null); setThumbComp(null); }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                Adjust & Rerun
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPredictorV2;
