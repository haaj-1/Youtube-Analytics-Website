import { useEffect, useState } from 'react';
import {
  FiArrowDownRight, FiArrowUpRight, FiCheckCircle, FiAlertTriangle, FiDatabase, FiMinus, FiZap, FiEdit3,
} from 'react-icons/fi';
import { ML_API_URL, request, fmt } from '../../../lib/api';
import { Alert, Badge, Bar, Button, Card, CardHeader, Stat } from '../../ui';
import { cx } from '../../../lib/cx';

const STAGES = [
  'Encoding title & description with BERT',
  'Extracting thumbnail features with ResNet-18',
  'Combining 1,294 features',
  'Running XGBoost regression',
];

export function ResultsLoading() {
  const [stage, setStage] = useState(0);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 1400);
    const s = setTimeout(() => setSlow(true), 9000);
    return () => { clearInterval(t); clearTimeout(s); };
  }, []);

  return (
    <Card className="p-6" aria-live="polite">
      <p className="eyebrow mb-4">Running model</p>
      <ol className="space-y-3">
        {STAGES.map((label, i) => (
          <li key={label} className={cx('flex items-center gap-3 text-sm transition-colors', i <= stage ? 'text-fg' : 'text-ink-500')}>
            <span className={cx('flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
              i < stage ? 'border-success-500/40 bg-success-500/15 text-success-300'
                : i === stage ? 'border-brand-500/50 text-brand-300' : 'border-ov/10')}>
              {i < stage ? '✓' : i === stage ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" /> : ''}
            </span>
            {label}
          </li>
        ))}
      </ol>
      <div className="mt-6 space-y-3">
        <div className="skeleton h-10 w-2/3" />
        <div className="grid grid-cols-3 gap-3">
          <div className="skeleton h-16" /><div className="skeleton h-16" /><div className="skeleton h-16" />
        </div>
      </div>
      {slow && (
        <p className="mt-5 text-xs text-ink-300">
          The model server sleeps when idle — the first prediction can take up to a minute while it wakes up.
        </p>
      )}
    </Card>
  );
}

const impactMeta = {
  high: { icon: FiArrowUpRight, cls: 'text-success-400' },
  positive: { icon: FiArrowUpRight, cls: 'text-success-400' },
  negative: { icon: FiArrowDownRight, cls: 'text-brand-400' },
};

