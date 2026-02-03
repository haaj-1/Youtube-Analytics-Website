// src/components/tools/NLPCaptionLab/NLPCaptionLab.jsx
import React, { useState } from 'react';
import './NLPCaptionLab.css';

const NLPCaptionLab = () => {
  const [caption, setCaption] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('sentiment');

  const handleAnalyze = () => {
    if (!caption.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockAnalysis = {
        sentiment: {
          score: 0.78,
          label: 'Positive',
          confidence: 87,
          breakdown: [
            { label: 'Positive', value: 78, color: 'bg-green-500' },
            { label: 'Neutral', value: 18, color: 'bg-blue-500' },
            { label: 'Negative', value: 4, color: 'bg-red-500' },
          ]
        },
        keywords: [
          { word: 'excited', score: 0.92, category: 'Emotion' },
          { word: 'launch', score: 0.88, category: 'Action' },
          { word: 'new', score: 0.85, category: 'Descriptor' },
          { word: 'collection', score: 0.82, category: 'Topic' },
          { word: 'limited', score: 0.79, category: 'Descriptor' },
        ],
        hashtagSuggestions: [
          '#fashion',
          '#newcollection',
          '#launch',
          '#excited',
          '#limitededition',
          '#instafashion',
          '#style',
          '#trending',
        ],
        engagementImpact: [
          { factor: 'Positive sentiment', impact: '+12%', description: 'Positivity drives engagement' },
          { factor: 'Call to action', impact: '+8%', description: 'Encourages comments' },
          { factor: 'Question mark', impact: '+15%', description: 'Increases comment rate' },
          { factor: 'Emoji usage', impact: '+5%', description: 'Optimal emoji count (3)' },
        ],
        alternatives: [
          'Excited to launch our NEW collection! What do you think? 🤔',
          'Our latest collection is finally here! Limited edition pieces available now ✨',
          'Launch day! Our new collection is live. Which piece is your favorite? 👀',
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-slate-900">NLP Caption Optimizer</h2>
        <p className="text-slate-600 mt-1">Analyze and optimize your YouTube captions using Natural Language Processing</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Enter Your Caption
              </label>
              <textarea
                className="w-full min-h-[200px] p-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Paste your YouTube caption here for analysis..."
              />
              <div className="text-sm text-slate-500 text-right mt-2">
                {caption.length} characters
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Audience
                </label>
                <select className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option>General Audience</option>
                  <option>Fashion & Style</option>
                  <option>Food & Dining</option>
                  <option>Travel & Adventure</option>
                  <option>Fitness & Wellness</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Desired Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Professional', 'Casual', 'Friendly', 'Excited', 'Informative', 'Inspirational'].map((tone) => (
                    <button
                      key={tone}
                      className="p-2 border border-slate-200 rounded-lg text-sm hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !caption.trim()}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Caption'
              )}
            </button>
          </div>

          {/* Right Column - Analysis */}
          <div className="lg:col-span-2">
            {!analysis ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-500 mb-2">No Analysis Yet</h3>
                <p className="text-slate-400">Enter a caption and click "Analyze Caption" to see NLP insights</p>
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                  {['sentiment', 'keywords', 'hashtags', 'impact'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-3 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'sentiment' && 'Sentiment Analysis'}
                      {tab === 'keywords' && 'Keywords'}
                      {tab === 'hashtags' && 'Hashtag Suggestions'}
                      {tab === 'impact' && 'Engagement Impact'}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'sentiment' && (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">Sentiment Analysis</h3>
                          <p className="text-slate-600 text-sm">Overall sentiment: <span className="font-medium text-green-600">{analysis.sentiment.label}</span></p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">{analysis.sentiment.score.toFixed(2)}</div>
                          <div className="text-sm text-slate-500">Score (0-1)</div>
                        </div>
                      </div>
                      
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex mb-3">
                        {analysis.sentiment.breakdown.map((item, index) => (
                          <div
                            key={index}
                            className={item.color}
                            style={{ width: `${item.value}%` }}
                            title={`${item.label}: ${item.value}%`}
                          ></div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between text-xs text-slate-500">
                        {analysis.sentiment.breakdown.map((item, index) => (
                          <div key={index}>{item.label}: {item.value}%</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'keywords' && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Extracted Keywords</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {analysis.keywords.map((keyword, index) => (
                        <div key={index} className="border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-slate-900">{keyword.word}</div>
                            <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {keyword.category}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2"
                                  style={{ width: `${keyword.score * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="ml-3 font-medium text-slate-900">
                              {(keyword.score * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'hashtags' && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Hashtag Suggestions</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {analysis.hashtagSuggestions.map((hashtag, index) => (
                        <button
                          key={index}
                          className="px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg transition-colors"
                        >
                          {hashtag}
                        </button>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Hashtag Strategy</h4>
                      <p className="text-sm text-blue-800">
                        Mix popular hashtags (#fashion, #style) with niche ones (#limitededition) for optimal reach.
                        Recommended: 5-10 hashtags total.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'impact' && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Engagement Impact Analysis</h3>
                    <div className="space-y-4">
                      {analysis.engagementImpact.map((impact, index) => (
                        <div key={index} className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="mr-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              impact.impact.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              <span className="text-lg font-bold">{impact.impact}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{impact.factor}</div>
                            <div className="text-sm text-slate-600">{impact.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caption Alternatives */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Optimized Alternatives</h3>
                  <div className="space-y-4">
                    {analysis.alternatives.map((alt, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start mb-3">
                          <div className="mr-3 text-blue-600">✨</div>
                          <div className="flex-1">
                            <div className="text-slate-700 mb-2">{alt}</div>
                            <div className="text-xs text-slate-500">{alt.length} characters</div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Use This
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPCaptionLab;