import { Navigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'

function ProtectedRoute({ children }) {
  const { session, loading } = useSession()

  if (loading) return <p role="status" className="text-sm text-slate-500">Checking session...</p>
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
