import { useState } from 'react';
import { FiCheck, FiGlobe, FiSearch, FiTarget } from 'react-icons/fi';
import { API_URL, ML_API_URL, request, fmt } from '../../../lib/api';
import { Button, Input, Spinner } from '../../ui';
import { cx } from '../../../lib/cx';

export default function ChannelModelPicker({ model, onModel, onError }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [training, setTraining] = useState(null);

  const search = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await request(API_URL, `/youtube/search/channel?q=${encodeURIComponent(query.trim())}`);
      setResults(data.items || []);
      if (!data.items?.length) onError('No channels matched that name.');
    } catch (err) {
      onError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const train = async (ch) => {
    setTraining(ch.id.channelId);
    try {
      const data = await request(ML_API_URL, '/predict/personalized', {
        method: 'POST',
        body: { channel_id: ch.id.channelId, max_videos: 40 },
        timeout: 180000,
      });
      onModel(data);
      setResults([]);
      setOpen(false);
    } catch (err) {
      onError(err.message);
    } finally {
      setTraining(null);
    }
  };

  const segment = (active) =>
    cx('flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      active ? 'bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]' : 'text-ink-300 hover:text-white');

  return (
    <div>
      <div className="flex rounded-xl border border-white/10 bg-ink-850 p-1" role="radiogroup" aria-label="Prediction model">
        <button type="button" role="radio" aria-checked={!model && !open} onClick={() => { onModel(null); setOpen(false); }} className={segment(!model && !open)}>
          <FiGlobe className="h-4 w-4" /> Global
        </button>
        <button type="button" role="radio" aria-checked={!!model || open} onClick={() => setOpen(true)} className={segment(!!model || open)}>
          <FiTarget className="h-4 w-4" /> My channel
        </button>
      </div>

      {model ? (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3">
          <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-medium text-white">{model.stats.channel_name}</p>
            <p className="text-xs text-ink-300">Trained on {model.stats.videos_analyzed} videos · avg {fmt(model.stats.avg_views)} views</p>
          </div>
          <button type="button" onClick={() => onModel(null)} className="text-xs text-ink-300 underline-offset-2 hover:text-white hover:underline">Reset</button>
        </div>
      ) : open ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-ink-300">We'll fit a model to your 40 most recent uploads for tailored predictions.</p>
          <form onSubmit={search} className="flex gap-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your channel name…" aria-label="Channel name" className="flex-1" />
            <Button type="submit" variant="secondary" loading={searching} disabled={!!training} aria-label="Search channels">
              {!searching && <FiSearch className="h-4 w-4" />}
            </Button>
          </form>
          {results.length > 0 && (
            <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {results.map((ch) => (
                <li key={ch.id.channelId}>
                  <button
                    type="button"
                    disabled={!!training}
                    onClick={() => train(ch)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05] disabled:opacity-60"
                  >
                    <img src={ch.snippet.thumbnails?.default?.url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{ch.snippet.title}</p>
                      <p className="truncate text-xs text-ink-400">{ch.snippet.description || 'No description'}</p>
                    </div>
                    {training === ch.id.channelId && <Spinner className="h-4 w-4 text-brand-400" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {training && <p className="text-xs text-ink-300">Training on recent uploads — this can take up to a minute…</p>}
        </div>
      ) : (
        <p className="mt-2 text-xs text-ink-400">Trained on 51,888 YouTube videos across all categories.</p>
      )}
    </div>
  );
}
