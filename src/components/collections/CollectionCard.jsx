function CollectionCard({ collection, collectionAds, isSelected, onSelect }) {
  return (
    <article className={`flex min-w-0 flex-col rounded-xl border bg-white p-5 ${isSelected ? 'border-indigo-400 ring-1 ring-indigo-100' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{collection.name}</h3>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{collectionAds.length} {collectionAds.length === 1 ? 'ad' : 'ads'}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{collection.description}</p>
      <div className="my-5 grid grid-cols-3 gap-2">
        {collectionAds.slice(0, 3).map((ad) => (
          <img key={ad.id} src={ad.image} alt={`${ad.competitor}: ${ad.headline}`} width="640" height="400" className="aspect-[8/5] w-full rounded-md border border-slate-100 object-cover" />
        ))}
        {collectionAds.length === 0 && <p className="col-span-3 text-sm text-slate-500">No ads in this collection yet.</p>}
      </div>
      <button
        type="button"
        onClick={() => onSelect(collection.id)}
        aria-pressed={isSelected}
        aria-controls="collection-detail"
        aria-label={`View Collection: ${collection.name}`}
        className="mt-auto self-start rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        View Collection{isSelected && <span className="sr-only"> (selected)</span>}
      </button>
    </article>
  )
}

export default CollectionCard
