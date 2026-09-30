import { useState } from 'react'
import AdCard from '../components/dashboard/AdCard'
import CompetitorItem from '../components/dashboard/CompetitorItem'
import StatCard from '../components/dashboard/StatCard'
import TrendItem from '../components/dashboard/TrendItem'
import { ads, competitors, dashboardStats, trendingAngles } from '../data/mockAds'

function Dashboard() {
  const [recentAds, setRecentAds] = useState(ads)
  // The library includes older saved ads outside these four recent ads.
  const savedCountChange = recentAds.filter((ad) => ad.saved).length
    - ads.filter((ad) => ad.saved).length

  function toggleSave(id) {
    setRecentAds((currentAds) => currentAds.map((ad) => (
      ad.id === id ? { ...ad, saved: !ad.saved } : ad
    )))
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Monitor competitor advertising activity and discover what is getting attention.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">Sample data · Sep 30, 2026</span>
      </div>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Activity overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.id === 'saved' ? stat.value + savedCountChange : stat.value}
              description={stat.description}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-heading">
        <div className="mb-4">
          <h2 id="recent-heading" className="text-lg font-semibold">Recent Ads</h2>
          <p className="mt-1 text-sm text-slate-500">The latest creatives from your tracked competitors.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {recentAds.map((ad) => <AdCard key={ad.id} ad={ad} onToggleSave={toggleSave} />)}
        </div>
        <p className="mt-3 text-xs text-slate-500">Sample creatives. Saves reset when you leave this page.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="competitors-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 id="competitors-heading" className="text-lg font-semibold">Tracked Competitors</h2>
          <p className="mt-1 text-sm text-slate-500">A quick pulse on the brands you follow.</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {competitors.map((competitor) => <CompetitorItem key={competitor.id} competitor={competitor} />)}
          </ul>
        </section>

        <section aria-labelledby="angles-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 id="angles-heading" className="text-lg font-semibold">Trending Angles</h2>
          <p className="mt-1 text-sm text-slate-500">Share of this week's ads · change vs. last week in percentage points.</p>
          <ul className="mt-6 space-y-6">
            {trendingAngles.map((trend) => <TrendItem key={trend.id} trend={trend} />)}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
