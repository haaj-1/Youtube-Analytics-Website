// src/pages/PostPerformance.jsx
import React from 'react';
import PostPredictor from '../components/tools/PostPredictor/PostPredictor';

const PostPerformancePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Post Performance Predictor</h1>
          <p className="text-green-700">
            Predict Instagram engagement before posting. Get data-driven insights to optimize your content strategy.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-10 py-8">
        <PostPredictor />
        
        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-blue-600 text-2xl mb-3">💡</div>
            <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
            <p className="text-sm text-slate-700">
              Our ML model analyzes your caption, hashtags, and posting time to predict engagement based on historical patterns.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-green-600 text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-slate-900 mb-2">Best Practices</h3>
            <p className="text-sm text-slate-700">
              Use 5-15 relevant hashtags, post during peak engagement hours (2-5 PM), and include a call-to-action.
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="text-purple-600 text-2xl mb-3">📈</div>
            <h3 className="font-semibold text-slate-900 mb-2">Accuracy</h3>
            <p className="text-sm text-slate-700">
              Our predictions are 86.4% accurate on average, improving as we learn from more of your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPerformancePage;