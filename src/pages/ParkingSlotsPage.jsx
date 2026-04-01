import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SlotCard from '../components/SlotCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendedSlotCard from '../components/RecommendedSlotCard';
import parkingService from '../services/parkingService';
import bookingService from '../services/bookingService';

/**
 * Parking slots page showing all slots with filtering and booking modal.
 */
export default function ParkingSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({ startTime: '', endTime: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recommendation, setRecommendation] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendType, setRecommendType] = useState('ANY');

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const data = await parkingService.getAllSlots();
      setSlots(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load parking slots' });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (slot) => {
    setSelectedSlot(slot);
    // Default: book for next 2 hours
    const now = new Date();
    const start = new Date(now.getTime() + 5 * 60000);
    const end = new Date(start.getTime() + 2 * 3600000);
    setBookingForm({
      startTime: formatDateTimeLocal(start),
      endTime: formatDateTimeLocal(end),
    });
  };

  const formatDateTimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await bookingService.createBooking(
        selectedSlot.id,
        bookingForm.startTime + ':00',
        bookingForm.endTime + ':00'
      );
      setMessage({ type: 'success', text: `Slot ${selectedSlot.slotNumber} booked successfully!` });
      setSelectedSlot(null);
      setRecommendation(null); // Clear recommendation if booked
      loadSlots(); // Refresh slot statuses
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredSlots = filter === 'ALL' ? slots : slots.filter(s => s.status === filter);

  const handleRecommend = async () => {
    setRecommendLoading(true);
    setRecommendation(null);
    setMessage({ type: '', text: '' });
    try {
      const data = await parkingService.getRecommendation(recommendType);
      if (data) {
        setRecommendation(data);
      } else {
        setMessage({ type: 'error', text: 'No available slots to recommend right now.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to get recommendation.' });
    } finally {
      setRecommendLoading(false);
    }
  };

  const statusCounts = {
    ALL: slots.length,
    AVAILABLE: slots.filter(s => s.status === 'AVAILABLE').length,
    BOOKED: slots.filter(s => s.status === 'BOOKED').length,
    MAINTENANCE: slots.filter(s => s.status === 'MAINTENANCE').length,
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
          <h1 className="text-3xl font-bold text-surface-900">Parking Slots</h1>
          <p className="text-surface-700 mt-1">Browse and book available parking spaces</p>
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
          {(['ALL', 'AVAILABLE', 'BOOKED', 'MAINTENANCE']).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all-smooth ${
                filter === status
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-surface-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {status === 'ALL' ? '🔍' : status === 'AVAILABLE' ? '🟢' : status === 'BOOKED' ? '🟡' : '🔴'}{' '}
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {/* AI Recommendation Section */}
        <div className="mb-8 p-6 bg-white rounded-3xl border border-purple-100 shadow-sm animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-primary-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-surface-900 flex items-center">
                  <span className="text-2xl mr-2">🤖</span> Smart Slot Recommendation
                </h2>
                <p className="text-sm text-surface-700 mt-1">Let our AI find the best available slot for you.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  value={recommendType} 
                  onChange={(e) => setRecommendType(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-surface-700 bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="ANY">Any Vehicle</option>
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                  <option value="TRUCK">Truck</option>
                </select>
                
                <button
                  onClick={handleRecommend}
                  disabled={recommendLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-primary-600 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:from-purple-700 hover:to-primary-700 transition-all-smooth disabled:opacity-70 flex items-center"
                >
                  {recommendLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Thinking...
                    </span>
                  ) : (
                    '✨ Get Recommendation'
                  )}
                </button>
              </div>
            </div>

            {recommendation && (
              <div className="mt-6">
                <RecommendedSlotCard 
                  recommendation={recommendation} 
                  onBook={handleBook} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Slot Grid */}
        {filteredSlots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSlots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <span className="text-4xl mb-3 block">🅿️</span>
            <p className="text-surface-700 font-medium">No {filter.toLowerCase()} slots found</p>
          </div>
        )}

        {/* Booking Modal */}
        {selectedSlot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSlot(null)}>
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">Book Slot {selectedSlot.slotNumber}</h2>
                <button onClick={() => setSelectedSlot(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-primary-50 rounded-xl">
                <p className="text-sm text-primary-700">
                  📍 {selectedSlot.parkingLot?.name} — {selectedSlot.parkingLot?.location}
                </p>
              </div>

              <form onSubmit={submitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Start Time</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">End Time</label>
                  <input
                    type="datetime-local"
                    value={bookingForm.endTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="flex-1 py-3 bg-gray-100 text-surface-700 font-semibold rounded-xl hover:bg-gray-200 transition-all-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-800 transition-all-smooth disabled:opacity-50 shadow-lg"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
