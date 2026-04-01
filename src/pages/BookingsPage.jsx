import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import bookingService from '../services/bookingService';

/**
 * User's booking history page with cancel functionality.
 */
export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load bookings' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId);
      setMessage({ type: 'success', text: 'Booking cancelled successfully' });
      loadBookings();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel booking' });
    }
  };

  const filteredBookings = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    ALL: bookings.length,
    ACTIVE: bookings.filter(b => b.status === 'ACTIVE').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
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
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-surface-900">My Bookings</h1>
          <p className="text-surface-700 mt-1">View and manage your parking reservations</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium animate-slide-up ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['ALL', 'ACTIVE', 'CANCELLED', 'COMPLETED']).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all-smooth ${
                filter === status
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-surface-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {status === 'ALL' ? '📋' : status === 'ACTIVE' ? '✅' : status === 'CANCELLED' ? '❌' : '✔️'}{' '}
              {status} ({counts[status]})
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-surface-700 font-medium">
              {filter === 'ALL' ? 'No bookings yet' : `No ${filter.toLowerCase()} bookings`}
            </p>
            <p className="text-sm text-surface-700 mt-1">
              {filter === 'ALL' ? 'Go to Parking Slots to make your first booking!' : 'Try a different filter'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
