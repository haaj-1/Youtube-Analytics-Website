import React, { useState, useEffect } from 'react';
import PostPredictorV2 from '../components/tools/PostPredictor/PostPredictorV2';

const PostPerformancePage = () => {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem('pp_theme') || 'dark');

  // Sync page background when theme changes (PostPredictorV2 updates localStorage)
  useEffect(() => {
    const onStorage = () => setThemeKey(localStorage.getItem('pp_theme') || 'dark');
    window.addEventListener('storage', onStorage);
    // Poll for same-tab changes
    const id = setInterval(() => setThemeKey(localStorage.getItem('pp_theme') || 'dark'), 200);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(id); };
  }, []);

  const isDark = themeKey === 'dark';
  const pageBg = isDark ? '#0d1220' : '#ffffff';
  const headerBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #fecaca';
  const titleColor = isDark ? '#ffffff' : '#111111';
  const subColor = isDark ? '#64748b' : '#dc2626';

  return (
    <div className="min-h-screen font-display" style={{ background: pageBg, color: titleColor }}>
      <header className="px-6 py-8 relative overflow-hidden" style={{ borderBottom: headerBorder }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 0% 50%, rgba(239,68,68,0.07) 0%, transparent 60%)'
        }} />
        <div className="max-w-7xl mx-auto relative">
          <h1 className="text-2xl font-bold mb-1" style={{ color: titleColor }}>Video Performance Predictor</h1>
          <p className="text-sm" style={{ color: subColor }}>
            Predict YouTube engagement before posting. Get data-driven insights to optimize your content.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PostPredictorV2 />
      </div>
    </div>
  );
};

export default PostPerformancePage;
