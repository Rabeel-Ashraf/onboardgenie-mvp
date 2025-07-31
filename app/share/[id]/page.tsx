'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ShareFlow({ params }: { params: { id: string } }) {
  const [flow, setFlow] = useState<any>(null)
  const [responses, setResponses] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    fetchFlow()
  }, [])

  async function fetchFlow() {
    const { data, error } = await supabase
      .from('flows')
      .select('*')
      .eq('id', params.id)
      .single()
    if (error) alert(error.message)
    else setFlow(data)
  }

  function handleChange(id: string, value: any) {
    setResponses(prev => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const tok = Math.random().toString(36).substring(2, 10)
    setToken(tok)

    await supabase.from('shares').insert({ flow_id: flow.id, token: tok, max_uses: 1 })
    await supabase.from('responses').insert({ share_token: tok,  responses })

    setSubmitted(true)
    setSubmitting(false)
  }

  if (!flow) return <div>Loading...</div>

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">🎉 Thank You!</h1>
        <p>Your onboarding is complete.</p>
        <p className="mt-4"><strong>Access Token:</strong> {token}</p>
        <p className="text-sm text-gray-500">Share this with your agency.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{flow.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {flow.questions.map((q: any) => (
          <div key={q.id}>
            <label className="block font-medium">{q.question}</label>
            {q.helpText && <p className="text-sm text-gray-500">{q.helpText}</p>}
            {q.type === 'text' && (
              <input
                type="text"
                required={q.required}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            )}
            {q.type === 'boolean' && (
              <select
                required={q.required}
                onChange={(e) => handleChange(q.id, e.target.value === 'true')}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select...</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded font-semibold"
        >
          {submitting ? 'Submitting...' : 'Submit Onboarding'}
        </button>
      </form>
    </div>
  )
}
