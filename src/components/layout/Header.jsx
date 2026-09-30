import { Search, UserRound } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Dashboard',
  '/ads': 'Ads Explorer',
  '/competitors': 'Competitors',
  '/collections': 'Collections',
}

function Header() {
  const { pathname } = useLocation()
  const currentPath = pathname.replace(/\/+$/, '') || '/'

  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
      <p className="mr-auto text-lg font-semibold">
        {currentPath.startsWith('/ads/') ? 'Ad Detail' : pageTitles[currentPath] || 'AdScope'}
      </p>
      <label className="order-last flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 sm:order-none sm:w-64">
        <Search aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
        <span className="sr-only">Search ads</span>
        <input
          type="search"
          placeholder="Search ads..."
          className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </label>
      <div
        role="img"
        aria-label="Profile placeholder"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"
      >
        <UserRound aria-hidden="true" className="size-5" />
      </div>
    </header>
  )
}

export default Header
