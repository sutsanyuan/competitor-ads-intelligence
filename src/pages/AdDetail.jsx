import placeholderImage from '../assets/ads/placeholder.svg'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { adAnalysis } from '../data/mockAds'
import { ads as localAds } from '../data/ads'
import { supabase } from '../lib/supabase'
import useSession from '../hooks/useSession'

function AddToCollection({ adId }) {
  const { session, loading: sessionLoading } = useSession()
  const [collections, setCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [collectionsError, setCollectionsError] = useState('')
  const [selectedCollectionId, setSelectedCollectionId] = useState('')
  const [adding, setAdding] = useState(false)
  const [addMessage, setAddMessage] = useState('')
  const [addError, setAddError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadCollections() {
      try {
        const { data, error } = await supabase.from('collections').select('*').order('created_at')
        if (error) throw error
        if (!cancelled) setCollections(data || [])
      } catch {
        if (!cancelled) setCollectionsError('Unable to load collections. Please refresh to try again.')
      } finally {
        if (!cancelled) setCollectionsLoading(false)
      }
    }
    loadCollections()
    return () => { cancelled = true }
  }, [])

  async function handleAdd(event) {
    event.preventDefault()
    if (adding) return
    setAddMessage('')
    setAddError('')
    if (!session) {
      setAddError('Log in to add this ad to a collection.')
      return
    }
    if (!selectedCollectionId) {
      setAddError('Please select a collection.')
      return
    }
    setAdding(true)
    try {
      const { error } = await supabase.from('collection_ads').insert({
        collection_id: selectedCollectionId,
        ad_id: adId,
      })
      if (error) {
        if (error.code === '23505') {
          setAddMessage('This ad is already in that collection.')
          return
        }
        throw error
      }
      setAddMessage('Added to collection')
    } catch (error) {
      setAddError(error.message || 'Unable to add this ad. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <section aria-labelledby="add-collection-heading" className="border-t border-slate-200 pt-5">
      <h2 id="add-collection-heading" className="text-sm font-semibold">Add to Collection</h2>
      {sessionLoading ? <p role="status" className="mt-2 text-sm text-slate-500">Checking session...</p> : !session ? (
        <p className="mt-2 text-sm text-slate-500"><Link to="/login" className="rounded text-indigo-700 underline focus-visible:outline-2">Log in</Link> to add this ad to a collection.</p>
      ) : collectionsLoading ? <p role="status" className="mt-2 text-sm text-slate-500">Loading collections...</p> : collectionsError ? (
        <p role="alert" className="mt-2 text-sm text-red-700">{collectionsError}</p>
      ) : collections.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No collections available yet.</p>
      ) : (
        <form onSubmit={handleAdd} className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Select collection</span>
              <select value={selectedCollectionId} disabled={adding} onChange={(event) => { setSelectedCollectionId(event.target.value); setAddMessage(''); setAddError('') }} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-indigo-600">
                <option value="">Select collection</option>
                {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
              </select>
            </label>
            <button type="submit" disabled={adding || !selectedCollectionId} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">{adding ? 'Adding...' : 'Add'}</button>
          </div>
          {addMessage && <p role="status" className="text-sm text-emerald-700">{addMessage}</p>}
          {addError && <p role="alert" className="text-sm text-red-700">{addError}</p>}
        </form>
      )}
    </section>
  )
}

function AdDetail() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [savedChanges, setSavedChanges] = useState({})

  useEffect(() => {
    let cancelled = false

    async function loadAd() {
      // Use the matching local record if the database lookup fails.
      let loadedAd = localAds.find((item) => String(item.id) === id) || null
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('id', id)
          .single()

        if (!error && data) {
          loadedAd = {
            id: data.id,
            competitor: data.competitor ?? '',
            platform: data.platform ?? '',
            headline: data.headline ?? '',
            copy: data.copy ?? '',
            image: data.image_url ?? '',
            angle: data.angle ?? null,
            date: data.started_at ?? '',
            sourceUrl: data.source_url ?? '',
            sourceId: data.source_id ?? '',
            isReal: data.is_real === true,
            saved: false,
          }
        }
      } catch {
        // Network failures use the same local fallback as query errors.
      }

      if (!cancelled) setResult({ routeId: id, ad: loadedAd })
    }

    loadAd()
    return () => { cancelled = true }
  }, [id])

  // Matching the result to the URL also avoids showing a previous ad on navigation.
  if (!result || result.routeId !== id) {
    return <p role="status" className="text-sm text-slate-500">Loading ad...</p>
  }

  const ad = result.ad
  if (!ad) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Ad not found</h1>
        <p className="mt-3 text-sm text-slate-500">We couldn't find or load this ad. Explore the other ads to find more inspiration.</p>
        <Link to="/ads" className="mt-6 inline-block rounded-lg px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600">← Back to Ads Explorer</Link>
      </section>
    )
  }

  const saved = savedChanges[ad.id] ?? ad.saved ?? false
  const analysis = ad.isReal ? undefined : adAnalysis[ad.id]
  const analysisFields = analysis ? [
    { label: 'Target Audience', value: analysis.targetAudience },
    { label: 'Hook', value: analysis.hook },
    { label: 'Pain Point', value: analysis.painPoint },
    { label: 'Key Benefit', value: analysis.keyBenefit },
    { label: 'Offer', value: analysis.offer },
    { label: 'CTA', value: analysis.cta },
    { label: 'Funnel Stage', value: analysis.funnelStage },
    { label: 'Message Angle', value: ad.angle || 'Not categorized' },
  ] : []

  function toggleSave() {
    setSavedChanges((current) => ({
      ...current,
      [ad.id]: !(current[ad.id] ?? ad.saved),
    }))
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link to="/ads" className="inline-block rounded-sm text-sm font-medium text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">← Back to Ads Explorer</Link>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img src={ad.image || placeholderImage} alt={`Ad creative for ${ad.competitor}`} width="640" height="400" className="aspect-[8/5] w-full object-contain" />
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{ad.competitor}</p>
                <p className="mt-1 text-sm text-slate-500">{ad.platform} · {ad.date || 'Date unavailable'}</p>
              </div>
              <button type="button" onClick={toggleSave} aria-pressed={saved} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${saved ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Bookmark aria-hidden="true" className={`size-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save ad'}
              </button>
            </div>
            <h1 className="text-2xl font-semibold leading-8 tracking-tight">{ad.headline}</h1>
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{ad.copy}</p>
            <span className="inline-block rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{ad.angle || 'Not categorized'}</span>
            {ad.sourceUrl && (
              <a href={ad.sourceUrl} target="_blank" rel="noreferrer" className="inline-block rounded text-sm font-medium text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-600">View original ad</a>
            )}
            <p className="text-xs leading-5 text-slate-500">Saves are local to this page and reset when you leave.</p>
            <AddToCollection key={ad.id} adId={ad.id} />
          </div>
        </article>

        <section aria-labelledby="analysis-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="analysis-heading" className="text-xl font-semibold">AI Analysis</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{analysis ? 'Mock analysis' : 'Not analyzed'}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">{analysis ? 'An example breakdown of this ad’s messaging. Written sample data, not generated by AI.' : 'AI analysis not available yet.'}</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {analysisFields.map((field) => (
              <div key={field.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <dt className="text-xs font-semibold text-slate-500">{field.label}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-800">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}

export default AdDetail
