// src/pages/NLPCaption.jsx
import React from 'react';
import NLPCaptionLab from '../components/tools/NLPCaptionLab/NLPCaptionLab';

const NLPCaptionPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - same style */}
      <header className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200 py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-2">NLP Caption Optimizer</h1>
          <p className="text-red-700">
            Analyze and optimize your YouTube captions using Natural Language Processing. Get sentiment analysis and keyword recommendations.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-10 py-8">
        <NLPCaptionLab />
      </div>
    </div>
  );
};

export default NLPCaptionPage;