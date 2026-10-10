// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import {
  FiActivity, FiArrowRight, FiBarChart2, FiCpu, FiEdit3, FiEye, FiGithub, FiImage, FiLock, FiTarget, FiType,
} from 'react-icons/fi';
import { Badge, Bar, Button } from '../components/ui';

const REPO_URL = 'https://github.com/haaj-1/Youtube-Analytics-Website';

const STATS = [
  { value: '95.6%', label: 'R² on held-out test set' },
  { value: '51,888', label: 'videos in training data' },
  { value: '1,294', label: 'features per prediction' },
  { value: '< 10s', label: 'typical prediction time' },
];

const FEATURES = [
  {
    icon: FiActivity,
    title: 'Performance Predictor',
    body: 'Enter a title, description, thumbnail and channel size. Get projected views with a confidence range and the factors that drove it.',
    to: '/post-performance',
  },
  {
    icon: FiEdit3,
    title: 'Title Optimizer',
    body: 'Generate up to ten variations of your title and score each one with the same model to find the strongest option.',
    to: '/post-performance',
  },
  {
    icon: FiTarget,
    title: 'Personalized models',
    body: "Fit a model to your channel's 40 most recent uploads so predictions reflect your audience, not the average one.",
    to: '/post-performance',
  },
  {
    icon: FiBarChart2,
    title: 'Channel Analytics',
    body: 'Best publish day and hour, the video length that performs, and recurring words in top titles — from the last 100 uploads.',
    to: '/performance-history',
  },
];

const STEPS = [
  { icon: FiType, title: 'Understand the text', body: 'BERT encodes your title and description into a 768-dimension semantic embedding.' },
  { icon: FiImage, title: 'Read the thumbnail', body: 'A ResNet-18 CNN extracts 512 visual features — colour, contrast, composition.' },
  { icon: FiCpu, title: 'Predict', body: 'XGBoost combines both with category, length and channel size to forecast views.' },
];

function HeroMock() {
  const factors = [
    { label: 'Title has a number', v: '+18%', up: true },
    { label: 'High-contrast thumbnail', v: '+11%', up: true },
    { label: 'Length above category median', v: '−4%', up: false },
  ];
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-brand-500/10 blur-3xl" aria-hidden="true" />
      <div className="panel relative overflow-hidden bg-ink-900/90">
        <div className="flex items-center gap-2 border-b border-ov/[0.06] px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ov/10" /><span className="h-2.5 w-2.5 rounded-full bg-ov/10" /><span className="h-2.5 w-2.5 rounded-full bg-ov/10" />
          </span>
          <span className="ml-2 font-mono text-[11px] text-ink-400">prepost / predict</span>
          <Badge tone="brand" className="ml-auto">Global model</Badge>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="eyebrow">Title</p>
            <p className="mt-1.5 text-sm text-fg">7 Python Tricks That Will Change How You Code</p>
          </div>
          <div className="flex items-end justify-between gap-4 border-t border-ov/[0.06] pt-5">
            <div>
              <p className="eyebrow">Predicted views</p>
              <p className="mt-1 font-mono text-5xl font-semibold tracking-tight text-fg">128.4K</p>
              <p className="mt-1 font-mono text-xs text-ink-300">95% range · 92K – 171K</p>
            </div>
            <div className="hidden w-28 sm:block">
              <svg viewBox="0 0 120 48" className="h-12 w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ff3b3b" stopOpacity="0.35" /><stop offset="1" stopColor="#ff3b3b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 40 L15 36 L30 38 L45 28 L60 30 L75 20 L90 22 L105 10 L120 6 L120 48 L0 48 Z" fill="url(#spark)" />
                <path d="M0 40 L15 36 L30 38 L45 28 L60 30 L75 20 L90 22 L105 10 L120 6" fill="none" stroke="#ff6464" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-xs"><span className="text-ink-300">Model confidence</span><span className="font-mono text-ink-100">87%</span></div>
            <Bar value={87} />
          </div>
          <ul className="space-y-2 border-t border-ov/[0.06] pt-5">
            {factors.map((f) => (
              <li key={f.label} className="flex items-center justify-between text-sm">
                <span className="text-ink-200">{f.label}</span>
                <span className={`font-mono text-xs ${f.up ? 'text-success-400' : 'text-brand-400'}`}>{f.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-ink-400">Illustrative example</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/[0.07] blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div className="animate-fade-up">
            <a href={REPO_URL} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ov/10 bg-ov/[0.03] py-1 pl-1 pr-3 text-xs text-ink-200 transition-colors hover:border-ov/20">
              <span className="rounded-full bg-brand-500/15 px-2 py-0.5 font-medium text-brand-300">Open source</span>
              BERT + CNN + XGBoost ensemble <FiArrowRight className="h-3 w-3" />
            </a>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Predict YouTube performance <span className="text-gradient">before you publish.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
              PrePost forecasts how many views a video will get from its title, thumbnail and context — then shows you what to change to do better.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/post-performance" size="lg">Try the predictor <FiArrowRight className="h-4 w-4" /></Button>
              <Button to="/predictive-accuracy" size="lg" variant="secondary">How the model works</Button>
            </div>
            <p className="mt-4 text-sm text-ink-400">5 free predictions a day · unlimited with a free account</p>
          </div>
          <HeroMock />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ov/[0.06] bg-ink-900/40">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-ov/[0.06] px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:px-10">
          {STATS.map((s) => (
            <div key={s.label} className="px-2 py-8 lg:px-8">
              <dt className="order-2 mt-1 text-sm text-ink-300">{s.label}</dt>
              <dd className="font-mono text-3xl font-semibold tracking-tight text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Four tools, one goal: fewer uploads that miss.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body, to }) => (
            <Link key={title} to={to} className="panel group relative overflow-hidden p-6 transition-colors hover:border-ov/15 sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/0 blur-3xl transition-colors group-hover:bg-brand-500/15" aria-hidden="true" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ov/10 bg-ov/[0.03] text-brand-400">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg">
                Open <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-ov/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow">Under the hood</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Three models, one forecast.</h2>
              <p className="mt-4 text-ink-300">
                Each part of your upload is read by a model built for it, then combined into a single prediction.
                Every metric and limitation is documented on the model transparency page.
              </p>
              <Button to="/predictive-accuracy" variant="secondary" className="mt-6">Read the model card <FiArrowRight className="h-4 w-4" /></Button>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="panel p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-brand-400" />
                    <span className="font-mono text-xs text-ink-500">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-ov/[0.06]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-10">
          {[
            { icon: FiEye, t: 'Transparent', d: 'Accuracy, error margins and known blind spots are published, not hidden.' },
            { icon: FiLock, t: 'Privacy-first', d: "Predictions run on public metadata. We don't store your videos or thumbnails." },
            { icon: FiGithub, t: 'Open source', d: 'The full stack — models, API and this interface — is on GitHub.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex gap-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-300" />
              <div>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="panel relative mx-auto max-w-5xl overflow-hidden px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-full h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-semibold sm:text-4xl">See your next video's numbers first.</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-300">No card, no install. Paste a title and get a forecast in seconds.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/post-performance" size="lg">Start predicting <FiArrowRight className="h-4 w-4" /></Button>
              <Button to="/signup" size="lg" variant="secondary">Create free account</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
