'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function Flows() {
  const [flows, setFlows] = useState<any[]>([])
  const [service, setService] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchFlows()
  }, [])

  async function fetchFlows() {
    const {  { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('flows')
      .select('*')
      .eq('user_id', user.id)
    if (error) console.error(error)
    else setFlows(data)
  }

  async function createFlow() {
    if (!service) return
    setLoading(true)
    const {  { user } } = await supabase.auth.getUser()
    const { generateQuestions } = await import('@/lib/ai/client')
    const questions = await generateQuestions(service)

    const { data, error } = await supabase
      .from('flows')
      .insert({
        user_id: user!.id,
        title: \`\${service} Onboarding\`,
        service_type: service,
        questions
      })
      .select()

    setLoading(false)
    if (error) alert(error.message)
    else {
      router.refresh()
      fetchFlows()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Onboarding Flows</h1>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">Create New Flow</h2>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="">Select Service</option>
          <option value="Web Design">Web Design</option>
          <option value="Brand Identity">Brand Identity</option>
          <option value="SEO Audit">SEO Audit</option>
          <option value="Content Writing">Content Writing</option>
        </select>
        <button
          onClick={createFlow}
          disabled={loading}
          className="p-2 bg-green-600 text-white rounded"
        >
          {loading ? 'Generating...' : 'Create with AI'}
        </button>
      </div>

      <div className="grid gap-4">
        {flows.map(flow => (
          <div key={flow.id} className="border p-4 rounded">
            <h3 className="font-semibold">{flow.title}</h3>
            <p className="text-sm text-gray-500">{flow.questions.length} questions</p>
            <a href={\`/share/\${flow.id}\`} className="text-blue-600 text-sm">Share</a>
          </div>
        ))}
      </div>
    </div>
  )
}
