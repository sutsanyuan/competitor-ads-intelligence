import { Search, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { supabase } from '../../lib/supabase'

const pageTitles = {
  '/': 'Dashboard',
  '/ads': 'Ads Explorer',
  '/competitors': 'Competitors',
  '/collections': 'Collections',
  '/import': 'Import Ad',
  '/login': 'Login',
}

function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { session, loading } = useSession()
  const [signingOut, setSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const currentPath = pathname.replace(/\/+$/, '') || '/'

  async function handleLogout() {
    if (signingOut) return
    setSigningOut(true)
    setLogoutError('')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(error.message || 'Unable to log out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

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
      {!loading && session && (
        <button type="button" onClick={handleLogout} disabled={signingOut} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 disabled:opacity-60">
          {signingOut ? 'Logging out...' : 'Logout'}
        </button>
      )}
      {logoutError && <p role="alert" className="w-full text-sm text-red-700">{logoutError}</p>}
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
