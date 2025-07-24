"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react"
import { ONBOARDING_QUESTIONS } from "@/config/questions"
import type { OnboardingResponse, OnboardingSession } from "@/types/onboarding"
import { generateFollowUpQuestion, generateAIResponse } from "@/lib/ai-service"
import { useQuestionAnimation, type AnimationState } from "@/hooks/use-question-animation"
import OnboardingReview from "./onboarding-review"
import Image from "next/image"

// Mock data for all 14 questions
const MOCK_RESPONSES: OnboardingResponse[] = [
  {
    questionId: 1,
    answer: "TechFlow Solutions",
    aiResponse: "Great name! It suggests both technology and smooth processes.",
  },
  {
    questionId: 2,
    answer:
      "We create AI-powered workflow automation tools that help small businesses streamline their operations and reduce manual tasks by up to 70%.",
    aiFollowUp: "Our main focus is on customer service automation, inventory management, and appointment scheduling.",
    aiResponse: "Interesting approach! Workflow automation is a growing market with strong demand.",
  },
  {
    questionId: 3,
    answer:
      "Small to medium-sized businesses with 10-100 employees who are struggling with repetitive manual processes and want to scale efficiently.",
    aiResponse: "This is a well-defined target market with clear pain points.",
  },
  {
    questionId: 4,
    answer:
      "Businesses waste 40% of their time on repetitive manual tasks that could be automated, leading to inefficiency, errors, and employee burnout.",
    aiFollowUp: "We've seen companies spending 20+ hours per week just on data entry and scheduling tasks.",
    aiResponse: "You've identified a significant and measurable problem that businesses face daily.",
  },
  {
    questionId: 5,
    answer:
      "This affects approximately 32 million small businesses in the US alone, with the global market for business process automation expected to reach $19.6 billion by 2026.",
    aiFollowUp: "Studies show that 67% of small businesses still rely on manual processes for core operations.",
    aiResponse: "Excellent market sizing with concrete data to support your opportunity.",
  },
  {
    questionId: 6,
    answer:
      "Our AI-powered platform integrates with existing business tools and uses machine learning to identify automation opportunities, then creates custom workflows without requiring technical expertise.",
    aiFollowUp:
      "The platform includes drag-and-drop workflow builder, pre-built templates, and smart suggestions based on business type.",
    aiResponse: "A no-code approach is smart for your target market of small businesses.",
  },
  {
    questionId: 7,
    answer: "MVP",
    aiFollowUp:
      "We have a working prototype with 3 core automation modules and are currently testing with 5 pilot customers.",
    aiResponse: "Having an MVP with pilot customers is a strong validation signal.",
  },
  {
    questionId: 8,
    answer:
      "SaaS subscription model with tiered pricing: Basic ($49/month), Professional ($149/month), and Enterprise ($299/month) based on number of automations and integrations.",
    aiFollowUp: "We also plan to offer implementation services and custom automation development for larger clients.",
    aiResponse: "Tiered SaaS pricing is proven in this market and allows for growth with customers.",
  },
  {
    questionId: 9,
    answer:
      "Main competitors include Zapier, Microsoft Power Automate, and UiPath. However, these solutions are either too complex for small businesses or lack AI-powered suggestions.",
    aiFollowUp:
      "Zapier requires technical knowledge, Power Automate is enterprise-focused, and UiPath is primarily for large corporations.",
    aiResponse: "You've identified clear gaps in the current competitive landscape.",
  },
  {
    questionId: 10,
    answer:
      "Our AI engine learns from each business's specific patterns and proactively suggests automations, while our interface is designed specifically for non-technical users with guided setup and templates.",
    aiFollowUp:
      "We also offer industry-specific templates and integrations that competitors don't have, particularly for service-based businesses.",
    aiResponse: "AI-powered suggestions and industry focus could be strong differentiators.",
  },
  {
    questionId: 11,
    answer: "Yes, extensively",
    aiFollowUp:
      "We've conducted 47 customer interviews and surveyed 200+ small business owners. 78% said they would pay for a solution that could automate their repetitive tasks.",
    aiResponse: "Extensive customer validation is excellent - this shows real market demand.",
  },
  {
    questionId: 12,
    answer: "Yes, pre-orders",
    aiFollowUp:
      "We have 12 businesses signed up for our beta program with letters of intent, representing $8,400 in potential monthly recurring revenue.",
    aiResponse: "Pre-orders and LOIs are strong indicators of product-market fit potential.",
  },
  {
    questionId: 13,
    answer:
      "Our biggest challenge is building the AI engine that can accurately identify automation opportunities across different business types while keeping the interface simple enough for non-technical users.",
    aiFollowUp:
      "We're also concerned about integration complexity with the hundreds of different tools that small businesses use.",
    aiResponse: "Technical complexity balanced with usability is a common challenge in this space.",
  },
  {
    questionId: 14,
    answer:
      "Success would be 500+ paying customers, $250K+ monthly recurring revenue, and proven ROI case studies showing 50%+ time savings for our customers across at least 5 different industries.",
    aiFollowUp:
      "We'd also want to have raised a Series A round and expanded our team to 15+ people to accelerate growth.",
    aiResponse: "These are specific, measurable goals that show strong business thinking.",
  },
]

