"use client"

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function OnboardingFlow() {
  const [history, setHistory] = useState<{ role: "agent" | "user"; message: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [showPopup, setShowPopup] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory([
      {
        role: "agent" as const,
        message:
          "Hi there! I'm Kulkan’s onboarding strategist.\nI’ll ask you a few simple questions to understand your startup.\nBased on your stage, I’ll adapt the questions to keep it relevant and focused.\nIt should take just a few minutes.\n\n👉 What’s the name of your startup?",
      },
    ]);
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || done) return;
    setLoading(true);
    setError("");
    const newHistory = [...history, { role: "user" as const, message: input }];
    setHistory(newHistory);
    setInput("");
    try {
      const res = await fetch("/api/webhook/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, history: newHistory }),
      });
      const data = await res.json();
      setHistory([...newHistory, { role: "agent" as const, message: data.message }]);
      setDone(data.done || false);
      if (!data.done && inputRef.current) inputRef.current.focus();
    } catch (e) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderAgentMessage(msg: string) {
    const parts = msg.split(/\n+/).filter(Boolean);
    return (
      <div className="flex items-start gap-2">
        <Image src="/kulkan-icon.svg" alt="Kulkan" width={32} height={32} className="rounded-full mt-1" />
        <div className="bg-gray-100 rounded-xl px-4 py-2 text-left text-gray-800 max-w-[75%]">
          {parts.map((p, i) =>
            i === parts.length - 1 && p.startsWith("👉") ? (
              <p key={i} className="font-semibold mt-2">{p}</p>
            ) : (
              <p key={i} className="mb-1">{p}</p>
            )
          )}
        </div>
      </div>
    );
  }

  function renderUserMessage(msg: string) {
    return (
      <div className="flex justify-end">
        <div className="bg-yellow-200 rounded-xl px-4 py-2 text-right text-gray-900 max-w-[75%] shadow font-medium">
          {msg}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-2 py-6">
      {showPopup && (
        <div id="kulkan-popup" className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-[90%] p-8 rounded-2xl shadow-xl text-gray-800 text-center space-y-6">
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <Image src="/kulkan-logo.svg" alt="Kulkan Logo" width={120} height={40} className="inline-block" />
              </div>
              <h2 className="text-3xl font-bold text-black">Welcome to Kulkan!</h2>
            </div>
            <p className="text-lg leading-relaxed">
              You're about to start our onboarding process.  
            </p>
            <p className="text-lg leading-relaxed font-semibold">
              <span className="text-gray-700">✨ Pro Tip:</span> If you need help answering any question, feel free to <strong>use AI on your own to enrich your responses.</strong> The more thoughtful and detailed your answers, the better the insights we’ll generate for you.
            </p>
            <p className="text-base text-gray-500">
              High-quality input = High-impact strategic output.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-7 py-3 rounded-full transition font-bold text-xl"
              style={{ backgroundColor: '#EFFF4B', color: '#222', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              Got it, let's begin!
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between items-center max-w-md sm:max-w-lg w-full min-h-[600px] bg-white rounded-2xl shadow-lg border border-gray-200 p-0 relative">
        <div className="flex items-center gap-3 px-6 pt-6 pb-3 w-full border-b border-gray-100">
          <Image src="/kulkan-logo.svg" alt="Kulkan Logo" width={90} height={30} className="inline-block" />
          <span className="font-bold text-lg text-gray-700">Kulkan Onboarding</span>
        </div>
        <div className="flex-1 flex flex-col justify-start w-full px-4 py-4 space-y-3 overflow-y-auto min-h-[300px] max-h-[60vh]">
          {history.map((msg, i) =>
            msg.role === "agent"
              ? <div key={i}>{renderAgentMessage(msg.message)}</div>
              : <div key={i}>{renderUserMessage(msg.message)}</div>
          )}
        </div>
        <form
          className="w-full max-w-xl mx-auto mt-2 mb-6 flex flex-col sm:flex-row gap-3 items-center px-4"
          onSubmit={handleSend}
        >
          <input
            type="text"
            className="max-w-xl w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-200"
            placeholder="Type your answer..."
            value={input}
            onChange={e => setInput(e.target.value)}
            ref={inputRef}
            disabled={loading || done}
          />
          <button
            type="submit"
            className="bg-yellow-200 px-4 py-2 rounded font-semibold shadow hover:bg-yellow-300 transition"
            disabled={loading || !input.trim() || done}
          >
            Send
          </button>
        </form>
        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
}
