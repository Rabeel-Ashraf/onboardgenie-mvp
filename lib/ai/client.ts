import { OpenAI } from 'openai'
import { generateQuestionsPrompt } from './prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateQuestions(serviceType: string): Promise<any[]> {
  const prompt = generateQuestionsPrompt(serviceType)
  const response = await openai.chat.completions.create({
    model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  })

  const content = response.choices[0].message?.content
  if (!content) throw new Error('No response from AI')

  const jsonMatch = content.match(/```json\\n?([\\s\\S]*?)\\n?```/) || content.match(/(\\[.*\\])/s)
  const jsonString = jsonMatch ? jsonMatch[1] : content

  return JSON.parse(jsonString)
}