export default function OnboardingFlow() {
  const [session, setSession] = useState<OnboardingSession>({
    id: crypto.randomUUID(),
    currentStep: 1,
    responses: [],
    startedAt: new Date(),
  })

  const [currentAnswer, setCurrentAnswer] = useState("")
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null)
  const [followUpAnswer, setFollowUpAnswer] = useState("")
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const { animationState, isTransitioning, transitionToNext, transitionToPrevious } = useQuestionAnimation()

  const currentQuestion = ONBOARDING_QUESTIONS.find((q) => q.id === session.currentStep)
  const progress = (session.currentStep / ONBOARDING_QUESTIONS.length) * 100

  const handleNext = async () => {
    if (!currentAnswer.trim() || isTransitioning) return

    setIsLoading(true)

    try {
      let aiFollowUp = null
      let aiResp = null

      // Generate follow-up question if needed
      if (currentQuestion?.followUp && !showFollowUp) {
        aiFollowUp = await generateFollowUpQuestion(currentQuestion.question, currentAnswer, session.responses)

        transitionToNext(() => {
          setFollowUpQuestion(aiFollowUp)
          setShowFollowUp(true)
        })

        setIsLoading(false)
        return
      }

      // Generate AI response
      aiResp = await generateAIResponse(currentQuestion?.question || "", currentAnswer, followUpAnswer)

      // Save response and transition to next question
      const newResponse: OnboardingResponse = {
        questionId: session.currentStep,
        answer: currentAnswer,
        aiFollowUp: showFollowUp ? followUpAnswer : undefined,
        aiResponse: aiResp,
      }

      const updatedSession = {
        ...session,
        responses: [...session.responses, newResponse],
        currentStep: session.currentStep + 1,
      }

      // Check if we've completed all questions
      if (session.currentStep >= ONBOARDING_QUESTIONS.length) {
        setSession({ ...updatedSession, completedAt: new Date() })
        setShowReview(true)
        setIsLoading(false)
        return
      }

      transitionToNext(() => {
        setSession(updatedSession)

        // Reset for next question
        setCurrentAnswer("")
        setFollowUpQuestion(null)
        setFollowUpAnswer("")
        setShowFollowUp(false)
        setAiResponse(aiResp)
      })

      // Show AI response briefly
      setTimeout(() => setAiResponse(null), 4000)
    } catch (error) {
      console.error("Error processing question:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowUpSubmit = async () => {
    if (!followUpAnswer.trim() || isTransitioning) return
    await handleNext()
  }

  const handleBack = () => {
    if (isTransitioning) return

    if (showFollowUp) {
      transitionToPrevious(() => {
        setShowFollowUp(false)
        setFollowUpQuestion(null)
        setFollowUpAnswer("")
      })
      return
    }

    if (session.currentStep > 1) {
      transitionToPrevious(() => {
        setSession((prev) => ({
          ...prev,
          currentStep: prev.currentStep - 1,
          responses: prev.responses.slice(0, -1),
        }))
        setCurrentAnswer("")
        setAiResponse(null)
      })
    }
  }

  const handleSkip = async () => {
    // Create a mock session with sample responses for testing
    const mockSession: OnboardingSession = {
      id: crypto.randomUUID(),
      currentStep: ONBOARDING_QUESTIONS.length + 1,
      responses: MOCK_RESPONSES,
      startedAt: new Date(),
      completedAt: new Date(),
    }

    setSession(mockSession)
    
    try {
      // Send onboarding data to n8n webhook even when skipping
      const webhookData = {
        sessionId: mockSession.id,
        responses: mockSession.responses,
        completedAt: new Date().toISOString(),
        totalQuestions: mockSession.responses.length,
        skipped: true
      }

      const response = await fetch('/api/webhook/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      const result = await response.json();
      console.log("n8n response:", result);

      if (response.ok) {
        console.log('Skipped onboarding data sent to n8n successfully')
      } else {
        console.error('Failed to send skipped data to n8n webhook')
      }
    } catch (error) {
      console.error('Error sending skipped data to n8n webhook:', error)
    }
    
    setShowReview(true)
  }

  const handleEditQuestion = (questionId: number) => {
    setShowReview(false)
    setSession((prev) => ({
      ...prev,
      currentStep: questionId,
      responses: prev.responses.filter((r) => r.questionId < questionId),
    }))
  }

  const handleApproveAnalysis = async () => {
    try {
      // Send onboarding data to n8n webhook
      const webhookData = {
        sessionId: session.id,
        responses: session.responses,
        completedAt: new Date().toISOString(),
        totalQuestions: session.responses.length
      }

      const response = await fetch('/api/webhook/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      const result = await response.json();
      console.log("n8n response:", result);

      if (response.ok) {
        console.log('Onboarding data sent to n8n successfully')
        // Redirect to analysis page
        window.location.href = "/analysis"
      } else {
        console.error('Failed to send data to n8n webhook')
        // Still redirect even if webhook fails
        window.location.href = "/analysis"
      }
    } catch (error) {
      console.error('Error sending data to n8n webhook:', error)
      // Still redirect even if webhook fails
      window.location.href = "/analysis"
    }
  }

  const handleBackToQuestions = () => {
    setShowReview(false)
  }

  const getAnimationClasses = (state: AnimationState) => {
    switch (state) {
      case "dissolving-out":
        return "animate-dissolve-slide-out"
      case "sliding-in":
        return "animate-slide-in-right"
      case "transitioning":
        return "animate-typeform-transition"
      default:
        return ""
    }
  }

  // Show review page if onboarding is complete
  if (showReview) {
    return (
      <OnboardingReview
        session={session}
        onEdit={handleEditQuestion}
        onApprove={handleApproveAnalysis}
        onBack={handleBackToQuestions}
      />
    )
  }

  if (session.currentStep > ONBOARDING_QUESTIONS.length && !showReview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl animate-slide-in-right">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <Image src="/kulkan-icon.svg" alt="Kulkan" width={64} height={64} className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Onboarding Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing the onboarding. We're now analyzing your responses...
            </p>
            <Button onClick={() => setShowReview(true)} className="bg-gray-500 hover:bg-gray-600 text-white">
              Review Responses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <div style={{ height: "3.125rem" }}>
          <Image src="/kulkan-logo.svg" alt="Kulkan" width={150} height={50} className="h-full w-auto" />
        </div>
        <Button variant="ghost" className="text-white hover:text-kulkan-green" onClick={handleSkip}>
          <SkipForward className="w-4 h-4 mr-2" />
          Skip to Analysis
        </Button>
      </header>

      {/* Progress Bar */}
      <div className="bg-white p-4">
        <Progress value={progress} className="w-full h-1 mb-3" />
        <p className="text-center text-sm font-medium">
          <span className="text-kulkan-dark-green">{session.currentStep}</span>
          <span className="text-gray-600"> of </span>
          <span className="text-gray-600">{ONBOARDING_QUESTIONS.length}</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="relative overflow-hidden">
            <Card className={`mb-8 shadow-sm transition-all duration-600 ${getAnimationClasses(animationState)}`}>
              <CardContent className="p-8">
                {/* AI Avatar and Message */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image src="/kulkan-icon.svg" alt="Kulkan AI" width={48} height={48} className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    {session.currentStep === 1 && !showFollowUp ? (
                      <div className="animate-fade-in">
                        <p className="text-gray-700 mb-6 text-base leading-relaxed">
                          Hello, I'm Kulkan AI. I am here to help you find out if your idea / Business / Service or
                          Product must be built, pivoted or killed. Let's get started.
                        </p>
                      </div>
                    ) : null}

                    {aiResponse && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400 animate-fade-in">
                        <p className="text-blue-800">{aiResponse}</p>
                      </div>
                    )}

                    {!showFollowUp ? (
                      <div className={animationState === "sliding-in" ? "animate-fade-in" : ""}>
                        <h3 className="font-semibold text-lg mb-4 text-gray-800">
                          Q{currentQuestion?.id}/ {currentQuestion?.question}
                        </h3>

                        {currentQuestion?.type === "text" && (
                          <Input
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            placeholder={currentQuestion.id === 1 ? "Enter your startup name" : "Your answer..."}
                            className="w-full text-base py-2 px-0 border-0 border-b-2 border-gray-300 rounded-none focus:border-kulkan-green focus:ring-0 focus:outline-none active:outline-none bg-transparent placeholder:text-gray-400 text-gray-700 outline-none shadow-none focus:shadow-none transition-colors duration-300"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && currentAnswer.trim()) {
                                handleNext()
                              }
                            }}
                          />
                        )}

                        {currentQuestion?.type === "textarea" && (
                          <Textarea
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            placeholder="Your answer..."
                            className="w-full min-h-[100px] text-base py-2 px-0 border-0 border-b-2 border-gray-300 rounded-none focus:border-kulkan-green focus:ring-0 focus:outline-none active:outline-none bg-transparent placeholder:text-gray-400 text-gray-700 resize-none outline-none shadow-none focus:shadow-none transition-colors duration-300"
                          />
                        )}

                        {currentQuestion?.type === "select" && (
                          <Select value={currentAnswer} onValueChange={setCurrentAnswer}>
                            <SelectTrigger className="w-full text-base py-2 px-0 border-0 border-b-2 border-gray-300 rounded-none focus:border-kulkan-green focus:ring-0 focus:outline-none active:outline-none bg-transparent text-gray-700 shadow-none focus:shadow-none transition-colors duration-300">
                              <SelectValue placeholder="Select an option..." />
                            </SelectTrigger>
                            <SelectContent>
                              {currentQuestion.options?.map((option) => (
                                <SelectItem key={option} value={option} className="text-base p-3">
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ) : (
                      <div className={animationState === "sliding-in" ? "animate-fade-in" : ""}>
                        <h3 className="font-semibold text-lg mb-4 text-gray-800">Follow-up: {followUpQuestion}</h3>
                        <Textarea
                          value={followUpAnswer}
                          onChange={(e) => setFollowUpAnswer(e.target.value)}
                          placeholder="Your answer..."
                          className="w-full min-h-[100px] text-base py-2 px-0 border-0 border-b-2 border-gray-300 rounded-none focus:border-kulkan-green focus:ring-0 focus:outline-none active:outline-none bg-transparent placeholder:text-gray-400 text-gray-700 resize-none outline-none shadow-none focus:shadow-none transition-colors duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={(session.currentStep === 1 && !showFollowUp) || isTransitioning}
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {showFollowUp ? "Back to Question" : "Back to Dashboard"}
            </Button>

            <Button
              onClick={showFollowUp ? handleFollowUpSubmit : handleNext}
              disabled={
                isLoading ||
                isTransitioning ||
                (!showFollowUp && !currentAnswer.trim()) ||
                (showFollowUp && !followUpAnswer.trim())
              }
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 transition-all duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
