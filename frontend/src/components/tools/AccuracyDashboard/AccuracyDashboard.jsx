// src/components/tools/AccuracyDashboard/AccuracyDashboard.jsx
import React, { useState } from 'react';
import './AccuracyDashboard.css';

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

const AccuracyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="border-b border-red-100 p-6 bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Model Transparency Dashboard</h2>
        <p className="text-slate-600">
          Understanding how our AI predicts YouTube video performance
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-6">
        <div className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'performance', label: 'Performance' },
            { id: 'limitations', label: 'Limitations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                <div className="text-sm font-medium text-red-100 mb-2">Model Accuracy (R²)</div>
                <div className="text-4xl font-bold mb-2">
                  {(modelInfo.overview.accuracy_r2 * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-red-100">
                  Explains {(modelInfo.overview.accuracy_r2 * 100).toFixed(1)}% of variance in views
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="text-sm font-medium text-orange-100 mb-2">Training Data</div>
                <div className="text-4xl font-bold mb-2">
                  {(modelInfo.overview.training_samples / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-orange-100">
                  Videos analyzed across all categories
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-xl p-6 text-white">
                <div className="text-sm font-medium text-red-100 mb-2">Model Type</div>
                <div className="text-2xl font-bold mb-2">
                  Ensemble
                </div>
                <div className="text-sm text-red-100">
                  BERT + CNN + XGBoost
                </div>
              </div>
            </div>

            {/* Model Components */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Model Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modelInfo.components.map((component, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        {idx === 0 ? (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                          </svg>
                        ) : idx === 1 ? (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7H7v6h6V7z"/><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900">{component.name}</h4>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{component.purpose}</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span className="font-medium">{component.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parameters:</span>
                        <span className="font-medium">{component.parameters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Output:</span>
                        <span className="font-medium">{component.output}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Importance */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Feature Importance</h3>
              <div className="space-y-4">
                {Object.entries(modelInfo.features).map(([key, feature]) => (
                  <div key={key} className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{feature.description}</h4>
                        <p className="text-sm text-slate-600">
                          {feature.importance}% contribution to predictions
                        </p>
                      </div>
                      <div className="text-3xl font-bold text-red-600">{feature.importance}%</div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-3"
                        style={{ width: `${feature.importance}%` }}
                      ></div>
                    </div>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How It Works Tab */}
        {activeTab === 'how-it-works' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Prediction Pipeline</h3>
              <p className="text-sm text-red-800">
                Your video data goes through a 5-step process to generate accurate predictions
              </p>
            </div>

            <div className="space-y-4">
              {modelInfo.how_it_works.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-slate-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-3">Technical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-red-900 mb-1">Input Dimensions</p>
                  <p className="text-red-800">1,294 features total</p>
                  <ul className="mt-2 space-y-1 text-red-700">
                    <li>• 768 from BERT (text)</li>
                    <li>• 512 from CNN (image)</li>
                    <li>• 14 from metadata</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-900 mb-1">Processing Time</p>
                  <p className="text-red-800">~2-3 seconds per prediction</p>
                  <ul className="mt-2 space-y-1 text-red-700">
                    <li>• BERT: ~1s</li>
                    <li>• CNN: ~0.5s</li>
                    <li>• XGBoost: ~0.1s</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(modelInfo.performance_metrics).map(([key, metric]) => (
                <div key={key} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="text-sm font-medium text-slate-600 mb-2">
                    {key.toUpperCase().replace('_', ' ')}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-3">
                    {typeof metric.value === 'number' && metric.value < 1
                      ? (metric.value * 100).toFixed(1) + '%'
                      : metric.value.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{metric.description}</p>
                  <p className="text-xs text-red-600 font-medium">{metric.interpretation}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Training Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Dataset</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>{modelInfo.training_details.dataset_size.toLocaleString()} videos</span>
                    </li>
                    {modelInfo.training_details.data_sources.map((source, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Training Info</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex justify-between">
                      <span>Validation Split:</span>
                      <span className="font-medium">{modelInfo.training_details.validation_split}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Training Time:</span>
                      <span className="font-medium">{modelInfo.training_details.training_time}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Last Retrained:</span>
                      <span className="font-medium">{modelInfo.training_details.last_retrained}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-3">What This Means</h3>
              <p className="text-sm text-orange-800 mb-3">
                An R² score of {(modelInfo.overview.accuracy_r2 * 100).toFixed(1)}% means the model is highly accurate at predicting video performance. 
                For context:
              </p>
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>90-100%: Excellent prediction accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>70-90%: Good prediction accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Below 70%: Limited prediction accuracy</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Limitations Tab */}
        {activeTab === 'limitations' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-2">Important Disclaimer</h3>
              <p className="text-sm text-orange-800">
                While the model is highly accurate, it's important to understand its limitations. 
                Predictions are estimates based on historical data and cannot account for all variables.
              </p>
            </div>

            <div className="space-y-4">
              {modelInfo.limitations.map((limitation, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                      !
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 mb-2">{limitation.title}</h4>
                      <p className="text-sm text-slate-700">{limitation.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-3">Ethical Considerations</h3>
              <ul className="space-y-2 text-sm text-red-800">
                {modelInfo.ethical_considerations.map((consideration, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-3">Best Practices</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Use predictions as guidance, not absolute truth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Combine AI insights with your creative judgment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Test different approaches and learn from results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Focus on creating quality content first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Use personalized models for more accurate predictions</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccuracyDashboard;
