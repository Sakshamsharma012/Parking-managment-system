/**
 * Recommended slot card with gradient highlight, score visualization,
 * and "Why this slot?" explanation. Premium, eye-catching design.
 */
export default function RecommendedSlotCard({ recommendation, onBook }) {
  if (!recommendation) return null;

  const scorePercent = Math.min(Math.max((recommendation.score / 16) * 100, 10), 100);

  return (
    <div className="relative mb-8 animate-slide-up">
      {/* Gradient border wrapper */}
      <div className="p-[2px] rounded-3xl bg-gradient-to-r from-purple-500 via-primary-500 to-emerald-500">
        <div className="bg-white rounded-3xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-900 flex items-center">
                  AI Recommendation
                  <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                    SMART PICK
                  </span>
                </h3>
                <p className="text-sm text-surface-700">Best available slot based on intelligent scoring</p>
              </div>
            </div>
          </div>

          {/* Recommended Slot Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Slot details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">{recommendation.slotNumber}</span>
                </div>
                <div>
                  <p className="font-bold text-surface-900 text-lg">Slot {recommendation.slotNumber}</p>
                  <p className="text-sm text-surface-700">
                    📍 {recommendation.parkingLot?.name}
                  </p>
                  <p className="text-xs text-surface-700">
                    {recommendation.parkingLot?.location}
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-surface-700">Recommendation Score</span>
                  <span className="font-bold text-primary-600">{recommendation.score.toFixed(1)} pts</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                  🟢 {recommendation.status}
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
                  🚗 {recommendation.slotType || 'ANY'}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                  📊 Used {recommendation.usageCount}x
                </span>
              </div>
            </div>

            {/* Right: Reasons */}
            <div>
              <p className="text-sm font-semibold text-surface-800 mb-2 flex items-center">
                💡 Why this slot?
              </p>
              <div className="space-y-1.5">
                {recommendation.reasons?.map((reason, idx) => (
                  <div key={idx} className="flex items-start text-sm text-surface-700">
                    <span className="mr-1.5 mt-0.5 flex-shrink-0 text-xs">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Book button */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => onBook({
                id: recommendation.id,
                slotNumber: recommendation.slotNumber,
                status: recommendation.status,
                parkingLot: recommendation.parkingLot,
              })}
              className="w-full py-3 bg-gradient-to-r from-purple-500 via-primary-500 to-emerald-500 text-white font-bold rounded-xl hover:from-purple-600 hover:via-primary-600 hover:to-emerald-600 transition-all-smooth shadow-lg hover:shadow-xl text-sm"
            >
              ✨ Book This Recommended Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
