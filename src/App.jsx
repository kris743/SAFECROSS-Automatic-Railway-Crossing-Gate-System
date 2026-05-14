import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SensorProvider } from './context/SensorContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationPanel from './components/NotificationPanel';
import LoadingScreen from './components/LoadingScreen';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ControlPage from './pages/ControlPage';
import ProjectPage from './pages/ProjectPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrackingPage from './pages/TrackingPage';
import ESPManagementPage from './pages/ESPManagementPage';

// Protected route wrapper — redirects to login if not authorized
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <NotificationPanel />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/project" element={<ProjectPage />} />

              {/* Tracking — any logged-in user */}
              <Route path="/tracking" element={
                <ProtectedRoute>
                  <TrackingPage />
                </ProtectedRoute>
              } />

              {/* Dashboard — Railway Authority + Admin only */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['railway', 'admin']}>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              {/* Controls — Railway Authority + Admin only */}
              <Route path="/controls" element={
                <ProtectedRoute allowedRoles={['railway', 'admin']}>
                  <ControlPage />
                </ProtectedRoute>
              } />

              {/* ESP Management — Railway Authority + Admin only */}
              <Route path="/esp" element={
                <ProtectedRoute allowedRoles={['railway', 'admin']}>
                  <ESPManagementPage />
                </ProtectedRoute>
              } />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SensorProvider>
        <AppContent />
      </SensorProvider>
    </AuthProvider>
  );
}

export default App;
