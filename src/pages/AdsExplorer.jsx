import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import AdCard from '../components/dashboard/AdCard'
import useAds from '../hooks/useAds'

function AdsExplorer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { ads, loading, error } = useAds()
  const [sourceAds, setSourceAds] = useState(ads)
  const [explorerAds, setExplorerAds] = useState(() => ads.map((ad) => ({ ...ad })))
  const competitorFilter = searchParams.get('competitor') || ''
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [angleFilter, setAngleFilter] = useState('All')
  const [savedFilter, setSavedFilter] = useState('All')

  // Sync only when the hook returns a new array, preserving local save choices.
  // React rerenders before committing, so filters never display the old list.
  if (sourceAds !== ads) {
    setSourceAds(ads)
    setExplorerAds((currentAds) => ads.map((ad) => ({
      ...ad,
      saved: currentAds.find((current) => current.id === ad.id)?.saved ?? ad.saved,
    })))
  }

  const query = searchQuery.trim().toLowerCase()
  const filteredAds = explorerAds.filter((ad) => {
    const matchesSearch = [ad.competitor, ad.headline, ad.copy, ad.angle]
      .some((text) => (text || '').toLowerCase().includes(query))
    const matchesPlatform = platformFilter === 'All' || ad.platform === platformFilter
    const matchesAngle = angleFilter === 'All' || ad.angle === angleFilter
    const matchesSaved = savedFilter === 'All' || ad.saved
    const matchesCompetitor = competitorFilter === '' || ad.competitor === competitorFilter

    return matchesSearch && matchesPlatform && matchesAngle && matchesSaved && matchesCompetitor
  })
  const hasActiveFilters = searchQuery !== '' || platformFilter !== 'All'
    || angleFilter !== 'All' || savedFilter !== 'All' || competitorFilter !== ''

  function clearFilters() {
    setSearchQuery('')
    setPlatformFilter('All')
    setAngleFilter('All')
    setSavedFilter('All')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('competitor')
    setSearchParams(nextParams)
  }

  function toggleSave(id) {
    setExplorerAds((currentAds) => currentAds.map((ad) => (
      ad.id === id ? { ...ad, saved: !ad.saved } : ad
    )))
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ads Explorer</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Browse competitor ads and filter by platform, marketing angle, or saved inspiration.
        </p>
      </div>

      <section aria-label="Search and filter ads" className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        {competitorFilter && (
          <p className="text-sm text-slate-600">Showing ads for <span className="font-semibold text-slate-900">{competitorFilter}</span>. Use Clear filters to browse all competitors.</p>
        )}
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
          <span className="sr-only">Search ads, competitors, or keywords</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search ads, competitors, or keywords..."
            className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-slate-600">
            Platform
            <select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600">
              <option>All</option>
              <option>Meta</option>
              <option>Google</option>
              <option>TikTok</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Angle
            <select value={angleFilter} onChange={(event) => setAngleFilter(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600">
              <option>All</option>
              <option>AI English</option>
              <option>Speaking Confidence</option>
              <option>Business English</option>
              <option>Free Trial</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-600">
            Saved status
            <select value={savedFilter} onChange={(event) => setSavedFilter(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600">
              <option>All</option>
              <option>Saved only</option>
            </select>
          </label>
        </div>
      </section>

      <section aria-labelledby="results-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="results-heading" aria-live="polite" aria-atomic="true" className="text-sm font-medium text-slate-600">
            {loading ? 'Loading ads...' : error ? 'Ads unavailable' : `${filteredAds.length} ${filteredAds.length === 1 ? 'ad' : 'ads'} found`}
          </h2>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600">
              Clear filters
            </button>
          )}
        </div>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && (filteredAds.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {filteredAds.map((ad) => <AdCard key={ad.id} ad={ad} onToggleSave={toggleSave} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-14 text-center">
            <Search aria-hidden="true" className="mx-auto mb-4 size-8 text-slate-400" />
            <h3 className="text-lg font-semibold">No ads match just yet</h3>
            <p className="mt-2 text-sm text-slate-500">Try another keyword or clear your filters to explore all ads.</p>
            <button type="button" onClick={clearFilters} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Clear filters
            </button>
          </div>
        ))}
        <p className="mt-4 text-xs text-slate-500">Saves are local to this page and reset when you leave.</p>
      </section>
    </div>
  )
}

export default AdsExplorer
