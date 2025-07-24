"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestWebhook() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState<string>("")

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhook/onboarding`)
  }, [])

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
          },
          {
            questionId: 2,
            answer: "We build test products",
          }
        ],
        completedAt: new Date().toISOString(),
        totalQuestions: 2
      }

      console.log("Sending test data:", testData)

      const response = await fetch('/api/webhook/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })

      const data = await response.json()
      console.log("Response status:", response.status)
      console.log("Response data:", data)
      
      if (response.ok) {
        // Check if we got actual analysis data or just a workflow started message
        if (data.analysis || data.results || data.data) {
          setResult(`✅ Webhook test successful with analysis data!\n\nResponse: ${JSON.stringify(data, null, 2)}`)
        } else if (data.message && data.message.includes("started")) {
          setResult(`✅ Webhook test successful!\n\nNote: Your n8n workflow started but didn't return analysis data yet.\n\nResponse: ${JSON.stringify(data, null, 2)}\n\nExpected: Your n8n workflow should return analysis data in the response.`)
        } else {
          setResult(`✅ Webhook test successful!\n\nResponse: ${JSON.stringify(data, null, 2)}`)
        }
      } else {
        setResult(`❌ Webhook test failed!\n\nStatus: ${response.status}\nError: ${JSON.stringify(data, null, 2)}`)
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
                {webhookUrl || '/api/webhook/onboarding'}
              </code>
              <p className="text-sm text-gray-600 mt-2">
                This endpoint forwards data to n8n webhook
              </p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <h4 className="font-semibold mb-2">Troubleshooting:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>If you get a 404 error:</strong> Your n8n workflow is not active. Go to your n8n editor and activate the workflow using the toggle in the top-right.
                </div>
                <div>
                  <strong>If you get a "webhook not registered" error:</strong> The webhook URL might be incorrect or the workflow needs to be activated.
                </div>
                <div>
                  <strong>If the test succeeds but no analysis data:</strong> Your n8n workflow needs to return analysis data in the response.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 