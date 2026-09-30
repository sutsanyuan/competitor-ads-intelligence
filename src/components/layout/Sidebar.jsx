import { FolderHeart, LayoutDashboard, ScanSearch, Users } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ads', label: 'Ads Explorer', icon: ScanSearch },
  { to: '/competitors', label: 'Competitors', icon: Users },
  { to: '/collections', label: 'Collections', icon: FolderHeart },
]

function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
      <Link
        to="/"
        className="m-5 inline-flex items-center gap-2 rounded-lg text-xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 md:m-7"
      >
        <ScanSearch aria-hidden="true" className="size-7 text-indigo-600" />
        AdScope
      </Link>
      <nav aria-label="Main navigation" className="px-3 pb-4 md:px-4">
        <ul className="grid grid-cols-2 gap-1 md:grid-cols-1">
          {navigation.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
