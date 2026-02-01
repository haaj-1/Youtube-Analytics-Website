// App.jsx 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Tool Pages */}
            <Route path="/" element={<PostPerformancePage />} />
            <Route path="/post-performance" element={<PostPerformancePage />} />
            <Route path="/predictive-accuracy" element={<PredictiveAccuracyPage />} />
            <Route path="/nlp-caption" element={<NLPCaptionPage />} />
            <Route path="/performance-history" element={<PerformanceHistoryPage />} />
            
            {/* Other Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} /> {/* ADD THIS ROUTE */}
            
            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
                  <p className="text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
                  <a 
                    href="/" 
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;