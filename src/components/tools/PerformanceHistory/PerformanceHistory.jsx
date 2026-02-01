// src/components/tools/PerformanceHistory/PerformanceHistory.jsx
import React, { useState } from 'react';
import './PerformanceHistory.css';

const PerformanceHistory = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPost, setSelectedPost] = useState(null);

  const postHistory = [
    { id: 1, date: '2024-01-20', time: '14:30', caption: 'New collection launch! Excited to share...', likes: 2100, comments: 89, saves: 450, reach: 12500, engagement: '4.5%', media: 'carousel' },
    { id: 2, date: '2024-01-18', time: '16:45', caption: 'Behind the scenes of our photoshoot', likes: 1800, comments: 120, saves: 320, reach: 9800, engagement: '4.2%', media: 'video' },
    { id: 3, date: '2024-01-15', time: '11:15', caption: 'AMA Session Q&A - Ask me anything!', likes: 3400, comments: 312, saves: 890, reach: 21800, engagement: '7.2%', media: 'photo' },
    { id: 4, date: '2024-01-12', time: '19:30', caption: 'Weekend vibes and coffee breaks ☕', likes: 1250, comments: 45, saves: 210, reach: 7600, engagement: '3.8%', media: 'photo' },
    { id: 5, date: '2024-01-10', time: '13:00', caption: 'New tutorial: Mastering Instagram Reels', likes: 2900, comments: 156, saves: 670, reach: 15200, engagement: '5.6%', media: 'video' },
    { id: 6, date: '2024-01-08', time: '09:45', caption: 'Throwback to our best performing post', likes: 1500, comments: 78, saves: 340, reach: 8900, engagement: '4.0%', media: 'carousel' },
  ];

  const stats = {
    totalPosts: 1247,
    avgEngagement: '4.2%',
    totalLikes: '2.4M',
    totalComments: '45K',
    totalSaves: '120K',
    bestDay: 'Wednesday',
    bestTime: '14:00-17:00',
  };

  const getMediaIcon = (type) => {
    switch(type) {
      case 'photo': return '📷';
      case 'video': return '🎬';
      case 'carousel': return '🖼️';
      default: return '📝';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Performance History</h2>
            <p className="text-slate-600 mt-1">Track and analyze your historical Instagram performance</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6 border-b border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Total Posts</div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalPosts.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Avg. Engagement</div>
            <div className="text-2xl font-bold text-slate-900">{stats.avgEngagement}</div>
            <div className="text-xs text-green-600 font-medium">+0.4% from last period</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Best Day</div>
            <div className="text-2xl font-bold text-slate-900">{stats.bestDay}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-slate-600 mb-1">Best Time</div>
            <div className="text-2xl font-bold text-slate-900">{stats.bestTime}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post History Table */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Posts</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Caption</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Likes</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Engagement</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Media</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postHistory.map((post) => (
                      <tr 
                        key={post.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedPost?.id === post.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPost(post)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-slate-900">{post.date}</div>
                          <div className="text-xs text-slate-500">{post.time}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-[200px] truncate text-sm text-slate-900">
                            {post.caption}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{post.likes.toLocaleString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            parseFloat(post.engagement) > 5 
                              ? 'bg-green-100 text-green-800'
                              : parseFloat(post.engagement) > 4
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {post.engagement}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-2xl">{getMediaIcon(post.media)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Export Your Data</h4>
                  <p className="text-slate-600 text-sm">Download comprehensive performance reports</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                    CSV Export
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Post Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Post Details</h3>
                
                {selectedPost ? (
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Posted On</div>
                      <div className="font-medium text-slate-900">{selectedPost.date} at {selectedPost.time}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Caption</div>
                      <div className="text-sm text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
                        {selectedPost.caption}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Likes</div>
                        <div className="text-xl font-bold text-slate-900">{selectedPost.likes.toLocaleString()}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Comments</div>
                        <div className="text-xl font-bold text-slate-900">{selectedPost.comments}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Saves</div>
                        <div className="text-xl font-bold text-slate-900">{selectedPost.saves}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Reach</div>
                        <div className="text-xl font-bold text-slate-900">{selectedPost.reach.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <div className="text-sm text-slate-500 mb-2">Engagement Breakdown</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700">Engagement Rate</span>
                          <span className="font-medium text-slate-900">{selectedPost.engagement}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2"
                            style={{ width: selectedPost.engagement }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p>Select a post from the table to view details</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">Total Engagement</span>
                      <span className="font-medium text-slate-900">2.6M</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-green-500 rounded-full h-2" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">Avg. Post Performance</span>
                      <span className="font-medium text-slate-900">4.2%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">Growth Rate</span>
                      <span className="font-medium text-green-600">+12.3%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-purple-500 rounded-full h-2" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHistory;