import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AISummary {
  summary: string
  timeline: string
  tasks: {
    title: string
    description?: string
    status: 'To Do' | 'In Progress' | 'Review' | 'Done'
    due_date?: string
  }[]
}

export async function generateAISummary({
  serviceType,
  responses,
  questions,
}: {
  serviceType: string
  responses: Record<string, any>
  questions: { question: string; id: string }[]
}): Promise<AISummary> {
  const prompt = \`
You are a project strategist for creative agencies.
Based on the client's onboarding responses for a "\${serviceType}" project, generate:

1. A concise project summary (3–4 sentences)
2. A suggested timeline with phases (e.g., "Week 1: Discovery")
3. A list of actionable tasks with title, description, and estimated due date

Use realistic timeframes. Format as strict JSON:
{
  "summary": "...",
  "timeline": "Phase 1: Research (Days 1–3)\\\\nPhase 2: Design (Days 4–7)...",
  "tasks": [
    {
      "title": "...",
      "description": "...",
      "status": "To Do",
      "due_date": "2024-06-10"
    }
  ]
}

Client Responses:
\${questions
  .map(q => {
    const answer = responses[q.id]
    return \`\${q.question}: \${Array.isArray(answer) ? answer.join(', ') : answer}\`
  })
  .join('\\\\n')}
\`

  const response = await openai.chat.completions.create({
    model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  })

  const content = response.choices[0].message?.content
  if (!content) throw new Error('No AI response')

  try {
    const jsonStart = content.indexOf('{')
    const jsonEnd = content.lastIndexOf('}') + 1
    const jsonString = content.slice(jsonStart, jsonEnd)
    return JSON.parse(jsonString) as AISummary
  } catch (error) {
    console.error('Failed to parse AI summary:', content)
    throw new Error('AI response malformed')
  }
}
