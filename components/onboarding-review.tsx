"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ArrowLeft, Edit3, Check, FileText, Brain, Shield } from "lucide-react"
import { ONBOARDING_QUESTIONS } from "@/config/questions"
import type { OnboardingSession } from "@/types/onboarding"
import Image from "next/image"

interface OnboardingReviewProps {
  session: OnboardingSession
  onEdit: (questionId: number) => void
  onApprove: () => void
  onBack: () => void
}

export default function OnboardingReview({ session, onEdit, onApprove, onBack }: OnboardingReviewProps) {
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: string }>({})
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)

  const handleEditSave = (questionId: number) => {
    // Here you would update the session with the edited answer
    setEditingQuestion(null)
    setEditedAnswers({})
  }

  const handleApproveClick = () => {
    setShowDisclaimerModal(true)
  }

  const handleModalApprove = () => {
    if (hasAgreed) {
      setShowDisclaimerModal(false)
      onApprove()
    }
  }

  const getQuestionById = (id: number) => {
    return ONBOARDING_QUESTIONS.find((q) => q.id === id)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "market":
        return "bg-green-100 text-green-800"
      case "product":
        return "bg-purple-100 text-purple-800"
      case "business":
        return "bg-orange-100 text-orange-800"
      case "validation":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <div style={{ height: "3.125rem" }}>
          <Image src="/kulkan-logo.svg" alt="Kulkan" width={150} height={50} className="h-full w-auto" />
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span className="text-lg font-medium">Review Your Responses</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Summary Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-12 h-12">
                <Image src="/kulkan-icon.svg" alt="Kulkan AI" width={48} height={48} className="w-full h-full" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Review Your Startup Information</h2>
                <p className="text-gray-600 text-base font-normal">
                  Please review your responses below. You can edit any answer before proceeding to analysis.
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Submit Button - Top */}
        <div className="mb-6">
          <button
            onClick={handleApproveClick}
            className="w-full bg-kulkan-green hover:bg-kulkan-green/80 active:bg-kulkan-green/70 focus:bg-kulkan-green focus:ring-4 focus:ring-kulkan-green/30 text-black px-12 py-4 text-lg font-bold rounded-md shadow-md border-2 border-kulkan-green hover:border-kulkan-green/80 active:border-kulkan-green/70 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit for Analysis
          </button>
        </div>

        {/* Responses List */}
        <div className="space-y-4 mb-6">
          {session.responses.map((response) => {
            const question = getQuestionById(response.questionId)
            const isEditing = editingQuestion === response.questionId
            const currentAnswer = editedAnswers[response.questionId] || response.answer

            return (
              <Card key={response.questionId} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge className={getCategoryColor(question?.category || "basic")}>
                        {question?.category?.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">Question {response.questionId}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        isEditing ? handleEditSave(response.questionId) : setEditingQuestion(response.questionId)
                      }
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {isEditing ? "Save" : "Edit"}
                    </Button>
                  </div>

                  <h3 className="font-semibold text-lg mb-3 text-gray-800">
                    Q{response.questionId}/ {question?.question}
                  </h3>

                  {isEditing ? (
                    <div className="space-y-3">
                      {question?.type === "text" && (
                        <Input
                          value={currentAnswer}
                          onChange={(e) =>
                            setEditedAnswers({ ...editedAnswers, [response.questionId]: e.target.value })
                          }
                          className="w-full"
                        />
                      )}
                      {question?.type === "textarea" && (
                        <Textarea
                          value={currentAnswer}
                          onChange={(e) =>
                            setEditedAnswers({ ...editedAnswers, [response.questionId]: e.target.value })
                          }
                          className="w-full min-h-[100px]"
                        />
                      )}
                      {question?.type === "select" && (
                        <Select
                          value={currentAnswer}
                          onValueChange={(value) =>
                            setEditedAnswers({ ...editedAnswers, [response.questionId]: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{response.answer}</p>
                    </div>
                  )}

                  {response.aiFollowUp && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-200">
                      <p className="text-sm text-gray-600 mb-2">Follow-up response:</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-700 text-sm">{response.aiFollowUp}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Start Over
            </Button>
            <button
              onClick={handleApproveClick}
              className="bg-kulkan-green hover:bg-kulkan-green/80 active:bg-kulkan-green/70 focus:bg-kulkan-green focus:ring-4 focus:ring-kulkan-green/30 text-black px-12 py-4 text-lg font-bold rounded-md shadow-md border-2 border-kulkan-green hover:border-kulkan-green/80 active:border-kulkan-green/70 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit for Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Brain className="w-6 h-6 text-amber-600" />
              <span>AI-Powered Analysis Framework</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-700 text-sm leading-relaxed mb-4">
                Our analysis is conducted using a proprietary framework enhanced with Artificial Intelligence. While our
                system is designed to provide valuable insights based on data and AI inference, please understand that:
              </p>
              <ul className="text-amber-700 text-sm space-y-2 mb-4 list-disc list-inside">
                <li>AI systems can make mistakes and may not capture all nuances of your specific situation</li>
                <li>Our recommendations are guidance tools, not definitive business advice</li>
                <li>Final decisions should incorporate your own judgment and additional research</li>
                <li>Market conditions and business landscapes change rapidly</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Important Disclaimer</h4>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Kulkan AI serves as a guide and is not liable for business decisions made based on our analysis. You
                    acknowledge that you are solely responsible for your business decisions and their outcomes. This
                    analysis does not constitute professional business, financial, or legal advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="modal-agreement"
                checked={hasAgreed}
                onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="modal-agreement" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                <strong>I understand and agree</strong> that Kulkan AI's analysis is for guidance purposes only. I
                acknowledge that the AI-powered recommendations are not guaranteed to be accurate and that I am
                responsible for my own business decisions. I agree that Kulkan AI is not liable for any outcomes
                resulting from following the provided analysis.
              </label>
            </div>
          </div>

          <DialogFooter className="flex justify-center sm:justify-center pt-2">
            <button
              onClick={handleModalApprove}
              disabled={!hasAgreed}
              className={`bg-kulkan-green text-black px-8 py-3 text-lg font-bold rounded-md shadow-md border-2 border-kulkan-green transition-all duration-200 w-full sm:w-auto ${
                !hasAgreed
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-kulkan-green/80 active:bg-kulkan-green/70 focus:ring-4 focus:ring-kulkan-green/30 hover:border-kulkan-green/80 active:border-kulkan-green/70 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              OK, I understand, proceed
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
