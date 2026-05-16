import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
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
  return (
    <>
      <GreenSidebar />
      <div className="ml-64 flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

function PageLayout({ children }) {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
        <Routes>
          {/* Tool pages with sidebar */}
          <Route element={<ToolLayout />}>
            <Route path="/" element={<PostPerformancePage />} />
            <Route path="/post-performance" element={<PostPerformancePage />} />
            <Route path="/predictive-accuracy" element={<PredictiveAccuracyPage />} />
            <Route path="/performance-history" element={<PerformanceHistoryPage />} />
          </Route>

          <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />
          <Route path="/login" element={<PageLayout><LoginPage /></PageLayout>} />
          <Route path="/signup" element={<PageLayout><SignUpPage /></PageLayout>} />
          <Route path="/privacy" element={<PageLayout><PrivacyPolicy /></PageLayout>} />
          <Route path="/terms" element={<PageLayout><TermsOfService /></PageLayout>} />

          <Route path="*" element={
            <PageLayout>
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
                  <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
                  <Link to="/" className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all">
                    Go Home
                  </Link>
                </div>
              </div>
            </PageLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
