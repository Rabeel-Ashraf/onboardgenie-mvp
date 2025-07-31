import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateAISummary } from '@/lib/ai/generateSummary'

export async function POST(req: NextRequest) {
  const { responseId } = await req.json()

  const {  responseData, error: responseError } = await supabaseAdmin
    .from('responses')
    .select('*, shares!inner(flow_id)')
    .eq('id', responseId)
    .single()

  if (responseError || !responseData) {
    return Response.json({ error: 'Response not found' }, { status: 404 })
  }

  const {  flowData, error: flowError } = await supabaseAdmin
    .from('flows')
    .select('title, service_type, questions')
    .eq('id', responseData.shares.flow_id)
    .single()

  if (flowError || !flowData) {
    return Response.json({ error: 'Flow not found' }, { status: 404 })
  }

  try {
    const summary = await generateAISummary({
      serviceType: flowData.service_type,
      responses: responseData.data,
      questions: flowData.questions,
    })

    const { data, error: insertError } = await supabaseAdmin
      .from('summaries')
      .insert({
        response_id: responseData.id,
        summary: summary.summary,
        timeline: summary.timeline,
        tasks: summary.tasks,
      })
      .select()
      .single()

    if (insertError) throw insertError

    return Response.json({ summary: data })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