function TitleOptimizer({ payload, onUseTitle }) {
  const [state, setState] = useState({ loading: false, data: null, error: null });

  const run = async () => {
    setState({ loading: true, data: null, error: null });
    try {
      const data = await request(ML_API_URL, '/optimizer/optimize-title', {
        method: 'POST',
        body: {
          base_title: payload.title,
          description: payload.description,
          category_id: payload.category_id,
          subscriber_count: payload.subscriber_count,
          duration_seconds: payload.duration_seconds,
          thumbnail_url: payload.thumbnail_url || null,
        },
        timeout: 180000,
      });
      setState({ loading: false, data, error: null });
    } catch (err) {
      setState({ loading: false, data: null, error: err.message });
    }
  };

  const { loading, data, error } = state;
  const maxViews = data ? Math.max(...data.variations.map((v) => v.predicted_views)) : 0;

  return (
    <Card>
      <CardHeader
        icon={<FiEdit3 className="h-4 w-4" />}
        title="Title optimizer"
        description="Scores up to 10 variations of your title with the same model."
        action={!data && <Button size="sm" variant="secondary" onClick={run} loading={loading}>{loading ? 'Scoring…' : 'Find a better title'}</Button>}
      />
      <div className="p-5">
        {error && <Alert>{error}</Alert>}
        {!data && !error && (
          <p className="text-sm text-ink-300">
            {loading ? 'Generating and scoring variations — this usually takes 10–30 seconds.' : 'Try alternatives like adding a number, the year, or a “for beginners” angle and see which the model prefers.'}
          </p>
        )}
        {data && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              {data.improvement > 0 ? (
                <Badge tone="success"><FiArrowUpRight className="h-3 w-3" /> +{data.improvement}% with the best variation</Badge>
              ) : (
                <Badge>Your original title already scores highest</Badge>
              )}
            </div>
            <ul className="space-y-2">
              {data.variations.map((v, i) => {
                const isOriginal = v.title === payload.title;
                return (
                  <li key={v.title} className={cx('rounded-xl border p-3', i === 0 ? 'border-brand-500/30 bg-brand-500/[0.05]' : 'border-ov/[0.06] bg-ov/[0.02]')}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 shrink-0 font-mono text-xs text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-fg">
                          {v.title}
                          {isOriginal && <span className="ml-2 text-xs text-ink-400">(original)</span>}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <Bar value={v.predicted_views} max={maxViews} className="max-w-[160px]" tone={i === 0 ? 'brand' : 'neutral'} />
                          <span className="font-mono text-xs tabular-nums text-ink-200">{fmt(v.predicted_views)}</span>
                          {!isOriginal && (
                            <span className={cx('font-mono text-xs tabular-nums', v.improvement_percent > 0 ? 'text-success-400' : v.improvement_percent < 0 ? 'text-brand-400' : 'text-ink-400')}>
                              {v.improvement_percent > 0 ? '+' : ''}{v.improvement_percent}%
                            </span>
                          )}
                        </div>
                      </div>
                      {!isOriginal && (
                        <Button size="sm" variant="ghost" onClick={() => onUseTitle(v.title)}>Use</Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </Card>
  );
}

export default function Results({ predictions, payload, onUseTitle }) {
  const ci = predictions.confidence_interval;
  const confidence = Math.round((predictions.confidence_score || 0) * 100);
  const features = predictions.feature_importance || [];
  const recs = predictions.recommendations || [];
  const similar = predictions.similar_videos;

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Hero */}
      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Predicted views</p>
            <Badge tone="brand"><FiZap className="h-3 w-3" /> {payload.personalized ? 'Channel model' : 'Global model'}</Badge>
          </div>
          <p className="mt-3 font-mono text-5xl font-semibold tabular-nums tracking-tight text-fg sm:text-6xl">
            {fmt(predictions.predicted_views)}
          </p>
          {ci && (
            <p className="mt-2 text-sm text-ink-300">
              {ci.confidence_level || '95%'} range: <span className="font-mono text-ink-100">{ci.range_description}</span>
            </p>
          )}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-ink-300">Model confidence</span>
              <span className="font-mono text-ink-100">{confidence}%</span>
            </div>
            <Bar value={confidence} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Est. likes" value={fmt(Math.round(predictions.predicted_views * 0.04))} sub="~4% of views" />
        <Stat label="Est. comments" value={fmt(Math.round(predictions.predicted_views * 0.005))} sub="~0.5% of views" />
        <Stat label="Engagement" value="4.5%" sub="Industry benchmark" />
      </div>

      {recs.length > 0 && (
        <div className="space-y-2">
          {recs.map((r, i) => (
            <div key={i} className={cx('flex items-start gap-3 rounded-xl border p-3.5 text-sm',
              r.type === 'success' ? 'border-success-500/25 bg-success-500/[0.06]' : 'border-warning-500/25 bg-warning-500/[0.06]')}>
              {r.type === 'success'
                ? <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success-400" />
                : <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-400" />}
              <div>
                <p className="text-fg">{r.message}</p>
                {r.action && <p className="mt-0.5 text-xs text-ink-300">{r.action}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {features.length > 0 && (
        <Card>
          <CardHeader title="Why this prediction" description="The factors that moved the estimate most." />
          <ul className="divide-y divide-ov/[0.05]">
            {features.map((f, i) => {
              const meta = impactMeta[f.impact] || { icon: FiMinus, cls: 'text-ink-400' };
              const Icon = meta.icon;
              return (
                <li key={i} className="flex items-center gap-3 px-5 py-3">
                  <Icon className={cx('h-4 w-4 shrink-0', meta.cls)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-fg">{f.factor}</p>
                    {f.description && <p className="truncate text-xs text-ink-400">{f.description}</p>}
                  </div>
                  {f.impact_percent && <span className={cx('font-mono text-sm tabular-nums', meta.cls)}>{f.impact_percent}</span>}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <TitleOptimizer key={payload.title + payload.description} payload={payload} onUseTitle={onUseTitle} />

      {similar?.count > 0 && (
        <Card>
          <CardHeader
            icon={<FiDatabase className="h-4 w-4" />}
            title="Similar videos in the dataset"
            description={`${similar.count.toLocaleString()} videos matching “${similar.keyword}”`}
          />
          <ul className="divide-y divide-ov/[0.05]">
            {similar.videos.slice(0, 4).map((v, i) => (
              <li key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                <p className="truncate text-sm text-ink-100">{v.title}</p>
                <span className="shrink-0 font-mono text-sm tabular-nums text-fg">{v.views_formatted}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-ov/[0.05] px-5 py-3 text-xs text-ink-300">
            Dataset average: <span className="font-mono text-fg">{similar.average_views_formatted}</span> views
          </div>
        </Card>
      )}
    </div>
  );
}
