import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    setErrorMessage('')
    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.')
      return
    }
    setSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      if (!data.session) throw new Error('Unable to start a session. Please try again.')
      navigate('/import', { replace: true })
    } catch (error) {
      setErrorMessage(error.message || 'Unable to log in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with your existing account to import competitor ads.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={submitting} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-indigo-600" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-indigo-600" />
        </label>
        {errorMessage && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60">
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login
