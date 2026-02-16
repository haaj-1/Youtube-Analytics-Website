/**
 * Post Predictor V2 Component
 * 
 * Main video performance prediction tool with comprehensive ML analysis.
 * 
 * Features:
 * - 3-step wizard: Video Details → Advanced Options → Results
 * - Global ML model (51,888 videos) or personalized channel model
 * - Thumbnail comparison (A/B testing)
 * - Confidence intervals with statistical ranges
 * - Feature importance explanations (why predictions were made)
 * - Similar video benchmarks from dataset
 * - Seasonal trend adjustments
 * - Live YouTube preview
 * - Pro tips sidebar
 * 
 * Prediction Limits:
 * - Non-logged-in users: 5 predictions per day
 * - Logged-in users: Unlimited
 */

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

const PostPredictorV2 = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
  
  // Prediction limit state
  const [predictionsRemaining, setPredictionsRemaining] = useState(5);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Channel import state
  const [channelName, setChannelName] = useState('');
  const [channelResults, setChannelResults] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSearchingChannel, setIsSearchingChannel] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [personalizedModel, setPersonalizedModel] = useState(null);
  const [usePersonalizedModel, setUsePersonalizedModel] = useState(false);
  
  // Thumbnail comparison state
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [thumbnailComparison, setThumbnailComparison] = useState(null);
  const [isComparingThumbnails, setIsComparingThumbnails] = useState(false);
  
  // Advanced features toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Check prediction limit on component mount
  React.useEffect(() => {
    checkPredictionLimit();
  }, []);
  
  const checkPredictionLimit = () => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    
    if (token) {
      setPredictionsRemaining(999); // Unlimited for logged-in users
      return;
    }
    
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('predictionLimit');
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      
      if (date === today) {
        const remaining = Math.max(0, 5 - count);
        setPredictionsRemaining(remaining);
      } else {
        localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count: 0 }));
        setPredictionsRemaining(5);
      }
    } else {
      localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count: 0 }));
      setPredictionsRemaining(5);
    }
  };
  
  const incrementPredictionCount = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('predictionLimit');
    
    if (storedData) {
      const { count } = JSON.parse(storedData);
      const newCount = count + 1;
      localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count: newCount }));
      setPredictionsRemaining(Math.max(0, 5 - newCount));
      
      if (newCount >= 5) {
        setShowLoginPrompt(true);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };
  
  const handleChannelSearch = async () => {
    if (!channelName.trim()) {
      setError('Please enter a channel name');
      return;
    }
    
    setIsSearchingChannel(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/youtube/search/channel?q=${encodeURIComponent(channelName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search channels');
      }
      
      const data = await response.json();
      setChannelResults(data.items || []);
      
      if (!data.items || data.items.length === 0) {
        setError('No channels found. Try a different search term.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearchingChannel(false);
    }
  };
  
  const handleChannelSelect = async (channel) => {
    setSelectedChannel(channel);
    setIsTrainingModel(true);
    setError(null);
    
    try {
      const channelId = channel.id.channelId;
      
      const response = await fetch('http://localhost:5000/predict/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channelId,
          max_videos: 40
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to train personalized model');
      }
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        subscriber_count: data.stats.subscriber_count
      }));
      
      setPersonalizedModel(data);
      setUsePersonalizedModel(true);
      setChannelResults([]);
      
    } catch (err) {
      setError(err.message);
      setUsePersonalizedModel(false);
    } finally {
      setIsTrainingModel(false);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, thumbnail_file: file, thumbnail_url: '' }));
      setError(null);
    }
  };
  
  const handleMultipleThumbnailUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 2 || files.length > 5) {
      setError('Please upload 2-5 thumbnails for comparison');
      return;
    }
    setThumbnailFiles(files);
    setThumbnailComparison(null);
    setError(null);
  };
  
  const handleCompareThumbnails = async () => {
    if (thumbnailFiles.length < 2) {
      setError('Please upload at least 2 thumbnails');
      return;
    }
    
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description first to compare thumbnails');
      return;
    }
    
    setIsComparingThumbnails(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      thumbnailFiles.forEach((file) => {
        formDataToSend.append('thumbnails', file);
      });
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id.toString());
      formDataToSend.append('subscriber_count', formData.subscriber_count.toString());
      formDataToSend.append('duration_seconds', formData.duration_seconds.toString());

      const response = await fetch('http://localhost:5000/thumbnail/compare-with-prediction', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to compare thumbnails');
      }

      const data = await response.json();
      setThumbnailComparison(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsComparingThumbnails(false);
    }
  };
  
  const selectThumbnail = (thumbnail) => {
    const selectedFile = thumbnailFiles[thumbnail.thumbnail_id - 1];
    setFormData(prev => ({ ...prev, thumbnail_file: selectedFile, thumbnail_url: '' }));
    setError(null);
  };

  const handlePredict = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description');
      return;
    }
    
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    if (!token && predictionsRemaining <= 0) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let thumbnailData = formData.thumbnail_url;
      
      if (formData.thumbnail_file) {
        const reader = new FileReader();
        thumbnailData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(formData.thumbnail_file);
        });
      }
      
      const endpoint = usePersonalizedModel && personalizedModel
        ? 'http://localhost:5000/predict/personalized/predict'
        : 'http://localhost:5000/predict/';
      
      const response = await fetch(endpoint, {
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
      setCurrentStep(3);
      
      // Increment prediction count for non-logged-in users
      const token = localStorage.getItem('token');
      if (!token) {
        incrementPredictionCount();
      }
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
  
  const canProceedToStep = (step) => {
    if (step === 2) return formData.title && formData.description;
    if (step === 3) return formData.title && formData.description;
    return true;
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Limit Reached</h3>
              <p className="text-gray-600">
                You've used all 5 predictions for today. Create an account to get unlimited predictions!
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Unlimited predictions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Always free, no credit card required</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <a
                href="/signup"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-center transition-colors"
              >
                Create Account
              </a>
              <a
                href="/login"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg text-center transition-colors"
              >
                Already have an account? Log in
              </a>
            </div>
          </div>
        </div>
      )}

      
      {/* Main Content - Left Side (60%) */}
      <div className="flex-1 lg:w-3/5">
        {/* Prediction Counter */}
        {predictionsRemaining < 999 && (
          <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="font-bold text-gray-900">
                  {predictionsRemaining} prediction{predictionsRemaining !== 1 ? 's' : ''} remaining today
                </p>
                <p className="text-sm text-gray-600">
                  <a href="/signup" className="text-red-600 hover:text-red-700 font-semibold underline">
                    Sign up
                  </a> for unlimited predictions
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step Wizard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    currentStep >= step 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-gray-700 text-sm font-medium">
              <span className={currentStep === 1 ? 'font-bold text-red-600' : ''}>Video Details</span>
              <span className={currentStep === 2 ? 'font-bold text-red-600' : ''}>Advanced Options</span>
              <span className={currentStep === 3 ? 'font-bold text-red-600' : ''}>Results</span>
            </div>
          </div>

          
          {/* Step Content */}
          <div className="p-8 bg-white">
            {/* Step 1: Video Details (Combined Basic Info + Content) */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Details</h2>
                  <p className="text-gray-600">Tell us about your video content</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-base font-semibold">Video Title *</label>
                  <input 
                    className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400" 
                    placeholder="e.g. 10 Python Tips for Beginners" 
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Make it catchy and include keywords</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-base font-semibold">Description *</label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 bg-white h-32 px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400 resize-none" 
                    placeholder="Describe your video content in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Include relevant keywords and what viewers will learn</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-base font-semibold">Category</label>
                    <select 
                      className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
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
                      className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      value={SUBSCRIBER_RANGES.find(r => formData.subscriber_count >= r.min && formData.subscriber_count <= r.max)?.value || 10000}
                      onChange={(e) => handleInputChange('subscriber_count', parseInt(e.target.value))}
                    >
                      {SUBSCRIBER_RANGES.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-base font-semibold">Video Duration</label>
                    <input 
                      className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
                      type="number"
                      min="1"
                      value={formData.duration_seconds}
                      onChange={(e) => handleInputChange('duration_seconds', parseInt(e.target.value))}
                    />
                    <span className="text-sm text-gray-500">{formatTime(formData.duration_seconds)}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-base font-semibold">Thumbnail</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 rounded-lg border border-gray-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400" 
                        placeholder="URL or upload"
                        type="url"
                        value={formData.thumbnail_url}
                        onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                        disabled={!!formData.thumbnail_file}
                      />
                      <label className="px-4 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center cursor-pointer transition-colors font-medium">
                        📁
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
                
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to Advanced Options
                  <span>→</span>
                </button>
              </div>
            )}

            
            {/* Step 2: Advanced Options */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Options</h2>
                  <p className="text-gray-600">Optional features for more accurate predictions</p>
                </div>
                
                {/* Personalized Model */}
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                    </svg>
                    <h3 className="text-lg font-bold text-red-900">Use My Channel Data</h3>
                  </div>
                  
                  {personalizedModel ? (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <p className="font-bold text-orange-900">Personalized Model Active</p>
                      </div>
                      <div className="text-sm text-orange-800 space-y-1">
                        <p>Channel: {personalizedModel.stats.channel_name}</p>
                        <p>Trained on: {personalizedModel.stats.videos_analyzed} videos</p>
                        <p>Your Avg Views: {formatNumber(personalizedModel.stats.avg_views)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUsePersonalizedModel(false);
                          setPersonalizedModel(null);
                          setSelectedChannel(null);
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Switch to Global Model
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-red-700">
                        Train a personalized model using your channel's 40 most recent videos
                      </p>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter your channel name..."
                          value={channelName}
                          onChange={(e) => setChannelName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleChannelSearch()}
                          className="flex-1 rounded-lg border border-red-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={handleChannelSearch}
                          disabled={isSearchingChannel || isTrainingModel}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {isSearchingChannel ? 'Searching...' : 'Search'}
                        </button>
                      </div>
                      
                      {isTrainingModel && (
                        <div className="p-4 bg-white rounded-lg border border-red-200">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                            <div>
                              <p className="font-semibold text-red-900">Training Your Personalized Model...</p>
                              <p className="text-sm text-red-700">Analyzing your 40 most recent videos</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {channelResults.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-red-900">Select your channel:</p>
                          {channelResults.map((channel, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleChannelSelect(channel)}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200 hover:border-red-400 cursor-pointer transition-all"
                            >
                              <img
                                src={channel.snippet.thumbnails.default.url}
                                alt={channel.snippet.title}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{channel.snippet.title}</p>
                                <p className="text-xs text-gray-600">{channel.snippet.description.substring(0, 100)}...</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                
                {/* Thumbnail Comparison */}
                <div className="p-6 bg-coral-50 border-2 border-orange-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                    <h3 className="text-lg font-bold text-orange-900">Thumbnail Comparison</h3>
                  </div>
                  <p className="text-sm text-orange-700 mb-4">Upload 2-5 thumbnails to see which performs best</p>
                  
                  <div className="flex gap-3 mb-4">
                    <label className="flex-1 px-4 py-3 bg-white hover:bg-orange-50 rounded-lg border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer transition-colors font-medium text-orange-700">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
                      </svg>
                      Upload 2-5 Thumbnails
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        className="hidden"
                        onChange={handleMultipleThumbnailUpload}
                      />
                    </label>
                    
                    {thumbnailFiles.length >= 2 && (
                      <button
                        type="button"
                        onClick={handleCompareThumbnails}
                        disabled={isComparingThumbnails}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isComparingThumbnails ? 'Analyzing...' : 'Compare'}
                      </button>
                    )}
                  </div>
                  
                  {thumbnailFiles.length > 0 && (
                    <p className="text-sm text-orange-700 mb-3">
                      {thumbnailFiles.length} thumbnail(s) selected
                    </p>
                  )}
                  
                  {thumbnailComparison && (
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-900 mb-2">Best Thumbnail: #{thumbnailComparison.best_thumbnail}</h4>
                        <p className="text-sm text-gray-700">Predicted Views: <span className="font-bold text-orange-600">{formatNumber(thumbnailComparison.analysis.best_predicted_views)}</span></p>
                      </div>
                      
                      {thumbnailComparison.thumbnails.slice(0, 3).map((thumb) => (
                        <div 
                          key={thumb.thumbnail_id}
                          onClick={() => selectThumbnail(thumb)}
                          className={`flex gap-3 p-3 bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            thumb.rank === 1 ? 'border-orange-500' : 'border-gray-300'
                          }`}
                        >
                          <img 
                            src={thumb.image_data} 
                            alt={`Thumbnail ${thumb.thumbnail_id}`}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">#{thumb.rank} - {formatNumber(thumb.predicted_views)} views</p>
                            <p className="text-xs text-gray-600">{(thumb.confidence_score * 100).toFixed(0)}% confidence</p>
                          </div>
                          <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium">
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePredict}
                    disabled={isLoading || !canProceedToStep(3)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Generate Prediction
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            
            {/* Step 3: Results */}
            {currentStep === 3 && predictions && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Prediction Complete!</h2>
                  <p className="text-gray-600">Here's what the models predict for your video</p>
                </div>
                
                {/* Main Metrics with Confidence Interval */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200">
                    <p className="text-sm font-medium text-red-700 mb-2">Predicted Views</p>
                    <h3 className="text-4xl font-bold text-red-900 mb-3">{formatNumber(predictions.predicted_views)}</h3>
                    {predictions.confidence_interval && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600">
                          <span className="text-sm font-bold">{(predictions.confidence_score * 100).toFixed(0)}% Model Accuracy</span>
                        </div>
                        <div className="text-xs text-red-700 bg-red-50 p-2 rounded">
                          <p className="font-semibold mb-1">{predictions.confidence_interval.confidence_level} Confidence Range:</p>
                          <p>{predictions.confidence_interval.range_description}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
                    <p className="text-sm font-medium text-orange-700 mb-2">
                      {predictions.model_type === 'personalized' ? 'Your Channel' : 'Subscriber Range'}
                    </p>
                    <h3 className="text-2xl font-bold text-orange-900 mb-3">
                      {predictions.model_type === 'personalized' 
                        ? predictions.channel_stats.channel_name 
                        : predictions.subscriber_range}
                    </h3>
                    <div className="flex items-center gap-2 text-orange-600">
                      <span className="text-sm font-bold">
                        {predictions.model_type === 'personalized' ? 'Personalized Model' : 'Global Model'}
                      </span>
                    </div>
                    {predictions.seasonal_factor && predictions.seasonal_factor !== 1.0 && (
                      <div className="mt-2 text-xs text-orange-700">
                        <span className="font-semibold">Seasonal Boost:</span> {((predictions.seasonal_factor - 1) * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Feature Importance - NEW */}
                {predictions.feature_importance && predictions.feature_importance.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                      </svg>
                      Why This Prediction?
                    </h4>
                    <div className="space-y-3">
                      {predictions.feature_importance.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            feature.impact === 'high' ? 'bg-green-100 text-green-700' :
                            feature.impact === 'medium' ? 'bg-blue-100 text-blue-700' :
                            feature.impact === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {feature.impact === 'high' ? '↑' : feature.impact === 'negative' ? '↓' : '•'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900">{feature.factor}</p>
                              <span className={`text-sm font-bold ${
                                feature.impact === 'high' ? 'text-green-600' :
                                feature.impact === 'medium' ? 'text-blue-600' :
                                feature.impact === 'negative' ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                {feature.impact_percent}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Similar Videos - NEW */}
                {predictions.similar_videos && predictions.similar_videos.count > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                      Similar Videos in Dataset
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Based on {predictions.similar_videos.count} videos with "{predictions.similar_videos.keyword}" in our training data
                    </p>
                    <div className="space-y-2 mb-4">
                      {predictions.similar_videos.videos.slice(0, 3).map((video, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg text-sm">
                          <p className="text-gray-700 flex-1 mr-3">{video.title}</p>
                          <span className="font-bold text-purple-900">{video.views_formatted}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <p className="text-sm text-purple-900">
                        <span className="font-bold">Average for similar videos:</span> {predictions.similar_videos.average_views_formatted} views
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Engagement Estimates */}
                <div className="bg-gradient-to-br from-orange-50 to-coral-50 p-6 rounded-xl border-2 border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-4">
                    Estimated Engagement
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Likes</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatNumber(Math.round(predictions.predicted_views * 0.04))}
                      </p>
                      <p className="text-xs text-gray-500">~4% of views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Comments</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatNumber(Math.round(predictions.predicted_views * 0.005))}
                      </p>
                      <p className="text-xs text-gray-500">~0.5% of views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                      <p className="text-2xl font-bold text-orange-900">4.5%</p>
                      <p className="text-xs text-gray-500">Industry avg</p>
                    </div>
                  </div>
                </div>
                
                {/* Performance Insights */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200">
                  <h4 className="font-bold text-orange-900 mb-4">
                    Performance Insights
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Estimated Watch Time</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(Math.round(predictions.predicted_views * formData.duration_seconds * 0.5 / 60))} total minutes across all viewers
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Based on {formatTime(Math.round(formData.duration_seconds * 0.5))} avg view duration per viewer
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Estimated CTR</p>
                        <p className="text-sm text-gray-600">
                          5-8% click-through rate expected for this content
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">View Range</p>
                        <p className="text-sm text-gray-600">
                          Best case: {formatNumber(Math.round(predictions.predicted_views * 1.5))} views
                          <span className="mx-2">•</span>
                          Worst case: {formatNumber(Math.round(predictions.predicted_views * 0.5))} views
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {predictions.model_type === 'personalized' && (
                  <div className="p-6 bg-orange-50 border-2 border-orange-200 rounded-xl">
                    <h4 className="font-bold text-orange-900 mb-3">vs Your Channel Performance</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">vs Average:</p>
                        <p className="text-lg font-bold text-orange-900">{predictions.comparison.vs_channel_avg}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">vs Median:</p>
                        <p className="text-lg font-bold text-orange-900">{predictions.comparison.vs_channel_median}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setPredictions(null);
                      setFormData({
                        title: '',
                        description: '',
                        thumbnail_url: '',
                        thumbnail_file: null,
                        category_id: 24,
                        subscriber_count: formData.subscriber_count,
                        duration_seconds: 600
                      });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-lg transition-all"
                  >
                    New Prediction
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all"
                  >
                    Adjust & Rerun
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* Right Side Panel (40%) - Live Preview & Tips */}
      <div className="w-full lg:w-2/5 space-y-6">
        {/* Live YouTube Preview */}
        {currentStep < 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                </svg>
                Live Preview
              </h3>
            </div>
            
            <div className="p-6">
              {/* Thumbnail Preview */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4 aspect-video">
                {formData.thumbnail_file ? (
                  <img 
                    src={URL.createObjectURL(formData.thumbnail_file)} 
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : formData.thumbnail_url ? (
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">🖼️</span>
                      <p className="text-sm">No thumbnail yet</p>
                    </div>
                  </div>
                )}
                
                {formData.duration_seconds > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {formatTime(formData.duration_seconds)}
                  </div>
                )}
              </div>
              
              {/* Title Preview */}
              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {formData.title || 'Your video title will appear here...'}
              </h4>
              
              {/* Meta Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span>Channel Name</span>
                <span>•</span>
                <span>Just now</span>
              </div>
              
              {/* Description Preview */}
              <p className="text-sm text-gray-700 line-clamp-2">
                {formData.description || 'Your video description will appear here...'}
              </p>
              
              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-bold text-gray-900">Category</p>
                    <p className="text-gray-600">{CATEGORIES.find(c => c.id === formData.category_id)?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Subscribers</p>
                    <p className="text-gray-600">{SUBSCRIBER_RANGES.find(r => formData.subscriber_count >= r.min && formData.subscriber_count <= r.max)?.label || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Duration</p>
                    <p className="text-gray-600">{formatTime(formData.duration_seconds)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* Pro Tips */}
        <div className="bg-beige-50 border border-orange-200 rounded-xl overflow-hidden">
          <div className="bg-orange-100 p-4 border-b border-orange-200">
            <h3 className="font-bold text-orange-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Pro Tips: CTR Optimization
            </h3>
          </div>
          
          <div className="p-6 space-y-4 text-sm text-gray-700 max-h-96 overflow-y-auto">
            <div>
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
                Thumbnail Design
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>High contrast thumbnails grab attention — orange, red, and green beat muted blues and grays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Video thumbnails with clear imagery can increase CTR by 200-300% vs text-only</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                Titles & Headlines
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Titles with numbers perform 36% better — try "7 Proven Ways" instead of "Tips for Better Results"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Words like "unlock," "boost," "transform" trigger curiosity and action</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-coral-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                Urgency & Mobile
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>60%+ of views are mobile — ensure thumbnail text is readable on phone screens</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                Common Mistakes
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Avoid clickbait — misleading thumbnails erode trust and increase bounce rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Don't "set it & forget it" — regular A/B testing keeps CTR alive</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-3 border-t border-orange-200">
              <p className="text-xs text-gray-600 italic">
                Source: Vashkevich, K. (2025, October 1). Proven Tactics to Improve CTR. RedTrack.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPredictorV2;
