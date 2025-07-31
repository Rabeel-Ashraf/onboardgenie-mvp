import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { syncTasksToNotion } from '@/lib/notion/syncTasks'

export async function POST(req: NextRequest) {
  const { summaryId, databaseId } = await req.json()

  const {  summary, error } = await supabaseAdmin
    .from('summaries')
    .select('*')
    .eq('id', summaryId)
    .single()

  if (error || !summary) {
    return Response.json({ error: 'Summary not found' }, { status: 404 })
  }

  try {
    const results = await syncTasksToNotion(summary.tasks, databaseId)
    return Response.json({ success: true, tasksCreated: results.length })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
