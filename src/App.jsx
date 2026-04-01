import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ParkingSlotsPage from './pages/ParkingSlotsPage';
import BookingsPage from './pages/BookingsPage';
import AdminPanelPage from './pages/AdminPanelPage';

import Chatbot from './components/Chatbot';

/**
 * Root application component with routing and auth provider.
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/slots" element={
            <ProtectedRoute><ParkingSlotsPage /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><BookingsPage /></ProtectedRoute>
          } />

          {/* Admin Only Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPanelPage /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        
        {/* Global Floating Components */}
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}
