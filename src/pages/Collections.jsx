import { useEffect, useState } from 'react'
import CollectionCard from '../components/collections/CollectionCard'
import AdCard from '../components/dashboard/AdCard'
import { supabase } from '../lib/supabase'

function Collections() {
  const [collections, setCollections] = useState([])
  const [collectionAds, setCollectionAds] = useState([])
  const [ads, setAds] = useState([])
  const [selectedCollectionId, setSelectedCollectionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadCollections() {
      try {
        // Run the three independent reads together and wait for all results.
        const [collectionsResult, relationshipsResult, adsResult] = await Promise.all([
          supabase.from('collections').select('*').order('created_at'),
          supabase.from('collection_ads').select('*'),
          supabase.from('ads').select('*'),
        ])
        if (cancelled) return
        const queryError = collectionsResult.error || relationshipsResult.error || adsResult.error
        if (queryError) throw queryError
        if (!Array.isArray(collectionsResult.data) || !Array.isArray(relationshipsResult.data) || !Array.isArray(adsResult.data)) {
          throw new Error('Incomplete collection data returned.')
        }

        const mappedAds = adsResult.data.map((ad) => ({
          id: ad.id,
          competitor: ad.competitor ?? '',
          platform: ad.platform ?? '',
          headline: ad.headline ?? '',
          copy: ad.copy ?? '',
          image: ad.image_url ?? '',
          angle: ad.angle ?? null,
          date: ad.started_at ?? '',
          sourceUrl: ad.source_url ?? '',
          sourceId: ad.source_id ?? '',
          isReal: ad.is_real === true,
          saved: false,
        }))
        setCollections(collectionsResult.data)
        setCollectionAds(relationshipsResult.data)
        setAds(mappedAds)
        setSelectedCollectionId(collectionsResult.data[0]?.id ?? null)
      } catch {
        if (!cancelled) setError('Unable to load collections from Supabase. Please refresh to try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCollections()
    return () => { cancelled = true }
  }, [])

  // Follow each collection's relationship rows to the matching ad records.
  const collectionSummaries = collections.map((collection) => {
    const adIds = collectionAds
      .filter((relationship) => String(relationship.collection_id) === String(collection.id))
      .map((relationship) => String(relationship.ad_id))
    const matchingAds = ads.filter((ad) => adIds.includes(String(ad.id)))
    return { ...collection, ads: matchingAds }
  })
  const selectedCollection = collectionSummaries.find((collection) => collection.id === selectedCollectionId)
  // Show All displays each collected ad once, even if it belongs to multiple collections.
  const allCollectedIds = collectionSummaries.flatMap((collection) => collection.ads.map((ad) => ad.id))
  const selectedAds = selectedCollection
    ? selectedCollection.ads
    : ads.filter((ad) => allCollectedIds.includes(ad.id))

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Organize saved competitor ads for later review.</p>
      </div>

      {loading ? (
        <p role="status" className="text-sm text-slate-500">Loading collections...</p>
      ) : error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : collections.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No collections yet. Collections will appear here once they are added.</p>
      ) : (
        <>
          <section aria-labelledby="collections-heading">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 id="collections-heading" className="text-lg font-semibold">Your collections</h2>
              <button
                type="button"
                onClick={() => setSelectedCollectionId(null)}
                aria-pressed={selectedCollectionId === null}
                aria-controls="collection-detail"
                className={`rounded-lg px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${selectedCollectionId === null ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}
              >
                Show All
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {collectionSummaries.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  collectionAds={collection.ads}
                  isSelected={collection.id === selectedCollectionId}
                  onSelect={setSelectedCollectionId}
                />
              ))}
            </div>
          </section>

          <section id="collection-detail" aria-labelledby="collection-detail-heading">
            <div className="mb-4" aria-live="polite" aria-atomic="true">
              <h2 id="collection-detail-heading" className="text-lg font-semibold">{selectedCollection?.name || 'All collected ads'}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {selectedAds.length} {selectedAds.length === 1 ? 'ad' : 'ads'}
                {selectedCollection ? (selectedCollection.description ? ` · ${selectedCollection.description}` : '') : ' across your collections. Choose a collection to narrow the view.'}
              </p>
            </div>
            {selectedAds.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {selectedAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                {selectedCollection ? 'No ads in this collection yet. Choose another collection to keep exploring.' : 'No ads have been added to your collections yet.'}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Collections
