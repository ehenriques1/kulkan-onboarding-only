"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestWebhook() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testWebhook = async () => {
    setLoading(true)
    setResult("")

    try {
      const testData = {
        sessionId: "test-session-123",
        responses: [
          {
            questionId: 1,
            answer: "Test Company",
            aiResponse: "Great test response!"
          },
          {
            questionId: 2,
            answer: "We build test products",
            aiResponse: "Interesting test approach!"
          }
        ],
        completedAt: new Date().toISOString(),
        totalQuestions: 2
      }

      const response = await fetch('/api/webhook/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Webhook test successful!\n\nResponse: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ Webhook test failed!\n\nError: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult(`❌ Webhook test error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test n8n Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This page tests the webhook endpoint that will receive data from your onboarding flow.
            </p>
            
            <Button 
              onClick={testWebhook} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Testing..." : "Test Webhook"}
            </Button>

            {result && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {result}
                </pre>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">Local API Endpoint:</h4>
              <code className="bg-white p-2 rounded text-sm block">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/onboarding` : '/api/webhook/onboarding'}
              </code>
              <p className="text-sm text-gray-600 mt-2">
                This endpoint forwards data to n8n webhook
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 