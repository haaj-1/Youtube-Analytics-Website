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
import NLPCaptionPage from './pages/NLPCaption';
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

  if (isChrome) {
    return (
      <>
        <GreenSidebar isChrome={true} />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-1">
      <GreenSidebar isChrome={false} />
      <main className="flex-1 pl-64">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
    setIsChrome(isChromeBrowser);
  }, []);

  if (isChrome) {
    return (
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex bg-background-light">
          <Routes>
            {/* Tool pages rendered inside a layout that shows the GreenSidebar */}
            <Route element={<ToolLayout />}>
              <Route path="/" element={<PostPerformancePage />} />
              <Route path="/post-performance" element={<PostPerformancePage />} />
              <Route path="/predictive-accuracy" element={<PredictiveAccuracyPage />} />
              <Route path="/nlp-caption" element={<NLPCaptionPage />} />
              <Route path="/performance-history" element={<PerformanceHistoryPage />} />
            </Route>

            {/* Other Pages */}
            <Route path="/about" element={<><GreenSidebar isChrome={true} /><div className="flex-1 flex flex-col"><Navbar /><AboutPage /><Footer /></div></>} />
            <Route path="/login" element={<><GreenSidebar isChrome={true} /><div className="flex-1 flex flex-col"><Navbar /><LoginPage /><Footer /></div></>} />
            <Route path="/signup" element={<><GreenSidebar isChrome={true} /><div className="flex-1 flex flex-col"><Navbar /><SignUpPage /><Footer /></div></>} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<><GreenSidebar isChrome={true} /><div className="flex-1 flex flex-col"><Navbar /><PrivacyPolicy /><Footer /></div></>} />
            <Route path="/terms" element={<><GreenSidebar isChrome={true} /><div className="flex-1 flex flex-col"><Navbar /><TermsOfService /><Footer /></div></>} />

            {/* 404 Page */}
            <Route path="*" element={
              <>
                <GreenSidebar isChrome={true} />
                <div className="flex-1 flex flex-col">
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
              </>
            } />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-background-light">
        <Navbar />

        <Routes>
          {/* Tool pages rendered inside a layout that shows the GreenSidebar */}
          <Route element={<ToolLayout />}>
            <Route path="/" element={<PostPerformancePage />} />
            <Route path="/post-performance" element={<PostPerformancePage />} />
            <Route path="/predictive-accuracy" element={<PredictiveAccuracyPage />} />
            <Route path="/nlp-caption" element={<NLPCaptionPage />} />
            <Route path="/performance-history" element={<PerformanceHistoryPage />} />
          </Route>

          {/* Other Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* 404 Page */}
          <Route path="*" element={
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
          } />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;