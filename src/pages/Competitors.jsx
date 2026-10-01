import CompetitorCard from '../components/competitors/CompetitorCard'
import { ads } from '../data/ads'

// Count each label, then keep every label tied for the highest count.
function getMostCommon(values) {
  const counts = values.filter(Boolean).reduce((result, value) => {
    result[value] = (result[value] || 0) + 1
    return result
  }, {})
  const highestCount = Math.max(0, ...Object.values(counts))
  return Object.keys(counts).filter((value) => counts[value] === highestCount)
}

function Competitors() {
  const competitorNames = [...new Set(ads.map((ad) => ad.competitor))]
  const competitorSummaries = competitorNames.map((name) => {
    const competitorAds = ads.filter((ad) => ad.competitor === name)
    const platforms = [...new Set(competitorAds.map((ad) => ad.platform))]
    // Compare dates rather than relying on the order of the ads array.
    const latestAd = competitorAds.reduce((latest, ad) => (
      (Date.parse(ad.date) || 0) > (Date.parse(latest.date) || 0) ? ad : latest
    ))

    return {
      name,
      adCount: competitorAds.length,
      platforms,
      latestDate: latestAd.date || 'Date unavailable',
      topAngles: getMostCommon(competitorAds.map((ad) => ad.angle)),
    }
  })
  const summaryStats = [
    { label: 'Total Competitors', value: competitorSummaries.length },
    { label: 'Total Ads', value: ads.length },
    { label: 'Most Active Platform', value: getMostCommon(ads.map((ad) => ad.platform)).join(' · ') || 'No ads yet' },
    { label: 'Most Common Angle', value: getMostCommon(ads.map((ad) => ad.angle)).join(' · ') || 'Not categorized' },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Competitors</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Track competitor activity, platforms, and messaging patterns.</p>
      </div>

      <section aria-label="Competitor overview">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5">
              <dt className="text-sm font-medium text-slate-500">{stat.label}</dt>
              <dd className="mt-3 text-xl font-semibold leading-8 tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-5 text-slate-500">Based on the local ad library. All tied platforms or angles are shown.</p>
      </section>

      <section aria-labelledby="tracked-heading">
        <h2 id="tracked-heading" className="mb-4 text-lg font-semibold">Tracked Competitors</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {competitorSummaries.map((competitor) => <CompetitorCard key={competitor.name} competitor={competitor} />)}
        </div>
        {competitorSummaries.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No competitors to show yet. Competitors will appear when ads are added.</p>
        )}
      </section>
    </div>
  )
}

export default Competitors
