// src/pages/PostPerformance.jsx
import React from 'react';
import PostPredictorV2 from '../components/tools/PostPredictor/PostPredictorV2';

const PostPerformancePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-display text-[#111812]">
      {/* Header - same style */}
      <header className="bg-white border-b border-gray-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Performance Predictor</h1>
          <p className="text-gray-600">
            Predict YouTube engagement before posting. Get data-driven insights to optimize your next viral hit.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-10 py-8">
        <PostPredictorV2 />
      </div>
    </div>
  );
};

export default PostPerformancePage;