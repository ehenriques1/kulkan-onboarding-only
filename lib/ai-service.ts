import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { OnboardingResponse } from "@/types/onboarding"

export async function generateFollowUpQuestion(
  question: string,
  answer: string,
  context: OnboardingResponse[],
): Promise<string> {
  const contextString = context.map((r) => `Q: ${r.questionId} - A: ${r.answer}`).join("\n")

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are Kulkan AI, a startup advisor. Based on the user's answer, generate ONE insightful follow-up question that will help you better understand their startup. Keep it conversational and specific to their response. Don't repeat information they've already provided.`,
    prompt: `
Context from previous answers:
${contextString}

Current Question: ${question}
User's Answer: ${answer}

Generate a thoughtful follow-up question that digs deeper into their response:
    `,
  })

  return text
}

export async function generateAIResponse(question: string, answer: string, followUpAnswer?: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are Kulkan AI, a helpful startup advisor. Provide a brief, encouraging response that shows you understand their answer and builds confidence for the next question. Keep it under 50 words and maintain a supportive tone.`,
    prompt: `
Question: ${question}
Answer: ${answer}
${followUpAnswer ? `Follow-up Answer: ${followUpAnswer}` : ""}

Provide a brief, supportive response:
    `,
  })

  return text
}

export async function generateFinalAnalysis(responses: OnboardingResponse[]): Promise<string> {
  const answersString = responses
    .map((r) => `Q${r.questionId}: ${r.answer}${r.aiFollowUp ? ` | Follow-up: ${r.aiFollowUp}` : ""}`)
    .join("\n")

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are Kulkan AI, an expert startup advisor. Based on all the onboarding responses, provide a comprehensive analysis with clear recommendations on whether they should BUILD, PIVOT, or KILL their startup idea. Be honest but constructive.`,
    prompt: `
Analyze this startup based on their onboarding responses:

${answersString}

Provide a detailed analysis covering:
1. Market Opportunity Assessment
2. Product-Market Fit Potential  
3. Competitive Advantage
4. Validation Status
5. Key Risks & Challenges
6. Final Recommendation: BUILD / PIVOT / KILL
7. Next Steps

Be specific and actionable in your advice.
    `,
  })

  return text
}
