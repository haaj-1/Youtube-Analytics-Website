// App.jsx 
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
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
  return (
    <div className="flex flex-1">
      <GreenSidebar />
      <main className="flex-1 pl-64">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
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
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
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