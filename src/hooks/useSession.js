import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Shared session-checking logic; Supabase manages session persistence.
export default function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    let authChanged = false
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      authChanged = true
      setSession(nextSession)
      setLoading(false)
    })

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        // A newer auth event takes precedence over the initial lookup.
        if (active && !authChanged) setSession(error ? null : data.session)
      } catch {
        if (active && !authChanged) setSession(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    checkSession()
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return { session, loading }
}
