/**
 * Dashboard statistic card with icon and animated hover.
 */
export default function StatsCard({ title, value, icon, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'from-primary-500 to-primary-700',
    green: 'from-emerald-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-700',
    red: 'from-red-500 to-red-700',
    purple: 'from-purple-500 to-purple-700',
    blue: 'from-blue-500 to-blue-700',
  };

  return (
    <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all-smooth p-6 border border-gray-100 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-700">{title}</p>
          <p className="text-3xl font-bold text-surface-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-surface-700 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
