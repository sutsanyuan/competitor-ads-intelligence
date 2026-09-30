function TrendItem({ trend }) {
  return (
    <li>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <h3 className="font-medium">{trend.name}</h3>
        <p className="tabular-nums">
          <span className="font-semibold">{trend.percentage}%</span>
          <span className="ml-2 text-xs text-emerald-700">+{trend.change} pp</span>
        </p>
      </div>
      <div
        role="meter"
        aria-label={`${trend.name} share of ads`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={trend.percentage}
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${trend.percentage}%` }} />
      </div>
    </li>
  )
}

export default TrendItem
