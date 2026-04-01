import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import adminService from '../services/adminService';
import bookingService from '../services/bookingService';
import parkingService from '../services/parkingService';

/**
 * Dashboard page showing statistics and recent bookings.
 * Admins see system-wide stats; users see personal stats.
 */
export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      if (isAdmin()) {
        const [statsData, bookingsData] = await Promise.all([
          adminService.getStats(),
          adminService.getAllBookings(),
        ]);
        setStats(statsData);
        setRecentBookings(bookingsData.slice(0, 5));
      } else {
        const [slotsData, bookingsData] = await Promise.all([
          parkingService.getAllSlots(),
          bookingService.getMyBookings(),
        ]);
        const availableCount = slotsData.filter(s => s.status === 'AVAILABLE').length;
        const bookedCount = slotsData.filter(s => s.status === 'BOOKED').length;
        setStats({
          totalSlots: slotsData.length,
          availableSlots: availableCount,
          bookedSlots: bookedCount,
          activeBookings: bookingsData.filter(b => b.status === 'ACTIVE').length,
          totalBookings: bookingsData.length,
        });
        setRecentBookings(bookingsData.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-surface-900">
            Welcome back, <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{user?.name}</span> 👋
          </h1>
          <p className="text-surface-700 mt-1">Here's your parking overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatsCard title="Total Slots" value={stats?.totalSlots || 0} icon="🅿️" color="primary" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatsCard title="Available" value={stats?.availableSlots || 0} icon="✅" color="green" subtitle="Ready to book" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <StatsCard title="Booked" value={stats?.bookedSlots || 0} icon="📋" color="amber" subtitle="Currently occupied" />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <StatsCard title="Active Bookings" value={stats?.activeBookings || 0} icon="🔥" color="red" />
          </div>
        </div>

        {isAdmin() && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="purple" />
            <StatsCard title="Total Lots" value={stats?.totalLots || 0} icon="🏗️" color="blue" />
            <StatsCard title="Maintenance" value={stats?.maintenanceSlots || 0} icon="🔧" color="red" />
            <StatsCard title="All Bookings" value={stats?.totalBookings || 0} icon="📊" color="primary" />
          </div>
        )}

        {/* Recent Bookings */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-surface-900 mb-4">
            {isAdmin() ? 'Recent Bookings' : 'Your Recent Bookings'}
          </h2>
          {recentBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showUser={isAdmin()} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="text-surface-700 font-medium">No bookings yet</p>
              <p className="text-sm text-surface-700 mt-1">Book your first parking slot to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
