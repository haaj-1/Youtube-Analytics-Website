// src/components/tools/NLPCaptionLab/NLPCaptionLab.jsx
import React, { useState } from 'react';
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
      </div>

      {/* Results Section */}
      <div className="flex-1">
        {results ? (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">Best Performing Title</h3>
              <p className="text-2xl font-bold text-green-900 mb-4">{results.best_title}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700">Predicted Views</p>
                  <p className="text-xl font-bold text-green-900">{formatNumber(results.best_views)}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Improvement</p>
                  <p className="text-xl font-bold text-green-900">+{results.improvement.toFixed(1)}%</p>
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
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-gray-900 flex-1">{variation.title}</p>
                      {idx === 0 && (
                        <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
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
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
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
