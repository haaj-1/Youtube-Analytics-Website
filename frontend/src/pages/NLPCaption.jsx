import React from 'react';
import NLPCaptionLab from '../components/tools/NLPCaptionLab/NLPCaptionLab';

const NLPCaptionPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#080b12', color: '#e2e8f0' }}>
      <header className="px-10 py-10 relative overflow-hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 0% 50%, rgba(239,68,68,0.07) 0%, transparent 60%)'
        }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-red-400 uppercase tracking-widest">NLP Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">NLP Caption Optimizer</h1>
          <p className="text-slate-500 text-sm">
            Analyze and optimize your YouTube captions with Natural Language Processing.
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
