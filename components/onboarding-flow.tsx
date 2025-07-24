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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  // Start conversation with first question after popup
  useEffect(() => {
    if (!showPopup && history.length === 0) {
      setHistory([
        {
          role: "agent" as const,
          message:
            "Hi there! I'm Kulkan’s onboarding strategist.\nI’ll ask you a few simple questions to understand your startup.\nBased on your stage, I’ll adapt the questions to keep it relevant and focused.\nIt should take just a few minutes.\n\n👉 What’s the name of your startup?",
        },
      ]);
    }
  }, [showPopup, history.length]);

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
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#f1f5f9] rounded-md font-bold text-lg text-gray-700 mt-1">
          <Image src="/kulkan-icon.svg" alt="Kulkan" width={24} height={24} />
        </div>
        <div className="bg-[#f1f5f9] rounded-md px-4 py-2 text-left text-gray-800 max-w-[75%] text-sm sm:text-base">
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
        <div className="bg-[#ebfc72] rounded-md px-4 py-2 text-right text-gray-900 max-w-[75%] shadow font-medium text-sm sm:text-base">
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
            <h2 className="text-2xl font-bold text-black mb-2">Welcome to Kulkan Onboarding!</h2>
            <p className="text-base leading-relaxed">
              We encourage you to enrich your answers using AI if it helps you provide more context.<br />
              The more thoughtful and detailed your responses, the better the insights we can generate for you.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-6 py-2 rounded-md bg-yellow-200 font-semibold text-gray-900 text-base shadow hover:bg-yellow-300 transition"
            >
              I’m Ready
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between items-center max-w-[640px] w-full min-h-[600px] bg-white rounded-2xl shadow-lg border border-gray-200 p-0 relative h-full sm:h-auto">
        <div className="flex items-center gap-3 px-6 pt-6 pb-3 w-full border-b border-gray-100">
          <Image src="/kulkan-logo.svg" alt="Kulkan Logo" width={90} height={30} className="inline-block" />
          <span className="font-bold text-lg text-gray-700">Kulkan Onboarding</span>
        </div>
        <div className="flex-1 flex flex-col justify-end w-full px-4 py-4 space-y-3 overflow-y-auto min-h-[300px] max-h-[60vh]">
          {history.map((msg, i) =>
            msg.role === "agent"
              ? <div key={i}>{renderAgentMessage(msg.message)}</div>
              : <div key={i}>{renderUserMessage(msg.message)}</div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form
          className="w-full max-w-xl mx-auto mt-2 mb-6 flex flex-col sm:flex-row gap-3 items-center px-4"
          onSubmit={handleSend}
        >
          <input
            type="text"
            className="max-w-xl w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
            placeholder="Type your answer…"
            value={input}
            onChange={e => setInput(e.target.value)}
            ref={inputRef}
            disabled={loading || done}
          />
          <button
            type="submit"
            className="bg-yellow-200 px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-300 transition"
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
