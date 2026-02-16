/**
 * NLP Caption Lab Component
 * 
 * Title optimization tool that generates and compares multiple title variations
 * using ML predictions to find the best performing option.
 * 
 * Features:
 * - Generate up to 10 title variations
 * - ML-based performance predictions for each variation
 * - Confidence intervals and feature importance analysis
 * - Similar video comparisons from training dataset
 * - Separate analysis for title, description, and metadata factors
 * 
 * Layout:
 * - Left: Input form + Prediction confidence + Feature importance
 * - Right: Results with best title + All variations + Similar videos
 */

import { useState } from 'react';
import './NLPCaptionLab.css';

const CATEGORIES = [
  { id: 24, name: 'Entertainment' },
  { id: 27, name: 'Education' },
  { id: 28, name: 'Science & Technology' },
  { id: 20, name: 'Gaming' },
  { id: 10, name: 'Music' },
  { id: 23, name: 'Comedy' },
  { id: 26, name: 'Howto & Style' }
];

const NLPCaptionLab = () => {
  const [formData, setFormData] = useState({
    base_title: '',
    description: '',
    category_id: 24,
    subscriber_count: 10000,
    duration_seconds: 600,
    thumbnail_url: ''
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    if (!formData.base_title || !formData.description) {
      setError('Please enter both title and description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/optimizer/optimize-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Optimization failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Input Section */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Title Optimizer</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Title *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="e.g. Python Tutorial"
                value={formData.base_title}
                onChange={(e) => setFormData({ ...formData, base_title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                rows="4"
                placeholder="Describe your video content..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subscribers
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  value={formData.subscriber_count}
                  onChange={(e) => setFormData({ ...formData, subscriber_count: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                value={formData.duration_seconds}
                onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) })}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleOptimize}
              disabled={isLoading || !formData.base_title || !formData.description}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  Generate Title Variations
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Confidence Interval - MOVED TO LEFT COLUMN */}
        {results && results.variations[0].confidence_interval && (
          <div className="mt-6 bg-gradient-to-br from-orange-50 to-coral-50 p-6 rounded-xl border-2 border-orange-200">
            <h3 className="text-lg font-bold text-orange-900 mb-3">Prediction Confidence</h3>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                {results.variations[0].confidence_interval.confidence_level} Confidence Range:
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {results.variations[0].confidence_interval.range_description} <span className="text-sm font-normal text-gray-600">Predicted Views</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Based on model accuracy of {(results.variations[0].confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        )}
        
        {/* Feature Importance - Title & Description */}
        {results && results.variations && results.variations[0] && results.variations[0].feature_importance && results.variations[0].feature_importance.length > 0 ? (
          <div className="mt-6 space-y-4">
            {/* Title Factors */}
            {results.variations[0].feature_importance.filter(f => f.type === 'title').length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  Title Performance Factors
                </h3>
                <div className="space-y-3">
                  {results.variations[0].feature_importance.filter(f => f.type === 'title').map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-orange-100">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                        feature.impact === 'high' ? 'bg-green-100 text-green-700' :
                        feature.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                        feature.impact === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feature.impact === 'high' ? '↑' : feature.impact === 'negative' ? '↓' : '•'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 text-sm">{feature.factor}</p>
                          <span className={`text-sm font-bold ${
                            feature.impact === 'high' ? 'text-green-600' :
                            feature.impact === 'medium' ? 'text-orange-600' :
                            feature.impact === 'negative' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {feature.impact_percent}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description Factors */}
            {results.variations[0].feature_importance.filter(f => f.type === 'description').length > 0 && (
              <div className="bg-gradient-to-br from-coral-50 to-orange-50 p-6 rounded-xl border-2 border-coral-200">
                <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                  Description Performance Factors
                </h3>
                <div className="space-y-3">
                  {results.variations[0].feature_importance.filter(f => f.type === 'description').map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-orange-100">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                        feature.impact === 'high' ? 'bg-green-100 text-green-700' :
                        feature.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                        feature.impact === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feature.impact === 'high' ? '↑' : feature.impact === 'negative' ? '↓' : '•'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 text-sm">{feature.factor}</p>
                          <span className={`text-sm font-bold ${
                            feature.impact === 'high' ? 'text-green-600' :
                            feature.impact === 'medium' ? 'text-orange-600' :
                            feature.impact === 'negative' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {feature.impact_percent}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Other Factors (metadata) */}
            {results.variations[0].feature_importance.filter(f => f.type === 'metadata').length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200">
                <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                  Other Performance Factors
                </h3>
                <div className="space-y-3">
                  {results.variations[0].feature_importance.filter(f => f.type === 'metadata').map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-orange-100">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-bold ${
                        feature.impact === 'high' ? 'bg-green-100 text-green-700' :
                        feature.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                        feature.impact === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feature.impact === 'high' ? '↑' : feature.impact === 'negative' ? '↓' : '•'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 text-sm">{feature.factor}</p>
                          <span className={`text-sm font-bold ${
                            feature.impact === 'high' ? 'text-green-600' :
                            feature.impact === 'medium' ? 'text-orange-600' :
                            feature.impact === 'negative' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {feature.impact_percent}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Results Section */}
      <div className="flex-1">
        {results ? (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-red-50 to-orange-100 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-900 mb-4">Best Performing Title</h3>
              <p className="text-2xl font-bold text-red-900 mb-4">{results.best_title}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-red-700">Predicted Views</p>
                  <p className="text-xl font-bold text-red-900">{formatNumber(results.best_views)}</p>
                </div>
                <div>
                  <p className="text-sm text-red-700">Improvement</p>
                  <p className="text-xl font-bold text-red-900">+{results.improvement.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* All Variations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Variations</h3>
              <div className="space-y-3">
                {results.variations.map((variation, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      idx === 0
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-900 flex-1">{variation.title}</p>
                      {idx === 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                          BEST
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span className="text-gray-600">
                        Views: <span className="font-bold text-gray-900">{formatNumber(variation.predicted_views)}</span>
                      </span>
                      <span className={`font-bold ${
                        variation.improvement_percent > 0 ? 'text-green-600' : 
                        variation.improvement_percent < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {variation.improvement_percent > 0 ? '+' : ''}{variation.improvement_percent}%
                      </span>
                      <span className="text-gray-600">
                        Confidence: <span className="font-bold text-gray-900">{(variation.confidence * 100).toFixed(0)}%</span>
                      </span>
                    </div>

                    {variation.insights && variation.insights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {variation.insights.map((insight, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                          >
                            {insight}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Similar Videos */}
            {results.variations[0].similar_videos && results.variations[0].similar_videos.count > 0 && (
              <div className="bg-gradient-to-br from-coral-50 to-orange-50 p-6 rounded-xl border-2 border-coral-200">
                <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  Similar Videos in Dataset
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  Based on {results.variations[0].similar_videos.count} videos with "{results.variations[0].similar_videos.keyword}" in our training data
                </p>
                <div className="space-y-2 mb-4">
                  {results.variations[0].similar_videos.videos.slice(0, 3).map((video, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg text-sm border border-orange-100">
                      <p className="text-gray-700 flex-1 mr-3">{video.title}</p>
                      <span className="font-bold text-orange-900">{video.views_formatted}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <p className="text-sm text-orange-900">
                    <span className="font-bold">Average for similar videos:</span> {results.variations[0].similar_videos.average_views_formatted} views
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600">
              Enter your video details and click "Generate Title Variations" to see AI-powered optimization suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NLPCaptionLab;
