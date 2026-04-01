import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

/**
 * Navigation bar with responsive design, role-based links, and user menu.
 */
export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all-smooth ${
        isActive(path)
          ? 'bg-primary-600 text-white shadow-md'
          : 'text-surface-700 hover:text-primary-600 hover:bg-primary-50'
      }`}
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              ParkSmart
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navLink('/dashboard', '📊 Dashboard')}
            {navLink('/slots', '🅿️ Parking Slots')}
            {navLink('/bookings', '📋 My Bookings')}
            {isAdmin() && navLink('/admin', '⚙️ Admin Panel')}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-surface-800">{user?.name}</p>
                <p className="text-xs text-surface-700">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all-smooth"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-up">
            {navLink('/dashboard', '📊 Dashboard')}
            {navLink('/slots', '🅿️ Parking Slots')}
            {navLink('/bookings', '📋 My Bookings')}
            {isAdmin() && navLink('/admin', '⚙️ Admin Panel')}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
