// src/components/tools/PostPredictor/PostPredictor.jsx
import React, { useState } from 'react';
import './PostPredictor.css';
// import { MLService } from '../../services/mlService';
// import { YouTubeAPI } from '../../services/youtubeAPI';

const PostPredictor = () => {
  const [formData, setFormData] = useState({
    title: '',
    videoLength: 12.75,
    description: '',
    tags: []
  });
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    if (!formData.title) return;
    
    setIsLoading(true);
    try {
      // Simulate API call for now
      setTimeout(() => {
        setPredictions({
          views: 15000,
          likes: 750,
          comments: 85,
          engagement_rate: 4.2
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Prediction failed:', error);
      setIsLoading(false);
    }
  };

  const formatTime = (decimal) => {
    const minutes = Math.floor(decimal);
    const seconds = Math.round((decimal - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
          <div className="mb-8">
            <h1 className="text-gray-900 text-[32px] font-bold leading-tight">Create Predictions</h1>          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-900 text-base font-semibold">Video Title</label>
              <input 
                className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
                placeholder="e.g. 10 Mistakes Every New UI Designer Makes" 
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-base font-semibold">Thumbnail Concept</label>
                <div className="group relative flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="text-4xl text-gray-400 mb-2">📷</div>
                  <p className="text-sm text-gray-600 font-medium">Drag or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">AI will analyze visual hierarchy & color psychology</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-900 text-base font-semibold">Video Length</label>
                    <span className="text-blue-500 font-mono font-bold text-lg">{formatTime(formData.videoLength)}</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="relative flex w-full flex-col items-start gap-3">
                      <div className="flex h-4 w-full items-center gap-4">
                        <div className="flex h-2 flex-1 rounded-full bg-gray-200">
                          <div className="h-full w-[45%] rounded-full bg-blue-500"></div>
                          <div className="relative"><div className="absolute -left-2 -top-1 size-4 rounded-full bg-blue-500 shadow-lg border-2 border-white"></div></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full text-[10px] text-gray-500 font-mono mt-2">
                      <span>0:00</span>
                      <span>15:00</span>
                      <span>30:00+</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="w-full mt-auto bg-blue-500 text-white font-bold text-lg py-4 rounded-full hover:bg-blue-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  onClick={handlePredict}
                  disabled={isLoading || !formData.title}
                >
                  {isLoading ? 'Analyzing...' : 'Generate Prediction'}
                  <span className="text-xl">⚡</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-2">Predicted Views (24h)</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">{predictions ? `${(predictions.views/1000).toFixed(1)}k` : '12.5k'} - {predictions ? `${(predictions.views*1.2/1000).toFixed(1)}k` : '18k'}</h3>
            <div className="flex items-center gap-1 text-blue-500">
              <span className="text-sm">↗</span>
              <span className="text-xs font-bold">+12% vs. Channel Avg</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-2">Estimated CTR</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">{predictions ? `${predictions.engagement_rate}%` : '8.4%'}</h3>
            <div className="flex items-center gap-1 text-red-500">
              <span className="text-sm">⚠</span>
              <span className="text-xs font-bold">Thumbnail too busy</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-2">Engagement Score</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">{predictions ? `${Math.round(predictions.engagement_rate * 22)}/100` : '92/100'}</h3>
            <div className="flex items-center gap-1 text-blue-500">
              <span className="text-sm">✓</span>
              <span className="text-xs font-bold">High Potential</span>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Optimization Tags</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">#uidesign2024</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#productivity</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">#creativeprocess</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#figmatips</span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#careeradvice</span>
            <button className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-full text-sm font-medium hover:border-gray-400 transition-colors">+ Add Custom</button>
          </div>
        </section>
      </div>
      
      <aside className="w-full lg:w-96 flex flex-col gap-8">
        <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-6 text-gray-900">
            <span className="text-3xl">💡</span>
            <h4 className="text-2xl font-bold">Optimal Insights</h4>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">DURATION SWEET SPOT</span>
              <span className="text-2xl font-mono font-bold text-gray-900">14:20 - 16:05</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">PRIME POST TIME</span>
              <span className="text-2xl font-mono font-bold text-gray-900">Tue, 09:00 AM</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">RETENTION HOOK</span>
              <span className="text-2xl font-mono font-bold text-gray-900">00:15 - 00:22</span>
            </div>
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "Videos in this niche perform 22% better with a 15-second hook transition and high-contrast visuals in the first minute."
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4 text-gray-900">
            <span className="text-red-500 text-3xl">❗</span>
            <h4 className="text-xl font-bold">Content Alerts</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Detected high competition for keywords: 
            <span className="font-mono bg-white px-2 py-1 rounded border border-red-200 text-gray-900 font-semibold">UI Mistakes</span>.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Recommendation: Consider diversifying title with 
            <span className="font-mono bg-white px-2 py-1 rounded border border-red-200 text-gray-900 font-semibold">Case Study</span> 
            to capture higher intent searches.
          </p>
        </div>
      </aside>
    </>
  );
};

export default PostPredictor;