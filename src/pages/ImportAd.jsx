import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const emptyForm = {
  competitor: '',
  platform: 'Meta',
  headline: '',
  copy: '',
  startedAt: '',
  sourceId: '',
  sourceUrl: '',
  imageUrl: '',
}

const inputClass = 'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600'

function ImportAd() {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSuccessMessage('')
    setErrorMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return
    setSuccessMessage('')
    setErrorMessage('')

    const requiredValues = [form.competitor, form.platform, form.headline, form.copy, form.startedAt, form.sourceId]
    if (requiredValues.some((value) => !value.trim())) {
      setErrorMessage('Please fill in competitor, platform, headline, ad copy, started at, and source ID.')
      return
    }
    if (!['Meta', 'Google', 'TikTok'].includes(form.platform)) {
      setErrorMessage('Please choose Meta, Google, or TikTok.')
      return
    }
    for (const value of [form.sourceUrl, form.imageUrl]) {
      if (!value.trim()) continue
      try {
        const url = new URL(value.trim())
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid URL')
      } catch {
        setErrorMessage('Please enter a complete HTTP or HTTPS URL, or leave optional URLs blank.')
        return
      }
    }

    const payload = {
      id: `${form.platform.toLowerCase()}-${form.sourceId.trim()}`,
      competitor: form.competitor.trim(),
      platform: form.platform,
      headline: form.headline.trim(),
      copy: form.copy.trim(),
      image_url: form.imageUrl.trim() || null,
      angle: null,
      started_at: form.startedAt,
      source_url: form.sourceUrl.trim() || null,
      source_id: form.sourceId.trim(),
      is_real: true,
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('ads').insert(payload)
      if (error) throw error
      setSuccessMessage('Ad saved successfully')
      setForm(emptyForm)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save this ad. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import Ad</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Manually add a competitor ad from a public ad transparency library.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
        <p className="mb-6 text-sm text-slate-500">All fields are required except Source URL and Image URL.</p>
        <fieldset disabled={submitting} className="grid min-w-0 gap-5 sm:grid-cols-2 disabled:opacity-60">
          <legend className="sr-only">Ad information</legend>
          <label className="text-sm font-medium text-slate-700">
            Competitor
            <input name="competitor" value={form.competitor} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Platform
            <select name="platform" value={form.platform} onChange={handleChange} required className={inputClass}>
              <option>Meta</option>
              <option>Google</option>
              <option>TikTok</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Headline
            <input name="headline" value={form.headline} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Ad Copy
            <textarea name="copy" value={form.copy} onChange={handleChange} required rows={5} className={`${inputClass} resize-y`} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Started At
            <input type="date" name="startedAt" value={form.startedAt} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Source ID
            <input name="sourceId" value={form.sourceId} onChange={handleChange} required className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Source URL <span className="font-normal text-slate-500">(optional)</span>
            <input type="url" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} className={inputClass} />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Image URL <span className="font-normal text-slate-500">(optional)</span>
            <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} className={inputClass} />
          </label>
        </fieldset>
        {errorMessage && <p role="alert" className="mt-6 break-words rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
        {successMessage && (
          <div role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p>{successMessage}</p>
            <Link to="/ads" className="mt-2 inline-block rounded font-medium underline focus-visible:outline-2 focus-visible:outline-offset-2">View Ads Explorer</Link>
          </div>
        )}
        <button type="submit" disabled={submitting} className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60">
          {submitting ? 'Saving...' : 'Save Ad'}
        </button>
      </form>
    </div>
  )
}

export default ImportAd
