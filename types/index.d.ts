export type QuestionType = {
  id: string
  type: 'text' | 'file' | 'multiple_choice' | 'boolean' | 'date'
  question: string
  helpText?: string
  options?: string[]
  required: boolean
}

export type FlowType = {
  id: string
  user_id: string
  title: string
  service_type: string
  questions: QuestionType[]
  created_at: string
  updated_at: string
}

export type ShareType = {
  id: string
  flow_id: string
  token: string
  expires_at: string | null
  password_hash: string | null
  uses: number
  max_uses: number
}

export type ResponseType = {
  id: string
  share_token: string
  data: Record<string, any>
  submitted_at: string
}

export type SummaryType = {
  id: string
  response_id: string
  summary: string
  timeline: string
  tasks: TaskType[]
  generated_at: string
}

export type TaskType = {
  title: string
  description?: string
  status: 'To Do' | 'In Progress' | 'Review' | 'Done'
  due_date?: string
  assignee?: string
}
