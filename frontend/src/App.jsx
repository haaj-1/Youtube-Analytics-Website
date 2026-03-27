// App.jsx 
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GreenSidebar from './components/GreenSidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PostPerformancePage from './pages/PostPerformance';
import PredictiveAccuracyPage from './pages/PredictiveAccuracy';
import PerformanceHistoryPage from './pages/PerformanceHistory';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import SignUpPage from './pages/SignUpPage';
import ScrollToTop from './components/ScrollToTop';


function ToolLayout() {
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
    setIsChrome(isChromeBrowser);
  }, []);

  return (
    <>
      <GreenSidebar isChrome={isChrome} />
      <div className={`${isChrome ? 'ml-56' : 'ml-64'} flex-1 flex flex-col`} style={isChrome ? { zoom: '0.85' } : {}}>
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
    setIsChrome(isChromeBrowser);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex bg-background-light">
        <Routes>
          {/* Tool pages with sidebar */}
          <Route element={<ToolLayout />}>
            <Route path="/" element={<PostPerformancePage />} />
            <Route path="/post-performance" element={<PostPerformancePage />} />
            <Route path="/predictive-accuracy" element={<PredictiveAccuracyPage />} />
            <Route path="/performance-history" element={<PerformanceHistoryPage />} />
          </Route>

          {/* Other Pages WITHOUT sidebar */}
          <Route path="/about" element={
            <div className="flex-1 flex flex-col" style={isChrome ? { zoom: '0.85' } : {}}>
              <Navbar />
              <AboutPage />
              <Footer />
            </div>
          } />
          <Route path="/login" element={
            <div className="flex-1 flex flex-col" style={isChrome ? { zoom: '0.85' } : {}}>
              <Navbar />
              <LoginPage />
              <Footer />
            </div>
          } />
          <Route path="/signup" element={
            <div className="flex-1 flex flex-col" style={isChrome ? { zoom: '0.85' } : {}}>
              <Navbar />
              <SignUpPage />
              <Footer />
            </div>
          } />

          {/* Legal Pages WITHOUT sidebar */}
          <Route path="/privacy" element={
            <div className="flex-1 flex flex-col" style={isChrome ? { zoom: '0.85' } : {}}>
              <Navbar />
              <PrivacyPolicy />
              <Footer />
            </div>
          } />
          <Route path="/terms" element={
            <div className="flex-1 flex flex-col" style={isChrome ? { zoom: '0.85' } : {}}>
              <Navbar />
              <TermsOfService />
              <Footer />
            </div>
          } />

          {/* 404 Page WITHOUT sidebar */}
          <Route path="*" element={
            <div className="flex-1 flex flex-col" style={isChrome ? { zoom: '0.85' } : {}}>
              <Navbar />
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
                  <p className="text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
                  <Link 
                    to="/" 
                    className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
              <Footer />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
