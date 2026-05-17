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
  { value: 500, label: '0-1K', min: 0, max: 1000 },
  { value: 5000, label: '1K-10K', min: 1000, max: 10000 },
  { value: 25000, label: '10K-50K', min: 10000, max: 50000 },
  { value: 75000, label: '50K-100K', min: 50000, max: 100000 },
  { value: 175000, label: '100K-250K', min: 100000, max: 250000 },
  { value: 375000, label: '250K-500K', min: 250000, max: 500000 },
  { value: 750000, label: '500K-1M', min: 500000, max: 1000000 },
  { value: 5000000, label: '1M-10M', min: 1000000, max: 10000000 },
  { value: 15000000, label: '10M+', min: 10000000, max: 100000000 },
];

const fmt = (n) => { if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`; if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`; return String(n); };
const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

export default function PostPredictorClean() {
  const [form, setForm] = useState({
    title: '', description: '', thumbnail_url: '', thumbnail_file: null,
    category_id: 24, subscriber_count: 10000, duration_seconds: 600,
  });
  const [predictions, setPredictions] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState(null);
  const [predictionsRemaining, setPredictionsRemaining] = useState(5);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [personalizedModel, setPersonalizedModel] = useState(null);
  const [usePersonalized, setUsePersonalized] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelResults, setChannelResults] = useState([]);
  const [isSearchingChannel, setIsSearchingChannel] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [showChannelPanel, setShowChannelPanel] = useState(false);

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
    if (!form.title || !form.description) { setError('Title and description required'); return; }
    const token = localStorage.getItem('token');
    if (!token && predictionsRemaining <= 0) { setShowLoginPrompt(true); return; }
    setIsPredicting(true); setError(null);
    try {
      let thumb = form.thumbnail_url;
      if (form.thumbnail_file) {
        thumb = await new Promise(res => { const r = new FileReader(); r.onloadend = () => res(r.result); r.readAsDataURL(form.thumbnail_file); });
      }
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
    } catch (e) { setError(e.message); }
    finally { setIsPredicting(false); }
  };

  const handleChannelSearch = async () => {
    if (!channelName.trim()) return;
    setIsSearchingChannel(true);
    try {
      const res = await fetch(`${API}/youtube/search/channel?q=${encodeURIComponent(channelName)}`);
      const data = await res.json();
      setChannelResults(data.items || []);
    } catch (e) { setError(e.message); }
    finally { setIsSearchingChannel(false); }
  };

  const handleChannelSelect = async (ch) => {
    setIsTrainingModel(true);
    try {
      const res = await fetch(`${API}/predict/personalized`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: ch.id.channelId, max_videos: 40 }),
      });
      if (!res.ok) throw new Error('Training failed');
      const data = await res.json();
      setPersonalizedModel(data);
      setUsePersonalized(true);
      setChannelResults([]);
      setShowChannelPanel(false);
      set('subscriber_count', data.stats.subscriber_count);
    } catch (e) { setError(e.message); }
    finally { setIsTrainingModel(false); }
  };

  const subscriberRange = SUBSCRIBER_RANGES.find(r => form.subscriber_count >= r.min && form.subscriber_count <= r.max);

  return (
    <div className="w-full">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowLoginPrompt(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Limit Reached</h3>
              <p className="text-gray-500">Create a free account for unlimited predictions.</p>
            </div>
            <div className="space-y-3">
              <a href="/signup" className="block w-full text-center py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">Create Free Account</a>
              <a href="/login" className="block w-full text-center py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Log In</a>
            </div>
          </div>
        </div>
      )}

      {/* Prediction counter banner */}
      {predictionsRemaining < 999 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm bg-orange-50 border border-orange-200">
          <span className="text-orange-500">⚡</span>
          <span className="text-orange-700">
            <strong>{predictionsRemaining} predictions left today</strong> —{' '}
            <a href="/signup" className="underline font-semibold hover:text-orange-900">sign up for unlimited</a>
          </span>
        </div>
      )}

      {/* Main two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Form */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Video Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">Fill in your video info to get a prediction</p>
            </div>
            <div className="p-6 space-y-5">

              {/* Title */}
              <div>
                <label className={labelCls}>Video Title *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. 10 Python Tips for Beginners"
                  className={inputCls} />
                <p className="text-xs text-gray-400 mt-1">We'll generate optimized title variations too</p>
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Describe your video content in detail..."
                  rows={4} className={`${inputCls} resize-none`} />
              </div>

              {/* Category + Subscribers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={form.category_id} onChange={e => set('category_id', parseInt(e.target.value))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Subscribers</label>
                  <select value={subscriberRange?.value || 10000} onChange={e => set('subscriber_count', parseInt(e.target.value))} className={inputCls}>
                    {SUBSCRIBER_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className={labelCls}>Duration (seconds) — <span className="text-red-500 normal-case font-normal">{fmtTime(form.duration_seconds)}</span></label>
                <input type="number" min="1" value={form.duration_seconds}
                  onChange={e => set('duration_seconds', parseInt(e.target.value))} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Thumbnail</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex gap-3 mb-1">
                <button className="flex-1 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-900 shadow-sm">Single</button>
                <button className="flex-1 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">Compare 2–5</button>
              </div>
              <div className="flex gap-2">
                <input type="url" value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)}
                  placeholder="Paste thumbnail URL..." disabled={!!form.thumbnail_file}
                  className={`${inputCls} flex-1`} />
                <label className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-gray-700">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) set('thumbnail_file', f); }} />
                </label>
              </div>
              {form.thumbnail_file && <p className="text-xs text-green-600">✓ {form.thumbnail_file.name}</p>}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200">{error}</div>
          )}

          {/* CTA */}
          <button onClick={handlePredict} disabled={isPredicting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-sm disabled:cursor-not-allowed"
            style={{ background: isPredicting ? '#f87171' : 'linear-gradient(135deg, #ef4444, #dc2626)', opacity: isPredicting ? 0.8 : 1 }}>
            {isPredicting
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
              : <>⚡ Generate Prediction</>}
          </button>

          {/* Prediction Model */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Prediction Model</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => setUsePersonalized(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    !usePersonalized ? 'bg-white border-gray-300 text-gray-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}>
                  🌐 Global Model
                </button>
                <button
                  onClick={() => setShowChannelPanel(p => !p)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    usePersonalized || showChannelPanel ? 'bg-white border-gray-300 text-gray-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}>
                  🎯 My Channel
                </button>
              </div>
              <p className="text-xs text-gray-400">
                {usePersonalized && personalizedModel
                  ? `Personalized model active · ${personalizedModel.stats.channel_name}`
                  : 'Uses our model trained on 51,888 YouTube videos for general predictions.'}
              </p>

              {personalizedModel && usePersonalized && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <p className="font-semibold text-green-800">✓ Personalized Model Active</p>
                  <p className="text-green-700 mt-1">Channel: {personalizedModel.stats.channel_name}</p>
                  <p className="text-green-700">Trained on {personalizedModel.stats.videos_analyzed} videos · Avg {fmt(personalizedModel.stats.avg_views)} views</p>
                  <button onClick={() => { setPersonalizedModel(null); setUsePersonalized(false); }} className="text-xs text-red-500 hover:text-red-700 mt-1">Switch to global model</button>
                </div>
              )}

              {showChannelPanel && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Train on your channel's 40 most recent videos for tailored predictions.</p>
                  <div className="flex gap-2">
                    <input type="text" value={channelName} onChange={e => setChannelName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleChannelSearch()}
                      placeholder="Enter your channel name..." className={`${inputCls} flex-1`} />
                    <button onClick={handleChannelSearch} disabled={isSearchingChannel || isTrainingModel}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors">
                      {isSearchingChannel ? '...' : 'Search'}
                    </button>
                  </div>
                  {isTrainingModel && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                      Training personalized model...
                    </div>
                  )}
                  {channelResults.map((ch, i) => (
                    <div key={i} onClick={() => handleChannelSelect(ch)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-red-300 cursor-pointer transition-colors">
                      <img src={ch.snippet.thumbnails.default.url} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{ch.snippet.title}</p>
                        <p className="text-xs text-gray-500 truncate">{ch.snippet.description?.substring(0, 60)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* END LEFT */}

        {/* RIGHT: Live Preview + Results */}
        <div className="space-y-5">

          {/* Live Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-red-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/70"></span>
              <span className="text-sm font-semibold text-white">Live Preview</span>
              <span className="ml-auto text-xs text-white/60 font-mono">youtube.com</span>
            </div>
            <div className="p-5">
              {/* Thumbnail */}
              <div className="relative rounded-lg overflow-hidden mb-4 aspect-video bg-gray-900">
                {form.thumbnail_file ? (
                  <img src={URL.createObjectURL(form.thumbnail_file)} alt="" className="w-full h-full object-cover" />
                ) : form.thumbnail_url ? (
                  <img src={form.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2 opacity-30">🖼</div>
                      <p className="text-xs text-gray-500">No thumbnail yet</p>
                    </div>
                  </div>
                )}
                {form.duration_seconds > 0 && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs text-white font-mono bg-black/80">
                    {fmtTime(form.duration_seconds)}
                  </div>
                )}
              </div>
              <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {form.title || <span className="text-gray-400">Your video title will appear here...</span>}
              </p>
              <p className="text-xs text-gray-400 mb-1">Channel Name · Just now</p>
              <p className="text-xs text-gray-500 line-clamp-2">{form.description || 'Your description will appear here...'}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Category', val: CATEGORIES.find(c => c.id === form.category_id)?.name?.split(' ')[0] || '—' },
                  { label: 'Subs', val: subscriberRange?.label || '—' },
                  { label: 'Duration', val: fmtTime(form.duration_seconds) },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-xs font-semibold text-gray-700">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          {predictions && (
            <div className="space-y-4">
              {/* Hero */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-1">Predicted Views</p>
                <p className="text-5xl font-black text-gray-900 mb-3">{fmt(predictions.predicted_views)}</p>
                <div className="flex items-center gap-3 flex-wrap text-sm text-gray-500">
                  <span>Model accuracy: <strong className="text-gray-900">{(predictions.confidence_score * 100).toFixed(0)}%</strong></span>
                  {predictions.confidence_interval && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-100">
                      {predictions.confidence_interval.range_description}
                    </span>
                  )}
                </div>
              </div>

              {/* Engagement */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Est. Likes', val: fmt(Math.round(predictions.predicted_views * 0.04)), sub: '~4% of views' },
                  { label: 'Est. Comments', val: fmt(Math.round(predictions.predicted_views * 0.005)), sub: '~0.5%' },
                  { label: 'Engagement', val: '4.5%', sub: 'Industry avg' },
                ].map(({ label, val, sub }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-xl font-bold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Feature importance */}
              {predictions.feature_importance?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <p className="text-sm font-bold text-gray-900 mb-4">📊 Why This Prediction?</p>
                  <div className="space-y-2">
                    {predictions.feature_importance.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <span className="text-lg">{f.impact === 'high' ? '↑' : f.impact === 'negative' ? '↓' : '•'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{f.factor}</p>
                          <p className="text-xs text-gray-500 truncate">{f.description}</p>
                        </div>
                        <span className={`text-sm font-bold ${f.impact === 'high' ? 'text-green-600' : f.impact === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
                          {f.impact_percent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar videos */}
              {predictions.similar_videos?.count > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <p className="text-sm font-bold text-gray-900 mb-1">Similar Videos in Dataset</p>
                  <p className="text-xs text-gray-500 mb-4">{predictions.similar_videos.count} videos matching "{predictions.similar_videos.keyword}"</p>
                  <div className="space-y-2">
                    {predictions.similar_videos.videos.slice(0, 3).map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-700 flex-1 mr-3 truncate">{v.title}</p>
                        <span className="text-sm font-bold text-gray-900">{v.views_formatted}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 px-3 py-2 rounded-lg text-xs bg-orange-50 text-orange-700">
                    Dataset average: <strong>{predictions.similar_videos.average_views_formatted}</strong> views
                  </div>
                </div>
              )}

              <button onClick={() => { setPredictions(null); setForm({ title: '', description: '', thumbnail_url: '', thumbnail_file: null, category_id: 24, subscriber_count: 10000, duration_seconds: 600 }); }}
                className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors">
                🔄 Reset
              </button>
            </div>
          )}

          {/* Empty state */}
          {!predictions && !isPredicting && (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <p className="font-medium text-gray-600 mb-1">No prediction yet</p>
              <p className="text-sm text-gray-400">Fill in your video details and hit Generate Prediction</p>
            </div>
          )}

          {/* Pro Tips */}
          <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
              <span className="text-orange-500">&#9733;</span>
              <span className="text-sm font-bold text-orange-800">Pro Tips</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { title: 'Thumbnails', tips: [
                  'High contrast colors (red, orange) beat muted tones.',
                  'Clear imagery can boost CTR by 200-300%.',
                ]},
                { title: 'Titles', tips: [
                  'Numbers perform 36% better — try "7 Proven Ways..."',
                  'Words like "unlock" and "transform" drive curiosity.',
                ]},
                { title: 'Mobile', tips: [
                  '60%+ of views are mobile — keep text readable on small screens.',
                ]},
              ].map(({ title, tips }) => (
                <div key={title}>
                  <p className="text-sm font-semibold text-gray-800 mb-1.5">{title}</p>
                  <ul className="space-y-1">
                    {tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
