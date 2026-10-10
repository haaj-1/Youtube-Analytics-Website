import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell, PublicLayout } from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PostPerformancePage from './pages/PostPerformance';
import PredictiveAccuracyPage from './pages/PredictiveAccuracy';
import PerformanceHistoryPage from './pages/PerformanceHistory';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Tool pages with sidebar */}
        <Route element={<AppShell />}>
          <Route path="/" element={<PostPerformancePage />} />
          <Route path="/post-performance" element={<PostPerformancePage />} />
          <Route path="/predictive-accuracy" element={<PredictiveAccuracyPage />} />
          <Route path="/performance-history" element={<PerformanceHistoryPage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
