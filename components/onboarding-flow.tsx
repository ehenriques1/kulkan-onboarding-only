"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function OnboardingFlow() {
  const [history, setHistory] = useState<{ role: "agent" | "user"; message: string }[]>([]) // [{role: "agent"|"user", message: string}]
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [showPopup, setShowPopup] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Start the chat on mount
  useEffect(() => {
    startChat()
    // eslint-disable-next-line
  }, [])

  async function startChat() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/webhook/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, history: [] }),
      })
      const data = await res.json()
      setHistory([{ role: "agent" as const, message: data.message }])
      setDone(data.done || false)
    } catch (e) {
      setError("Failed to start onboarding. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading || done) return
    setLoading(true)
    setError("")
    const newHistory = [...history, { role: "user" as const, message: input }]
    console.log("Sending history:", newHistory)
    setHistory(newHistory)
    setInput("")
    try {
      const res = await fetch("/api/webhook/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, history: newHistory }),
      })
      const data = await res.json()
      setHistory([...newHistory, { role: "agent" as const, message: data.message }])
      setDone(data.done || false)
      if (!data.done && inputRef.current) inputRef.current.focus()
    } catch (e) {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {showPopup && (
        <div id="kulkan-popup" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-[90%] p-6 rounded-2xl shadow-xl text-gray-800 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-green-600">👋 Welcome to Kulkan!</h2>
            <p className="text-base leading-relaxed">
              You're about to start our onboarding process.  
            </p>
            <p className="text-base leading-relaxed font-medium">
              <span className="text-gray-700">✨ Pro Tip:</span> If you need help answering any question, feel free to <strong>use AI to enrich your responses.</strong> The more thoughtful and detailed your answers, the better the insights we’ll generate for you.
            </p>
            <p className="text-sm text-gray-500">
              High-quality input = High-impact strategic output.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
            >
              Got it, let's begin!
            </button>
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 mr-4">
                <Image src="/kulkan-icon.svg" alt="Kulkan AI" width={48} height={48} className="w-full h-full" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Kulkan Onboarding</h2>
                <p className="text-gray-600">Conversational onboarding powered by your AI agent</p>
              </div>
            </div>

            <div className="mb-6 max-h-96 overflow-y-auto bg-gray-100 rounded p-4">
              {history.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.role === "agent" ? "text-blue-800" : "text-gray-800"}`}>
                  <b>{msg.role === "agent" ? "Kulkan AI" : "You"}:</b> {msg.message}
                </div>
              ))}
              {loading && <div className="text-blue-400">Kulkan AI is typing...</div>}
            </div>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            {!done ? (
              <div className="flex gap-2">
                <Input
                  id="chat-input"
                  name="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type your answer..."
                  disabled={loading}
                  className="flex-1 text-lg"
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-kulkan-green hover:bg-kulkan-dark-green">
                  Send
                </Button>
              </div>
            ) : (
              <div className="text-green-700 font-semibold text-center mt-4">Onboarding complete! Thank you.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
