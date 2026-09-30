import { Bookmark } from 'lucide-react'

function AdCard({ ad, onToggleSave }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{ad.competitor}</p>
          <p className="mt-1 text-xs text-slate-500">{ad.platform}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleSave(ad.id)}
          aria-pressed={ad.saved}
          aria-label={`${ad.saved ? 'Unsave' : 'Save'} ad: ${ad.headline}`}
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${ad.saved ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Bookmark aria-hidden="true" className={`size-4 ${ad.saved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <img src={ad.image} alt={`${ad.angle} sample creative for ${ad.competitor}`} width="640" height="400" className="aspect-[8/5] w-full object-cover" />
      <div className="flex flex-1 flex-col items-start p-4">
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{ad.angle}</span>
        <h3 className="mt-3 text-base font-semibold leading-6">{ad.headline}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{ad.copy}</p>
        <p className="mt-auto pt-5 text-xs text-slate-500">{ad.date}</p>
      </div>
    </article>
  )
}

export default AdCard
