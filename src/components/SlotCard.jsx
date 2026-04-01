/**
 * Parking slot card with status indicator and booking action.
 */
export default function SlotCard({ slot, onBook, disabled = false }) {
  const statusStyles = {
    AVAILABLE: {
      bg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      badge: 'bg-emerald-100 text-emerald-700',
      icon: '🟢',
      label: 'Available',
    },
    BOOKED: {
      bg: 'bg-amber-50 border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      icon: '🟡',
      label: 'Booked',
    },
    MAINTENANCE: {
      bg: 'bg-red-50 border-red-200',
      badge: 'bg-red-100 text-red-700',
      icon: '🔴',
      label: 'Maintenance',
    },
  };

  const style = statusStyles[slot.status] || statusStyles.AVAILABLE;

  return (
    <div className={`rounded-2xl border-2 p-5 transition-all-smooth ${style.bg} ${slot.status === 'AVAILABLE' ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' : 'opacity-80'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-surface-900">{slot.slotNumber}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
          {style.icon} {style.label}
        </span>
      </div>

      <div className="space-y-1 text-sm text-surface-700 mb-4">
        <p className="flex items-center">
          <span className="mr-2">📍</span>
          {slot.parkingLot?.name}
        </p>
        <p className="flex items-center">
          <span className="mr-2">📌</span>
          {slot.parkingLot?.location}
        </p>
      </div>

      {slot.status === 'AVAILABLE' && (
        <button
          onClick={() => onBook(slot)}
          disabled={disabled}
          className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-800 transition-all-smooth disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          Book Now
        </button>
      )}
    </div>
  );
}
