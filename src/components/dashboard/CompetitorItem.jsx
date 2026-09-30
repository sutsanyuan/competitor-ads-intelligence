function CompetitorItem({ competitor }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div>
        <h3 className="text-sm font-semibold">{competitor.name}</h3>
        <p className="mt-1 text-xs text-slate-500">{competitor.category}</p>
      </div>
      <div className="sm:text-right">
        <p className="text-sm font-medium tabular-nums">{competitor.adCount} ads</p>
        <p className="mt-1 text-xs text-slate-500">{competitor.activity}</p>
      </div>
    </li>
  )
}

export default CompetitorItem
