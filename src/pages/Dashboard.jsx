import { useState } from 'react'
import AdCard from '../components/dashboard/AdCard'
import CompetitorItem from '../components/dashboard/CompetitorItem'
import StatCard from '../components/dashboard/StatCard'
import TrendItem from '../components/dashboard/TrendItem'
import useAds from '../hooks/useAds'

function Dashboard() {
  const { ads, loading, error } = useAds()
  const [savedIds, setSavedIds] = useState([])

  function toggleSave(id) {
    setSavedIds((current) => current.includes(id)
      ? current.filter((savedId) => savedId !== id)
      : [...current, id])
  }

  if (loading) return <p role="status" className="text-sm text-slate-500">Loading dashboard...</p>
  if (error) return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>

  const recentAds = [...ads]
    .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0))
    .slice(0, 4)
    .map((ad) => ({ ...ad, saved: savedIds.includes(ad.id) }))
  const competitorNames = [...new Set(ads.map((ad) => ad.competitor).filter(Boolean))]
  const competitors = competitorNames.map((name) => {
    const competitorAds = ads.filter((ad) => ad.competitor === name)
    const platforms = [...new Set(competitorAds.map((ad) => ad.platform).filter(Boolean))]
    return { id: name, name, category: platforms.join(' · '), adCount: competitorAds.length, activity: 'In the ad library' }
  })
  const today = new Date()
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const newAds = ads.filter((ad) => {
    const started = new Date(ad.date)
    return started >= weekStart && started < tomorrow
  })
  const dashboardStats = [
    { id: 'total', label: 'Total Ads', value: ads.length, description: 'In the Supabase ad library' },
    { id: 'competitors', label: 'Tracked Competitors', value: competitorNames.length, description: 'With ads in the library' },
    { id: 'saved', label: 'Saved Ads', value: savedIds.length, description: 'Saved on this page only' },
    { id: 'new', label: 'Started This Week', value: newAds.length, description: 'Known start dates in the last 7 days' },
  ]
  // Count only recorded angles; missing categorization is not guessed.
  const angleNames = [...new Set(ads.map((ad) => ad.angle).filter(Boolean))]
  const trendingAngles = angleNames.map((name) => ({
    id: name,
    name,
    percentage: Math.round(ads.filter((ad) => ad.angle === name).length / ads.length * 100),
  })).sort((a, b) => b.percentage - a.percentage).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Monitor competitor advertising activity and discover what is getting attention.
          </p>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">Supabase ad library</span>
      </div>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Activity overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
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
        {ads.length === 0 && <p className="mb-4 text-sm text-slate-500">No ads yet. Import an ad to get started.</p>}
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {recentAds.map((ad) => <AdCard key={ad.id} ad={ad} onToggleSave={toggleSave} />)}
        </div>
        <p className="mt-3 text-xs text-slate-500">Saves reset when you leave this page.</p>
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
          <h2 id="angles-heading" className="text-lg font-semibold">Message Angles</h2>
          <p className="mt-1 text-sm text-slate-500">Share of all ads by recorded angle. Changes over time are not available yet.</p>
          {trendingAngles.length === 0 && <p className="mt-4 text-sm text-slate-500">No categorized ads yet.</p>}
          <ul className="mt-6 space-y-6">
            {trendingAngles.map((trend) => <TrendItem key={trend.id} trend={trend} />)}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
