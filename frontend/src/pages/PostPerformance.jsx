import React from 'react';
import PostPredictorV2 from '../components/tools/PostPredictor/PostPredictorV2';

const PostPerformancePage = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b border-gray-200 py-8 px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Video Performance Predictor</h1>
        <p className="text-gray-500 text-sm">
          Predict views, find your best thumbnail, and get AI-optimized title suggestions — all in one run.
        </p>
      </div>
    </header>
    <div className="max-w-7xl mx-auto px-10 py-8">
      <PostPredictorV2 />
    </div>
  </div>
);

export default PostPerformancePage;
