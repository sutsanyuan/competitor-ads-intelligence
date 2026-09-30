import { Link } from 'react-router-dom'

function CompetitorCard({ competitor }) {
  const initials = competitor.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">{initials}</div>
        <div>
          <h3 className="font-semibold">{competitor.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{competitor.adCount} {competitor.adCount === 1 ? 'ad' : 'ads'} in the sample library</p>
        </div>
      </div>
      <dl className="my-5 space-y-4 text-sm">
        <div>
          <dt className="text-xs font-medium text-slate-500">Platforms used</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {competitor.platforms.map((platform) => <span key={platform} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">{platform}</span>)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Latest ad</dt>
          <dd className="mt-1">{competitor.latestDate}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Top angle{competitor.topAngles.length > 1 ? 's (tied)' : ''}</dt>
          <dd className="mt-1 leading-6">{competitor.topAngles.join(' · ')}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">Activity across {competitor.platforms.length} {competitor.platforms.length === 1 ? 'platform' : 'platforms'}</p>
        <Link to={`/ads?competitor=${encodeURIComponent(competitor.name)}`} aria-label={`View Ads for ${competitor.name}`} className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Ads</Link>
      </div>
    </article>
  )
}

export default CompetitorCard
