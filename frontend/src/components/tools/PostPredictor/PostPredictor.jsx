import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiActivity, FiFileText, FiImage, FiLayers, FiRefreshCw, FiZap } from 'react-icons/fi';
import { ML_API_URL, request, fmtDuration } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import { Alert, Button, Card, CardHeader, EmptyState, Field, Input, Modal, Select } from '../../ui';
import { cx } from '../../../lib/cx';
import ThumbnailInput from './ThumbnailInput';
import ChannelModelPicker from './ChannelModelPicker';
import Results, { ResultsLoading } from './Results';
import {
  CATEGORIES, DURATION_PRESETS, EMPTY_FORM, GUEST_DAILY_LIMIT, SUBSCRIBER_RANGES, TITLE_MAX, rangeFor,
} from './constants';

const LIMIT_KEY = 'predictionLimit';
const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function readGuestUsage() {
  const today = new Date().toDateString();
  try {
    const stored = JSON.parse(localStorage.getItem(LIMIT_KEY) || 'null');
    return stored?.date === today ? stored.count : 0;
  } catch {
    return 0;
  }
}

function recordGuestUsage() {
  const count = readGuestUsage() + 1;
  localStorage.setItem(LIMIT_KEY, JSON.stringify({ date: new Date().toDateString(), count }));
  return count;
}

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read the thumbnail file.'));
    r.readAsDataURL(file);
  });

