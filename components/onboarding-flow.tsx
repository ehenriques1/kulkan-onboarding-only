"use client"

import React, { useState, useRef, useEffect } from "react";

export default function OnboardingFlow() {
  const [history, setHistory] = useState<{ role: "agent" | "user"; message: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const inputRef = useRef<HTMLInputElement>(null);

  // Example: initial AI message
  useEffect(() => {
    setHistory([
      {
        role: "agent",
        message:
          "Hi there! I'm Kulkan’s onboarding strategist.\nI’ll ask you a few simple questions to understand your startup.\nBased on your stage, I’ll adapt the questions to keep it relevant and focused.\nIt should take just a few minutes.\n\n👉 What’s the name of your startup?",
      },
    ]);
  }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || done) return;
    setHistory([...history, { role: "user", message: input }]);
    setInput("");
    // Here you would trigger the AI response and update history
  }

  // Helper to split agent message into paragraphs and bold the last question
  function renderAgentMessage(msg: string) {
    const parts = msg.split(/\n+/).filter(Boolean);
    return (
      <div className="max-w-2xl space-y-3 text-gray-800 text-base leading-relaxed">
        {parts.map((p, i) =>
          i === parts.length - 1 && p.startsWith("👉") ? (
            <p key={i} className="font-semibold">{p}</p>
          ) : (
            <p key={i} className="mb-2">{p}</p>
          )
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      {history.map((msg, i) =>
        msg.role === "agent" ? (
          <div key={i}>{renderAgentMessage(msg.message)}</div>
        ) : (
          <div key={i} className="w-full flex justify-end max-w-2xl mx-auto">
            <div className="bg-yellow-100 text-gray-900 rounded-lg px-4 py-2 text-right max-w-xs w-fit font-medium mb-2">
              {msg.message}
            </div>
          </div>
        )
      )}
      <form
        className="w-full max-w-xl mt-8 flex flex-col sm:flex-row gap-3 items-center"
        onSubmit={handleSend}
      >
        <input
          type="text"
          className="max-w-xl w-full px-4 py-2 border rounded"
          placeholder="Type your answer..."
          value={input}
          onChange={e => setInput(e.target.value)}
          ref={inputRef}
          disabled={loading || done}
        />
        <button
          type="submit"
          className="bg-yellow-200 px-4 py-2 rounded font-semibold"
          disabled={loading || !input.trim() || done}
        >
          Send
        </button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}
