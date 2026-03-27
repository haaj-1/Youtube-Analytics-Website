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
  
  // Prediction limit state
  const [predictionsRemaining, setPredictionsRemaining] = useState(5);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Channel import state
  const [channelName, setChannelName] = useState('');
  const [channelResults, setChannelResults] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isSearchingChannel, setIsSearchingChannel] = useState(false);
  const [showChannelImport, setShowChannelImport] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [personalizedModel, setPersonalizedModel] = useState(null);
  const [usePersonalizedModel, setUsePersonalizedModel] = useState(false);
  
  // Check prediction limit on component mount
  React.useEffect(() => {
    checkPredictionLimit();
  }, []);
  
  const checkPredictionLimit = () => {
    // Check if user is logged in (you'll need to implement this based on your auth system)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      setPredictionsRemaining(999); // Unlimited for logged-in users
      return;
    }
    
    // For non-logged-in users, check daily limit
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('predictionLimit');
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      
      if (date === today) {
        const remaining = Math.max(0, 5 - count);
        setPredictionsRemaining(remaining);
      } else {
        // New day, reset count
        localStorage.setItem('predictionLimit', JSON.stringify({ date: today, count: 0 }));
        setPredictionsRemaining(5);
      }
    } else {
      // First time
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
  
  // Thumbnail comparison state
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [thumbnailComparison, setThumbnailComparison] = useState(null);
  const [isComparingThumbnails, setIsComparingThumbnails] = useState(false);
  const [showThumbnailComparison, setShowThumbnailComparison] = useState(false);

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
      
      // Train personalized model with 40 most recent videos
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
      
      // Auto-fill subscriber count
      setFormData(prev => ({
        ...prev,
        subscriber_count: data.stats.subscriber_count
      }));
      
      setPersonalizedModel(data);
      setUsePersonalizedModel(true);
      setChannelResults([]);
      setShowChannelImport(false);
      
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
      
      // Add video details for full prediction
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
    // Find the file that matches this thumbnail
    const selectedFile = thumbnailFiles[thumbnail.thumbnail_id - 1];
    setFormData(prev => ({ ...prev, thumbnail_file: selectedFile, thumbnail_url: '' }));
    setShowThumbnailComparison(false);
    setError(null);
  };

  const handlePredict = async () => {
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description');
      return;
    }
    
    // Check if user has predictions remaining
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn && predictionsRemaining <= 0) {
      setShowLoginPrompt(true);
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
      
      // Choose endpoint based on model type
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
      
      // Increment prediction count for non-logged-in users
      if (!isLoggedIn) {
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

  return (
    <>
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily Limit Reached</h3>
              <p className="text-gray-600">
                You've used all 5 predictions for today. Create an account to get unlimited predictions!
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Unlimited predictions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Save your prediction history</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Personalized AI models</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-green-500 text-xl">✓</span>
                <span>Always free, no credit card required</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <a
                href="/signup"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-center transition-colors"
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
      
      <div className="flex-1 flex flex-col gap-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-900 text-3xl font-bold leading-tight">Create Predictions</h1>
              {predictionsRemaining < 999 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-600 font-semibold">
                    {predictionsRemaining} prediction{predictionsRemaining !== 1 ? 's' : ''} remaining today
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-2">Enter your video details to get AI-powered performance predictions</p>
            {predictionsRemaining < 999 && predictionsRemaining > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Guest users:</span> {predictionsRemaining} predictions left today. 
                  <a href="/signup" className="ml-1 text-blue-600 hover:text-blue-700 font-semibold underline">
                    Sign up
                  </a> for unlimited predictions!
                </p>
              </div>
            )}
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
            
            <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-bold text-purple-900">Use My Channel Data</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChannelImport(!showChannelImport)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  {showChannelImport ? '▼ Hide' : '▶ Show'}
                </button>
              </div>
              
              {personalizedModel && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✓</span>
                    <p className="font-bold text-green-900">Personalized Model Active</p>
                  </div>
                  <div className="text-sm text-green-800 space-y-1">
                    <p>Channel: {personalizedModel.stats.channel_name}</p>
                    <p>Trained on: {personalizedModel.stats.videos_analyzed} videos</p>
                    <p>Model Accuracy: {personalizedModel.model_accuracy}</p>
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
              )}
              
              {showChannelImport && !personalizedModel && (
                <div className="space-y-4">
                  <p className="text-sm text-purple-700">
                    Train a personalized model using your channel's 40 most recent videos for more accurate predictions based on your audience
                  </p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter your channel name..."
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChannelSearch()}
                      className="flex-1 rounded-lg border border-purple-300 bg-white h-12 px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={handleChannelSearch}
                      disabled={isSearchingChannel || isTrainingModel}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isSearchingChannel ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  
                  {isTrainingModel && (
                    <div className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <div>
                          <p className="font-semibold text-purple-900">Training Your Personalized Model...</p>
                          <p className="text-sm text-purple-700">Analyzing your 40 most recent videos</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {channelResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-purple-900">Select your channel:</p>
                      {channelResults.map((channel, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleChannelSelect(channel)}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 cursor-pointer transition-all"
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
                
                <button
                  type="button"
                  onClick={() => setShowThumbnailComparison(!showThumbnailComparison)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium text-left"
                >
                  {showThumbnailComparison ? '▼' : '▶'} Compare Multiple Thumbnails (2-5)
                </button>
              </div>
            </div>
            
            {showThumbnailComparison && (
              <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <h3 className="text-lg font-bold text-purple-900 mb-3">🎨 Thumbnail Comparison Tool</h3>
                <p className="text-sm text-purple-700 mb-4">Upload 2-5 thumbnails and our CNN model will predict which performs best</p>
                
                <div className="flex gap-3 mb-4">
                  <label className="flex-1 px-4 py-3 bg-white hover:bg-purple-50 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center cursor-pointer transition-colors font-medium text-purple-700">
                    📁 Upload 2-5 Thumbnails
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
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {isComparingThumbnails ? 'Analyzing...' : 'Compare'}
                    </button>
                  )}
                </div>
                
                {thumbnailFiles.length > 0 && (
                  <p className="text-sm text-purple-700 mb-3">
                    {thumbnailFiles.length} thumbnail(s) selected
                  </p>
                )}
                
                {thumbnailComparison && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-2">📊 Prediction Results</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Best Thumbnail:</span>
                          <span className="ml-2 font-bold text-purple-900">#{thumbnailComparison.best_thumbnail}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Predicted Views:</span>
                          <span className="ml-2 font-bold text-green-600">{formatNumber(thumbnailComparison.analysis.best_predicted_views)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Impact:</span>
                          <span className="ml-2 font-bold text-purple-900">{thumbnailComparison.analysis.recommendation}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {thumbnailComparison.thumbnails.map((thumb) => (
                        <div 
                          key={thumb.thumbnail_id}
                          className={`relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                            thumb.rank === 1 ? 'border-green-500 shadow-md' : 
                            thumb.rank === 2 ? 'border-blue-500' : 
                            'border-gray-300'
                          }`}
                          onClick={() => selectThumbnail(thumb)}
                        >
                          <div className="flex gap-4 p-4">
                            <div className="relative flex-shrink-0">
                              <div className={`absolute -top-2 -left-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg ${
                                thumb.rank === 1 ? 'bg-green-500' : 
                                thumb.rank === 2 ? 'bg-blue-500' : 
                                'bg-gray-500'
                              }`}>
                                {thumb.rank === 1 ? '🏆' : thumb.rank === 2 ? '🥈' : '🥉'} #{thumb.rank}
                              </div>
                              <img 
                                src={thumb.image_data} 
                                alt={`Thumbnail ${thumb.thumbnail_id}`}
                                className="w-40 h-24 object-cover rounded"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{thumb.filename}</p>
                              
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                  <span className="text-xs text-gray-600">Predicted Views:</span>
                                  <p className="text-lg font-bold text-purple-900">{formatNumber(thumb.predicted_views)}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-600">Confidence:</span>
                                  <p className="text-lg font-bold text-blue-600">{(thumb.confidence_score * 100).toFixed(0)}%</p>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 text-xs mb-2">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                  CNN: {thumb.cnn_activation}%
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  Diversity: {thumb.cnn_diversity}%
                                </span>
                              </div>
                              
                              {thumb.rank !== 1 && (
                                <p className="text-xs text-orange-600 font-medium mt-1">
                                  ⚠️ {thumb.performance_vs_best}
                                </p>
                              )}
                            </div>
                            
                            <button
                              type="button"
                              className={`self-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                thumb.rank === 1 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                            >
                              {thumb.rank === 1 ? '✓ Use Best' : 'Select'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-600 mb-2">Predicted Views</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">{formatNumber(predictions.predicted_views)}</h3>
              <div className="flex items-center gap-1 text-blue-500">
                <span className="text-sm">📊</span>
                <span className="text-xs font-bold">{(predictions.confidence_score * 100).toFixed(0)}% Confidence</span>
              </div>
              {predictions.model_type === 'personalized' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-purple-700 font-semibold mb-1">vs Your Channel:</p>
                  <p className="text-sm text-gray-700">Avg: {predictions.comparison.vs_channel_avg}</p>
                  <p className="text-sm text-gray-700">Median: {predictions.comparison.vs_channel_median}</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {predictions.model_type === 'personalized' ? 'Your Channel' : 'Subscriber Range'}
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {predictions.model_type === 'personalized' 
                  ? predictions.channel_stats.channel_name 
                  : predictions.subscriber_range}
              </h3>
              <div className="flex items-center gap-1 text-gray-500">
                <span className="text-sm">{predictions.model_type === 'personalized' ? '🎯' : '👥'}</span>
                <span className="text-xs font-bold">
                  {predictions.model_type === 'personalized' ? 'Personalized Model' : 'Channel Size'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <aside className="w-full lg:w-96 flex flex-col gap-8">
        <div className="bg-green-50 border border-green-200 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-4 text-gray-900">
            <span className="text-green-500 text-3xl">💡</span>
            <h4 className="text-xl font-bold">Pro Tips: CTR Optimization</h4>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900 mb-1">🎬 Thumbnail Design</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>High contrast thumbnails grab attention — orange, red, and green beat muted blues and grays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Video thumbnails with clear imagery can increase CTR by 200-300% vs text-only</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900 mb-1">📝 Titles & Headlines</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Titles with numbers perform 36% better — try "7 Proven Ways" instead of "Tips for Better Results"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Words like "unlock," "boost," "transform" trigger curiosity and action</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900 mb-1">⚡ Urgency & Mobile</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>60%+ of views are mobile — ensure thumbnail text is readable on phone screens</span>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900 mb-1">⚠️ Common Mistakes</p>
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
            
            <div className="pt-3 border-t border-green-200">
              <p className="text-xs text-gray-600 italic">
                Source: Vashkevich, K. (2025, October 1). Proven Tactics to Improve CTR. RedTrack.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PostPredictor;