function LivePreview({ form, previewUrl, channelName }) {
  const category = CATEGORIES.find((c) => c.id === form.category_id)?.name;
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </span>
        <span className="mx-auto rounded-md bg-white/[0.04] px-3 py-0.5 font-mono text-[11px] text-ink-400">youtube.com/watch</span>
        <span className="eyebrow">Preview</span>
      </div>
      <div className="p-4">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-850">
          {previewUrl ? (
            <img src={previewUrl} alt="Thumbnail preview" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="grid-bg absolute inset-0 flex items-center justify-center [mask-image:none]">
              <div className="text-center">
                <FiImage className="mx-auto h-6 w-6 text-ink-500" />
                <p className="mt-2 text-xs text-ink-400">No thumbnail yet</p>
              </div>
            </div>
          )}
          <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 font-mono text-xs text-white">
            {fmtDuration(form.duration_seconds)}
          </span>
        </div>
        <div className="mt-3 flex gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-ink-600 to-ink-700" />
          <div className="min-w-0">
            <p className={cx('line-clamp-2 text-sm font-medium leading-snug', form.title ? 'text-white' : 'text-ink-500')}>
              {form.title || 'Your video title will appear here'}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {channelName || 'Your channel'} · {rangeFor(form.subscriber_count).label} subs · {category}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function PostPredictor() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState(() => {
    const prefill = location.state?.subscriber_count;
    return prefill ? { ...EMPTY_FORM, subscriber_count: prefill } : EMPTY_FORM;
  });
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [guestUsed, setGuestUsed] = useState(readGuestUsage);
  const [showLimit, setShowLimit] = useState(false);
  const [personalModel, setPersonalModel] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const remaining = Math.max(0, GUEST_DAILY_LIMIT - guestUsed);
  const set = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  // Object URLs must be revoked or they leak for the lifetime of the page
  useEffect(() => {
    if (form.thumbnail_file) {
      const url = URL.createObjectURL(form.thumbnail_file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(form.thumbnail_url || '');
  }, [form.thumbnail_file, form.thumbnail_url]);

  const isStale = useMemo(() => {
    if (!lastPayload) return false;
    return ['title', 'description', 'category_id', 'subscriber_count', 'duration_seconds'].some((k) => lastPayload[k] !== form[k])
      || lastPayload.thumbnailKey !== (form.thumbnail_file?.name || form.thumbnail_url);
  }, [form, lastPayload]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Add a title to predict performance.';
    else if (form.title.length > TITLE_MAX) e.title = `YouTube titles are capped at ${TITLE_MAX} characters.`;
    if (!form.description.trim()) e.description = 'A short description helps the language model understand the topic.';
    if (!form.duration_seconds || form.duration_seconds < 1) e.duration_seconds = 'Enter a duration.';
    return e;
  };

  const handlePredict = useCallback(async () => {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    if (!isLoggedIn && remaining <= 0) { setShowLimit(true); return; }

    setIsPredicting(true);
    setRequestError(null);
    try {
      const thumb = form.thumbnail_file ? await fileToDataUrl(form.thumbnail_file) : form.thumbnail_url;
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        thumbnail_url: thumb || '',
        category_id: form.category_id,
        subscriber_count: form.subscriber_count,
        duration_seconds: form.duration_seconds,
      };
      const path = personalModel ? '/predict/personalized/predict' : '/predict/';
      const data = await request(ML_API_URL, path, { method: 'POST', body, timeout: 120000 });
      setPredictions(data);
      setLastPayload({
        ...form,
        ...body,
        title: form.title,
        description: form.description,
        personalized: !!personalModel,
        thumbnailKey: form.thumbnail_file?.name || form.thumbnail_url,
      });
      if (!isLoggedIn) {
        const used = recordGuestUsage();
        setGuestUsed(used);
        if (used >= GUEST_DAILY_LIMIT) setShowLimit(true);
      }
      if (window.matchMedia('(max-width: 1023px)').matches) {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setIsPredicting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isLoggedIn, remaining, personalModel]);

  // Cmd/Ctrl + Enter runs a prediction from anywhere in the form
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isPredicting) handlePredict();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePredict, isPredicting]);

  const reset = () => {
    setForm(EMPTY_FORM);
    setPredictions(null);
    setLastPayload(null);
    setErrors({});
    setRequestError(null);
  };

  const applyTitle = (title) => {
    set('title', title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const minutes = Math.floor(form.duration_seconds / 60);
  const seconds = form.duration_seconds % 60;
  const setDuration = (m, s) => set('duration_seconds', Math.max(0, (Number(m) || 0) * 60 + (Number(s) || 0)));

  return (
    <>
      <Modal open={showLimit} onClose={() => setShowLimit(false)} labelledBy="limit-title">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-400">
          <FiZap className="h-5 w-5" />
        </div>
        <h2 id="limit-title" className="text-xl font-semibold">You've used today's free predictions</h2>
        <p className="mt-2 text-sm text-ink-300">
          Guests get {GUEST_DAILY_LIMIT} predictions a day. Create a free account for unlimited predictions — no card required.
        </p>
        <div className="mt-6 grid gap-2">
          <Button to="/signup" size="lg">Create free account</Button>
          <Button to="/login" size="lg" variant="secondary">I already have an account</Button>
        </div>
      </Modal>

      {!isLoggedIn && (
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2.5 text-sm">
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: GUEST_DAILY_LIMIT }).map((_, i) => (
              <span key={i} className={cx('h-1.5 w-4 rounded-full', i < remaining ? 'bg-brand-500' : 'bg-white/10')} />
            ))}
          </div>
          <span className="text-ink-200">
            <span className="font-mono text-white">{remaining}</span> of {GUEST_DAILY_LIMIT} free predictions left today
          </span>
          <Button to="/signup" variant="ghost" size="sm" className="ml-auto">Get unlimited →</Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Inputs */}
        <form
          className="space-y-5"
          noValidate
          onSubmit={(e) => { e.preventDefault(); handlePredict(); }}
        >
          <Card>
            <CardHeader icon={<FiFileText className="h-4 w-4" />} title="Video details" description="What viewers see before they click." />
            <div className="space-y-5 p-5">
              <Field label="Title" error={errors.title}>
                {(p) => (
                  <div className="relative">
                    <Input
                      {...p}
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      placeholder="e.g. 10 Python tips I wish I knew sooner"
                      invalid={!!errors.title}
                      className="pr-16"
                    />
                    <span className={cx('pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[11px] tabular-nums',
                      form.title.length > TITLE_MAX ? 'text-brand-400' : form.title.length > 70 ? 'text-amber-400' : 'text-ink-400')}>
                      {form.title.length}/{TITLE_MAX}
                    </span>
                  </div>
                )}
              </Field>

              <Field label="Description" error={errors.description} hint="The first two lines matter most — they show in search results.">
                {(p) => (
                  <textarea
                    {...p}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="What's the video about? Who is it for?"
                    rows={4}
                    className={cx('input h-auto resize-y py-3 leading-relaxed', errors.description && 'border-brand-500/60')}
                  />
                )}
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader icon={<FiLayers className="h-4 w-4" />} title="Context" description="Category, audience size and length." />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Field label="Category">
                {(p) => (
                  <Select {...p} value={form.category_id} onChange={(e) => set('category_id', Number(e.target.value))}>
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                )}
              </Field>
              <Field label="Subscribers" hint={personalModel ? 'Set from your channel model.' : undefined}>
                {(p) => (
                  <Select {...p} value={rangeFor(form.subscriber_count).value} onChange={(e) => set('subscriber_count', Number(e.target.value))}>
                    {SUBSCRIBER_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </Select>
                )}
              </Field>
              <div className="sm:col-span-2">
                <span className="label" id="duration-label">Duration</span>
                <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby="duration-label">
                  <div className="flex items-center gap-1.5">
                    <Input type="number" min="0" inputMode="numeric" aria-label="Minutes" value={minutes} onChange={(e) => setDuration(e.target.value, seconds)} className="w-20 text-center font-mono" />
                    <span className="text-xs text-ink-400">min</span>
                    <Input type="number" min="0" max="59" inputMode="numeric" aria-label="Seconds" value={seconds} onChange={(e) => setDuration(minutes, Math.min(59, Number(e.target.value)))} className="w-20 text-center font-mono" />
                    <span className="text-xs text-ink-400">sec</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                    {DURATION_PRESETS.map((d) => (
                      <button key={d.label} type="button" onClick={() => set('duration_seconds', d.seconds)}
                        className={cx('rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                          form.duration_seconds === d.seconds ? 'border-brand-500/50 bg-brand-500/10 text-brand-300' : 'border-white/10 text-ink-300 hover:border-white/20 hover:text-white')}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.duration_seconds && <p className="mt-1.5 text-xs text-brand-300">{errors.duration_seconds}</p>}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader icon={<FiImage className="h-4 w-4" />} title="Thumbnail" />
            <div className="p-5">
              <ThumbnailInput
                file={form.thumbnail_file}
                url={form.thumbnail_url}
                previewUrl={previewUrl}
                onFile={(f) => setForm((p) => ({ ...p, thumbnail_file: f, thumbnail_url: f ? '' : p.thumbnail_url }))}
                onUrl={(u) => setForm((p) => ({ ...p, thumbnail_url: u, thumbnail_file: u ? null : p.thumbnail_file }))}
                onError={setRequestError}
              />
            </div>
          </Card>

          <Card>
            <CardHeader icon={<FiActivity className="h-4 w-4" />} title="Prediction model" />
            <div className="p-5">
              <ChannelModelPicker
                model={personalModel}
                onError={setRequestError}
                onModel={(m) => {
                  setPersonalModel(m);
                  if (m?.stats?.subscriber_count) set('subscriber_count', m.stats.subscriber_count);
                }}
              />
            </div>
          </Card>

          {requestError && <Alert onDismiss={() => setRequestError(null)}>{requestError}</Alert>}

          <div className="sticky bottom-4 z-10 flex gap-2 lg:static">
            <Button type="submit" size="lg" loading={isPredicting} className="flex-1 shadow-2xl lg:shadow-none">
              {isPredicting ? 'Running model…' : (<><FiZap className="h-4 w-4" /> {predictions ? 'Re-run prediction' : 'Predict performance'}</>)}
              {!isPredicting && <kbd className="ml-2 hidden rounded border border-white/25 px-1.5 font-mono text-[10px] text-white/80 sm:inline">{IS_MAC ? '⌘↵' : 'Ctrl ↵'}</kbd>}
            </Button>
            {predictions && (
              <Button type="button" size="lg" variant="secondary" onClick={reset} aria-label="Start over">
                <FiRefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Preview + results */}
        <div className="scroll-mt-20 space-y-5" id="results">
          <LivePreview form={form} previewUrl={previewUrl} channelName={personalModel?.stats?.channel_name || location.state?.channel_name} />
          {isPredicting ? (
            <ResultsLoading />
          ) : predictions ? (
            <>
              {isStale && (
                <Alert tone="warning">
                  Inputs changed since this prediction.{' '}
                  <button onClick={handlePredict} className="font-medium text-white underline underline-offset-2">Re-run</button>
                </Alert>
              )}
              <Results predictions={predictions} payload={lastPayload} onUseTitle={applyTitle} />
            </>
          ) : (
            <EmptyState
              icon={<FiZap className="h-5 w-5" />}
              title="No prediction yet"
              description="Fill in your video details and run the model to see projected views, the factors behind them and better title options."
            />
          )}
        </div>
      </div>
    </>
  );
}
