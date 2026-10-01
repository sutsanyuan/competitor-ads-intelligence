import { useState } from 'react'
import CollectionCard from '../components/collections/CollectionCard'
import AdCard from '../components/dashboard/AdCard'
import { ads } from '../data/ads'
import { collections } from '../data/mockCollections'

function Collections() {
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.id ?? null)
  const selectedCollection = collections.find((collection) => collection.id === selectedCollectionId)
  // Match the collection's IDs to the original ad records.
  const selectedAds = selectedCollection
    ? ads.filter((ad) => selectedCollection.adIds.includes(ad.id))
    : ads

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Organize saved competitor ads for later review.</p>
      </div>

      <section aria-labelledby="collections-heading">
        <h2 id="collections-heading" className="mb-4 text-lg font-semibold">Your collections <button
  type="button"
  onClick={() => setSelectedCollectionId(null)}
  className={`rounded-lg px-4 py-2 mx-2 text-sm ${
    selectedCollectionId === null
      ? 'bg-slate-900 text-white'
      : 'border border-slate-200 bg-white text-slate-700'
  }`}
>
  Show All
</button></h2>
        
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              collectionAds={ads.filter((ad) => collection.adIds.includes(ad.id))}
              isSelected={collection.id === selectedCollectionId}
              onSelect={setSelectedCollectionId}
            />
          ))}
        </div>
        
        <p className="mt-3 text-xs leading-5 text-slate-500">Sample collections are fixed groups and do not sync with bookmarks on other pages.</p>
      </section>

      <section id="collection-detail" aria-labelledby="collection-detail-heading">
        <div className="mb-4" aria-live="polite" aria-atomic="true">
          <h2 id="collection-detail-heading" className="text-lg font-semibold">{selectedCollection?.name || 'Select a collection'}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {selectedCollection ? `${selectedAds.length} ${selectedAds.length === 1 ? 'ad' : 'ads'} · ${selectedCollection.description}` : 'Choose a collection to review its ads here.'}
          </p>
        </div>
        {selectedAds.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {selectedAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            {selectedCollection ? 'No ads in this collection yet. Choose another collection to keep exploring.' : 'No collection selected.'}
          </p>
        )}
      </section>
    </div>
  )
}

export default Collections
