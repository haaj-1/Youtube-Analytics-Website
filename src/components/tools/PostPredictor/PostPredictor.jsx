// src/components/tools/PostPredictor/PostPredictor.jsx
import React, { useState, useEffect } from 'react';
import './PostPredictor.css';

const PostPredictor = () => {
  const [formData, setFormData] = useState({
    caption: '',
    mediaType: 'photo',
    hashtagCount: 5,
    postingTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const formatted = now.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, postingTime: formatted }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'caption') {
      setCharCount(value.length);
    }
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockPredictions = {
        likes: { value: 2450, range: 150 },
        comments: { value: 120, range: 20 },
        saves: { value: 450, range: 50 },
        reach: { value: 12500, range: 800 },
        engagementRate: '4.2%',
        confidence: 85,
        insights: [
          'Positive sentiment detected (+12% impact)',
          'Hashtag count optimal',
          'Posting time favorable',
          'Question in caption may increase comments',
        ]
      };
      
      setPredictions(mockPredictions);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="shadow-soft bg-white border border-slate-100 rounded-32 overflow-hidden relative p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Analyze Your Post</h2>
          
          {/* Caption Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Caption
            </label>
            <textarea
              className="w-full min-h-[140px] p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
              value={formData.caption}
              onChange={(e) => handleInputChange('caption', e.target.value)}
              maxLength={2200}
              placeholder="Enter your Instagram caption here... (Include hashtags if any)"
            />
            <div className="text-sm text-slate-500 text-right mt-1">
              {charCount}/2200 characters
            </div>
          </div>

          {/* Media Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Media Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'photo', label: '📷 Photo' },
                { id: 'video', label: '🎬 Video' },
                { id: 'carousel', label: '🖼️ Carousel' }
              ].map((type) => (
                <button
                  key={type.id}
                  className={`p-3 border rounded-xl text-center transition ${
                    formData.mediaType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => handleInputChange('mediaType', type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hashtag Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hashtag Count: <span className="font-bold text-blue-600">{formData.hashtagCount}</span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={formData.hashtagCount}
              onChange={(e) => handleInputChange('hashtagCount', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
            />
            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span>0</span>
              <span>Recommended: 5-15</span>
              <span>30</span>
            </div>
          </div>

          {/* Posting Time */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Posting Time
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={formData.postingTime}
              onChange={(e) => handleInputChange('postingTime', e.target.value)}
            />
            <div className="text-sm text-slate-600 mt-2">
              Your best time based on history: Today, 2:00 PM
            </div>
          </div>

          {/* Analyze Button */}
          <button
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing...
              </div>
            ) : (
              'Analyze Post Performance'
            )}
          </button>
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Prediction Results</h2>
          
          {!predictions ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 text-center">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg">Enter your post details and click "Analyze Post Performance" to see predictions</p>
            </div>
          ) : (
            <div>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">Likes</div>
                  <div className="text-2xl font-bold text-slate-900">{predictions.likes.value.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">± {predictions.likes.range}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">Comments</div>
                  <div className="text-2xl font-bold text-slate-900">{predictions.comments.value}</div>
                  <div className="text-sm text-slate-500">± {predictions.comments.range}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">Saves</div>
                  <div className="text-2xl font-bold text-slate-900">{predictions.saves.value}</div>
                  <div className="text-sm text-slate-500">± {predictions.saves.range}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-1">Engagement Rate</div>
                  <div className="text-2xl font-bold text-slate-900">{predictions.engagementRate}</div>
                  <div className="text-sm text-green-600">Above average</div>
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Prediction Confidence</span>
                  <span className="text-sm font-semibold text-blue-600">{predictions.confidence}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 rounded-full h-2" 
                    style={{ width: `${predictions.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Insights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  {predictions.insights.map((insight, index) => (
                    <div key={index} className="flex items-start p-3 bg-blue-50 rounded-xl">
                      <div className="mr-3 text-blue-600">💡</div>
                      <div className="text-sm text-slate-700">{insight}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-2">
                  <div className="mr-2 text-green-600">✨</div>
                  <h4 className="font-semibold text-green-800">Optimization Suggestion</h4>
                </div>
                <p className="text-sm text-green-700">
                  Consider posting in 3 hours for an additional 8% expected lift in engagement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPredictor;