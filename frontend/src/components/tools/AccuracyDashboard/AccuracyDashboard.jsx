// src/components/tools/AccuracyDashboard/AccuracyDashboard.jsx
import { useState } from 'react';
import { FiAlertTriangle, FiArrowRight, FiCheck, FiGitBranch, FiImage, FiSliders, FiType } from 'react-icons/fi';
import { Alert, Badge, Bar, Card } from '../../ui';
import { cx } from '../../../lib/cx';

// Static model information - no API call needed
const modelInfo = {
  overview: {
    accuracy_r2: 0.956,
    training_samples: 51888,
    model_type: "Ensemble (XGBoost + BERT + CNN)"
  },
  components: [
    {
      name: "BERT",
      purpose: "Analyzes title and description text to understand semantic meaning and context",
      model: "bert-base-uncased",
      parameters: "110M",
      output: "768-dim embeddings"
    },
    {
      name: "CNN",
      purpose: "Extracts visual features from thumbnails including colors, composition, and text presence",
      model: "ResNet-18",
      parameters: "11M",
      output: "512-dim embeddings"
    },
    {
      name: "XGBoost",
      purpose: "Combines all features to predict view count with high accuracy",
      model: "Gradient Boosting",
      parameters: "200 trees",
      output: "View prediction"
    }
  ],
  features: {
    text_features: {
      description: "Title & Description Analysis",
      importance: 45,
      details: [
        "Semantic meaning via BERT",
        "Keyword relevance",
        "Title length optimization",
        "Clickbait detection"
      ]
    },
    thumbnail_features: {
      description: "Thumbnail Visual Analysis",
      importance: 35,
      details: [
        "Color composition",
        "Face detection",
        "Text presence",
        "Visual complexity"
      ]
    },
    metadata_features: {
      description: "Video Metadata",
      importance: 20,
      details: [
        "Category",
        "Duration",
        "Subscriber count",
        "Publishing time"
      ]
    }
  },
  how_it_works: [
    {
      step: 1,
      title: "Text Processing",
      description: "Your video title and description are analyzed using BERT, a state-of-the-art language model that understands context and meaning."
    },
    {
      step: 2,
      title: "Thumbnail Analysis",
      description: "The thumbnail image is processed through a CNN to extract visual features like colors, composition, and text presence."
    },
    {
      step: 3,
      title: "Metadata Encoding",
      description: "Video metadata (category, duration, subscriber count) is normalized and encoded for the model."
    },
    {
      step: 4,
      title: "Feature Combination",
      description: "All features (768 from BERT + 512 from CNN + 14 metadata) are combined into a 1,294-dimensional feature vector."
    },
    {
      step: 5,
      title: "XGBoost Prediction",
      description: "The XGBoost model processes the combined features and outputs a predicted view count with confidence score."
    }
  ],
  performance_metrics: {
    r2_score: {
      value: 0.956,
      description: "Coefficient of determination - measures how well predictions match actual values",
      interpretation: "95.6% of variance in views is explained by the model"
    },
    mae: {
      value: 685339,
      description: "Mean Absolute Error - average prediction error",
      interpretation: "Predictions are typically within ±685K views"
    },
    rmse: {
      value: 1142231,
      description: "Root Mean Squared Error - penalizes larger errors more",
      interpretation: "Standard deviation of prediction errors"
    }
  },
  training_details: {
    dataset_size: 51888,
    data_sources: [
      "Kaggle YouTube Trending Dataset",
      "Multiple categories and regions",
      "Videos from 2017-2024"
    ],
    validation_split: "15%",
    training_time: "~2 hours on GPU",
    last_retrained: "February 2024"
  },
  limitations: [
    {
      title: "Cannot Predict Viral Content",
      description: "The model predicts typical performance based on historical patterns. It cannot predict viral videos or unexpected trends."
    },
    {
      title: "Historical Data Dependency",
      description: "Predictions are based on past data. Sudden changes in YouTube's algorithm or viewer behavior may affect accuracy."
    },
    {
      title: "Category-Specific Accuracy",
      description: "Accuracy varies by category. Some categories (Gaming, Entertainment) have more training data than others."
    },
    {
      title: "Subscriber Count Impact",
      description: "Predictions are more accurate for channels with 10K-1M subscribers. Very small or very large channels may see different results."
    },
    {
      title: "External Factors Not Considered",
      description: "The model doesn't account for external promotion, collaborations, or current events that might boost views."
    }
  ],
  ethical_considerations: [
    "No personal data is stored or used for training",
    "Model is designed to help creators, not manipulate viewers",
    "Predictions should guide, not dictate content strategy",
    "We encourage authentic content over optimization alone",
    "Model transparency helps users understand limitations"
  ]
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'performance', label: 'Performance' },
  { id: 'limitations', label: 'Limitations' },
];

const componentIcons = [FiType, FiImage, FiGitBranch];

