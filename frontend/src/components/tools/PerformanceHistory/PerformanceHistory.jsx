// src/components/tools/PerformanceHistory/PerformanceHistory.jsx
import React, { useState } from 'react';
import './PerformanceHistory.css';

const PerformanceHistory = () => {
  const [channelName, setChannelName] = useState('');
  const [channelResults, setChannelResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleChannelSearch = async () => {
    if (!channelName.trim()) {
      setError('Please enter a channel name');
      return;
    }
    
    setIsSearching(true);
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
      setIsSearching(false);
    }
  };

  const handleChannelSelect = async (channel) => {
    setIsLoadingAnalytics(true);
    setError(null);
    setChannelResults([]);
    
    try {
      const channelId = channel.id.channelId;
      
      const response = await fetch('http://localhost:5000/analytics/channel-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: channelId,
          max_videos: 100
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }
      
      const data = await response.json();
      setAnalytics(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDayOrder = () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="border-b border-red-100 p-6 bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Channel Analytics Dashboard</h2>
        <p className="text-slate-600">Get insights YouTube doesn't show you - posting patterns, engagement trends, and content optimization</p>
      </div>

      {/* Channel Search */}
      {!analytics && (
        <div className="p-8 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analyze Your Channel</h3>
              <p className="text-slate-600 mb-3">Enter your channel name to get advanced analytics</p>
              <div className="inline-flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <span>Analyzes your 100 most recent videos for the most accurate, up-to-date insights</span>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter your YouTube channel name..."
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChannelSearch()}
                className="flex-1 rounded-lg border border-slate-300 bg-white h-12 px-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              <button
                onClick={handleChannelSearch}
                disabled={isSearching || isLoadingAnalytics}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {isLoadingAnalytics && (
              <div className="p-8 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <div className="text-center">
                    <p className="font-semibold text-red-900 mb-1">Analyzing Your Channel...</p>
                    <p className="text-sm text-red-700">Fetching your 100 most recent videos</p>
                    <p className="text-xs text-red-600 mt-2">This gives us your current performance trends</p>
                  </div>
                </div>
              </div>
            )}

            {channelResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700 mb-3">Select your channel:</p>
                {channelResults.map((channel, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleChannelSelect(channel)}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-400 hover:bg-red-50 cursor-pointer transition-all"
                  >
                    <img
                      src={channel.snippet.thumbnails.default.url}
                      alt={channel.snippet.title}
                      className="w-14 h-14 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{channel.snippet.title}</p>
                      <p className="text-sm text-slate-600 line-clamp-1">{channel.snippet.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="p-6 bg-white">
          {/* Channel Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <img
                src={analytics.channel_info.thumbnail}
                alt={analytics.channel_info.title}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{analytics.channel_info.title}</h3>
                <p className="text-slate-600">{formatNumber(analytics.channel_info.subscriber_count)} subscribers</p>
                <p className="text-sm text-red-600 mt-1 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                  Analyzing {analytics.overview.total_videos} most recent videos
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAnalytics(null);
                setChannelName('');
                setSelectedVideo(null);
              }}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Search Another Channel
            </button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="text-sm text-red-700 mb-1">Videos Analyzed</div>
              <div className="text-2xl font-bold text-red-900">{analytics.overview.total_videos}</div>
              <div className="text-xs text-red-600 mt-1">Most recent uploads</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="text-sm text-orange-700 mb-1">Avg Views</div>
              <div className="text-2xl font-bold text-orange-900">{formatNumber(analytics.overview.avg_views)}</div>
              <div className="text-xs text-orange-600 mt-1">Current performance</div>
            </div>
            <div className="bg-gradient-to-br from-coral-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="text-sm text-red-700 mb-1">Avg Engagement</div>
              <div className="text-2xl font-bold text-red-900">{analytics.overview.avg_engagement_rate}%</div>
              <div className="text-xs text-red-600 mt-1">Recent trend</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="text-sm text-orange-700 mb-1">Growth Rate</div>
              <div className={`text-2xl font-bold ${analytics.overview.growth_rate >= 0 ? 'text-orange-900' : 'text-red-900'}`}>
                {analytics.overview.growth_rate >= 0 ? '+' : ''}{analytics.overview.growth_rate}%
              </div>
              <div className="text-xs text-orange-600 mt-1">Recent vs older</div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <div>
                <p className="font-semibold text-slate-900 mb-1">Why 100 Most Recent Videos?</p>
                <p className="text-sm text-slate-700">
                  Focuses on your latest content to capture your current audience behavior, algorithm performance, and content strategy. 
                  This ensures recommendations are based on what's working <span className="font-semibold">right now</span>, not outdated data.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Posting Patterns - Insights YouTube Doesn't Show */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  Optimal Posting Times
                </h3>
                <p className="text-sm text-slate-600 mb-4">Based on your recent video performance</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="text-sm text-slate-600 mb-2">Best Day to Post</div>
                    <div className="text-xl font-bold text-slate-900">{analytics.posting_patterns.best_day.day}</div>
                    <div className="text-sm text-orange-600 mt-1">
                      {formatNumber(analytics.posting_patterns.best_day.avg_views)} avg views
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="text-sm text-slate-600 mb-2">Best Hour to Post</div>
                    <div className="text-xl font-bold text-slate-900">{analytics.posting_patterns.best_hour.hour}:00</div>
                    <div className="text-sm text-orange-600 mt-1">
                      {formatNumber(analytics.posting_patterns.best_hour.avg_views)} avg views
                    </div>
                  </div>
                </div>

                {/* Day Breakdown */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Performance by Day:</p>
                  {getDayOrder().map(day => {
                    const dayData = analytics.posting_patterns.day_breakdown[day];
                    if (!dayData) return null;
                    const maxViews = Math.max(...Object.values(analytics.posting_patterns.day_breakdown).map(d => d.avg_views));
                    const percentage = (dayData.avg_views / maxViews) * 100;
                    
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <div className="w-24 text-sm text-slate-700">{day}</div>
                        <div className="flex-1 bg-slate-200 rounded-full h-6 relative">
                          <div
                            className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-6 flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs text-white font-medium">{formatNumber(dayData.avg_views)}</span>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-slate-600">{dayData.video_count} videos</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duration Analysis */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  Video Length Performance
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(analytics.duration_analysis).map(([key, data]) => (
                    <div key={key} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="text-sm text-slate-600 mb-2">{data.label}</div>
                      <div className="text-xl font-bold text-slate-900">{formatNumber(data.avg_views)}</div>
                      <div className="text-xs text-slate-500 mt-1">{data.video_count} videos</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Videos */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Top Performing Videos
                </h3>
                <div className="space-y-3">
                  {analytics.top_videos.map((video, idx) => (
                    <div
                      key={video.video_id}
                      onClick={() => setSelectedVideo(video)}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-red-50 cursor-pointer transition-all border border-slate-200 hover:border-red-300"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm line-clamp-2">{video.title}</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                            {formatNumber(video.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                            </svg>
                            {formatNumber(video.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                            </svg>
                            {video.engagement_rate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Insights */}
              {analytics.content_insights.common_words_in_top_videos.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    Common Words in Top Videos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.content_insights.common_words_in_top_videos.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white rounded-full text-sm font-medium text-red-900 border border-red-200"
                      >
                        {item.word} ({item.count})
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-red-700 mt-3">
                    These words appear frequently in your best-performing videos. Consider using them in future titles.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Engagement Insights */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Engagement Insights</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700">High Performers</span>
                      <span className="font-bold text-orange-600">{analytics.engagement_insights.high_performers}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-orange-500 rounded-full h-2"
                        style={{ width: `${(analytics.engagement_insights.high_performers / analytics.overview.total_videos) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700">Low Performers</span>
                      <span className="font-bold text-red-600">{analytics.engagement_insights.low_performers}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-red-500 rounded-full h-2"
                        style={{ width: `${(analytics.engagement_insights.low_performers / analytics.overview.total_videos) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600 mb-1">Consistency Score</div>
                    <div className="text-2xl font-bold text-slate-900">{analytics.engagement_insights.consistency_score}%</div>
                    <p className="text-xs text-slate-500 mt-1">How consistent your engagement rates are</p>
                  </div>
                </div>
              </div>

              {/* Selected Video Details */}
              {selectedVideo && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-bold text-red-900 mb-4">Video Details</h3>
                  <img
                    src={selectedVideo.thumbnail}
                    alt={selectedVideo.title}
                    className="w-full rounded-lg mb-3"
                  />
                  <p className="font-semibold text-slate-900 text-sm mb-3 line-clamp-2">{selectedVideo.title}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Views:</span>
                      <span className="font-bold text-slate-900">{formatNumber(selectedVideo.views)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Likes:</span>
                      <span className="font-bold text-slate-900">{formatNumber(selectedVideo.likes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Engagement:</span>
                      <span className="font-bold text-orange-600">{selectedVideo.engagement_rate}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Current Best Strategy</h3>
                <p className="text-sm text-red-50 mb-4">
                  Based on your 100 most recent videos, post on <span className="font-bold">{analytics.posting_patterns.best_day.day}</span> at <span className="font-bold">{analytics.posting_patterns.best_hour.hour}:00</span> for maximum reach with your current audience.
                </p>
                <button className="w-full bg-white text-red-600 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors">
                  Use This Data for Predictions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceHistory;
