/**
 * Booking card with status display and cancel action.
 */
export default function BookingCard({ booking, onCancel, showUser = false }) {
  const statusStyles = {
    ACTIVE: { badge: 'bg-emerald-100 text-emerald-700', label: '✅ Active' },
    CANCELLED: { badge: 'bg-red-100 text-red-700', label: '❌ Cancelled' },
    COMPLETED: { badge: 'bg-blue-100 text-blue-700', label: '✔️ Completed' },
  };

  const style = statusStyles[booking.status] || statusStyles.ACTIVE;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-card-hover transition-all-smooth">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{booking.slot?.slotNumber}</span>
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Slot {booking.slot?.slotNumber}</h3>
            {booking.slot?.parkingLot && (
              <p className="text-xs text-surface-700">{booking.slot.parkingLot.name}</p>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
          {style.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-surface-700 mb-4">
        <div>
          <p className="text-xs font-medium text-surface-700 mb-0.5">Start</p>
          <p className="font-medium">{formatDate(booking.startTime)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-surface-700 mb-0.5">End</p>
          <p className="font-medium">{formatDate(booking.endTime)}</p>
        </div>
      </div>

      {showUser && booking.user && (
        <div className="text-sm text-surface-700 mb-3 p-2 bg-gray-50 rounded-lg">
          <span className="font-medium">👤 {booking.user.name}</span>
          <span className="ml-2 text-xs">({booking.user.email})</span>
        </div>
      )}

      {booking.status === 'ACTIVE' && onCancel && (
        <button
          onClick={() => onCancel(booking.id)}
          className="w-full py-2 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all-smooth border border-red-200"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
}