const fmtViews = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : `${Math.round(n / 1e3)}K`);

function Pipeline() {
  const inputs = [
    { label: 'Title + description', model: 'BERT', dims: 768, icon: FiType },
    { label: 'Thumbnail', model: 'ResNet-18', dims: 512, icon: FiImage },
    { label: 'Metadata', model: 'Encoders', dims: 14, icon: FiSliders },
  ];
  return (
    <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_auto_auto_auto]">
      <div className="space-y-2">
        {inputs.map(({ label, model, dims, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-ov/[0.07] bg-ov/[0.02] px-3.5 py-2.5">
            <Icon className="h-4 w-4 shrink-0 text-ink-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-fg">{label}</p>
              <p className="text-xs text-ink-400">{model}</p>
            </div>
            <span className="font-mono text-xs tabular-nums text-ink-200">{dims}d</span>
          </div>
        ))}
      </div>
      <FiArrowRight className="mx-auto h-4 w-4 rotate-90 text-ink-500 lg:rotate-0" />
      <div className="rounded-xl border border-ov/10 bg-ink-850 px-4 py-3 text-center">
        <p className="font-mono text-lg font-semibold text-fg">1,294</p>
        <p className="text-xs text-ink-400">feature vector</p>
      </div>
      <FiArrowRight className="mx-auto h-4 w-4 rotate-90 text-ink-500 lg:rotate-0" />
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/[0.07] px-4 py-3 text-center shadow-glow">
        <p className="text-sm font-semibold text-fg">XGBoost</p>
        <p className="text-xs text-brand-300">→ predicted views</p>
      </div>
    </div>
  );
}

function CheckList({ items, tone = 'brand' }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-sm text-ink-200">
          <FiCheck className={cx('mt-0.5 h-4 w-4 shrink-0', tone === 'brand' ? 'text-brand-400' : 'text-success-400')} />
          {t}
        </li>
      ))}
    </ul>
  );
}

const AccuracyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const r2 = (modelInfo.overview.accuracy_r2 * 100).toFixed(1);
  const { performance_metrics: pm, training_details: td } = modelInfo;

  const onTabKey = (e) => {
    const i = TABS.findIndex((t) => t.id === activeTab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
      setActiveTab(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Headline numbers */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/25 blur-3xl" aria-hidden="true" />
          <p className="text-xs text-ink-300">Accuracy (R²)</p>
          <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-fg">{r2}%</p>
          <p className="mt-1 text-xs text-ink-400">of variance in views explained</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-ink-300">Training data</p>
          <p className="mt-2 font-mono text-4xl font-semibold tabular-nums text-fg">{modelInfo.overview.training_samples.toLocaleString()}</p>
          <p className="mt-1 text-xs text-ink-400">videos across all categories</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-ink-300">Architecture</p>
          <p className="mt-2 text-2xl font-semibold text-fg">Ensemble</p>
          <p className="mt-1 text-xs text-ink-400">BERT + CNN + XGBoost</p>
        </Card>
      </div>

      <Card>
        <div role="tablist" aria-label="Model details" onKeyDown={onTabKey} className="flex gap-1 overflow-x-auto border-b border-ov/[0.06] px-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                'relative whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors',
                activeTab === tab.id ? 'text-fg' : 'text-ink-300 hover:text-fg',
              )}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />}
            </button>
          ))}
        </div>

        <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="p-5 sm:p-6" key={activeTab}>
          {activeTab === 'overview' && (
            <div className="animate-fade-up space-y-8">
              <section>
                <h3 className="mb-4 text-base font-semibold">Pipeline</h3>
                <Pipeline />
              </section>

              <section>
                <h3 className="mb-4 text-base font-semibold">Components</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {modelInfo.components.map((c, idx) => {
                    const Icon = componentIcons[idx];
                    return (
                      <div key={c.name} className="rounded-xl border border-ov/[0.07] bg-ov/[0.02] p-5">
                        <div className="mb-3 flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-ov/10 bg-ov/[0.04] text-brand-400">
                            <Icon className="h-4 w-4" />
                          </div>
                          <h4 className="font-semibold">{c.name}</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-ink-300">{c.purpose}</p>
                        <dl className="mt-4 space-y-1.5 border-t border-ov/[0.06] pt-4 text-xs">
                          {[['Model', c.model], ['Parameters', c.parameters], ['Output', c.output]].map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2">
                              <dt className="text-ink-400">{k}</dt>
                              <dd className="font-mono text-ink-100">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-base font-semibold">Feature importance</h3>
                <div className="space-y-3">
                  {Object.values(modelInfo.features).map((f) => (
                    <div key={f.description} className="rounded-xl border border-ov/[0.07] bg-ov/[0.02] p-5">
                      <div className="mb-3 flex items-baseline justify-between gap-4">
                        <h4 className="text-sm font-medium">{f.description}</h4>
                        <span className="font-mono text-xl font-semibold tabular-nums text-fg">{f.importance}%</span>
                      </div>
                      <Bar value={f.importance} className="h-2" />
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {f.details.map((d) => <Badge key={d}>{d}</Badge>)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'how-it-works' && (
            <div className="animate-fade-up space-y-8">
              <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-ov/10">
                {modelInfo.how_it_works.map((s) => (
                  <li key={s.step} className="relative flex gap-4">
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-500/40 bg-ink-900 font-mono text-xs text-brand-300">
                      {s.step}
                    </span>
                    <div className="flex-1 rounded-xl border border-ov/[0.07] bg-ov/[0.02] p-4">
                      <h4 className="text-sm font-semibold">{s.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink-300">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-ov/[0.07] p-5">
                  <p className="eyebrow mb-3">Input dimensions</p>
                  <p className="font-mono text-2xl font-semibold text-fg">1,294</p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    {[['BERT (text)', 768], ['CNN (image)', 512], ['Metadata', 14]].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><dt className="text-ink-300">{k}</dt><dd className="font-mono text-ink-100">{v}</dd></div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-xl border border-ov/[0.07] p-5">
                  <p className="eyebrow mb-3">Processing time</p>
                  <p className="font-mono text-2xl font-semibold text-fg">~2–3s</p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    {[['BERT', '~1s'], ['CNN', '~0.5s'], ['XGBoost', '~0.1s']].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><dt className="text-ink-300">{k}</dt><dd className="font-mono text-ink-100">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="animate-fade-up space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { k: 'R² score', v: `${(pm.r2_score.value * 100).toFixed(1)}%`, m: pm.r2_score },
                  { k: 'MAE', v: `±${fmtViews(pm.mae.value)}`, m: pm.mae },
                  { k: 'RMSE', v: fmtViews(pm.rmse.value), m: pm.rmse },
                ].map(({ k, v, m }) => (
                  <div key={k} className="rounded-xl border border-ov/[0.07] bg-ov/[0.02] p-5">
                    <p className="eyebrow">{k}</p>
                    <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-fg">{v}</p>
                    <p className="mt-3 text-sm text-ink-300">{m.description}</p>
                    <p className="mt-2 text-xs text-brand-300">{m.interpretation}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-ov/[0.07] p-5">
                  <h4 className="mb-3 text-sm font-semibold">Dataset</h4>
                  <CheckList items={[`${td.dataset_size.toLocaleString()} videos`, ...td.data_sources]} />
                </div>
                <div className="rounded-xl border border-ov/[0.07] p-5">
                  <h4 className="mb-3 text-sm font-semibold">Training</h4>
                  <dl className="space-y-2 text-sm">
                    {[['Validation split', td.validation_split], ['Training time', td.training_time], ['Last retrained', td.last_retrained]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4"><dt className="text-ink-300">{k}</dt><dd className="text-ink-100">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="rounded-xl border border-ov/[0.07] p-5">
                <h4 className="text-sm font-semibold">Reading the R² score</h4>
                <p className="mt-1 text-sm text-ink-300">R² measures how much of the variation in views the model explains.</p>
                <div className="mt-4 flex h-2 overflow-hidden rounded-full">
                  <div className="w-[70%] bg-ov/10" title="Below 70%: limited" />
                  <div className="w-[20%] bg-ov/25" title="70–90%: good" />
                  <div className="w-[10%] bg-brand-500" title="90–100%: excellent" />
                </div>
                <div className="mt-2 grid grid-cols-[70%_20%_10%] text-[11px] text-ink-400">
                  <span>Limited &lt;70%</span><span>Good 70–90%</span><span className="text-brand-300">90%+</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'limitations' && (
            <div className="animate-fade-up space-y-6">
              <Alert tone="warning">
                Predictions are estimates based on historical data and can't account for every variable. Use them to compare options, not as a promise.
              </Alert>
              <div className="grid gap-3 md:grid-cols-2">
                {modelInfo.limitations.map((l) => (
                  <div key={l.title} className="flex gap-3 rounded-xl border border-ov/[0.07] bg-ov/[0.02] p-4">
                    <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-400" />
                    <div>
                      <h4 className="text-sm font-semibold">{l.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink-300">{l.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-ov/[0.07] p-5">
                  <h4 className="mb-3 text-sm font-semibold">Ethical considerations</h4>
                  <CheckList items={modelInfo.ethical_considerations} tone="success" />
                </div>
                <div className="rounded-xl border border-ov/[0.07] p-5">
                  <h4 className="mb-3 text-sm font-semibold">Best practices</h4>
                  <CheckList items={[
                    'Use predictions as guidance, not absolute truth',
                    'Combine AI insights with your creative judgment',
                    'Test different approaches and learn from results',
                    'Focus on creating quality content first',
                    'Use personalized models for more accurate predictions',
                  ]} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccuracyDashboard;
