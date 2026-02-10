// src/components/tools/PostPredictor/PostPredictor.jsx
import React, { useState } from 'react';
import './PostPredictor.css';

const CATEGORIES = [
  { id: 1, name: 'Film & Animation' },
  { id: 2, name: 'Autos & Vehicles' },
  { id: 10, name: 'Music' },
  { id: 15, name: 'Pets & Animals' },
  { id: 17, name: 'Sports' },
  { id: 19, name: 'Travel & Events' },
  { id: 20, name: 'Gaming' },
  { id: 22, name: 'People & Blogs' },
  { id: 23, name: 'Comedy' },
  { id: 24, name: 'Entertainment' },
  { id: 25, name: 'News & Politics' },
  { id: 26, name: 'Howto & Style' },
  { id: 27, name: 'Education' },
  { id: 28, name: 'Science & Technology' }
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
  { value: 15000000, label: '10M+', min: 10000000, max: 100000000 }
];

const PostPredictor = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    thumbnail_file: null,
    category_id: 24,
    subscriber_count: 10000,
    duration_seconds: 600
  });
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, thumbnail_file: file, thumbnail_url: '' }));
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let thumbnailData = formData.thumbnail_url;
      
      // Convert uploaded file to base64
      if (formData.thumbnail_file) {
        const reader = new FileReader();
        thumbnailData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(formData.thumbnail_file);
        });
      }
      
      const response = await fetch('http://localhost:5000/predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          thumbnail_url: thumbnailData || 'https://via.placeholder.com/1280x720'
        })
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPredictions(data);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
          <div className="mb-8">
            <h1 className="text-gray-900 text-3xl font-bold leading-tight">Create Predictions</h1>
            <p className="text-gray-600 mt-2">Enter your video details to get AI-powered performance predictions</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 text-base font-semibold">Video Title *</label>
              <input 
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
                placeholder="e.g. 10 Python Tips for Beginners" 
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-900 text-base font-semibold">Description *</label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 bg-white h-24 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none" 
                placeholder="Describe your video content..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-base font-semibold">Category</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-base font-semibold">Subscriber Range</label>
                <select 
                  className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={SUBSCRIBER_RANGES.find(r => formData.subscriber_count >= r.min && formData.subscriber_count <= r.max)?.value || 10000}
                  onChange={(e) => handleInputChange('subscriber_count', parseInt(e.target.value))}
                >
                  {SUBSCRIBER_RANGES.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-base font-semibold">Video Duration (seconds)</label>
                <input 
                  className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  type="number"
                  min="1"
                  value={formData.duration_seconds}
                  onChange={(e) => handleInputChange('duration_seconds', parseInt(e.target.value))}
                />
                <span className="text-sm text-gray-500">Duration: {formatTime(formData.duration_seconds)}</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-base font-semibold">Thumbnail</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
                    placeholder="URL or upload below"
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                    disabled={!!formData.thumbnail_file}
                  />
                  <label className="px-4 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center cursor-pointer transition-colors font-medium">
                    📁 Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                </div>
                {formData.thumbnail_file && (
                  <span className="text-sm text-green-600">✓ {formData.thumbnail_file.name}</span>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button 
              className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-full hover:bg-blue-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePredict}
              disabled={isLoading || !formData.title || !formData.description}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  Generate Prediction
                  <span className="text-xl">⚡</span>
                </>
              )}
            </button>
          </div>
        </section>
        
        {predictions && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-2">Predicted Views</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{formatNumber(predictions.predicted_views)}</h3>
                <div className="flex items-center gap-1 text-blue-500">
                  <span className="text-sm">📊</span>
                  <span className="text-xs font-bold">{(predictions.confidence_score * 100).toFixed(0)}% Confidence</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-2">Subscriber Range</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{predictions.subscriber_range}</h3>
                <div className="flex items-center gap-1 text-gray-500">
                  <span className="text-sm">👥</span>
                  <span className="text-xs font-bold">Channel Size</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600 mb-2">Model Accuracy</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{(predictions.confidence_score * 100).toFixed(1)}%</h3>
                <div className="flex items-center gap-1 text-green-500">
                  <span className="text-sm">✓</span>
                  <span className="text-xs font-bold">High Accuracy</span>
                </div>
              </div>
            </div>

            {predictions.recommendations && predictions.recommendations.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">AI Recommendations</h2>
                <div className="space-y-4">
                  {predictions.recommendations.map((rec, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.type === 'success' ? 'bg-green-50 border-green-500' :
                        rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                        rec.type === 'tip' ? 'bg-blue-50 border-blue-500' :
                        'bg-gray-50 border-gray-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : '💡'}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{rec.category}</p>
                          <p className="text-sm text-gray-700 mb-2">{rec.message}</p>
                          <p className="text-sm text-gray-600 italic">{rec.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      
      <aside className="w-full lg:w-96 flex flex-col gap-8">
        <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-6 text-gray-900">
            <span className="text-3xl">🤖</span>
            <h4 className="text-2xl font-bold">AI Model Info</h4>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">MODEL TYPE</span>
              <span className="text-lg font-mono font-bold text-gray-900">XGBoost + BERT + CNN</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">TRAINING DATA</span>
              <span className="text-lg font-mono font-bold text-gray-900">80,000 Videos</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">ACCURACY (R²)</span>
              <span className="text-lg font-mono font-bold text-gray-900">95.6%</span>
            </div>
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "Our ML model analyzes title text with BERT, thumbnail images with ResNet18 CNN, and combines with XGBoost regression for highly accurate predictions."
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4 text-gray-900">
            <span className="text-green-500 text-3xl">💡</span>
            <h4 className="text-xl font-bold">Pro Tips</h4>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Titles with numbers get 30% higher CTR</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Optimal title length: 50-70 characters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Videos 3-10 minutes perform best</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Add detailed descriptions (200+ chars)</span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default PostPredictor;
