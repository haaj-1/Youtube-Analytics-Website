// src/components/tools/PerformanceHistory/PerformanceHistory.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiArrowRight, FiBarChart2, FiCalendar, FiClock, FiExternalLink, FiEye, FiHash,
  FiMessageCircle, FiSearch, FiThumbsUp, FiTrendingDown, FiTrendingUp,
} from 'react-icons/fi';
import { API_URL, request, fmt } from '../../../lib/api';
import { Alert, Badge, Bar, Button, Card, CardHeader, Input, Spinner, Stat } from '../../ui';
import { cx } from '../../../lib/cx';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// The API reports publish hours in UTC; show them in the viewer's timezone.
function localHour(utcHour) {
  const d = new Date(Date.UTC(2024, 0, 1, utcHour));
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function SearchView({ onSelect, loadingId }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) { setError('Enter a channel name to search.'); return; }
    setSearching(true);
    setError(null);
    try {
      const data = await request(API_URL, `/youtube/search/channel?q=${encodeURIComponent(query.trim())}`);
      setResults(data.items || []);
      if (!data.items?.length) setError('No channels found. Try a different spelling.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-brand-400">
          <FiBarChart2 className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Analyze any channel</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-300">
          We pull the 100 most recent uploads and surface posting patterns, length sweet spots and title keywords YouTube Studio doesn't show.
        </p>
      </div>

      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Channel name, e.g. Veritasium" aria-label="Channel name" className="h-12 pl-10" />
        </div>
        <Button type="submit" size="lg" loading={searching} disabled={!!loadingId}>Search</Button>
      </form>

      {error && <div className="mt-4"><Alert onDismiss={() => setError(null)}>{error}</Alert></div>}

      {results.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-3">Select a channel</p>
          <ul className="space-y-2">
            {results.map((ch) => (
              <li key={ch.id.channelId}>
                <button
                  onClick={() => onSelect(ch)}
                  disabled={!!loadingId}
                  className="group flex w-full items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05] disabled:opacity-60"
                >
                  <img src={ch.snippet.thumbnails?.default?.url} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{ch.snippet.title}</p>
                    <p className="line-clamp-1 text-sm text-ink-400">{ch.snippet.description || 'No description'}</p>
                  </div>
                  {loadingId === ch.id.channelId
                    ? <Spinner className="h-4 w-4 text-brand-400" />
                    : <FiArrowRight className="h-4 w-4 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function LoadingView({ channel }) {
  return (
    <div className="space-y-6" aria-live="polite">
      <Card className="flex items-center gap-4 p-5">
        <img src={channel.snippet.thumbnails?.default?.url} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
        <div>
          <p className="font-medium text-white">{channel.snippet.title}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-300"><Spinner className="h-3.5 w-3.5 text-brand-400" /> Fetching and analyzing the 100 most recent videos…</p>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="skeleton h-80 lg:col-span-2" />
        <div className="skeleton h-80" />
      </div>
    </div>
  );
}

function Dashboard({ analytics, onReset }) {
  const navigate = useNavigate();
  const { channel_info: info, overview, posting_patterns: posting, duration_analysis: durations,
    top_videos: topVideos, content_insights: content, engagement_insights: engagement } = analytics;

  const dayEntries = DAYS.filter((d) => posting.day_breakdown[d]);
  const maxDayViews = Math.max(...dayEntries.map((d) => posting.day_breakdown[d].avg_views), 1);
  const durationEntries = Object.values(durations);
  const maxDurViews = Math.max(...durationEntries.map((d) => d.avg_views), 1);
  const bestDuration = durationEntries.reduce((a, b) => (b.avg_views > (a?.avg_views ?? -1) ? b : a), null);
  const growth = overview.growth_rate;

  const goPredict = () =>
    navigate('/post-performance', { state: { subscriber_count: info.subscriber_count, channel_name: info.title } });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Channel header */}
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <img src={info.thumbnail} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/10" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold">{info.title}</h2>
          <p className="mt-1 text-sm text-ink-300">
            <span className="font-mono text-white">{fmt(info.subscriber_count)}</span> subscribers · last {overview.total_videos} uploads analyzed
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onReset}><FiArrowLeft className="h-4 w-4" /> New search</Button>
          <Button onClick={goPredict}>Predict a video <FiArrowRight className="h-4 w-4" /></Button>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Videos analyzed" value={overview.total_videos} sub="Most recent uploads" />
        <Stat label="Avg views" value={fmt(overview.avg_views)} sub="Per video" />
        <Stat label="Avg engagement" value={`${overview.avg_engagement_rate}%`} sub="(Likes + comments) / views" />
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-xs text-ink-300">Growth</p>
          <p className={cx('mt-1.5 flex items-center gap-1.5 font-mono text-2xl font-semibold tabular-nums', growth >= 0 ? 'text-emerald-400' : 'text-brand-400')}>
            {growth >= 0 ? <FiTrendingUp className="h-5 w-5" /> : <FiTrendingDown className="h-5 w-5" />}
            {growth >= 0 ? '+' : ''}{growth}%
          </p>
          <p className="mt-1 text-xs text-ink-400">Recent vs older uploads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Posting patterns */}
          <Card>
            <CardHeader icon={<FiCalendar className="h-4 w-4" />} title="When to post" description="Average views by publish day and hour." />
            <div className="grid gap-4 border-b border-white/[0.05] p-5 sm:grid-cols-2">
              <div className="rounded-xl border border-brand-500/25 bg-brand-500/[0.05] p-4">
                <p className="text-xs text-ink-300">Best day</p>
                <p className="mt-1 text-xl font-semibold text-white">{posting.best_day.day}</p>
                <p className="mt-0.5 font-mono text-xs text-brand-300">{fmt(posting.best_day.avg_views)} avg views</p>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <p className="text-xs text-ink-300">Best hour <span className="text-ink-400">(your local time)</span></p>
                <p className="mt-1 text-xl font-semibold text-white">{localHour(posting.best_hour.hour)}</p>
                <p className="mt-0.5 font-mono text-xs text-ink-300">{String(posting.best_hour.hour).padStart(2, '0')}:00 UTC · {fmt(posting.best_hour.avg_views)} avg views</p>
              </div>
            </div>
            <ul className="space-y-2.5 p-5">
              {dayEntries.map((day) => {
                const d = posting.day_breakdown[day];
                const best = day === posting.best_day.day;
                return (
                  <li key={day} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[6rem_1fr_7rem]">
                    <span className={cx(best ? 'text-white' : 'text-ink-300')}>
                      <span className="sm:hidden">{day.slice(0, 3)}</span><span className="hidden sm:inline">{day}</span>
                    </span>
                    <Bar value={d.avg_views} max={maxDayViews} tone={best ? 'brand' : 'neutral'} className="h-2" />
                    <span className="text-right font-mono text-xs tabular-nums text-ink-200">
                      {fmt(d.avg_views)} <span className="text-ink-500">· {d.video_count}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-white/[0.05] px-5 py-3 text-xs text-ink-400">Days are based on UTC publish time. Grey number = videos posted that day.</p>
          </Card>

          {/* Duration */}
          <Card>
            <CardHeader icon={<FiClock className="h-4 w-4" />} title="Video length" description="How each length bucket performs on this channel." />
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {durationEntries.map((d) => {
                const best = d === bestDuration;
                return (
                  <div key={d.label} className={cx('rounded-xl border p-4', best ? 'border-brand-500/25 bg-brand-500/[0.05]' : 'border-white/[0.07] bg-white/[0.02]')}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-ink-300">{d.label}</p>
                      {best && <Badge tone="brand">Best</Badge>}
                    </div>
                    <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-white">{fmt(d.avg_views)}</p>
                    <Bar value={d.avg_views} max={maxDurViews} tone={best ? 'brand' : 'neutral'} className="mt-3" />
                    <p className="mt-2 text-xs text-ink-400">{d.video_count} videos</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Top videos */}
          <Card>
            <CardHeader icon={<FiTrendingUp className="h-4 w-4" />} title="Top performing videos" />
            <ol className="divide-y divide-white/[0.05]">
              {topVideos.map((v, i) => (
                <li key={v.video_id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.video_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="w-5 shrink-0 font-mono text-xs text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                    <img src={v.thumbnail} alt="" className="aspect-video w-24 shrink-0 rounded-lg object-cover sm:w-32" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-white">{v.title}</p>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-ink-300">
                        <span className="flex items-center gap-1"><FiEye className="h-3 w-3" />{fmt(v.views)}</span>
                        <span className="flex items-center gap-1"><FiThumbsUp className="h-3 w-3" />{fmt(v.likes)}</span>
                        <span className="flex items-center gap-1"><FiMessageCircle className="h-3 w-3" />{v.engagement_rate}%</span>
                      </div>
                    </div>
                    <FiExternalLink className="h-4 w-4 shrink-0 text-ink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/25 blur-3xl" aria-hidden="true" />
            <p className="eyebrow relative">Recommended strategy</p>
            <p className="relative mt-3 text-sm leading-relaxed text-ink-100">
              Publish on <span className="font-semibold text-white">{posting.best_day.day}</span> around{' '}
              <span className="font-semibold text-white">{localHour(posting.best_hour.hour)}</span>
              {bestDuration && <> and aim for <span className="font-semibold text-white">{bestDuration.label.toLowerCase()}</span> videos</>}.
            </p>
            <Button onClick={goPredict} className="relative mt-4 w-full">Forecast your next video</Button>
          </Card>

          <Card>
            <CardHeader title="Engagement spread" />
            <div className="space-y-4 p-5">
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-ink-200">High performers</span>
                  <span className="font-mono text-emerald-400">{engagement.high_performers}</span>
                </div>
                <Bar value={engagement.high_performers} max={overview.total_videos} tone="success" />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-ink-200">Low performers</span>
                  <span className="font-mono text-brand-400">{engagement.low_performers}</span>
                </div>
                <Bar value={engagement.low_performers} max={overview.total_videos} />
              </div>
              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-xs text-ink-300">Consistency score</p>
                <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-white">{engagement.consistency_score}%</p>
                <p className="mt-1 text-xs text-ink-400">How stable engagement is from video to video.</p>
              </div>
            </div>
          </Card>

          {content.common_words_in_top_videos.length > 0 && (
            <Card>
              <CardHeader icon={<FiHash className="h-4 w-4" />} title="Words in top titles" description="Recurring terms in this channel's best videos." />
              <div className="flex flex-wrap gap-2 p-5">
                {content.common_words_in_top_videos.map((w) => (
                  <span key={w.word} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-sm text-ink-100">
                    {w.word}<span className="font-mono text-[11px] text-ink-400">×{w.count}</span>
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

const PerformanceHistory = () => {
  const [selected, setSelected] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  const load = async (channel) => {
    setSelected(channel);
    setError(null);
    try {
      const data = await request(API_URL, '/analytics/channel-analytics', {
        method: 'POST',
        body: { channel_id: channel.id.channelId, max_videos: 100 },
        timeout: 120000,
      });
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
      setSelected(null);
    }
  };

  const reset = () => { setAnalytics(null); setSelected(null); setError(null); };

  if (analytics) return <Dashboard analytics={analytics} onReset={reset} />;
  if (selected) return <LoadingView channel={selected} />;
  return (
    <div className="space-y-4">
      {error && <div className="mx-auto max-w-2xl"><Alert onDismiss={() => setError(null)}>{error}</Alert></div>}
      <SearchView onSelect={load} loadingId={selected?.id?.channelId} />
      <div className="mx-auto grid max-w-2xl gap-3 pt-4 sm:grid-cols-3">
        {[
          { icon: FiCalendar, t: 'Posting windows', d: 'Best day and hour for this audience' },
          { icon: FiClock, t: 'Length sweet spot', d: 'Which durations earn the most views' },
          { icon: FiHash, t: 'Title keywords', d: 'Words that recur in top performers' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-xl border border-white/[0.06] p-4">
            <Icon className="h-4 w-4 text-ink-300" />
            <p className="mt-3 text-sm font-medium text-white">{t}</p>
            <p className="mt-1 text-xs text-ink-400">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceHistory;
