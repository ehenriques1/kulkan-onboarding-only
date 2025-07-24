export interface OnboardingQuestion {
  id: number
  category: "basic" | "market" | "product" | "business" | "validation"
  question: string
  type: "text" | "textarea" | "select" | "multiselect"
  required: boolean
  options?: string[]
  followUp?: boolean // Whether AI should generate follow-up questions
}

export interface OnboardingResponse {
  questionId: number
  answer: string
  aiFollowUp?: string
  aiResponse?: string
}

export interface OnboardingSession {
  id: string
  currentStep: number
  responses: OnboardingResponse[]
  startedAt: Date
  completedAt?: Date
}
